/**
 * UI Helper Functions
 * DOM manipulation helpers separated from business logic
 */

import { AppState } from '../core/state.js';

/**
 * Update company logo in header
 */
export function updateCompanyLogoHeader() {
    const header = document.getElementById('company-logo-header');
    const logoImg = document.getElementById('header-company-logo');
    const logoImgRight = document.getElementById('header-company-logo-right');
    
    if (header) {
        if (AppState.companyLogo) {
            header.style.display = 'flex';
            
            if (logoImg) {
                logoImg.src = AppState.companyLogo;
                logoImg.style.display = 'block';
            }
            
            if (logoImgRight) {
                logoImgRight.src = AppState.companyLogo;
                logoImgRight.style.display = 'block';
            }
        } else {
            header.style.display = 'none';
            if (logoImg) logoImg.style.display = 'none';
            if (logoImgRight) logoImgRight.style.display = 'none';
        }
        
        // Update section padding
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            if (header.style.display === 'flex') {
                section.style.paddingTop = '70px';
            } else {
                section.style.paddingTop = '0';
            }
        });
    }
}

/**
 * Update dashboard logo
 */
export function updateDashboardLogo() {
    const dashboardLogoDiv = document.getElementById('dashboard-company-logo');
    const dashboardLogoImg = document.getElementById('dashboard-logo-img');
    
    if (dashboardLogoDiv && dashboardLogoImg) {
        if (AppState.companyLogo) {
            dashboardLogoDiv.style.display = 'block';
            dashboardLogoImg.src = AppState.companyLogo;
            dashboardLogoImg.style.display = 'block';
            dashboardLogoImg.onload = function() {
                dashboardLogoImg.style.display = 'block';
                dashboardLogoDiv.style.display = 'block';
            };
            dashboardLogoImg.onerror = function() {
                dashboardLogoDiv.style.display = 'none';
            };
        } else {
            dashboardLogoDiv.style.display = 'none';
        }
    }
}

