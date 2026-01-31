// Load quotes from localStorage or use defaults
let quotes = [];
const defaultQuotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      quotes = [...defaultQuotes];
    }
      // Populate the category filter dropdown
      function populateCategories() {
        const filter = document.getElementById('categoryFilter');
        if (!filter) return;
        // Save current selection
        const lastSelected = localStorage.getItem('lastCategoryFilter') || 'all';
        filter.innerHTML = '';
        const optionAll = document.createElement('option');
        optionAll.value = 'all';
        optionAll.textContent = 'All Categories';
        filter.appendChild(optionAll);
        getCategories().forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          filter.appendChild(opt);
        });
        filter.value = lastSelected;
      }

      // Filter quotes based on selected category
      function filterQuotes() {
        const filter = document.getElementById('categoryFilter');
        if (!filter) return;
        const selected = filter.value;
        localStorage.setItem('lastCategoryFilter', selected);
        let filteredQuotes = (selected === 'all') ? quotes : quotes.filter(q => q.category === selected);
        if (filteredQuotes.length === 0) {
          document.getElementById('quoteDisplay').innerText = 'No quotes available for this category.';
          return;
        }
        // Show all filtered quotes (could be improved to show one at a time if needed)
        document.getElementById('quoteDisplay').innerHTML = filteredQuotes.map(q => `<blockquote>${q.text}</blockquote><footer>${q.category}</footer>`).join('');
        // Save last viewed quote in sessionStorage (first in filtered list)
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
  } else {
    quotes = [...defaultQuotes];
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Helper to get unique categories
function getCategories() {
  return [...new Set(quotes.map(q => q.category))];
        createCategorySelector();
        populateCategories();

// Show a random quote, optionally filtered by category
        // If new category, select it and filter
        document.getElementById('categoryFilter').value = category;
        filterQuotes();
  let filtered = category ? quotes.filter(q => q.category === category) : quotes;
  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available for this category.';
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `<blockquote>${random.text}</blockquote><footer>${random.category}</footer>`;
  // Save last viewed quote in sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(random));
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
        // Also update the filter dropdown
        populateCategories();
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
              createCategorySelector();
              populateCategories();
              filterQuotes();
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (!text || !category) {
    alert('Please enter both quote and category.');
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  createCategorySelector();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote(category);
// Export quotes to JSON file
function exportToJsonFile() {
      populateCategories();
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        createCategorySelector();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
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
    <button id="exportBtn" type="button">Export Quotes (JSON)</button>
    <input type="file" id="importFile" accept=".json" style="display:inline-block;" />
  `;
  document.body.appendChild(form);
  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
  document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
}

// Initial setup
loadQuotes();
createCategorySelector();
createAddQuoteForm();
// Show last viewed quote if available in sessionStorage
const lastViewed = sessionStorage.getItem('lastViewedQuote');
if (lastViewed) {
  const q = JSON.parse(lastViewed);
  document.getElementById('quoteDisplay').innerHTML = `<blockquote>${q.text}</blockquote><footer>${q.category}</footer>`;
} else {
  showRandomQuote();
}
