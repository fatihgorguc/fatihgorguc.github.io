class Card {
    constructor(cardIndex, frontImage, backImage, page) {
        this.index = cardIndex
        this.frontImageUrl = frontImage;
        this.backImageUrl = backImage;
        this.pageUrl = page;
    }
}

const cards = [
    new Card(1,'images/CardFront1.png', 'images/CardBackLow1.png', 'about-me.html'),
    new Card(2,'images/CardFront2.png', 'images/CardBackLow2.png', 'agent-in-depth.html'),
    new Card(3,'images/CardFront2.png', 'images/CardBackLow2.png', 'agent-in-depth.html'),
    new Card(4,'images/CardFront2.png', 'images/CardBackLow2.png', 'agent-in-depth.html'),
];

const cardDeck = document.querySelector('.card-deck');
const hand = document.querySelector('.hand');
const discardPile = document.querySelector('.discard-pile');
const page = document.querySelector('.page');
const returnArea = document.querySelector('.return-area');
const dustVFX = document.querySelector('.dust-vfx');
const drawACard = document.querySelector('.draw-a-card');
const pageBackground = document.querySelector('.page-background');

let missingCards;
let handCards;
let isDealingCards = false;
let isPlayAnimationPlaying = false;
let selectedCard;

const cardSpawnDelay = 300;
const cardRandomRotation = 20;
const angleBetweenCards = 5;
const heightBetweenCards = 15;
const hoverTime = 0.2;
const cardAdjustmentTime = 0.7;
const shakeDuration = 1;

cardDeck.addEventListener('click', dealCards, true);
returnArea.addEventListener('click', hidePage, true);

function dealCards() {
    if (isDealingCards || isPlayAnimationPlaying) return;
    
    setMissingCards()
    
    if (missingCards.length === 0) return;
    isDealingCards = true;
    createCardPlaceholders();
    createHandCards();

    setHandCardRotations();
    drawACard.style.opacity = '0';
}

function setMissingCards() {
    handCards = hand.querySelectorAll('.card');
    const handCardIndices = Array.from(handCards).map(card => parseInt(card.dataset.index, 10));
    missingCards = cards.filter(card => !handCardIndices.includes(card.index));
}

function createCardPlaceholders() {
    let zIndex = 100; // En yüksek z-index değeri, ilk kart en üstte olacak şekilde
    
    missingCards.forEach((card) => {
        const cardPlaceholder = document.createElement('div');
        cardPlaceholder.classList.add('card-placeholder');
        cardPlaceholder.style.backgroundImage = `url(${card.backImageUrl})`;
        cardPlaceholder.style.zIndex = `${zIndex--}`;
        document.body.appendChild(cardPlaceholder);
    });

    const cardPlaceholders = document.querySelectorAll('.card-placeholder');
    
    //cardPlaceholders animasyonunu başlat ve bitince sil
    cardPlaceholders.forEach((cardPlaceholder, index) => {
        setTimeout(() => {
            cardPlaceholder.classList.add('animate');
            cardPlaceholder.addEventListener('animationend', () => {
                document.body.removeChild(cardPlaceholder);
            });
        }, cardSpawnDelay * index);
    });
}

function createHandCards() {
    handCards = hand.querySelectorAll('.card');
    handCards.forEach(eachCard=> {
        eachCard.style.pointerEvents = 'none';
    });
    missingCards.forEach((card, index) => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.dataset.index = card.index;
        newCard.pageUrl = card.pageUrl;
        
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        cardImage.style.backgroundImage = `url(${card.frontImageUrl})`;
        newCard.appendChild(cardImage);
        
        const shadow = document.createElement('div');
        shadow.classList.add('shadow');
        newCard.appendChild(shadow);

        hand.appendChild(newCard);

        setTimeout(() => {
            newCard.classList.add('spawn-animation');
        }, cardSpawnDelay * index);

        const spawnAnimationEndHandler = () => {
            newCard.classList.remove('spawn-animation');
            newCard.removeEventListener('animationend', spawnAnimationEndHandler);
            newCard.style.opacity = '1';
            newCard.style.marginRight = '-25px';
            newCard.style.marginLeft = '-25px';
            newCard.addEventListener('click', () => {selectCard(newCard)});
        };
        newCard.addEventListener('animationend', spawnAnimationEndHandler);
    });
}

function setHandCardRotations() {
    handCards = Array.from(hand.querySelectorAll('.card'));
    handCards = handCards.filter(card => card !== selectedCard);
    
    handCards.forEach((eachCard, index) => {
        eachCard.style.transition = `transform ${cardAdjustmentTime}s, translate ${cardAdjustmentTime}s, rotate ${cardAdjustmentTime}s`;
        eachCard.style.transform = 'translateY(0px) rotate(0deg)';
        eachCard.style.rotate = `${(index - (handCards.length-1)/2) * angleBetweenCards}deg`;
        eachCard.style.translate = `0 ${Math.abs(index - (handCards.length-1)/2) * heightBetweenCards}px`;
        
        let rotationEndHandler = () => {
            handCards.forEach(eachCard => {
                let translate = parseFloat(eachCard.style.translate.split(' ')[1]);
                let rotate = parseFloat(eachCard.style.rotate);
                eachCard.style.transition = 'transform 0s, translate 0s, rotate 0s';
                eachCard.style.transform = `translateY(${translate}px) rotate(${rotate}deg)`;
                eachCard.style.translate = '0px 0px';
                eachCard.style.rotate = '0deg';

                setTimeout(() => {
                    eachCard.style.transition = `transform ${hoverTime}s, margin ${hoverTime}s, translate ${hoverTime}s, rotate ${hoverTime}s`;
                    isDealingCards = false;
                    eachCard.style.pointerEvents = 'auto';
                }, 0);
            });
        };
        
        if (index === handCards.length - 1)
        {
            let rotateAnimationEndHandler = () => {
                eachCard.removeEventListener('animationend', rotateAnimationEndHandler);
                rotationEndHandler();
            };
            eachCard.addEventListener('animationend', rotateAnimationEndHandler);
        }
        if (selectedCard != null) {
            let rotateAnimationEndHandler = () => {
                selectedCard.removeEventListener('animationend', rotateAnimationEndHandler);
                rotationEndHandler();
            };
            selectedCard.addEventListener('animationend', rotateAnimationEndHandler);
        }
    });
}

function selectCard(newCard) {
    if (isDealingCards) return;
    selectedCard = newCard;
    drawACard.style.opacity = '1';
    handCards = document.querySelectorAll('.card');
    const shadow = selectedCard.querySelector('.shadow');
    
    isPlayAnimationPlaying = true;
    selectedCard.style.transform = 'translateY(0) rotate(0deg)';
    handCards.forEach(eachCard => {
        eachCard.style.pointerEvents = 'none';
    });

    let moveX =  window.innerWidth / 2 - (selectedCard.getBoundingClientRect().x + selectedCard.getBoundingClientRect().width / 2);
    let moveY = window.innerHeight / 2 - (hand.getBoundingClientRect().y + hand.getBoundingClientRect().height / 2);

    let rotate = Math.random() * cardRandomRotation - cardRandomRotation/2;

    selectedCard.style.transition = 'transform 0.95s,translate 1s, rotate 1s, margin 1s';
    selectedCard.style.translate = `${moveX}px ${moveY}px`;
    selectedCard.style.margin = '0 -100px';
    selectedCard.style.rotate = `${rotate}deg`;
    selectedCard.classList.add('play-animation');
    shadow.classList.add('play-animation');
    hidePage();

    const animationEndHandler = () => {
        selectedCard.removeEventListener('animationend', animationEndHandler, true);
        discardPile.appendChild(selectedCard);
        selectedCard.style.position = 'fixed'
        selectedCard.classList.remove('play-animation');
        selectedCard.style.rotate = `${rotate}deg`;
        selectedCard.style.translate = '0px 0px';
        selectedCard.style.scale = '0.9';
        shadow.classList.remove('play-animation')
        shadow.style.scale = '1.03';
        shadow.style.top = '0';
        shadow.style.left = '5px';
        shakeScreen();
        playDustVFX();

        hand.querySelectorAll('.card').forEach(eachCard => {
            eachCard.style.pointerEvents = 'auto';
        });
        isPlayAnimationPlaying = false;
        showTargetPage();
    };
    
    selectedCard.addEventListener('animationend', animationEndHandler, true);

    setHandCardRotations();
}

function showTargetPage() {
    const iframe = document.createElement('iframe');
    
    iframe.src = selectedCard.pageUrl;
    iframe.classList.add('frame');
    
    page.appendChild(iframe);
    
    page.style.transition = 'transform 0.8s ease-out 0.2s';
    page.style.transform = 'translateY(200%)';
    pageBackground.src = 'images/Paper.gif';
    returnArea.style.opacity = '0.3';
    returnArea.pointerEvents = 'auto';
}

function hidePage() {
    if (page.querySelector("iframe") == null) return;

    page.style.transition = 'transform 0.8s ease-in 0.2s';
    page.style.transform = 'translateY(0%)';
    pageBackground.src = 'images/PaperReverse.gif';
    returnArea.style.opacity = '0';
    returnArea.pointerEvents = 'none';
    const transitionEndHandler = () => {
        page.removeEventListener('transitionend', transitionEndHandler, true);
        page.querySelectorAll('iframe').forEach(iframe => {page.removeChild(iframe);});
        removeDiscardPileCards();
    };
    page.addEventListener('transitionend', transitionEndHandler, true);
}

function shakeScreen() {
    document.body.style.animation = `shake ${shakeDuration}s`;
    setTimeout(function() {
        document.body.style.animation = '';
    }, shakeDuration * 1000);
}

function playDustVFX()
{
    dustVFX.style.zIndex = '3';
    dustVFX.src = '';
    dustVFX.src = 'images/Dust.gif';
}

function removeDiscardPileCards() {
    const discardList = discardPile.querySelectorAll('.card')
    if (discardList.length >= 6)
    {
        discardPile.removeChild(discardList[0]);
    }
}
