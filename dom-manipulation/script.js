// Initial quotes array with categories
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// Helper to get unique categories
function getCategories() {
  return [...new Set(quotes.map(q => q.category))];
}

// Show a random quote, optionally filtered by category
function showRandomQuote(category = null) {
  let filtered = category ? quotes.filter(q => q.category === category) : quotes;
  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available for this category.';
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `<blockquote>${random.text}</blockquote><footer>${random.category}</footer>`;
}

// Create category selector dynamically
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
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    showRandomQuote(select.value || null);
  });
  document.body.insertBefore(select, document.getElementById('quoteDisplay'));
}

// Add quote from form
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
  showRandomQuote(category);
}

document.getElementById('newQuote').addEventListener('click', () => {
  const catSel = document.getElementById('categorySelector');
  showRandomQuote(catSel && catSel.value ? catSel.value : null);
});
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Dynamically create the add-quote form
function createAddQuoteForm() {
  // Remove existing form if present
  const existing = document.getElementById('addQuoteForm');
  if (existing) existing.remove();

  const form = document.createElement('div');
  form.id = 'addQuoteForm';
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(form);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Initial setup
createCategorySelector();
showRandomQuote();

createAddQuoteForm();
