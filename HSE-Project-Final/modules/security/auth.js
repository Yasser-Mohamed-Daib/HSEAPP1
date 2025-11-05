/**
 * Authentication Module
 * Handles user authentication with SHA-256 password hashing
 */

import { AppState } from '../core/state.js';
import { saveState } from '../core/state.js';
import * as Notifications from '../core/notifications.js';
import * as Loading from '../core/loading.js';

/**
 * Hash password using SHA-256
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 */
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

/**
 * Check if password is plain text (for backward compatibility)
 */
function isPlainText(password) {
    // Plain text passwords are typically shorter and don't match hash pattern
    // SHA-256 hashes are always 64 characters
    return password.length !== 64 || !/^[a-f0-9]{64}$/i.test(password);
}

/**
 * Login user
 */
export async function login(email, password, remember = false) {
    Loading.show();
    
    try {
        const users = AppState.appData.users || [];
        const foundUser = users.find(u => 
            u.email && u.email.toLowerCase() === email.toLowerCase()
        );

        if (!foundUser) {
            Loading.hide();
            Notifications.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            return false;
        }

        // Check password - support both plain text (backward compatibility) and hashed
        let passwordValid = false;
        if (isPlainText(foundUser.password)) {
            // Plain text password (backward compatibility)
            passwordValid = foundUser.password === password;
            // Upgrade to hashed password
            if (passwordValid) {
                foundUser.password = await hashPassword(password);
                // Save updated user
                const userIndex = users.findIndex(u => u.id === foundUser.id);
                if (userIndex !== -1) {
                    AppState.appData.users[userIndex] = foundUser;
                    // Trigger save will happen via DataManager
                }
            }
        } else {
            // Hashed password
            passwordValid = await verifyPassword(password, foundUser.password);
        }

        if (!passwordValid) {
            Loading.hide();
            Notifications.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            return false;
        }

        // Set current user
        AppState.currentUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            department: foundUser.department,
            photo: foundUser.photo,
            permissions: foundUser.permissions || {}
        };

        // Save state
        saveState();

        // Save to sessionStorage for quick access
        if (remember) {
            localStorage.setItem('hse_remember_user', email);
        }

        Loading.hide();
        Notifications.success(`مرحباً ${foundUser.name || foundUser.email}`);
        return true;

    } catch (error) {
        Loading.hide();
        console.error('Login error:', error);
        Notifications.error('حدث خطأ أثناء تسجيل الدخول: ' + error.message);
        return false;
    }
}

/**
 * Logout user
 */
export function logout() {
    AppState.currentUser = null;
    saveState();
    localStorage.removeItem('hse_remember_user');
    Notifications.info('تم تسجيل الخروج بنجاح');
}

/**
 * Get current user
 */
export function getCurrentUser() {
    return AppState.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return AppState.currentUser !== null;
}

/**
 * Hash password for new user (call this when creating/updating users)
 */
export async function hashPasswordForUser(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

