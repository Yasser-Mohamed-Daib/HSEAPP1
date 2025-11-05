/**
 * Loading Indicator System
 * Manages loading states and indicators
 */

let loadingCount = 0;
let loadingElement = null;

/**
 * Create loading overlay
 */
function createLoadingElement() {
    if (loadingElement) return loadingElement;
    
    loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.className = 'loading-overlay';
    loadingElement.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p class="loading-text">جاري التحميل...</p>
        </div>
    `;
    document.body.appendChild(loadingElement);
    return loadingElement;
}

/**
 * Show loading indicator
 */
export function show() {
    loadingCount++;
    const element = createLoadingElement();
    element.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Hide loading indicator
 */
export function hide() {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0 && loadingElement) {
        loadingElement.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Force hide (reset counter)
 */
export function forceHide() {
    loadingCount = 0;
    if (loadingElement) {
        loadingElement.style.display = 'none';
        document.body.style.overflow = '';
    }
}

