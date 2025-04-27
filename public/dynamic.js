let cards = [];
let totalCards = 0;
let currentIndex = 0;

// Fetch and cache data.json once
async function fetchCards() {
  if (cards.length) return cards;
  const res = await fetch('/data.json');
  cards = await res.json();
  totalCards = cards.length;
  return cards;
}

// Render the card at a given index
function renderCard(index) {
  const card = cards[index];
  currentIndex = index;

  // Card background
  const cardEl = document.getElementById('card');
  cardEl.style.backgroundImage = `url('${card.frame || ''}'), url('${card.art}')`;
  cardEl.style.backgroundSize = 'cover, cover';
  cardEl.style.backgroundPosition = 'center, center';
  cardEl.style.backgroundRepeat = 'no-repeat, no-repeat';

  document.getElementById('cardNumber').innerText = `#${card.number}`;
  document.getElementById('cardTitle').innerHTML = card.title.replace(/\\n/g, '<br>');
  setCardType(card.type);
  document.getElementById('cardLiquidity').innerText = card.liquidity;
  document.getElementById('cardReaction').style.display = card.reaction ? 'block' : 'none';
  document.getElementById('cardEffect').innerHTML = card.effect.replace(/\\n/g, '<br>');
  document.getElementById('cardKeywords').innerText = card.keywords;
  document.getElementById('cardFlavor').innerText = card.flavor;
  document.getElementById('rarityIcon').src = card.rarityIcon;
  document.getElementById('rarityText').innerText = card.rarityText;

  // Progress
  document.getElementById('cardProgress').textContent =
    `Card #${card.number}: ${card.title.replace(/\\n/g, ' ')} (${index + 1} of ${totalCards})`;

  // Disable buttons at ends
  document.getElementById('prevCard').disabled = index <= 0;
  document.getElementById('nextCard').disabled = index >= totalCards - 1;
}

// Navigation logic
function goToCard(index, pushState = true) {
  index = Math.max(0, Math.min(totalCards - 1, index));
  renderCard(index);
  if (pushState) {
    history.pushState({ card: index }, '', `?card=${index}`);
  }
}

// Set up event listeners
function setupNavigation() {
  document.getElementById('prevCard').addEventListener('click', () => goToCard(currentIndex - 1));
  document.getElementById('nextCard').addEventListener('click', () => goToCard(currentIndex + 1));
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') goToCard(currentIndex - 1);
    else if (e.key === 'ArrowRight') goToCard(currentIndex + 1);
  });
  window.addEventListener('popstate', (event) => {
    const idx = event.state && typeof event.state.card === 'number'
      ? event.state.card
      : getCardIndexFromURL();
    goToCard(idx, false);
  });
}

// Get card index from URL
function getCardIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  const idx = parseInt(params.get('card'));
  return isNaN(idx) ? 0 : idx;
}

// Set card type color class
function setCardType(type) {
  const typeElement = document.getElementById('cardType');
  typeElement.className = 'card-type';
  let className = 'card-type-' + type.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  typeElement.classList.add(className);
  typeElement.textContent = type;
}

// Initialize everything
async function init() {
  await fetchCards();
  setupNavigation();
  goToCard(getCardIndexFromURL(), false);
}
init();
