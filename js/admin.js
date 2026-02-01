// ========================================
// ADMIN.JS - Admin Dashboard Logic
// ========================================

let editingId = null;
let deleteId = null;

// ========================================
// AUTHENTICATION CHECK
// ========================================

// Protect this page - redirect to login if not authenticated
if (!requireAuth()) {
    // requireAuth() will handle redirect
    throw new Error('Authentication required');
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Display welcome message
    displayWelcomeMessage();
    
    // Load VN table
    loadVNTable();
    
    // Setup event listeners
    setupAdminEventListeners();
}

// ========================================
// WELCOME MESSAGE
// ========================================

function displayWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        const username = getCurrentUser();
        welcomeMessage.innerHTML = `Selamat datang, <strong>${username || 'Admin'}</strong>`;
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupAdminEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add New Button
    const addNewBtn = document.getElementById('addNewBtn');
    if (addNewBtn) {
        addNewBtn.addEventListener('click', showAddForm);
    }
    
    // Form submission
    const vnForm = document.getElementById('vnForm');
    if (vnForm) {
        vnForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideForm);
    }
    
    // Delete modal buttons
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteOverlay = document.getElementById('deleteOverlay');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (deleteOverlay) {
        deleteOverlay.addEventListener('click', closeDeleteModal);
    }
}

// ========================================
// LOGOUT FUNCTION
// ========================================

function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        logout(); // This will clear session and redirect to login.html
    }
}

// ========================================
// TABLE FUNCTIONS
// ========================================

function loadVNTable() {
    const tbody = document.getElementById('vnTableBody');
    if (!tbody) return;
    
    const vnData = getAllVN();
    tbody.innerHTML = '';
    
    if (vnData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    Belum ada visual novel. Klik "Tambah Visual Novel" untuk menambah.
                </td>
            </tr>
        `;
        return;
    }
    
    vnData.forEach(vn => {
        const row = createTableRow(vn);
        tbody.appendChild(row);
    });
}

function createTableRow(vn) {
    const tr = document.createElement('tr');
    
    const categoryClass = `category-${vn.category}`;
    const categoryLabel = getCategoryLabel(vn.category);
    
    tr.innerHTML = `
        <td>
            <img src="${vn.image}" alt="${vn.title}" class="table-image" onerror="this.src='https://via.placeholder.com/60x80/1a2332/00d9ff?text=VN'">
        </td>
        <td class="table-title">${vn.title}</td>
        <td>${vn.language}</td>
        <td>
            <span class="category-badge ${categoryClass}">${categoryLabel}</span>
        </td>
        <td>
            <div class="table-actions">
                <button class="btn-icon btn-edit" onclick="editVN(${vn.id})" title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="btn-icon btn-delete" onclick="showDeleteModal(${vn.id})" title="Hapus">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

function getCategoryLabel(category) {
    const labels = {
        'general': 'General VN',
        'type-moon': 'TYPE-MOON',
        'umineko': 'Umineko'
    };
    return labels[category] || category;
}

// ========================================
// FORM FUNCTIONS
// ========================================

function showAddForm() {
    const adminForm = document.getElementById('adminForm');
    const formTitle = document.getElementById('formTitle');
    const vnForm = document.getElementById('vnForm');
    
    if (!adminForm || !formTitle || !vnForm) return;
    
    // Reset form
    vnForm.reset();
    document.getElementById('editId').value = '';
    editingId = null;
    
    // Update title
    formTitle.textContent = 'Tambah Visual Novel Baru';
    
    // Show form
    adminForm.style.display = 'block';
    
    // Scroll to form
    adminForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideForm() {
    const adminForm = document.getElementById('adminForm');
    const vnForm = document.getElementById('vnForm');
    
    if (!adminForm || !vnForm) return;
    
    adminForm.style.display = 'none';
    vnForm.reset();
    editingId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const vnData = {
        title: document.getElementById('vnTitle').value.trim(),
        language: document.getElementById('vnLanguage').value.trim(),
        category: document.getElementById('vnCategory').value,
        image: document.getElementById('vnImage').value.trim(),
        downloadLink: document.getElementById('vnDownloadLink').value.trim(),
        description: document.getElementById('vnDescription').value.trim()
    };
    
    // Validate
    if (!vnData.title || !vnData.language || !vnData.category || !vnData.image || !vnData.downloadLink) {
        showToast('Mohon isi semua field yang diperlukan!', 'error');
        return;
    }
    
    // Add or update
    if (editingId) {
        const updated = updateVN(editingId, vnData);
        if (updated) {
            showToast('Visual novel berhasil diperbarui!', 'success');
        } else {
            showToast('Gagal memperbarui visual novel!', 'error');
        }
    } else {
        const added = addVN(vnData);
        if (added) {
            showToast('Visual novel berhasil ditambahkan!', 'success');
        } else {
            showToast('Gagal menambahkan visual novel!', 'error');
        }
    }
    
    // Reload table and hide form
    loadVNTable();
    hideForm();
}

// ========================================
// EDIT FUNCTION
// ========================================

function editVN(id) {
    const vn = getVNById(id);
    if (!vn) {
        showToast('Visual novel tidak ditemukan!', 'error');
        return;
    }
    
    const adminForm = document.getElementById('adminForm');
    const formTitle = document.getElementById('formTitle');
    
    if (!adminForm || !formTitle) return;
    
    // Set editing ID
    editingId = id;
    document.getElementById('editId').value = id;
    
    // Fill form
    document.getElementById('vnTitle').value = vn.title;
    document.getElementById('vnLanguage').value = vn.language;
    document.getElementById('vnCategory').value = vn.category;
    document.getElementById('vnImage').value = vn.image;
    document.getElementById('vnDownloadLink').value = vn.downloadLink;
    document.getElementById('vnDescription').value = vn.description || '';
    
    // Update title
    formTitle.textContent = 'Edit Visual Novel';
    
    // Show form
    adminForm.style.display = 'block';
    
    // Scroll to form
    adminForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// DELETE FUNCTIONS
// ========================================

function showDeleteModal(id) {
    deleteId = id;
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDeleteModal() {
    deleteId = null;
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmDelete() {
    if (!deleteId) return;
    
    const deleted = deleteVN(deleteId);
    
    if (deleted) {
        showToast('Visual novel berhasil dihapus!', 'success');
        loadVNTable();
    } else {
        showToast('Gagal menghapus visual novel!', 'error');
    }
    
    closeDeleteModal();
}

// ========================================
// TOAST NOTIFICATION
// ========================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Add color based on type
    if (type === 'success') {
        toast.style.borderColor = 'var(--success)';
    } else if (type === 'error') {
        toast.style.borderColor = 'var(--danger)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions global for onclick attributes
window.editVN = editVN;
window.showDeleteModal = showDeleteModal;
