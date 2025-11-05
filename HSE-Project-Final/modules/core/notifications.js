/**
 * Notification System
 * Manages user notifications and alerts
 */

const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
};

/**
 * Show notification
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" aria-label="إغلاق">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto remove after duration
    const timeout = setTimeout(() => {
        notification.classList.add('notification-hide');
        setTimeout(() => notification.remove(), 300);
    }, duration);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        notification.classList.add('notification-hide');
        setTimeout(() => notification.remove(), 300);
    });

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('notification-show');
    });
}

/**
 * Success notification
 */
export function success(message, duration) {
    showNotification(message, 'success', duration);
}

/**
 * Error notification
 */
export function error(message, duration) {
    showNotification(message, 'error', duration || 5000);
}

/**
 * Warning notification
 */
export function warning(message, duration) {
    showNotification(message, 'warning', duration);
}

/**
 * Info notification
 */
export function info(message, duration) {
    showNotification(message, 'info', duration);
}

