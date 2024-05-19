// Card sınıfı tanımlaması
class Card {
    constructor(imageUrl, text, color) {
        this.imageUrl = imageUrl;
        this.text = text;
        this.color = color;
    }
}

// Kart nesnelerini oluştur
const cards = [
    new Card('image1.jpg', 'Kart 1', '#FF5733'),
    new Card('image2.jpg', 'Kart 2', '#33FF57'),
    new Card('image3.jpg', 'Kart 3', '#5733FF'),
    new Card('image4.jpg', 'Kart 4', '#FFFF33'),
    new Card('image5.jpg', 'Kart 5', '#33FFFF')
];

// Kart destesi oluştur
const cardDeck = document.querySelector('.card-deck');
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

function createHandCards() {
    const hand = document.querySelector('.hand');

    // Kartları eline ekle
    cards.forEach((card, index) => {
        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.style.backgroundColor = card.color;
        newCard.style.backgroundImage = `url(${card.imageUrl})`;
        
        newCard.style.transform = `translateY(${Math.abs(index - (cards.length-1)/2) * 15}px) rotate(${(index - (cards.length-1)/2) * 5}deg)`;
        newCard.style.rotate = `${(index - (cards.length-1)/2) * 5}deg`;
        newCard.style.translate = `0 ${Math.abs(index - (cards.length-1)/2) * 15}px`;
        
        newCard.innerHTML = `<span>${card.text}</span>`;
        hand.appendChild(newCard);
    });
}

function createCardPlaceholders() {
    let zIndex = cards.length; // En yüksek z-index değeri, ilk kart en üstte olacak şekilde

    // Card-placeholder'ları oluştur
    cards.forEach((card, index) => {
        const cardPlaceholder = document.createElement('div');
        cardPlaceholder.classList.add('card-placeholder');
        cardPlaceholder.style.backgroundColor = card.color; // Kartın rengini ayarla
        cardPlaceholder.style.zIndex = zIndex--; // z-index değerini azaltarak her kart için bir öncekinden düşük bir değer ayarla
        document.body.appendChild(cardPlaceholder); // Body içine yerleştir
    });
}


function startAnimations(placeholderDelay) {
    const hand = document.querySelector('.hand');
    const cardPlaceholders = document.querySelectorAll('.card-placeholder');
    const handCards = hand.querySelectorAll('.card');
    
    // Card-placeholder'ların animasyonlarını başlat
    cardPlaceholders.forEach((cardPlaceholder, index) => {
        setTimeout(() => {
            cardPlaceholder.classList.add('animate');
        }, placeholderDelay * index);
    });

    // Card'ların animasyonunu başlat
    handCards.forEach((handCard, cardIndex) => {
        setTimeout(() => {
            handCard.classList.add('spawn-animation');
            }, placeholderDelay * cardIndex);
    });
    
    // Card'ların animasyonunu bitir
    handCards.forEach((handCard, cardIndex) => {
        handCard.addEventListener('animationend', () => {
            handCard.style.rotate = '0deg';
            handCard.style.translate = '0px 0px';
            handCard.style.opacity = 1;
            handCard.classList.remove('spawn-animation');
        });
    });
    
    // Card-placeholder'ların animasyonları bitince sil
    cardPlaceholders[cardPlaceholders.length - 1].addEventListener('animationend', () => {
        cardPlaceholders.forEach(cardPlaceholder => {
            document.body.removeChild(cardPlaceholder);
        });
    });
    
    // Card'ların animasyonları bitince tıklanabilir yap
    handCards[handCards.length - 1].addEventListener('animationend', () => {
        enableClickableCards();
    });
}

function enableClickableCards() {
    const hand = document.querySelector('.hand');
    const handCards = hand.querySelectorAll('.card');

    // Kartları tıklanabilir yap
    handCards.forEach(handCard => {
        handCard.style.pointerEvents = 'auto';
        handCard.addEventListener('click', function() {
            console.log(handCard.querySelector('span').innerText);
        });
    });
}
