/**
 * Main Application Logic
 * 
 * Handles UI interactions, Handlebars rendering, HTTP/Axios communication
 * Displays anime, characters, and people images
 * 
 * @module App
 */

// Register Handlebars helpers
Handlebars.registerHelper('truncate', function(str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + '...';
    }
    return str || '';
});

Handlebars.registerHelper('formatNumber', function(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
});

// Global state
const AppState = {
    currentAnime: null,
    searchResults: [],
    topRated: [],
    characters: [],
    people: [],
    isLoading: false
};

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Anime Explorer - HTTP/Axios Architecture');
    console.log('📡 Protocol: HTTP');
    console.log('🔗 Communication: Axios');
    
    // Check server connectivity via HTTP
    try {
        const health = await API.healthCheck();
        console.log('✓ HTTP Connection successful:', health);
        showNotification('Connected via HTTP/Axios successfully!', 'success');
    } catch (error) {
        console.error('✗ HTTP Connection failed:', error);
        showNotification('Failed to connect. Please start all servers.', 'danger');
    }
    
    // Load initial data
    await Promise.all([
        loadTopRated(),
        loadPopularCharacters(),
        loadPopularPeople()
    ]);
});

/**
 * Search anime (HTTP GET via Axios)
 */
async function searchAnime(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('Please enter a search term', 'warning');
        return;
    }
    
    showLoading(true);
    console.log(`🔍 Searching via HTTP/Axios: "${query}"`);
    
    try {
        const results = await API.searchAnime(query);
        AppState.searchResults = results;
        
        if (results.length === 0) {
            showNotification(`No results found for "${query}"`, 'info');
            document.getElementById('searchResults').innerHTML = `
                <div class="alert alert-info text-center fade-in" role="alert">
                    <i class="bi bi-info-circle fs-1"></i>
                    <p class="mt-3 mb-0">No anime found matching "${query}"</p>
                </div>
            `;
        } else {
            showNotification(`Found ${results.length} anime via HTTP/Axios`, 'success');
            renderAnimeCards(results, 'searchResults');
        }
    } catch (error) {
        console.error('HTTP Search error:', error);
        showNotification('Search failed: ' + error.message, 'danger');
    } finally {
        showLoading(false);
    }
}

/**
 * Load top rated anime with images
 */
async function loadTopRated() {
    try {
        console.log('📡 Loading top rated via HTTP...');
        const topRated = await API.getTopRated(12);
        AppState.topRated = topRated;
        renderAnimeCards(topRated, 'topRatedResults');
    } catch (error) {
        console.error('Failed to load top rated:', error);
        document.getElementById('topRatedResults').innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="bi bi-exclamation-triangle"></i> 
                    Failed to load top rated anime. Server may not be running.
                </div>
            </div>
        `;
    }
}

/**
 * Load popular characters with images
 */
async function loadPopularCharacters() {
    try {
        console.log('📡 Loading characters via HTTP...');
        const characters = await API.getPopularCharacters(12);
        AppState.characters = characters;
        renderCharacterCards(characters, 'charactersResults');
    } catch (error) {
        console.error('Failed to load characters:', error);
        document.getElementById('charactersResults').innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> 
                    Character data will be available after CSV import
                </div>
            </div>
        `;
    }
}

/**
 * Load popular people/actors with photos
 */
async function loadPopularPeople() {
    try {
        console.log('📡 Loading people via HTTP...');
        const people = await API.getPopularPeople(12);
        AppState.people = people;
        renderPeopleCards(people, 'peopleResults');
    } catch (error) {
        console.error('Failed to load people:', error);
        document.getElementById('peopleResults').innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> 
                    Voice actor data will be available after CSV import
                </div>
            </div>
        `;
    }
}

/**
 * Render anime cards with images using Handlebars
 */
function renderAnimeCards(animes, containerId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById('anime-card-template').innerHTML;
    const compiledTemplate = Handlebars.compile(template);
    
    const html = compiledTemplate({ animes: animes });
    container.innerHTML = html;
    container.classList.add('fade-in');
}

/**
 * Render character cards with images using Handlebars
 */
function renderCharacterCards(characters, containerId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById('character-card-template').innerHTML;
    const compiledTemplate = Handlebars.compile(template);
    
    const html = compiledTemplate({ characters: characters });
    container.innerHTML = html;
    container.classList.add('fade-in');
}

/**
 * Render people/actor cards with photos using Handlebars
 */
function renderPeopleCards(people, containerId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById('person-card-template').innerHTML;
    const compiledTemplate = Handlebars.compile(template);
    
    const html = compiledTemplate({ people: people });
    container.innerHTML = html;
    container.classList.add('fade-in');
}

/**
 * View anime details (to be implemented)
 */
async function viewAnimeDetails(malId) {
    console.log('📖 Viewing anime:', malId);
    
    try {
        const anime = await API.getAnimeById(malId);
        console.log('Anime details via HTTP:', anime);
        
        // TODO: Create modal or detail page
        alert(`
Anime Details (via HTTP/Axios):

Title: ${anime.title}
Type: ${anime.type}
Score: ${anime.score || 'N/A'}
Episodes: ${anime.episodes || 'N/A'}
Synopsis: ${anime.synopsis ? anime.synopsis.substring(0, 150) + '...' : 'N/A'}

Detail page coming soon!
        `);
    } catch (error) {
        console.error('Failed to load details:', error);
        showNotification('Failed to load anime details', 'danger');
    }
}

/**
 * Show/hide loading spinner
 */
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
    AppState.isLoading = show;
}

/**
 * Show Bootstrap toast notification
 */
function showNotification(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast,