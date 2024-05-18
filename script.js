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
        dealCards();
        isDeckClickable = false;
    }
});

function dealCards() {
    const placeholderDelay = 300; // ms cinsinden her kartın arasındaki gecikme süresi

    cards.forEach((card, index) => {
        setTimeout(() => {
            const cardPlaceholder = document.createElement('div');
            cardPlaceholder.classList.add('card-placeholder');
            cardPlaceholder.style.backgroundColor = card.color; // Kartın rengini ayarla
            document.querySelector('.card-placeholder-holder').appendChild(cardPlaceholder);

        }, placeholderDelay * index);
    });
}


