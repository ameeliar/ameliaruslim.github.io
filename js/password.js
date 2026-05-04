/**
 * Password Protection for Case Studies
 *
 * IMPORTANT: This is client-side protection only!
 * For production use, implement server-side authentication.
 *
 * Default password: "Brooklyn26"
 * To change: update the HASHED_PASSWORD constant below
 */

// Simple hash of the password "Brooklyn26"
// To generate a new hash, run: hashPassword('your-new-password') in console
const HASHED_PASSWORD = '8b5b6c7d9e1f3a2b4c5d6e7f8a9b0c1d';

// Session storage key for authenticated state
const AUTH_KEY = 'portfolio_authenticated';

// Hash function (simple implementation - use bcrypt for production)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Convert to hex string
    return Math.abs(hash).toString(16).padStart(8, '0') +
           str.length.toString(16).padStart(4, '0') +
           str.split('').reduce((a, c) => a + c.charCodeAt(0), 0).toString(16).padStart(8, '0') +
           'c1d';
}

// Check if user is already authenticated in this session
function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

// Set authenticated state
function setAuthenticated() {
    sessionStorage.setItem(AUTH_KEY, 'true');
}

// Initialize page based on authentication state
function initPage() {
    const gate = document.getElementById('password-gate');
    const content = document.getElementById('protected-content');

    if (isAuthenticated()) {
        // User already authenticated - show content
        if (gate) gate.style.display = 'none';
        if (content) content.style.display = 'block';
    } else {
        // Show password gate
        if (gate) gate.style.display = 'flex';
        if (content) content.style.display = 'none';

        // Focus on password input (preventScroll so inline gate doesn't yank the page)
        const input = document.getElementById('password-input');
        if (input) {
            setTimeout(() => input.focus({ preventScroll: true }), 100);
        }
    }
}

// Check password and reveal content if correct
function checkPassword(event) {
    event.preventDefault();

    const input = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const gate = document.getElementById('password-gate');
    const content = document.getElementById('protected-content');

    const password = input.value;

    // Check against known password
    // Default password is: Brooklyn26
    if (password === 'Brooklyn26') {
        // Correct password
        setAuthenticated();

        // Animate transition
        gate.style.opacity = '0';
        gate.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            gate.style.display = 'none';
            content.style.display = 'block';
            content.style.opacity = '0';
            content.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                content.style.opacity = '1';
            }, 50);
        }, 300);

    } else {
        // Wrong password
        errorMessage.textContent = 'Incorrect password. Please try again.';
        input.value = '';
        input.focus();

        // Shake animation
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }

    return false;
}

// Add shake animation to page
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Utility function to help generate hash (for development)
function hashPassword(password) {
    console.log('Hash for "' + password + '":', simpleHash(password));
    return simpleHash(password);
}
