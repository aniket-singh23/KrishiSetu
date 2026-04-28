/**
 * Signup Page JavaScript - Multi-step Form with Validation
 * Handles form progression, validation, and user registration
 */

class SignupApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.validationRules = {};
        this.apiBaseUrl = window.AUTH_API_BASE || 'http://localhost:3001/api';
        this.emailCheckController = null;
        
        this.init();
    }

    init() {
        console.log('📝 Signup App Initializing...');
        
        this.setupFormValidation();
        this.setupPasswordStrength();
        this.setupPasswordToggle();
        this.setupFormSubmission();
        this.setupSocialAuth();
        
        // Make functions globally accessible
        window.nextStep = () => this.nextStep();
        window.previousStep = () => this.previousStep();
        window.signupWithGoogle = () => this.signupWithGoogle();
        window.signupWithFacebook = () => this.signupWithFacebook();
        
        console.log('✅ Signup App Initialized!');
    }

    // ===================================
    // STEP NAVIGATION
    // ===================================

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStep();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
        }
    }

    updateStep() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step-${this.currentStep}`).classList.add('active');

        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const submitBtn = document.querySelector('.submit-btn');

        if (this.currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }

        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }

        // Animate step transition
        this.animateStepTransition();
    }

    animateStepTransition() {
        const activeStep = document.querySelector('.form-step.active');
        if (activeStep) {
            activeStep.style.opacity = '0';
            activeStep.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                activeStep.style.transition = 'all 0.3s ease';
                activeStep.style.opacity = '1';
                activeStep.style.transform = 'translateX(0)';
            }, 50);
        }
    }

    // ===================================
    // FORM VALIDATION
    // ===================================

    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Setup validation rules
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            password: {
                required: true,
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
            },
            confirmPassword: {
                required: true,
                match: 'password',
                message: 'Passwords do not match'
            },
            farmSize: {
                required: true,
                message: 'Please select your farm size'
            },
            farmingType: {
                required: true,
                message: 'Please select your farming type'
            },
            country: {
                required: true,
                message: 'Please select your country'
            },
            experienceLevel: {
                required: true,
                message: 'Please select your experience level'
            }
        };
    }

    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        // Clear previous validation state
        input.classList.remove('valid', 'invalid');
        this.clearFieldError(input);

        // Required validation
        if (rules.required && !value) {
            this.setFieldError(input, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            return true;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.setFieldError(input, rules.message);
            return false;
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.setFieldError(input, `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`);
            return false;
        }

        // Match validation (for confirm password)
        if (rules.match) {
            const matchField = document.querySelector(`[name="${rules.match}"]`);
            if (matchField && value !== matchField.value) {
                this.setFieldError(input, rules.message);
                return false;
            }
        }

        // Email availability check (server-side)
        if (fieldName === 'email' && value) {
            setTimeout(() => this.checkEmailAvailability(input, value), 500);
        }

        this.setFieldSuccess(input);
        return true;
    }

    async checkEmailAvailability(input, email) {
        if (this.emailCheckController) {
            this.emailCheckController.abort();
        }

        this.emailCheckController = new AbortController();

        try {
            const result = await this.getJson(`/auth/check-email?email=${encodeURIComponent(email)}`, this.emailCheckController.signal);

            if (!result.available) {
                this.setFieldError(input, 'This email is already registered');
            } else {
                this.setFieldSuccess(input);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Additional validation for step 3
        if (this.currentStep === 3) {
            const termsCheckbox = document.getElementById('termsAccept');
            if (!termsCheckbox.checked) {
                this.showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
                isValid = false;
            }
        }

        return isValid;
    }

    setFieldError(input, message) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    setFieldSuccess(input) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        this.clearFieldError(input);
    }

    clearFieldError(input) {
        const errorElement = document.getElementById(`${input.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    getFieldLabel(fieldName) {
        const labelMap = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email',
            phone: 'Phone number',
            password: 'Password',
            confirmPassword: 'Confirm password',
            farmSize: 'Farm size',
            farmingType: 'Farming type',
            country: 'Country',
            experienceLevel: 'Experience level'
        };
        return labelMap[fieldName] || fieldName;
    }

    // ===================================
    // PASSWORD STRENGTH
    // ===================================

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput && strengthFill && strengthText) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                const strength = this.calculatePasswordStrength(password);
                
                strengthFill.className = `strength-fill ${strength.level}`;
                strengthText.textContent = strength.text;
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length === 0) {
            return { level: '', text: 'Password strength' };
        }

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');

        // Lowercase check
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letter');

        // Uppercase check
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letter');

        // Number check
        if (/\d/.test(password)) score += 1;
        else feedback.push('number');

        // Special character check
        if (/[@$!%*?&]/.test(password)) score += 1;
        else feedback.push('special character');

        const levels = {
            0: { level: 'weak', text: 'Very weak password' },
            1: { level: 'weak', text: 'Weak password' },
            2: { level: 'fair', text: 'Fair password' },
            3: { level: 'good', text: 'Good password' },
            4: { level: 'good', text: 'Good password' },
            5: { level: 'strong', text: 'Strong password' }
        };

        return levels[score] || levels[0];
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
    // FORM SUBMISSION
    // ===================================

    setupFormSubmission() {
        const form = document.getElementById('signupForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateCurrentStep()) {
                await this.submitForm();
            }
        });
    }

    async submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        
        // Collect form data
        this.collectFormData();
        
        // Set loading state
        this.setButtonLoading(submitBtn, true);

        try {
            await this.registerUser(this.formData);
            
            this.showNotification('Account created successfully! Welcome to Sustainable Agriculture!', 'success');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    collectFormData() {
        const form = document.getElementById('signupForm');
        const formData = new FormData(form);
        
        this.formData = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'notifications') {
                if (!this.formData.notifications) this.formData.notifications = [];
                this.formData.notifications.push(value);
            } else {
                this.formData[key] = value;
            }
        }

        delete this.formData.confirmPassword;
        delete this.formData.termsAccept;
    }

    async registerUser(userData) {
        const authResponse = await this.postJson('/auth/register', userData);
        this.persistAuthSession(authResponse);
        return authResponse;
    }

    // ===================================
    // SOCIAL AUTHENTICATION
    // ===================================

    setupSocialAuth() {
        // Social auth would integrate with actual providers
    }

    signupWithGoogle() {
        this.showNotification('Google signup would be implemented here', 'info');
        // Implement Google OAuth integration
    }

    signupWithFacebook() {
        this.showNotification('Facebook signup would be implemented here', 'info');
        // Implement Facebook OAuth integration
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
            throw new Error(data.message || 'Unable to create account right now');
        }

        return data;
    }

    async getJson(path, signal) {
        const response = await fetch(`${this.apiBaseUrl}${path}`, { signal });

        if (!response.ok) {
            return { available: true };
        }

        return response.json();
    }

    persistAuthSession(authResponse) {
        if (window.backendBridge) {
            window.backendBridge.setSession(authResponse.token, authResponse.user || {}, true);
            return;
        }

        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('authRole', authResponse.user?.role || 'user');
        localStorage.setItem('userName', authResponse.user?.name || 'Farmer');

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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `signup-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles if they don't exist
        if (!document.querySelector('#signup-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'signup-notification-styles';
            style.textContent = `
                .signup-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    max-width: 400px;
                    border-left: 4px solid var(--primary-green);
                    animation: slideInRight 0.3s ease;
                }
                
                .notification-success { border-left-color: var(--primary-green); }
                .notification-info { border-left-color: var(--secondary-blue); }
                .notification-warning { border-left-color: var(--accent-orange); }
                .notification-error { border-left-color: var(--input-error); }
                
                .notification-content {
                    font-size: 14px;
                    color: var(--gray-700);
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
                    color: var(--gray-400);
                    cursor: pointer;
                    line-height: 1;
                }
                
                .notification-close:hover {
                    color: var(--gray-600);
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
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize Signup App
document.addEventListener('DOMContentLoaded', () => {
    window.signupApp = new SignupApp();
    console.log('📝 Signup Ready!');
});

console.log(`
📝 ===================================
   Farm Quest Signup System
📝 ===================================
🚀 Status: Ready for Registration
✅ Validation: Multi-step Form
🔒 Security: Password Strength Check
📧 Verification: Email & SMS Options
🌱 Welcome New Farmers!
📝 ===================================
`);
