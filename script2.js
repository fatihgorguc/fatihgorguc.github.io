class Card {
    constructor(cardIndex, frontImage, backImage) {
        this.index = cardIndex
        this.frontImageUrl = frontImage;
        this.backImageUrl = backImage;
    }
}

const cards = [
    new Card(1,'images/CardFront1.png', 'images/CardBackLow1.png'),
    new Card(2,'images/CardFront2.png', 'images/CardBackLow2.png'),
    new Card(3,'images/CardFront2.png', 'images/CardBackLow2.png'),
    new Card(4,'images/CardFront2.png', 'images/CardBackLow2.png'),
];

const cardDeck = document.querySelector('.card-deck');
const hand = document.querySelector('.hand');
const discardPile = document.querySelector('.discard-pile');

let missingCards;
let handCards;
let isDealingCards = false;
let isPlayAnimationPlaying = false;

const cardSpawnDelay = 300;

cardDeck.addEventListener('click', dealCards, true);

function dealCards() {
    if (isDealingCards || isPlayAnimationPlaying) return;
    
    setMissingCards()
    
    if (missingCards.length === 0) return;
    isDealingCards = true;
    createCardPlaceholders();
    createHandCards();
}

function setMissingCards() {
    handCards = hand.querySelectorAll('.card');
    const handCardIndices = Array.from(handCards).map(card => parseInt(card.dataset.index, 10));
    missingCards = cards.filter(card => !handCardIndices.includes(card.index));
}

function createCardPlaceholders() {
    let zIndex = 20; // En yüksek z-index değeri, ilk kart en üstte olacak şekilde
    
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
        newCard.style.backgroundImage = `url(${card.frontImageUrl})`;
        
        newCard.style.transform = `translateY(${Math.abs(index - (cards.length-1)/2) * 15}px) rotate(${(index - (cards.length-1)/2) * 5}deg)`;
        newCard.style.rotate = `${(index - (cards.length-1)/2) * 5}deg`;
        newCard.style.translate = `0 ${Math.abs(index - (cards.length-1)/2) * 15}px`;

        hand.appendChild(newCard);

        setTimeout(() => {
            newCard.classList.add('spawn-animation');
        }, cardSpawnDelay * index);

        const spawnAnimationEndHandler = () => {
            newCard.classList.remove('spawn-animation');
            newCard.removeEventListener('animationend', spawnAnimationEndHandler);
            newCard.style.rotate = '0deg';
            newCard.style.translate = '0px 0px';
            newCard.style.opacity = '1';
            newCard.style.marginRight = '-25px';
            newCard.style.marginLeft = '-25px';
            newCard.addEventListener('click', () => {selectCard(newCard)});
            if (index === missingCards.length - 1)
            {
                isDealingCards = false;
                hand.querySelectorAll('.card').forEach(eachCard=> {
                    eachCard.style.pointerEvents = 'auto';
                });
            }
        };
        newCard.addEventListener('animationend', spawnAnimationEndHandler);
    });
}

function selectCard(selectedCard) {
    if (isDealingCards) return;
    handCards = document.querySelectorAll('.card');

    isPlayAnimationPlaying = true;
    selectedCard.style.transition = 'translate 1s, rotate 1s, margin 1s';
    handCards.forEach(eachCard => {
        eachCard.style.pointerEvents = 'none';
    });

    let moveX =  window.innerWidth / 2 - (selectedCard.getBoundingClientRect().x + selectedCard.getBoundingClientRect().width / 2);
    let moveY = window.innerHeight / 2 - (hand.getBoundingClientRect().y + hand.getBoundingClientRect().height / 2);

    let rotate = Math.random() * 20 - 10
    selectedCard.style.translate = `${moveX}px ${moveY}px`;
    selectedCard.style.margin = '0 -100px';
    selectedCard.style.transform = 'rotate(0deg)';
    selectedCard.style.rotate = `${rotate}deg`;
    selectedCard.classList.add('play-animation');

    selectedCard.addEventListener('animationend', () => {
        discardPile.appendChild(selectedCard);
        selectedCard.style.position = 'fixed'
        selectedCard.classList.remove('play-animation');
        selectedCard.style.rotate = `${rotate}deg`;
        selectedCard.style.translate = '0px 0px';

        hand.querySelectorAll('.card').forEach(eachCard => {
            eachCard.style.pointerEvents = 'auto';
        });
        isPlayAnimationPlaying = false;
    });
}
