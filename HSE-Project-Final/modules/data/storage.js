/**
 * Data Storage Module
 * Handles localStorage and IndexedDB storage
 */

import { AppState } from '../core/state.js';

const DB_NAME = 'HSE_Database';
const DB_VERSION = 1;
let db = null;

/**
 * Initialize IndexedDB
 */
export function initIndexedDB() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            console.warn('IndexedDB not supported, using localStorage only');
            resolve(null);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            resolve(null);
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            
            // Create object stores for each data type
            const stores = [
                'incidents', 'nearmiss', 'ptw', 'training', 'clinicVisits',
                'medications', 'sickLeave', 'injuries', 'fireEquipment', 'ppe',
                'violations', 'contractors', 'employees', 'behaviorMonitoring',
                'chemicalSafety', 'dailyObservations', 'users'
            ];

            stores.forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, { keyPath: 'id' });
                    store.createIndex('date', 'date', { unique: false });
                }
            });
        };
    });
}

/**
 * Save data to IndexedDB
 */
export async function saveToIndexedDB(storeName, data) {
    if (!db) return false;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const promises = Array.isArray(data) 
            ? data.map(item => store.put(item))
            : [store.put(data)];

        Promise.all(promises).then(() => {
            resolve(true);
        }).catch(reject);
    });
}

/**
 * Load data from IndexedDB
 */
export async function loadFromIndexedDB(storeName) {
    if (!db) return [];

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Save all app data
 */
export function save() {
    try {
        // Save to localStorage (fallback)
        localStorage.setItem('hse_app_data', JSON.stringify(AppState.appData));
        
        // Save to IndexedDB if available (async, don't wait)
        if (db) {
            Object.keys(AppState.appData).forEach(key => {
                const data = AppState.appData[key];
                if (Array.isArray(data) && data.length > 0) {
                    saveToIndexedDB(key, data).catch(err => {
                        console.warn(`Failed to save ${key} to IndexedDB:`, err);
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

/**
 * Load all app data
 */
export async function load() {
    try {
        // Try IndexedDB first
        if (db) {
            const keys = Object.keys(AppState.appData);
            for (const key of keys) {
                try {
                    const data = await loadFromIndexedDB(key);
                    if (data && data.length > 0) {
                        AppState.appData[key] = data;
                    }
                } catch (err) {
                    console.warn(`Failed to load ${key} from IndexedDB:`, err);
                }
            }
        }

        // Fallback to localStorage
        const savedData = localStorage.getItem('hse_app_data');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Merge with existing data
            Object.keys(parsed).forEach(key => {
                if (AppState.appData.hasOwnProperty(key)) {
                    // Only use localStorage if IndexedDB is empty
                    if (!db || !AppState.appData[key] || AppState.appData[key].length === 0) {
                        AppState.appData[key] = parsed[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

/**
 * Clear all data
 */
export function clear() {
    try {
        localStorage.removeItem('hse_app_data');
        if (db) {
            const stores = Array.from(db.objectStoreNames);
            stores.forEach(storeName => {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                store.clear();
            });
        }
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}

