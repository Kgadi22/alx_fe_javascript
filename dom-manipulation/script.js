// Sync quotes with server: fetch, merge, and post local changes
async function syncQuotes() {
  // Fetch server quotes
  const serverQuotes = await fetchServerQuotes();
  let updated = false;
  // Merge: add new server quotes to local
  serverQuotes.forEach(sq => {
    if (!quotes.some(lq => lq.text === sq.text)) {
      quotes.push(sq);
      updated = true;
    }
  });
  // Optionally, post all local quotes to server (simulate two-way sync)
  await postQuotesToServer(quotes);
  if (updated) {
    saveQuotes();
    createCategorySelector();
    populateCategories();
    filterQuotes();
    notifyUser('Quotes synced with server. (Merged)', 'info');
  } else {
    notifyUser('Quotes already up to date with server.', 'info');
  }
}
// POST quotes to server (simulation)
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotesToPost)
    });
    if (response.ok) {
      notifyUser('Quotes posted to server successfully.', 'info');
      return await response.json();
    } else {
      notifyUser('Failed to post quotes to server.', 'error');
    }
  } catch (e) {
    notifyUser('Error posting to server.', 'error');
  }
}
// Explicit fetch function for server quotes (for user/manual use)
async function fetchQuotesFromServer() {
  const serverQuotes = await fetchServerQuotes();
  notifyUser(`Fetched ${serverQuotes.length} quotes from server.`, 'info');
  return serverQuotes;
}
// --- Server Sync Simulation ---
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simulate with posts as quotes
let syncInterval = null;
let lastServerSync = null;

// Simulate fetching quotes from server (using JSONPlaceholder)
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Simulate server quotes as {text, category}
    return data.slice(0, 10).map(post => ({ text: post.title, category: 'Server' }));
  } catch (e) {
    notifyUser('Failed to fetch from server.', 'error');
    return [];
  }
}

// Merge server quotes, server wins on conflict
async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  let updated = false;
  // Find new server quotes not in local
  serverQuotes.forEach(sq => {
    if (!quotes.some(lq => lq.text === sq.text)) {
      quotes.push(sq);
      updated = true;
    }
  });
  // Optionally, remove local quotes not on server (simulate server wins)
  // quotes = quotes.filter(lq => serverQuotes.some(sq => sq.text === lq.text) || lq.category !== 'Server');
  if (updated) {
    saveQuotes();
    createCategorySelector();
    populateCategories();
    filterQuotes();
    notifyUser('Quotes updated from server. (Server data wins)', 'info');
  }
  lastServerSync = new Date();
}

// Notification system
function notifyUser(message, type = 'info') {
  let note = document.getElementById('notification');
  if (!note) {
    note = document.createElement('div');
    note.id = 'notification';
    note.style.position = 'fixed';
    note.style.top = '10px';
    note.style.right = '10px';
    note.style.padding = '10px 20px';
    note.style.zIndex = 1000;
    note.style.borderRadius = '5px';
    note.style.fontWeight = 'bold';
    document.body.appendChild(note);
  }
  note.textContent = message;
  note.style.background = type === 'error' ? '#f44336' : '#2196f3';
  note.style.color = '#fff';
  note.style.display = 'block';
  setTimeout(() => { note.style.display = 'none'; }, 4000);
}

// Manual sync button
function addSyncButton() {
  let btn = document.getElementById('syncBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'syncBtn';
    btn.textContent = 'Sync with Server';
    btn.style.marginLeft = '10px';
    btn.onclick = syncWithServer;
    document.body.insertBefore(btn, document.getElementById('quoteDisplay'));
  }
}

// Start periodic sync
function startSyncInterval() {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(syncWithServer, 20000); // every 20 seconds
}
// Track the currently selected category filter
let selectedCategory = localStorage.getItem('lastCategoryFilter') || 'all';
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
        filter.value = selectedCategory;
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

function filterQuotes() {
  const filter = document.getElementById('categoryFilter');
  if (!filter) return;
  selectedCategory = filter.value;
  localStorage.setItem('lastCategoryFilter', selectedCategory);
  let filteredQuotes = (selectedCategory === 'all') ? quotes : quotes.filter(q => q.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available for this category.';
    return;
  }
  document.getElementById('quoteDisplay').innerHTML = filteredQuotes.map(q => `<blockquote>${q.text}</blockquote><footer>${q.category}</footer>`).join('');
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
}
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
  document.getElementById('categoryFilter').value = category;
  selectedCategory = category;
  filterQuotes();
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
populateCategories();
document.getElementById('categoryFilter').value = selectedCategory;
filterQuotes();
// Also show last viewed quote if available (optional)
const lastViewed = sessionStorage.getItem('lastViewedQuote');
if (lastViewed) {
  const q = JSON.parse(lastViewed);
  if (selectedCategory === 'all' || q.category === selectedCategory) {
    document.getElementById('quoteDisplay').innerHTML = `<blockquote>${q.text}</blockquote><footer>${q.category}</footer>`;
  }
}
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Add sync button and start periodic sync
addSyncButton();
startSyncInterval();
