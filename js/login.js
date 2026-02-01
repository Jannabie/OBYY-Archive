// ========================================
// LOGIN.JS - Login Page Logic
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    checkAlreadyLoggedIn();
    
    // Initialize login page
    initializeLoginPage();
});

// ========================================
// INITIALIZE
// ========================================

function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Focus on username field
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.focus();
    }
}

// ========================================
// LOGIN HANDLER
// ========================================

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    const loginError = document.getElementById('loginError');
    
    // Hide error
    loginError.style.display = 'none';
    
    // Show loading
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    
    // Simulate network delay (remove in production or make it shorter)
    setTimeout(() => {
        // Verify credentials
        if (verifyCredentials(username, password)) {
            // Create session
            createSession(username, rememberMe);
            
            // Success! Redirect to admin
            const redirectUrl = getRedirectUrl();
            window.location.href = redirectUrl;
        } else {
            // Login failed
            showLoginError('Username atau password salah!');
            
            // Reset button
            loginBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            
            // Clear password field
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }, 800); // Simulated delay
}

// ========================================
// PASSWORD TOGGLE
// ========================================

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.querySelector('.eye-open');
    const eyeClosed = document.querySelector('.eye-closed');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    } else {
        passwordInput.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    }
}

// ========================================
// ERROR DISPLAY
// ========================================

function showLoginError(message) {
    const loginError = document.getElementById('loginError');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    loginError.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 5000);
}
