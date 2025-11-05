/**
 * Incidents Module Example
 * This is a template for converting feature modules to ES6 modules
 */

import { AppState } from '../core/state.js';
import * as Notifications from '../core/notifications.js';
import * as Loading from '../core/loading.js';
import { escapeHTML, formatDate } from '../core/utils.js';
import { autoSave } from '../data/google-sync.js';
import { save } from '../data/storage.js';

/**
 * Load incidents module
 */
export async function load() {
    const section = document.getElementById('incidents-section');
    if (!section) return;

    section.innerHTML = `
        <div class="section-header">
            <h1 class="section-title">
                <i class="fas fa-exclamation-triangle ml-3"></i>
                إدارة الحوادث
            </h1>
            <p class="section-subtitle">تسجيل ومتابعة حوادث السلامة المهنية</p>
        </div>
        <div id="incidents-content" class="mt-6">
            ${await renderList()}
        </div>
    `;

    setupEventListeners();
    loadIncidentsList();
}

/**
 * Render incidents list
 */
async function renderList() {
    const incidents = AppState.appData.incidents || [];
    
    if (incidents.length === 0) {
        return '<div class="empty-state"><p>لا توجد حوادث مسجلة</p></div>';
    }

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>كود ISO</th>
                    <th>العنوان</th>
                    <th>التاريخ</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${incidents.map(incident => `
                    <tr>
                        <td>${escapeHTML(incident.isoCode || '')}</td>
                        <td>${escapeHTML(incident.title || '')}</td>
                        <td>${formatDate(incident.date)}</td>
                        <td>${escapeHTML(incident.status || '')}</td>
                        <td>
                            <button onclick="window.Incidents?.viewIncident('${incident.id}')">
                                عرض
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    const addBtn = document.getElementById('add-incident-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => showForm());
    }
}

/**
 * Load incidents list
 */
function loadIncidentsList() {
    // Update table with current data
    const container = document.getElementById('incidents-content');
    if (container) {
        renderList().then(html => {
            container.innerHTML = html;
        });
    }
}

/**
 * Show incident form
 */
export async function showForm(incidentData = null) {
    // Form implementation
    // Similar to existing code but using ES6 modules
}

/**
 * View incident
 */
export function viewIncident(id) {
    const incident = AppState.appData.incidents.find(i => i.id === id);
    if (!incident) return;

    // View implementation
}

/**
 * Save incident
 */
export async function saveIncident(formData) {
    Loading.show();
    
    try {
        const index = AppState.appData.incidents.findIndex(i => i.id === formData.id);
        
        if (index !== -1) {
            AppState.appData.incidents[index] = formData;
        } else {
            AppState.appData.incidents.push(formData);
        }

        // Save to localStorage/IndexedDB
        save();

        // Auto-save to Google Sheets
        await autoSave('Incidents', AppState.appData.incidents);

        Loading.hide();
        Notifications.success('تم حفظ الحادث بنجاح');
        loadIncidentsList();
    } catch (error) {
        Loading.hide();
        Notifications.error('حدث خطأ: ' + error.message);
    }
}

// Export for global access
window.Incidents = {
    load,
    showForm,
    viewIncident,
    saveIncident
};

