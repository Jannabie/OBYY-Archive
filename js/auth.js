// ========================================
// AUTH.JS - Authentication System
// ========================================

// Storage keys
const AUTH_STORAGE_KEY = 'obyy_arsip_admin_auth';
const SESSION_STORAGE_KEY = 'obyy_arsip_admin_session';

// Default admin credentials - UPDATED!
const DEFAULT_CREDENTIALS = {
    username: 'ObyyGYJ',
    password: 'HaerinWonhee'
};

// Custom admin credentials (stored in localStorage)
const CUSTOM_CREDENTIALS_KEY = 'obyy_arsip_custom_credentials';

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

/**
 * Get stored credentials (custom or default)
 */
function getStoredCredentials() {
    const customCreds = localStorage.getItem(CUSTOM_CREDENTIALS_KEY);
    if (customCreds) {
        try {
            return JSON.parse(customCreds);
        } catch (e) {
            console.error('Error parsing custom credentials:', e);
        }
    }
    return DEFAULT_CREDENTIALS;
}

/**
 * Update admin credentials
 */
function updateCredentials(username, password) {
    const credentials = { username, password };
    localStorage.setItem(CUSTOM_CREDENTIALS_KEY, JSON.stringify(credentials));
    return true;
}

/**
 * Simple hash function (for basic security)
 * Note: In production, use proper encryption library
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

/**
 * Verify login credentials
 */
function verifyCredentials(username, password) {
    const stored = getStoredCredentials();
    return username === stored.username && password === stored.password;
}

/**
 * Create admin session
 */
function createSession(username, rememberMe = false) {
    const session = {
        username: username,
        loginTime: new Date().toISOString(),
        expiresAt: rememberMe 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    
    return session;
}

/**
 * Get current session
 */
function getSession() {
    // Check sessionStorage first
    let sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    
    // If not found, check localStorage
    if (!sessionData) {
        sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    }
    
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        
        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            clearSession();
            return null;
        }
        
        return session;
    } catch (e) {
        console.error('Error parsing session:', e);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return getSession() !== null;
}

/**
 * Clear session (logout)
 */
function clearSession() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
}

/**
 * Logout user
 */
function logout() {
    clearSession();
    window.location.href = 'login.html';
}

/**
 * Protect admin page - redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        // Store intended destination
        sessionStorage.setItem('redirect_after_login', window.location.pathname);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Get redirect URL after login
 */
function getRedirectUrl() {
    const redirect = sessionStorage.getItem('redirect_after_login');
    sessionStorage.removeItem('redirect_after_login');
    return redirect || 'admin.html';
}

/**
 * Check if already logged in (for login page)
 */
function checkAlreadyLoggedIn() {
    if (isAuthenticated()) {
        window.location.href = 'admin.html';
        return true;
    }
    return false;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get current user info
 */
function getCurrentUser() {
    const session = getSession();
    return session ? session.username : null;
}

/**
 * Get session expiry time
 */
function getSessionExpiry() {
    const session = getSession();
    return session ? new Date(session.expiresAt) : null;
}

/**
 * Extend session (refresh expiry time)
 */
function extendSession() {
    const session = getSession();
    if (!session) return false;
    
    // Determine if it was a "remember me" session
    const isRemembered = localStorage.getItem(SESSION_STORAGE_KEY) !== null;
    
    // Recreate session with extended time
    createSession(session.username, isRemembered);
    return true;
}
