/**
 * Screen Management Module
 * Handles screen transitions and UI updates
 */

import { AppState } from '../core/state.js';
import { updateCompanyLogoHeader, updateDashboardLogo } from './ui-helpers.js';

/**
 * Show login screen
 */
export function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('username').focus();
}

/**
 * Show main app
 */
export async function showMainApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';

    // Update company logo
    updateCompanyLogoHeader();
    updateDashboardLogo();

    // Sync data if Google Sheets is enabled
    if (AppState.googleConfig.appsScript.enabled) {
        const { syncData } = await import('../data/google-sync.js');
        try {
            await syncData();
        } catch (error) {
            console.warn('Sync error:', error);
        }
    }

    // Show dashboard
    const { showSection } = await import('./navigation.js');
    showSection('dashboard');
}


