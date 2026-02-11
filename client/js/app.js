<<<<<<< HEAD
Handlebars.registerHelper('truncate', function(str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + '...';
    }
    return str || '';
});

const AppState = {
    searchResults: [],
    topRated: []
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App starting...');
    
    try {
        const health = await API.healthCheck();
        console.log('Health:', health);
    } catch (error) {
        console.error('Connection error:', error);
    }
    
    loadTopRated();
});

async function searchAnime(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    console.log('Searching for:', query);
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    document.getElementById('loadingSpinner').style.display = 'block';
    
    try {
        const results = await API.searchAnime(query);
        console.log('Results:', results);
        
        if (results.length === 0) {
            document.getElementById('searchResults').innerHTML = `
                <div class="alert alert-info">No results found for "${query}"</div>
            `;
        } else {
            renderAnimeCards(results, 'searchResults');
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed: ' + error.message);
    }
    
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function loadTopRated() {
    console.log('Loading top rated...');
    
    try {
        const topRated = await API.getTopRated(12);
        console.log('Top rated:', topRated);
        renderAnimeCards(topRated, 'topRatedResults');
    } catch (error) {
        console.error('Error loading top rated:', error);
    }
}

function renderAnimeCards(animes, containerId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById('anime-card-template').innerHTML;
    const compiledTemplate = Handlebars.compile(template);
    
    const html = compiledTemplate({ animes: animes });
    container.innerHTML = html;
}

async function viewAnimeDetails(malId) {
    console.log('Loading details for anime:', malId);
    
    try {
        const anime = await API.getAnimeById(malId);
        console.log('Anime data:', anime);
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="animeModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${anime.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${anime.imageUrl || 'https://via.placeholder.com/225x320'}" 
                                         class="img-fluid rounded" alt="${anime.title}">
                                </div>
                                <div class="col-md-8">
                                    ${anime.titleJapanese ? `<p><strong>Japanese:</strong> ${anime.titleJapanese}</p>` : ''}
                                    <p><strong>Type:</strong> ${anime.type || 'N/A'}</p>
                                    <p><strong>Episodes:</strong> ${anime.episodes || 'N/A'}</p>
                                    <p><strong>Score:</strong> ⭐ ${anime.score || 'N/A'}</p>
                                    <p><strong>Ranked:</strong> #${anime.rank || 'N/A'}</p>
                                    <p><strong>Popularity:</strong> #${anime.popularity || 'N/A'}</p>
                                    <p><strong>Members:</strong> ${anime.members ? anime.members.toLocaleString() : 'N/A'}</p>
                                    <p><strong>Status:</strong> ${anime.status || 'N/A'}</p>
                                </div>
                            </div>
                            ${anime.synopsis ? `
                                <div class="mt-3">
                                    <h6>Synopsis</h6>
                                    <p>${anime.synopsis}</p>
                                </div>
                            ` : ''}
                            ${anime.genres ? `
                                <div class="mt-3">
                                    <h6>Genres</h6>
                                    <p>${anime.genres}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            ${anime.url ? `<a href="${anime.url}" target="_blank" class="btn btn-primary">View on MyAnimeList</a>` : ''}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        const oldModal = document.getElementById('animeModal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('animeModal'));
        modal.show();
        
    } catch (error) {
        console.error('Failed to load details:', error);
        alert('Failed to load anime details. Please try again.');
    }
}
function scrollToSearch() {
    document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTopRated() {
    document.getElementById('top-rated').scrollIntoView({ behavior: 'smooth' });
}

window.searchAnime = searchAnime;
window.viewAnimeDetails = viewAnimeDetails;
window.scrollToSearch = scrollToSearch;
window.scrollToTopRated = scrollToTopRated;

=======
Handlebars.registerHelper('truncate', function(str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + '...';
    }
    return str || '';
});

const AppState = {
    searchResults: [],
    topRated: []
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App starting...');
    
    try {
        const health = await API.healthCheck();
        console.log('Health:', health);
    } catch (error) {
        console.error('Connection error:', error);
    }
    
    loadTopRated();
});

async function searchAnime(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    console.log('Searching for:', query);
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    document.getElementById('loadingSpinner').style.display = 'block';
    
    try {
        const results = await API.searchAnime(query);
        console.log('Results:', results);
        
        if (results.length === 0) {
            document.getElementById('searchResults').innerHTML = `
                <div class="alert alert-info">No results found for "${query}"</div>
            `;
        } else {
            renderAnimeCards(results, 'searchResults');
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed: ' + error.message);
    }
    
    document.getElementById('loadingSpinner').style.display = 'none';
}

async function loadTopRated() {
    console.log('Loading top rated...');
    
    try {
        const topRated = await API.getTopRated(12);
        console.log('Top rated:', topRated);
        renderAnimeCards(topRated, 'topRatedResults');
    } catch (error) {
        console.error('Error loading top rated:', error);
    }
}

function renderAnimeCards(animes, containerId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById('anime-card-template').innerHTML;
    const compiledTemplate = Handlebars.compile(template);
    
    const html = compiledTemplate({ animes: animes });
    container.innerHTML = html;
}

async function viewAnimeDetails(malId) {
    console.log('Loading details for anime:', malId);
    
    try {
        const anime = await API.getAnimeById(malId);
        console.log('Anime data:', anime);
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="animeModal" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${anime.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${anime.imageUrl || 'https://via.placeholder.com/225x320'}" 
                                         class="img-fluid rounded" alt="${anime.title}">
                                </div>
                                <div class="col-md-8">
                                    ${anime.titleJapanese ? `<p><strong>Japanese:</strong> ${anime.titleJapanese}</p>` : ''}
                                    <p><strong>Type:</strong> ${anime.type || 'N/A'}</p>
                                    <p><strong>Episodes:</strong> ${anime.episodes || 'N/A'}</p>
                                    <p><strong>Score:</strong> ⭐ ${anime.score || 'N/A'}</p>
                                    <p><strong>Ranked:</strong> #${anime.rank || 'N/A'}</p>
                                    <p><strong>Popularity:</strong> #${anime.popularity || 'N/A'}</p>
                                    <p><strong>Members:</strong> ${anime.members ? anime.members.toLocaleString() : 'N/A'}</p>
                                    <p><strong>Status:</strong> ${anime.status || 'N/A'}</p>
                                </div>
                            </div>
                            ${anime.synopsis ? `
                                <div class="mt-3">
                                    <h6>Synopsis</h6>
                                    <p>${anime.synopsis}</p>
                                </div>
                            ` : ''}
                            ${anime.genres ? `
                                <div class="mt-3">
                                    <h6>Genres</h6>
                                    <p>${anime.genres}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            ${anime.url ? `<a href="${anime.url}" target="_blank" class="btn btn-primary">View on MyAnimeList</a>` : ''}
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove old modal if exists
        const oldModal = document.getElementById('animeModal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('animeModal'));
        modal.show();
        
    } catch (error) {
        console.error('Failed to load details:', error);
        alert('Failed to load anime details. Please try again.');
    }
}
function scrollToSearch() {
    document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
}

function scrollToTopRated() {
    document.getElementById('top-rated').scrollIntoView({ behavior: 'smooth' });
}

window.searchAnime = searchAnime;
window.viewAnimeDetails = viewAnimeDetails;
window.scrollToSearch = scrollToSearch;
window.scrollToTopRated = scrollToTopRated;

>>>>>>> 57cefe07fe08e6067ea1ffa571259ff1419f2ec3
console.log('App initialized!');