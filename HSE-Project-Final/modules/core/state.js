/**
 * Core Application State Management
 * Manages global state for the HSE Management System
 */

export const AppState = {
    currentUser: null,
    currentSection: 'dashboard',
    currentLanguage: 'ar',
    appData: {
        users: [],
        incidents: [],
        nearmiss: [],
        ptw: [],
        training: [],
        clinicVisits: [],
        medications: [],
        sickLeave: [],
        injuries: [],
        clinicInventory: [],
        fireEquipment: [],
        ppe: [],
        violations: [],
        contractors: [],
        employees: [],
        behaviorMonitoring: [],
        chemicalSafety: [],
        dailyObservations: [],
        isoDocuments: [],
        isoProcedures: [],
        isoForms: [],
        sopJHA: [],
        emergencyAlerts: [],
        emergencyPlans: [],
        riskAssessments: [],
        legalDocuments: [],
        hseAudits: [],
        hseNonConformities: [],
        hseCorrectiveActions: [],
        hseObjectives: [],
        hseRiskAssessments: [],
        environmentalAspects: [],
        environmentalMonitoring: [],
        sustainability: [],
        carbonFootprint: [],
        wasteManagement: [],
        energyEfficiency: [],
        waterManagement: [],
        recyclingPrograms: []
    },
    googleConfig: {
        appsScript: {
            enabled: false,
            scriptUrl: ''
        },
        sheets: {
            enabled: false,
            spreadsheetId: '',
            apiKey: ''
        }
    },
    companyLogo: '',
    companySettings: {
        name: 'الشركة العالمية للانتاج والتصنيع الزراعي',
        address: '',
        phone: '',
        email: ''
    },
    dateFormat: 'gregorian',
    notificationEmails: [],
    legalPortalUrl: '',
    legalKeywords: [],
    legalAutoNotify: false
};

/**
 * Initialize state from localStorage
 */
export function initState() {
    try {
        const savedState = localStorage.getItem('hse_app_state');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Merge saved state with defaults
            Object.assign(AppState, parsed);
        }
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
    }
}

/**
 * Save state to localStorage
 */
export function saveState() {
    try {
        const stateToSave = {
            currentUser: AppState.currentUser,
            currentSection: AppState.currentSection,
            currentLanguage: AppState.currentLanguage,
            googleConfig: AppState.googleConfig,
            companyLogo: AppState.companyLogo,
            companySettings: AppState.companySettings,
            dateFormat: AppState.dateFormat,
            notificationEmails: AppState.notificationEmails,
            legalPortalUrl: AppState.legalPortalUrl,
            legalKeywords: AppState.legalKeywords,
            legalAutoNotify: AppState.legalAutoNotify
        };
        localStorage.setItem('hse_app_state', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
}

