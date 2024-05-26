// Card sınıfı tanımlaması
class Card {
    constructor(cardIndex, frontImage, backImage) {
        this.index = cardIndex
        this.frontImageUrl = frontImage;
        this.backImageUrl = backImage;
    }
}

// Kart nesnelerini oluştur
const cards = [
    new Card(1,'images/CardFront1.png', 'images/CardBackLow1.png'),
    new Card(2,'images/CardFront2.png', 'images/CardBackLow2.png'),
    new Card(3,'images/CardFront2.png', 'images/CardBackLow2.png'),
    new Card(4,'images/CardFront2.png', 'images/CardBackLow2.png'),
];

const cardDeck = document.querySelector('.card-deck');
const hand = document.querySelector('.hand');
const discardPile = document.querySelector('.discard-pile');

let handCards;

let isDeckClickable = true;

// Kart destesine tıklandığında
cardDeck.addEventListener('click', function() {
    if (isDeckClickable) {
        isDeckClickable = false;
        dealCards();
    }
});

function dealCards() {
    const placeholderDelay = 300; // ms cinsinden her kartın arasındaki gecikme süresi

    createHandCards();
    createCardPlaceholders();

    // Animasyonları başlat
    startAnimations(placeholderDelay);
}

function getMissingCards() {
    handCards = hand.querySelectorAll('.card');
    const handCardIndices = Array.from(handCards).map(card => parseInt(card.dataset.index, 10));
    return cards.filter(card => !handCardIndices.includes(card.index));
}

function createHandCards() {
    // Kartları eline ekle
    cards.forEach((card, index) => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.dataset.index = card.index;
        newCard.style.backgroundImage = `url(${card.frontImageUrl})`;
        
        newCard.style.transform = `translateY(${Math.abs(index - (cards.length-1)/2) * 15}px) rotate(${(index - (cards.length-1)/2) * 5}deg)`;
        newCard.style.rotate = `${(index - (cards.length-1)/2) * 5}deg`;
        newCard.style.translate = `0 ${Math.abs(index - (cards.length-1)/2) * 15}px`;
        
        hand.appendChild(newCard);
    });
}

function createCardPlaceholders() {
    let zIndex = cards.length; // En yüksek z-index değeri, ilk kart en üstte olacak şekilde

    // Card-placeholder'ları oluştur
    cards.forEach((card, index) => {
        const cardPlaceholder = document.createElement('div');
        cardPlaceholder.classList.add('card-placeholder');
        cardPlaceholder.style.backgroundImage = `url(${card.backImageUrl})`;
        cardPlaceholder.style.zIndex = zIndex--; // z-index değerini azaltarak her kart için bir öncekinden düşük bir değer ayarla
        document.body.appendChild(cardPlaceholder); // Body içine yerleştir
    });
}

function startAnimations(placeholderDelay) {
    const cardPlaceholders = document.querySelectorAll('.card-placeholder');
    handCards = document.querySelectorAll('.card');
    
    // Card-placeholder'ların animasyonlarını başlat
    cardPlaceholders.forEach((cardPlaceholder, index) => {
        setTimeout(() => {
            cardPlaceholder.classList.add('animate');
        }, placeholderDelay * index);
    });

    // Card'ların animasyonunu başlat
    handCards.forEach((eachCard, cardIndex) => {
        setTimeout(() => {
            eachCard.classList.add('spawn-animation');
            }, placeholderDelay * cardIndex);
    });
    
    // Card'ların animasyonunu bitir
    handCards.forEach((eachCard, cardIndex) => {
        eachCard.addEventListener('animationend', () => {
            eachCard.style.rotate = '0deg';
            eachCard.style.translate = '0px 0px';
            eachCard.style.opacity = 1;
            eachCard.classList.remove('spawn-animation');
        });
    });
    
    // Card-placeholder'ların animasyonları bitince sil
    cardPlaceholders[cardPlaceholders.length - 1].addEventListener('animationend', () => {
        cardPlaceholders.forEach(cardPlaceholder => {
            document.body.removeChild(cardPlaceholder);
        });
    });
    
    handCards[handCards.length - 1].addEventListener('animationend', enableClickableCards, true);
}

function enableClickableCards(event) {
    handCards = document.querySelectorAll('.card');
    
    event.target.removeEventListener('animationend', enableClickableCards, true);
    
    handCards.forEach(eachCard => {
        eachCard.style.pointerEvents = 'auto';

        eachCard.addEventListener('click', function() {
            selectCard(eachCard);
        });
    });
}

function selectCard(selectedCard) {
    handCards = document.querySelectorAll('.card');
    
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
        
        hand.querySelectorAll('.card').forEach(eachCard => {
            eachCard.style.pointerEvents = 'auto';
        });
    });
}
