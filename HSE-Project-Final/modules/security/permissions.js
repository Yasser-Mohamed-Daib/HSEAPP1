/**
 * Permissions System
 * Manages user permissions and access control
 */

import { AppState } from '../core/state.js';
import * as Notifications from '../core/notifications.js';

/**
 * Default permissions for each role
 */
const defaultPermissions = {
    'safety_officer': {
        'dashboard': true,
        'incidents': true,
        'nearmiss': true,
        'ptw': true,
        'training': true,
        'clinic': false,
        'fire-equipment': true,
        'ppe': true,
        'violations': true,
        'contractors': true,
        'employees': true,
        'behavior-monitoring': true,
        'chemical-safety': true,
        'daily-observations': true,
        'iso': false,
        'emergency': true,
        'users': false,
        'settings': false
    },
    'user': {
        'dashboard': true,
        'incidents': false,
        'nearmiss': false,
        'ptw': false,
        'training': false,
        'clinic': false,
        'fire-equipment': false,
        'ppe': false,
        'violations': false,
        'contractors': false,
        'employees': false,
        'behavior-monitoring': false,
        'chemical-safety': false,
        'daily-observations': false,
        'iso': false,
        'emergency': false,
        'users': false,
        'settings': false
    }
};

/**
 * Check if user has access to a module
 */
export function hasAccess(moduleName) {
    const user = AppState.currentUser;
    if (!user) return false;
    
    // Admin has full access
    if (user.role === 'admin') return true;
    
    // Check custom permissions
    const users = AppState.appData.users || [];
    const dbUser = users.find(u => 
        u.email && u.email.toLowerCase() === user.email.toLowerCase()
    );
    
    if (dbUser && dbUser.permissions) {
        if (dbUser.permissions.hasOwnProperty(moduleName)) {
            return dbUser.permissions[moduleName] === true;
        }
    }
    
    // Use default permissions for role
    const rolePermissions = defaultPermissions[user.role] || {};
    return rolePermissions[moduleName] === true;
}

/**
 * Update navigation based on permissions
 */
export function updateNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const module = item.getAttribute('data-section');
        if (module && !hasAccess(module)) {
            item.style.display = 'none';
        } else if (module) {
            item.style.display = '';
        }
    });
}

/**
 * Check permissions before showing section
 */
export function checkBeforeShow(moduleName) {
    if (!hasAccess(moduleName)) {
        Notifications.error('ليس لديك صلاحية للوصول إلى هذا القسم');
        return false;
    }
    return true;
}

/**
 * Get default permissions for role
 */
export function getDefaultPermissions(role) {
    return { ...defaultPermissions[role] } || {};
}

