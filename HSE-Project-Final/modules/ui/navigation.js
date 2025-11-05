/**
 * Navigation Module
 * Handles section navigation and UI updates
 */

import { AppState } from '../core/state.js';
import { saveState } from '../core/state.js';
import { checkBeforeShow } from '../security/permissions.js';

/**
 * Show section
 */
export function showSection(sectionName) {
    if (!checkBeforeShow(sectionName)) {
        return;
    }

    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const sectionId = `${sectionName}-section`;
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        AppState.currentSection = sectionName;
        saveState();

        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionName) {
                item.classList.add('active');
            }
        });

        // Trigger lazy loading
        loadSectionData(sectionName);
    }
}

/**
 * Load section data dynamically
 */
async function loadSectionData(sectionName) {
    try {
        switch (sectionName) {
            case 'dashboard':
                const { load: loadDashboard } = await import('../features/dashboard.js');
                if (loadDashboard) loadDashboard();
                break;
            case 'incidents':
                const { load: loadIncidents } = await import('../features/incidents.js');
                if (loadIncidents) loadIncidents();
                break;
            case 'ptw':
                const { load: loadPTW } = await import('../features/ptw.js');
                if (loadPTW) loadPTW();
                break;
            case 'training':
                const { load: loadTraining } = await import('../features/training.js');
                if (loadTraining) loadTraining();
                break;
            // Add more cases as needed
            default:
                console.warn(`No module found for section: ${sectionName}`);
        }
    } catch (error) {
        console.error(`Error loading section ${sectionName}:`, error);
    }
}

/**
 * Setup navigation listeners
 */
export function setupNavigationListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
            }
        });
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                const { logout } = await import('../security/auth.js');
                logout();
                window.location.reload();
            }
        });
    }
}

/**
 * Initialize navigation
 */
export function init() {
    setupNavigationListeners();
    
    // Show initial section
    const initialSection = AppState.currentSection || 'dashboard';
    showSection(initialSection);
}

