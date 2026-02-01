// ========================================
// MAIN.JS - Frontend Logic with NEW Notifications
// ========================================

let currentFilter = 'all';
let allVNData = [];

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load all VN data
    allVNData = getAllVN();
    
    // Show update notification if there are new VNs
    showUpdateNotification();
    
    // Render VN grid
    renderVNGrid(allVNData);
    
    // Setup event listeners
    setupEventListeners();
    
    // Add staggered animation to cards
    animateCards();
}

// ========================================
// UPDATE NOTIFICATION
// ========================================

function showUpdateNotification() {
    const newVNs = getNewVNs();
    
    if (newVNs.length === 0) return;
    
    // Check if notification was dismissed today
    const dismissedToday = localStorage.getItem('notification_dismissed');
    const today = new Date().toDateString();
    
    if (dismissedToday === today) return;
    
    // Create notification banner
    const vnSection = document.querySelector('.vn-section');
    const container = vnSection.querySelector('.container');
    
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.id = 'updateNotification';
    
    const vnList = newVNs.slice(0, 3).map(vn => vn.title).join(', ');
    const moreText = newVNs.length > 3 ? ` and ${newVNs.length - 3} more` : '';
    
    notification.innerHTML = `
        <div class="update-notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
        </div>
        <div class="update-notification-content">
            <div class="update-notification-title">🎉 ${newVNs.length} New Visual Novel${newVNs.length > 1 ? 's' : ''} Added!</div>
            <div class="update-notification-text">${vnList}${moreText}</div>
        </div>
        <button class="update-notification-close" onclick="dismissNotification()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    container.insertBefore(notification, container.firstChild);
}

function dismissNotification() {
    const notification = document.getElementById('updateNotification');
    if (notification) {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
        
        // Remember dismissal for today
        const today = new Date().toDateString();
        localStorage.setItem('notification_dismissed', today);
    }
}

// Make function global
window.dismissNotification = dismissNotification;

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            handleFilter();
        });
    });
    
    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderVNGrid(vnData) {
    const grid = document.getElementById('vnGrid');
    const noResults = document.getElementById('noResults');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (vnData.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    vnData.forEach((vn, index) => {
        const card = createVNCard(vn, index);
        grid.appendChild(card);
    });
}

function createVNCard(vn, index) {
    const card = document.createElement('div');
    card.className = 'vn-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => openModal(vn);
    
    // Check if VN is new
    const isNew = isNewVN(vn.dateAdded);
    const newBadge = isNew ? '<span class="vn-card-new-badge">NEW!</span>' : '';
    const dateInfo = vn.dateAdded ? `<span class="vn-date-added">Added ${formatDateAdded(vn.dateAdded)}</span>` : '';
    
    card.innerHTML = `
        ${newBadge}
        <img src="${vn.image}" alt="${vn.title}" class="vn-card-image" onerror="this.src='https://via.placeholder.com/280x350/1a2332/00d9ff?text=${encodeURIComponent(vn.title)}'">
        <div class="vn-card-content">
            <h3 class="vn-card-title">${vn.title}</h3>
            <div class="vn-card-meta">
                <span class="vn-tag">${vn.language}</span>
                ${dateInfo}
            </div>
        </div>
    `;
    
    return card;
}

// ========================================
// SEARCH & FILTER
// ========================================

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query === '') {
        handleFilter();
        return;
    }
    
    const results = searchVN(query);
    const filtered = currentFilter === 'all' 
        ? results 
        : results.filter(vn => vn.category === currentFilter);
    
    renderVNGrid(filtered);
    animateCards();
}

function handleFilter() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    let filtered;
    
    if (query !== '') {
        const searchResults = searchVN(query);
        filtered = currentFilter === 'all' 
            ? searchResults 
            : searchResults.filter(vn => vn.category === currentFilter);
    } else {
        filtered = filterVNByCategory(currentFilter);
    }
    
    renderVNGrid(filtered);
    animateCards();
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function openModal(vn) {
    const modal = document.getElementById('downloadModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const downloadLinks = document.getElementById('downloadLinks');
    
    if (!modal) return;
    
    // Set modal content
    modalTitle.textContent = vn.title;
    modalImage.src = vn.image;
    modalImage.alt = vn.title;
    modalImage.onerror = function() {
        this.src = `https://via.placeholder.com/600x300/1a2332/00d9ff?text=${encodeURIComponent(vn.title)}`;
    };
    
    // Show NEW badge and date in modal if applicable
    const isNew = isNewVN(vn.dateAdded);
    const newBadgeHTML = isNew ? '<span style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; margin-left: 10px;">NEW!</span>' : '';
    const dateInfo = vn.dateAdded ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Added ${formatDateAdded(vn.dateAdded)}</p>` : '';
    
    modalTitle.innerHTML = `${vn.title}${newBadgeHTML}`;
    
    // Create download links
    downloadLinks.innerHTML = `
        ${dateInfo}
        <a href="${vn.downloadLink}" target="_blank" rel="noopener noreferrer" class="download-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download ${vn.title}</span>
        </a>
        ${vn.description ? `
        <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md);">
            <p style="color: var(--text-secondary); font-size: 0.9rem;">${vn.description}</p>
        </div>
        ` : ''}
    `;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('downloadModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// ANIMATIONS
// ========================================

function animateCards() {
    const cards = document.querySelectorAll('.vn-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 50);
    });
}

// Add slideUp animation for notification dismiss
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}
`;
document.head.appendChild(style);

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSearch = debounce(handleSearch, 300);
