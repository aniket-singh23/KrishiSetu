/**
 * Login Page JavaScript - Modern & Secure
 * Handles form validation, tab switching, and authentication
 */

class LoginApp {
    constructor() {
        this.currentTab = 'user';
        this.apiBaseUrl = window.AUTH_API_BASE || 'http://localhost:3001/api';
        
        this.init();
    }

    init() {
        console.log('🔐 Login App Initializing...');
        
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupTabSwitching();
        this.setupPasswordToggle();
        
        console.log('✅ Login App Initialized!');
    }

    // ===================================
    // TAB SWITCHING
    // ===================================

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const loginForms = document.querySelectorAll('.login-form');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tabId}-login`).classList.add('active');

        // Update background for admin
        const loginPage = document.body;
        if (tabId === 'admin') {
            loginPage.style.background = 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #f9fafb 100%)';
        } else {
            loginPage.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f9fafb 100%)';
        }

        this.currentTab = tabId;
        this.clearFormErrors();
    }

    // ===================================
    // FORM VALIDATION
    // ===================================

    setupFormValidation() {
        // User form validation
        const userForm = document.getElementById('userLoginForm');
        const userEmail = document.getElementById('user-email');
        const userPassword = document.getElementById('user-password');

        userEmail.addEventListener('input', () => this.validateEmail(userEmail));
        userEmail.addEventListener('blur', () => this.validateEmail(userEmail));
        userPassword.addEventListener('input', () => this.validatePassword(userPassword));

        userForm.addEventListener('submit', (e) => this.handleUserLogin(e));

        // Admin form validation
        const adminForm = document.getElementById('adminLoginForm');
        const adminId = document.getElementById('admin-id');
        const adminPassword = document.getElementById('admin-password');

        adminId.addEventListener('input', () => this.validateAdminId(adminId));
        adminPassword.addEventListener('input', () => this.validatePassword(adminPassword));

        adminForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
    }

    validateEmail(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        
        if (!value) {
            this.setFieldError(input, 'Email or phone number is required');
            return false;
        }

        if (!emailRegex.test(value) && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            this.setFieldError(input, 'Please enter a valid email or phone number');
            return false;
        }

        this.setFieldSuccess(input);
        return true;
    }

    validatePassword(input) {
        const value = input.value;
        
        if (!value) {
            this.setFieldError(input, 'Password is required');
            return false;
        }

        if (value.length < 8) {
            this.setFieldError(input, 'Password must be at least 8 characters');
            return false;
        }

        this.setFieldSuccess(input);
        return true;
    }

    validateAdminId(input) {
        const value = input.value.trim();
        
        if (!value) {
            this.setFieldError(input, 'Administrator ID is required');
            return false;
        }

        if (value.length < 4) {
            this.setFieldError(input, 'Admin ID must be at least 4 characters');
            return false;
        }

        this.setFieldSuccess(input);
        return true;
    }

    setFieldError(input, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    setFieldSuccess(input) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
        
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    }

    // ===================================
    // LOGIN HANDLERS
    // ===================================

    async handleUserLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('user-email');
        const password = document.getElementById('user-password');
        const remember = document.getElementById('user-remember').checked;
        const submitBtn = e.target.querySelector('.login-btn-primary');

        // Validate all fields
        const isEmailValid = this.validateEmail(email);
        const isPasswordValid = this.validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            const authResponse = await this.postJson('/auth/login', {
                identifier: email.value,
                password: password.value,
                remember
            });
            this.persistAuthSession(authResponse, remember);

            this.showNotification('Login successful! Redirecting...', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const adminId = document.getElementById('admin-id');
        const password = document.getElementById('admin-password');
        const secureSession = document.getElementById('admin-secure').checked;
        const submitBtn = e.target.querySelector('.login-btn-primary');

        // Validate all fields
        const isIdValid = this.validateAdminId(adminId);
        const isPasswordValid = this.validatePassword(password);

        if (!isIdValid || !isPasswordValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            const authResponse = await this.postJson('/auth/admin/login', {
                adminId: adminId.value,
                password: password.value,
                secureSession
            });
            this.persistAuthSession(authResponse, secureSession);

            this.showNotification('Admin authentication successful!', 'success');
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async postJson(path, payload) {
        let response;

        try {
            response = await fetch(`${this.apiBaseUrl}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            throw new Error('Auth server is offline. Start the backend with: npm run start:server');
        }

        let data = {};
        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }

        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
        }

        return data;
    }

    persistAuthSession(authResponse, remember) {
        if (window.backendBridge) {
            window.backendBridge.setSession(authResponse.token, authResponse.user || {}, remember);
            return;
        }

        const tokenStorage = remember ? localStorage : sessionStorage;

        tokenStorage.setItem('authToken', authResponse.token);
        tokenStorage.setItem('authRole', authResponse.user?.role || 'user');

        const userName = authResponse.user?.name || 'Farmer';
        localStorage.setItem('userName', userName);

        if (Number.isFinite(authResponse.user?.level)) {
            localStorage.setItem('userLevel', String(authResponse.user.level));
        }

        if (Number.isFinite(authResponse.user?.xp)) {
            localStorage.setItem('userXP', String(authResponse.user.xp));
        }

        if (Number.isFinite(authResponse.user?.coins)) {
            localStorage.setItem('greenCoins', String(authResponse.user.coins));
        }
    }

    // ===================================
    // PASSWORD TOGGLE
    // ===================================

    setupPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.dataset.target;
                const input = document.getElementById(targetId);
                const icon = toggle.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Add notification styles if not exists
        this.addNotificationStyles();
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                padding: 16px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 350px;
                border-left: 4px solid #22c55e;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success { border-left-color: #22c55e; }
            .notification-info { border-left-color: #3b82f6; }
            .notification-warning { border-left-color: #f59e0b; }
            .notification-error { border-left-color: #ef4444; }
            
            .notification-message {
                font-size: 14px;
                color: #374151;
                line-height: 1.4;
                margin-right: 20px;
            }
            
            .notification-close {
                position: absolute;
                top: 8px;
                right: 12px;
                background: none;
                border: none;
                font-size: 18px;
                color: #9ca3af;
                cursor: pointer;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: #374151;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // EVENT LISTENERS
    // ===================================

    setupEventListeners() {
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.classList.contains('google-btn') ? 'Google' : 
                               btn.classList.contains('facebook-btn') ? 'Facebook' : 'Phone';
                this.showNotification(`${provider} login would be implemented here`, 'info');
            });
        });

        // Forgot password links
        document.querySelectorAll('.forgot-password').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Password reset email would be sent', 'info');
            });
        });

    }
}

// Initialize login app
document.addEventListener('DOMContentLoaded', () => {
    window.loginApp = new LoginApp();
});

console.log(`
🔐 ===================================
   Farm Quest Login System
🔐 ===================================
🚀 Status: Ready for Authentication
🛡️  Security: Server-side Verification
👤 User Login: Enabled
🔑 Admin Login: Enabled
🌐 API: http://localhost:3001/api
🔐 ===================================
`);
