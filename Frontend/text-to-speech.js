/**
 * 🗣️ Universal Text-to-Speech - CSS Isolated Version
 * Compatible with all existing HTML pages without CSS conflicts
 */

class UniversalTTS {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentLanguage = localStorage.getItem('ttsLanguage') || 'en-IN';
        this.isEnabled = localStorage.getItem('ttsEnabled') !== 'false';
        this.voices = [];
        this.currentUtterance = null;
        this.readingSpeed = parseFloat(localStorage.getItem('ttsSpeed')) || 0.9;
        this.volume = parseFloat(localStorage.getItem('ttsVolume')) || 0.8;
        this.pitch = parseFloat(localStorage.getItem('ttsPitch')) || 1.0;
        
        // Language configurations
        this.languageMap = {
            'en': 'en-IN',
            'hi': 'hi-IN', 
            'ml': 'ml-IN',
            'te': 'te-IN',
            'ta': 'ta-IN'
        };

        this.init();
    }

    init() {
        console.log('🔊 Initializing Universal Text-to-Speech...');
        this.loadVoices();
        this.createTTSInterface();
        this.setupEventListeners();
        this.makeTextClickable();
        
        // Load voices when ready
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
        
        console.log('✅ Text-to-Speech initialized');
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        console.log('🎵 Available voices:', this.voices.length);
        
        // Organize voices by language
        this.voicesByLanguage = {
            'en-IN': this.voices.filter(voice => 
                voice.lang.includes('en-IN') || voice.lang.includes('en-US') || 
                voice.lang.includes('en-GB') || voice.name.toLowerCase().includes('english')
            ),
            'hi-IN': this.voices.filter(voice => 
                voice.lang.includes('hi') || voice.name.toLowerCase().includes('hindi')
            ),
            'ml-IN': this.voices.filter(voice => 
                voice.lang.includes('ml') || voice.name.toLowerCase().includes('malayalam')
            ),
            'te-IN': this.voices.filter(voice => 
                voice.lang.includes('te') || voice.name.toLowerCase().includes('telugu')
            ),
            'ta-IN': this.voices.filter(voice => 
                voice.lang.includes('ta') || voice.name.toLowerCase().includes('tamil')
            )
        };
        
        this.updateVoiceOptions();
    }

    createTTSInterface() {
        // Create completely isolated TTS interface
        const ttsPanel = document.createElement('div');
        ttsPanel.id = 'universal-tts-panel';
        ttsPanel.innerHTML = `
            <div class="utts-toggle-btn" onclick="universalTTS.togglePanel()" title="Text-to-Speech Settings">
                <svg class="utts-icon" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <span class="utts-indicator ${this.isEnabled ? 'utts-active' : ''}" id="utts-indicator"></span>
            </div>
            
            <div class="utts-controls" id="utts-controls" style="display: none;">
                <div class="utts-header">
                    <h4 class="utts-title">🔊 Text-to-Speech</h4>
                    <button class="utts-close" onclick="universalTTS.togglePanel()">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="utts-section">
                    <label class="utts-switch">
                        <input type="checkbox" id="utts-enable" ${this.isEnabled ? 'checked' : ''} 
                               onchange="universalTTS.toggleTTS()">
                        <span class="utts-slider"></span>
                        <span class="utts-label">Enable Click-to-Read</span>
                    </label>
                </div>

                <div class="utts-section">
                    <label class="utts-field-label" for="utts-language">Language:</label>
                    <select class="utts-select" id="utts-language" onchange="universalTTS.changeLanguage(this.value)">
                        <option value="en-IN" ${this.currentLanguage === 'en-IN' ? 'selected' : ''}>
                            🇺🇸 English (India)
                        </option>
                        <option value="hi-IN" ${this.currentLanguage === 'hi-IN' ? 'selected' : ''}>
                            🇮🇳 हिन्दी (Hindi)
                        </option>
                        <option value="ml-IN" ${this.currentLanguage === 'ml-IN' ? 'selected' : ''}>
                            🇮🇳 മലയാളം (Malayalam)
                        </option>
                        <option value="te-IN" ${this.currentLanguage === 'te-IN' ? 'selected' : ''}>
                            🇮🇳 తెలుగు (Telugu)
                        </option>
                        <option value="ta-IN" ${this.currentLanguage === 'ta-IN' ? 'selected' : ''}>
                            🇮🇳 தமிழ் (Tamil)
                        </option>
                    </select>
                </div>

                <div class="utts-section">
                    <label class="utts-field-label" for="utts-voice">Voice:</label>
                    <select class="utts-select" id="utts-voice" onchange="universalTTS.changeVoice(this.value)">
                        <!-- Voices will be populated dynamically -->
                    </select>
                </div>

                <div class="utts-section">
                    <label class="utts-field-label" for="utts-speed">Speed: <span class="utts-value" id="utts-speed-value">${this.readingSpeed}</span></label>
                    <input class="utts-range" type="range" id="utts-speed" min="0.5" max="2" step="0.1" 
                           value="${this.readingSpeed}" onchange="universalTTS.adjustSpeed(this.value)">
                </div>

                <div class="utts-section">
                    <label class="utts-field-label" for="utts-volume">Volume: <span class="utts-value" id="utts-volume-value">${this.volume}</span></label>
                    <input class="utts-range" type="range" id="utts-volume" min="0" max="1" step="0.1" 
                           value="${this.volume}" onchange="universalTTS.adjustVolume(this.value)">
                </div>

                <div class="utts-section">
                    <label class="utts-field-label" for="utts-pitch">Pitch: <span class="utts-value" id="utts-pitch-value">${this.pitch}</span></label>
                    <input class="utts-range" type="range" id="utts-pitch" min="0.5" max="2" step="0.1" 
                           value="${this.pitch}" onchange="universalTTS.adjustPitch(this.value)">
                </div>

                <div class="utts-actions">
                    <button onclick="universalTTS.testVoice()" class="utts-btn utts-test-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M8 5v14l11-7z"/>
                        </svg>
                        Test Voice
                    </button>
                    <button onclick="universalTTS.stopSpeaking()" class="utts-btn utts-stop-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M6 6h12v12H6z"/>
                        </svg>
                        Stop
                    </button>
                </div>

                <div class="utts-info">
                    <p class="utts-info-text">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Click any text to hear it read aloud!
                    </p>
                    <p class="utts-info-text">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm4.64-1.96l3.54 3.54 5.66-5.66L17 6.76l-4.24 4.24-2.12-2.12z"/>
                        </svg>
                        Double-click for full paragraph reading
                    </p>
                </div>
            </div>
        `;

        // Create completely isolated CSS that won't interfere with existing styles
        const styles = document.createElement('style');
        styles.id = 'universal-tts-styles';
        styles.textContent = `
            /* Reset and namespace all TTS styles to prevent conflicts */
            #universal-tts-panel, #universal-tts-panel * {
                all: initial;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-sizing: border-box;
            }

            #universal-tts-panel {
                position: fixed !important;
                top: 120px !important;
                right: 30px !important;
                z-index: 999999 !important;
                pointer-events: auto !important;
            }

            .utts-toggle-btn {
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
                color: white !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3) !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                border: none !important;
                outline: none !important;
            }

            .utts-toggle-btn:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4) !important;
            }

            .utts-icon {
                width: 24px !important;
                height: 24px !important;
                color: white !important;
            }

            .utts-indicator {
                position: absolute !important;
                top: -2px !important;
                right: -2px !important;
                width: 18px !important;
                height: 18px !important;
                background: #ef4444 !important;
                border: 2px solid white !important;
                border-radius: 50% !important;
                transition: all 0.3s !important;
                opacity: 0 !important;
            }

            .utts-indicator.utts-active {
                background: #10b981 !important;
                opacity: 1 !important;
            }

            .utts-controls {
                position: absolute !important;
                top: 70px !important;
                right: 0 !important;
                width: 320px !important;
                background: white !important;
                border-radius: 16px !important;
                box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
                border: 2px solid #8b5cf6 !important;
                overflow: hidden !important;
                font-size: 14px !important;
            }

            .utts-header {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
                color: white !important;
                padding: 15px 20px !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }

            .utts-title {
                margin: 0 !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                color: white !important;
            }

            .utts-close {
                background: none !important;
                border: none !important;
                color: white !important;
                cursor: pointer !important;
                padding: 5px !important;
                border-radius: 4px !important;
                transition: background 0.3s !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .utts-close:hover {
                background: rgba(255,255,255,0.2) !important;
            }

            .utts-section {
                padding: 15px 20px !important;
                border-bottom: 1px solid #f1f5f9 !important;
            }

            .utts-section:last-child {
                border-bottom: none !important;
            }

            .utts-field-label {
                display: block !important;
                font-weight: 600 !important;
                margin-bottom: 8px !important;
                color: #374151 !important;
                font-size: 14px !important;
            }

            .utts-select,
            .utts-range {
                width: 100% !important;
                margin-bottom: 8px !important;
            }

            .utts-select {
                padding: 8px 12px !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                background: white !important;
                color: #374151 !important;
            }

            .utts-select:focus {
                outline: none !important;
                border-color: #8b5cf6 !important;
            }

            .utts-range {
                height: 6px !important;
                border-radius: 3px !important;
                background: #e5e7eb !important;
                outline: none !important;
                -webkit-appearance: none !important;
                appearance: none !important;
            }

            .utts-range::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                appearance: none !important;
                width: 20px !important;
                height: 20px !important;
                border-radius: 50% !important;
                background: #8b5cf6 !important;
                cursor: pointer !important;
            }

            .utts-range::-moz-range-thumb {
                width: 20px !important;
                height: 20px !important;
                border-radius: 50% !important;
                background: #8b5cf6 !important;
                cursor: pointer !important;
                border: none !important;
            }

            .utts-value {
                color: #8b5cf6 !important;
                font-weight: 600 !important;
            }

            .utts-switch {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                cursor: pointer !important;
            }

            .utts-switch input {
                display: none !important;
            }

            .utts-slider {
                width: 50px !important;
                height: 26px !important;
                background: #cbd5e1 !important;
                border-radius: 13px !important;
                position: relative !important;
                transition: background 0.3s !important;
            }

            .utts-slider::before {
                content: '' !important;
                position: absolute !important;
                top: 2px !important;
                left: 2px !important;
                width: 22px !important;
                height: 22px !important;
                background: white !important;
                border-radius: 50% !important;
                transition: transform 0.3s !important;
            }

            .utts-switch input:checked + .utts-slider {
                background: #8b5cf6 !important;
            }

            .utts-switch input:checked + .utts-slider::before {
                transform: translateX(24px) !important;
            }

            .utts-label {
                font-size: 14px !important;
                color: #374151 !important;
                font-weight: 500 !important;
            }

            .utts-actions {
                display: flex !important;
                gap: 10px !important;
                padding: 15px 20px !important;
                background: #f8fafc !important;
            }

            .utts-btn {
                flex: 1 !important;
                padding: 10px !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                transition: all 0.3s !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
                font-family: inherit !important;
            }

            .utts-test-btn {
                background: #10b981 !important;
                color: white !important;
            }

            .utts-test-btn:hover {
                background: #059669 !important;
            }

            .utts-stop-btn {
                background: #ef4444 !important;
                color: white !important;
            }

            .utts-stop-btn:hover {
                background: #dc2626 !important;
            }

            .utts-info {
                padding: 15px 20px !important;
                background: #f0f9ff !important;
                border-top: 1px solid #e0f2fe !important;
            }

            .utts-info-text {
                margin: 5px 0 !important;
                font-size: 12px !important;
                color: #0369a1 !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-family: inherit !important;
            }

            /* Clickable text styles - non-interfering */
            .utts-clickable {
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                border-radius: 3px !important;
                position: relative !important;
            }

            .utts-clickable:hover {
                background: rgba(139, 92, 246, 0.1) !important;
                padding: 2px 4px !important;
                margin: -2px -4px !important;
            }

            .utts-reading {
                background: rgba(139, 92, 246, 0.2) !important;
                padding: 2px 4px !important;
                margin: -2px -4px !important;
                border-radius: 4px !important;
                animation: utts-reading-pulse 1s infinite !important;
            }

            @keyframes utts-reading-pulse {
                0%, 100% { background: rgba(139, 92, 246, 0.2) !important; }
                50% { background: rgba(139, 92, 246, 0.3) !important; }
            }

            /* Reading indicator */
            .utts-reading-indicator {
                position: fixed !important;
                top: 20px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                background: rgba(139, 92, 246, 0.9) !important;
                color: white !important;
                padding: 10px 20px !important;
                border-radius: 25px !important;
                font-size: 14px !important;
                z-index: 999998 !important;
                display: none !important;
                animation: utts-slideDown 0.3s ease !important;
                font-family: inherit !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                pointer-events: none !important;
            }

            @keyframes utts-slideDown {
                from { transform: translate(-50%, -30px) !important; opacity: 0 !important; }
                to { transform: translate(-50%, 0) !important; opacity: 1 !important; }
            }

            .utts-reading-indicator.utts-show {
                display: block !important;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                #universal-tts-panel {
                    right: 20px !important;
                    top: 100px !important;
                }

                .utts-toggle-btn {
                    width: 50px !important;
                    height: 50px !important;
                }

                .utts-icon {
                    width: 20px !important;
                    height: 20px !important;
                }

                .utts-controls {
                    width: 300px !important;
                    right: -20px !important;
                }

                .utts-actions {
                    flex-direction: column !important;
                    gap: 8px !important;
                }
            }

            @media (max-width: 480px) {
                .utts-controls {
                    width: 280px !important;
                    right: -40px !important;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(ttsPanel);

        // Create reading indicator
        const indicator = document.createElement('div');
        indicator.id = 'utts-reading-indicator';
        indicator.className = 'utts-reading-indicator';
        indicator.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 8px;">
                <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <span id="utts-reading-text">Reading...</span>
        `;
        document.body.appendChild(indicator);
    }

    setupEventListeners() {
        // Listen for page language changes
        document.addEventListener('languageChanged', (e) => {
            const newLang = e.detail.language;
            if (this.languageMap[newLang]) {
                this.changeLanguage(this.languageMap[newLang]);
            }
        });

        // Listen for dynamic content changes
        const observer = new MutationObserver(() => {
            if (this.isEnabled) {
                setTimeout(() => this.makeTextClickable(), 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Prevent TTS from interfering with existing click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('#universal-tts-panel')) {
                e.stopPropagation();
            }
        }, true);
    }

    makeTextClickable() {
        if (!this.isEnabled) return;

        // Remove existing TTS listeners
        document.querySelectorAll('.utts-clickable').forEach(el => {
            el.classList.remove('utts-clickable');
        });

        // Select text elements to make clickable
        const textSelectors = [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
            'span:not(.utts-label):not(.utts-value)', 
            'div:not([class*="utts-"]):not([id*="utts-"])', 
            'li', 'td', 'th', 'label:not(.utts-field-label)', 
            'button:not([class*="utts-"])', 
            'a', '[data-translate]'
        ];

        textSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Skip if already processed or is a TTS control element
                if (element.classList.contains('utts-clickable') || 
                    element.closest('#universal-tts-panel') ||
                    element.closest('.voice-assistant-btn') ||
                    element.id?.includes('utts-') ||
                    element.className?.includes('utts-') ||
                    element.tagName === 'SCRIPT' ||
                    element.tagName === 'STYLE') {
                    return;
                }

                // Check if element has readable text
                const text = this.getReadableText(element);
                if (text && text.trim().length > 2) {
                    element.classList.add('utts-clickable');
                    
                    // Store original handlers to preserve them
                    const originalClickHandler = element.onclick;
                    
                    // Add TTS click handler without removing existing ones
                    element.addEventListener('click', (e) => {
                        // Only trigger TTS if Ctrl/Cmd key is held or it's a pure text element
                        if (e.ctrlKey || e.metaKey || this.isPureTextElement(element)) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.readText(text, element);
                        }
                        // Let original handlers run for interactive elements
                    }, { capture: false });

                    // Double click for paragraph reading
                    element.addEventListener('dblclick', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.readParagraph(element);
                    }, { capture: false });
                }
            });
        });

        console.log('🔊 Made text clickable for TTS (non-interfering)');
    }

    isPureTextElement(element) {
        // Check if element is primarily for displaying text (not interactive)
        const textElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'LI'];
        const interactiveElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
        
        return textElements.includes(element.tagName) && 
               !interactiveElements.includes(element.tagName) &&
               !element.onclick &&
               !element.href;
    }

    getReadableText(element) {
        // Get clean text content without nested elements
        let text = '';
        
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            }
        }
        
        // If no direct text, get from data-translate or full text content
        if (!text.trim()) {
            if (element.hasAttribute('data-translate')) {
                text = element.textContent;
            } else if (element.children.length === 0) {
                text = element.textContent;
            }
        }
        
        return text.trim();
    }

    readText(text, element = null) {
        if (!text || !this.isEnabled) return;

        this.stopSpeaking();

        // Clean text for better pronunciation
        const cleanText = this.cleanTextForSpeech(text);
        
        // Show reading indicator
        this.showReadingIndicator(cleanText);
        
        // Highlight element being read
        if (element) {
            element.classList.add('utts-reading');
        }

        // Create and configure utterance
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = this.readingSpeed;
        utterance.volume = this.volume;
        utterance.pitch = this.pitch;
        utterance.lang = this.currentLanguage;

        // Select appropriate voice
        const voices = this.voicesByLanguage[this.currentLanguage];
        if (voices && voices.length > 0) {
            utterance.voice = voices[0];
        }

        utterance.onstart = () => {
            console.log('🔊 Started reading:', cleanText.substring(0, 50) + '...');
        };

        utterance.onend = () => {
            console.log('🔇 Finished reading');
            this.hideReadingIndicator();
            if (element) {
                element.classList.remove('utts-reading');
            }
            this.currentUtterance = null;
        };

        utterance.onerror = (event) => {
            console.error('TTS Error:', event.error);
            this.hideReadingIndicator();
            if (element) {
                element.classList.remove('utts-reading');
            }
            this.currentUtterance = null;
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }

    readParagraph(element) {
        // Find the parent paragraph or section
        let parent = element.closest('p, div:not([class*="utts-"]), section, article, .card-body, .modal-content');
        if (!parent) parent = element.parentElement;

        if (parent) {
            const fullText = this.getFullText(parent);
            this.readText(fullText, parent);
        } else {
            this.readText(element.textContent, element);
        }
    }

    getFullText(element) {
        // Get all text content while preserving sentence structure
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style and TTS elements
                    if (node.parentElement.closest('script, style, #universal-tts-panel')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let text = '';
        let node;
        while (node = walker.nextNode()) {
            const nodeText = node.textContent.trim();
            if (nodeText) {
                text += nodeText + ' ';
            }
        }

        return text.trim();
    }

    cleanTextForSpeech(text) {
        return text
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Replace common symbols with words
            .replace(/&/g, ' and ')
            .replace(/\$/g, ' dollars ')
            .replace(/%/g, ' percent ')
            .replace(/@/g, ' at ')
            .replace(/#/g, ' hash ')
            // Remove unwanted characters
            .replace(/[^\w\s.,!?;:'"()-]/g, '')
            // Fix spacing around punctuation
            .replace(/\s+([.!?])/g, '$1')
            .trim();
    }

    showReadingIndicator(text) {
        const indicator = document.getElementById('utts-reading-indicator');
        const textSpan = document.getElementById('utts-reading-text');
        
        if (indicator && textSpan) {
            textSpan.textContent = `Reading: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`;
            indicator.classList.add('utts-show');
        }
    }

    hideReadingIndicator() {
        const indicator = document.getElementById('utts-reading-indicator');
        if (indicator) {
            indicator.classList.remove('utts-show');
        }
    }

    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.hideReadingIndicator();
        
        // Remove all reading highlights
        document.querySelectorAll('.utts-reading').forEach(el => {
            el.classList.remove('utts-reading');
        });
        
        this.currentUtterance = null;
        console.log('🛑 TTS stopped');
    }

    // Control methods
    togglePanel() {
        const controls = document.getElementById('utts-controls');
        const isVisible = controls.style.display === 'block';
        controls.style.display = isVisible ? 'none' : 'block';
    }

    toggleTTS() {
        const checkbox = document.getElementById('utts-enable');
        this.isEnabled = checkbox.checked;
        localStorage.setItem('ttsEnabled', this.isEnabled);
        
        const indicator = document.getElementById('utts-indicator');
        indicator.classList.toggle('utts-active', this.isEnabled);
        
        if (this.isEnabled) {
            this.makeTextClickable();
            this.readText('Text-to-Speech enabled. Hold Ctrl and click any text to hear it, or double-click for paragraphs.');
        } else {
            this.stopSpeaking();
            document.querySelectorAll('.utts-clickable').forEach(el => {
                el.classList.remove('utts-clickable');
            });
        }
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('ttsLanguage', language);
        this.updateVoiceOptions();
        
        console.log('🌍 TTS language changed to:', language);
    }

    changeVoice(voiceIndex) {
        const voices = this.voicesByLanguage[this.currentLanguage];
        if (voices && voices[voiceIndex]) {
            this.selectedVoice = voices[voiceIndex];
            localStorage.setItem('ttsVoice', voiceIndex);
        }
    }

    adjustSpeed(speed) {
        this.readingSpeed = parseFloat(speed);
        document.getElementById('utts-speed-value').textContent = speed;
        localStorage.setItem('ttsSpeed', speed);
    }

    adjustVolume(volume) {
        this.volume = parseFloat(volume);
        document.getElementById('utts-volume-value').textContent = volume;
        localStorage.setItem('ttsVolume', volume);
    }

    adjustPitch(pitch) {
        this.pitch = parseFloat(pitch);
        document.getElementById('utts-pitch-value').textContent = pitch;
        localStorage.setItem('ttsPitch', pitch);
    }

    updateVoiceOptions() {
        const voiceSelect = document.getElementById('utts-voice');
        if (!voiceSelect) return;

        voiceSelect.innerHTML = '';
        
        const voices = this.voicesByLanguage[this.currentLanguage] || [];
        
        if (voices.length === 0) {
            voiceSelect.innerHTML = '<option>No voices available</option>';
            return;
        }

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    testVoice() {
        const testMessages = {
            'en-IN': 'Hello! This is a test of the English voice for sustainable farming platform.',
            'hi-IN': 'नमस्ते! यह स्थायी कृषि मंच के लिए हिन्दी आवाज़ का परीक्षण है।',
            'ml-IN': 'ഹലോ! ഇത് സുസ്ഥിര കൃഷി പ്ലാറ്റ്ഫോമിനായുള്ള മലയാളം ശബ്ദത്തിന്റെ പരീക്ഷണമാണ്।',
            'te-IN': 'హలో! ఇది స్థిరమైన వ్యవసాయ వేదిక కోసం తెలుగు వాయిస్ యొక్క పరీక్ష.',
            'ta-IN': 'வணக்கம்! இது நிலையான வேளாண் தளத்திற்கான தமிழ் குரலின் சோதனை.'
        };

        const message = testMessages[this.currentLanguage] || testMessages['en-IN'];
        this.readText(message);
    }

    // Public API methods
    readElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            const text = this.getReadableText(element) || element.textContent;
            this.readText(text, element);
        }
    }

    readCustomText(text) {
        this.readText(text);
    }

    setLanguage(language) {
        if (this.languageMap[language]) {
            this.changeLanguage(this.languageMap[language]);
        }
    }
}

// Initialize Universal TTS
let universalTTS;

document.addEventListener('DOMContentLoaded', () => {
    universalTTS = new UniversalTTS();
    
    // Make it globally accessible
    window.universalTTS = universalTTS;
    
    console.log('🔊 Universal Text-to-Speech ready (CSS isolated)!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalTTS;
}
