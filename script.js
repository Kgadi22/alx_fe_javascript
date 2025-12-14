// script.js for Dynamic Quote Generator

// Initial quotes array with categories
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Helper: Get unique categories
function getCategories() {
  return [...new Set(quotes.map(q => q.category))];
}

// Show a random quote (optionally by category)
function showRandomQuote(category = null) {
  let filtered = category ? quotes.filter(q => q.category === category) : quotes;
  if (filtered.length === 0) {
    quoteDisplay.textContent = 'No quotes available for this category.';
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<blockquote>"${random.text}"</blockquote><p><em>Category: ${random.category}</em></p>`;
}

// Create category selector
function createCategorySelector() {
  let existing = document.getElementById('categorySelector');
  if (existing) existing.remove();
  const select = document.createElement('select');
  select.id = 'categorySelector';
  const optionAll = document.createElement('option');
  optionAll.value = '';
  optionAll.textContent = 'All Categories';
  select.appendChild(optionAll);
  getCategories().forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  select.addEventListener('change', () => {
    showRandomQuote(select.value || null);
  });
  document.body.insertBefore(select, quoteDisplay);
}

// Create form to add new quotes
function createAddQuoteForm() {
  let existing = document.getElementById('addQuoteForm');
  if (existing) existing.remove();
  const form = document.createElement('div');
  form.id = 'addQuoteForm';
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(form);
  document.getElementById('addQuoteBtn').onclick = addQuote;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }
  quotes.push({ text, category });
  createCategorySelector();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
}

// Event listeners
newQuoteBtn.addEventListener('click', () => {
  const selector = document.getElementById('categorySelector');
  showRandomQuote(selector && selector.value ? selector.value : null);
});

// Initialize
createCategorySelector();
createAddQuoteForm();
showRandomQuote();
