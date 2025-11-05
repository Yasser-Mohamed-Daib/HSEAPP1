/**
 * Main Entry Point
 * Initializes the HSE Management System
 */

import { AppState, initState, saveState } from './core/state.js';
import { initIndexedDB } from './data/storage.js';
import { init as initGoogleSync } from './data/google-sync.js';
import { showLoginScreen, showMainApp } from './ui/screens.js';
import { login, isAuthenticated } from './security/auth.js';
import { updateNavigation } from './security/permissions.js';
import { load } from './data/storage.js';
import * as Notifications from './core/notifications.js';

/**
 * Initialize application
 */
async function initApp() {
    try {
        // Initialize state
        initState();
        
        // Initialize IndexedDB
        await initIndexedDB();
        
        // Load data
        await load();
        
        // Initialize Google Sheets sync
        initGoogleSync();
        
        // Load company logo
        loadCompanyLogo();
        
        // Setup theme
        setupTheme();
        
        // Setup notifications
        setupNotifications();
        
        // Check authentication
        if (isAuthenticated()) {
            updateNavigation();
            await showMainApp();
        } else {
            showLoginScreen();
            setupLoginForm();
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
        Notifications.error('حدث خطأ في تهيئة التطبيق: ' + error.message);
    }
}

/**
 * Load company logo
 */
function loadCompanyLogo() {
    const savedLogo = localStorage.getItem('company_logo');
    const logoImg = document.getElementById('company-logo');
    const defaultIcon = document.getElementById('default-logo-icon');
    
    if (savedLogo && logoImg && defaultIcon) {
        AppState.companyLogo = savedLogo;
        logoImg.src = savedLogo;
        logoImg.onload = function() {
            logoImg.style.display = 'block';
            defaultIcon.style.display = 'none';
        };
        logoImg.onerror = function() {
            logoImg.style.display = 'none';
            defaultIcon.style.display = 'block';
        };
    }
}

/**
 * Setup theme
 */
function setupTheme() {
    const savedTheme = localStorage.getItem('hse_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('hse_theme', newTheme);
        });
    }
}

/**
 * Setup notifications
 */
function setupNotifications() {
    // Add notification styles if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                min-width: 300px;
                max-width: 500px;
                animation: slideIn 0.3s ease;
            }
            .notification-show {
                animation: slideIn 0.3s ease;
            }
            .notification-hide {
                animation: slideOut 0.3s ease;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Setup login form
 */
function setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        if (!username || !password) {
            Notifications.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        
        const success = await login(username, password, remember);
        
        if (success) {
            updateNavigation();
            await showMainApp();
        }
    });
}

/**
 * Initialize on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

