/**
 * Google Sheets Sync Module
 * Enhanced with debouncing, rate limiting, and retry queue
 */

import { AppState } from '../core/state.js';
import { debounce } from '../core/utils.js';
import * as Notifications from '../core/notifications.js';
import * as Loading from '../core/loading.js';

const SYNC_DEBOUNCE_MS = 2000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

// Retry queue for offline operations
const retryQueue = [];
let isOnline = navigator.onLine;
let syncInProgress = false;

// Rate limiting
const rateLimit = {
    lastRequest: 0,
    minInterval: 1000, // 1 second between requests
    requests: 0,
    maxRequests: 10,
    windowMs: 60000 // 1 minute window
};

/**
 * Initialize online/offline listeners
 */
export function init() {
    window.addEventListener('online', () => {
        isOnline = true;
        processRetryQueue();
    });
    
    window.addEventListener('offline', () => {
        isOnline = false;
    });
}

/**
 * Check rate limit
 */
function checkRateLimit() {
    const now = Date.now();
    
    if (now - rateLimit.lastRequest < rateLimit.minInterval) {
        return false;
    }
    
    if (now - rateLimit.windowMs > rateLimit.lastRequest) {
        rateLimit.requests = 0;
    }
    
    if (rateLimit.requests >= rateLimit.maxRequests) {
        return false;
    }
    
    rateLimit.lastRequest = now;
    rateLimit.requests++;
    return true;
}

/**
 * Add to retry queue
 */
function addToRetryQueue(action, data) {
    retryQueue.push({
        action,
        data,
        retries: 0,
        timestamp: Date.now()
    });
}

/**
 * Process retry queue
 */
async function processRetryQueue() {
    if (!isOnline || syncInProgress || retryQueue.length === 0) {
        return;
    }

    syncInProgress = true;
    
    while (retryQueue.length > 0) {
        const item = retryQueue[0];
        
        if (item.retries >= MAX_RETRIES) {
            retryQueue.shift();
            Notifications.error(`فشل المزامنة بعد ${MAX_RETRIES} محاولات`);
            continue;
        }
        
        try {
            await item.action(item.data);
            retryQueue.shift();
        } catch (error) {
            item.retries++;
            if (item.retries >= MAX_RETRIES) {
                retryQueue.shift();
                Notifications.error(`فشل المزامنة: ${error.message}`);
            } else {
                // Move to end of queue
                retryQueue.push(retryQueue.shift());
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }
    
    syncInProgress = false;
}

/**
 * Debounced auto-save function
 */
const debouncedAutoSave = debounce(async (sheetName, data) => {
    await autoSave(sheetName, data);
}, SYNC_DEBOUNCE_MS);

/**
 * Auto-save to Google Sheets (debounced)
 * Compatible with existing Google Sheets integration
 */
export async function autoSave(sheetName, data) {
    if (!AppState.googleConfig.appsScript.enabled || !AppState.googleConfig.appsScript.scriptUrl) {
        return;
    }

    // التحقق من وجود spreadsheetId (مثل النظام القديم)
    const spreadsheetId = AppState.googleConfig.sheets.spreadsheetId;
    if (!spreadsheetId || spreadsheetId.trim() === '') {
        // لا نعرض خطأ، فقط نتجاهل (مثل النظام القديم)
        return;
    }

    if (!isOnline) {
        addToRetryQueue(() => autoSave(sheetName, data), { sheetName, data });
        return;
    }

    if (!checkRateLimit()) {
        // Queue for later
        debouncedAutoSave(sheetName, data);
        return;
    }

    try {
        // إرسال البيانات بنفس التنسيق الذي يتوقعه Google Apps Script
        await sendToAppsScript('saveToSheet', {
            sheetName,
            data: Array.isArray(data) ? data : [data],
            spreadsheetId: spreadsheetId.trim()
        });
    } catch (error) {
        // لا نعرض الأخطاء للحفظ التلقائي، فقط نكتب في console (مثل النظام القديم)
        console.log(`حفظ تلقائي لـ ${sheetName} فشل (سيتم المحاولة مرة أخرى عند الحفظ اليدوي):`, error.message);
        addToRetryQueue(() => autoSave(sheetName, data), { sheetName, data });
    }
}

/**
 * Send data to Google Apps Script
 * Compatible with existing Google Apps Script setup
 */
export async function sendToAppsScript(action, data) {
    if (!AppState.googleConfig.appsScript.enabled || !AppState.googleConfig.appsScript.scriptUrl) {
        throw new Error('Google Apps Script غير مفعّل');
    }

    const scriptUrl = AppState.googleConfig.appsScript.scriptUrl.trim();
    
    // التحقق من صحة URL
    if (!scriptUrl || !scriptUrl.includes('script.google.com') || !scriptUrl.endsWith('/exec')) {
        throw new Error('URL غير صحيح. يجب أن يكون رابط Google Apps Script وينتهي بـ /exec');
    }

    try {
        // استخدام text/plain لتجنب preflight CORS requests
        // Google Apps Script يدعم هذا النوع من الطلبات بدون مشاكل CORS
        const spreadsheetId = AppState.googleConfig.sheets.spreadsheetId || '';
        
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({ 
                action, 
                data,
                spreadsheetId: spreadsheetId.trim(),
                timestamp: new Date().toISOString() 
            })
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            // محاولة قراءة رسالة الخطأ من الاستجابة
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.text();
                if (errorData) {
                    const parsed = JSON.parse(errorData);
                    errorMessage = parsed.message || parsed.error || errorMessage;
                }
            } catch (e) {
                // إذا فشل parsing، نستخدم الرسالة الافتراضية
            }
            
            throw new Error(errorMessage);
        }

        const resultText = await response.text();
        let result;
        
        try {
            result = JSON.parse(resultText);
        } catch (e) {
            // إذا لم يكن JSON صالحاً
            throw new Error(`استجابة غير صالحة من Google Apps Script: ${resultText.substring(0, 100)}`);
        }

        if (!result.success) {
            throw new Error(result.message || result.error || 'فشل تنفيذ العملية');
        }

        return result;
    } catch (error) {
        console.error('خطأ في إرسال البيانات:', error);
        
        // تحديد نوع الخطأ وإرجاع رسالة مناسبة
        let errorMessage = error.message;
        
        // إذا كان خطأ CORS أو Network
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') || 
            error.message.includes('CORS')) {
            errorMessage = 'خطأ في الاتصال بـ Google Apps Script. يرجى التحقق من الإعدادات والاتصال بالإنترنت';
        }
        
        throw new Error(errorMessage);
    }
}

/**
 * Read from Google Sheets
 * Compatible with existing Google Apps Script GET requests
 */
export async function readFromSheets(sheetName) {
    if (!AppState.googleConfig.appsScript.enabled || !AppState.googleConfig.appsScript.scriptUrl) {
        throw new Error('Google Apps Script غير مفعّل');
    }

    try {
        const spreadsheetId = AppState.googleConfig.sheets.spreadsheetId || '';
        const scriptUrl = AppState.googleConfig.appsScript.scriptUrl.trim();
        
        // استخدام GET request (مثل النظام القديم)
        const url = new URL(scriptUrl);
        url.searchParams.append('action', 'getData');
        url.searchParams.append('sheetName', sheetName);
        if (spreadsheetId) {
            url.searchParams.append('spreadsheetId', spreadsheetId);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Accept': 'application/json'
            }
        }).catch(async () => {
            // إذا فشل CORS، نحاول بطريقة أخرى
            console.warn('محاولة قراءة البيانات بطريقة بديلة...');
            return { ok: false };
        });

        if (!response || !response.ok) {
            console.warn('فشل CORS - يرجى التأكد من إعدادات Google Apps Script');
            return [];
        }

        const result = await response.json();
        if (result.success && result.data) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Read from Sheets error:', error);
        // إرجاع مصفوفة فارغة بدلاً من رمي خطأ (مثل النظام القديم)
        return [];
    }
}

/**
 * Sync all data from Google Sheets
 */
export async function syncData() {
    if (!AppState.googleConfig.appsScript.enabled || !AppState.googleConfig.appsScript.scriptUrl) {
        Notifications.warning('Google Sheets غير مفعّل');
        return;
    }

    Loading.show();
    
    try {
        const sheetMapping = {
            'Users': 'users',
            'Incidents': 'incidents',
            'NearMiss': 'nearmiss',
            'PTW': 'ptw',
            'Training': 'training',
            'ClinicVisits': 'clinicVisits',
            'Medications': 'medications',
            'SickLeave': 'sickLeave',
            'Injuries': 'injuries',
            'ClinicInventory': 'clinicInventory',
            'FireEquipment': 'fireEquipment',
            'PPE': 'ppe',
            'Violations': 'violations',
            'Contractors': 'contractors',
            'Employees': 'employees',
            'BehaviorMonitoring': 'behaviorMonitoring',
            'ChemicalSafety': 'chemicalSafety',
            'DailyObservations': 'dailyObservations',
            'ISODocuments': 'isoDocuments',
            'ISOProcedures': 'isoProcedures',
            'ISOForms': 'isoForms',
            'SOPJHA': 'sopJHA',
            'EmergencyAlerts': 'emergencyAlerts',
            'EmergencyPlans': 'emergencyPlans',
            'RiskAssessments': 'riskAssessments',
            'LegalDocuments': 'legalDocuments',
            'HSEAudits': 'hseAudits',
            'HSENonConformities': 'hseNonConformities',
            'HSECorrectiveActions': 'hseCorrectiveActions',
            'HSEObjectives': 'hseObjectives',
            'HSERiskAssessments': 'hseRiskAssessments',
            'EnvironmentalAspects': 'environmentalAspects',
            'EnvironmentalMonitoring': 'environmentalMonitoring',
            'Sustainability': 'sustainability',
            'CarbonFootprint': 'carbonFootprint',
            'WasteManagement': 'wasteManagement',
            'EnergyEfficiency': 'energyEfficiency',
            'WaterManagement': 'waterManagement',
            'RecyclingPrograms': 'recyclingPrograms'
        };

        for (const [sheetName, dataKey] of Object.entries(sheetMapping)) {
            try {
                const data = await readFromSheets(sheetName);
                AppState.appData[dataKey] = data || [];
            } catch (error) {
                console.warn(`Failed to sync ${sheetName}:`, error);
            }
        }

        Loading.hide();
        Notifications.success('تمت المزامنة بنجاح');
    } catch (error) {
        Loading.hide();
        Notifications.error('فشلت المزامنة: ' + error.message);
    }
}

