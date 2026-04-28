/**
 * 🎯 Pick the Odd One Out - Farming Game Logic
 * Players identify the item that doesn't belong in each farming scenario
 */

class PickOddOutGame {
    constructor() {
        this.currentLanguage = localStorage.getItem('gameLanguage') || 'en';
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 10;
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.gameStarted = false;
        
        this.translations = {
            en: {
                'game-title': 'Pick the Odd One Out',
                'subtitle': 'Find the farming item that doesn\'t belong',
                'start-game': 'Start Game',
                'question': 'Question',
                'score': 'Score',
                'next': 'Next',
                'submit': 'Submit Answer',
                'correct': 'Correct! 🎉',
                'incorrect': 'Incorrect! ❌',
                'game-over': 'Game Over!',
                'final-score': 'Your Score',
                'play-again': 'Play Again',
                'back-dashboard': 'Back to Dashboard'
            },
            hi: {
                'game-title': 'विषम खोजें',
                'subtitle': 'खेती की वस्तु खोजें जो अलग हो',
                'start-game': 'खेल शुरू करें',
                'question': 'प्रश्न',
                'score': 'स्कोर',
                'next': 'अगला',
                'submit': 'उत्तर सबमिट करें',
                'correct': 'सही! 🎉',
                'incorrect': 'गलत! ❌',
                'game-over': 'खेल समाप्त!',
                'final-score': 'आपका स्कोर',
                'play-again': 'फिर से खेलें',
                'back-dashboard': 'डैशबोर्ड पर वापस'
            }
        };

        this.questions = [
            {
                text: 'Which item does NOT belong in a sustainable farm?',
                options: ['Organic Compost', 'Chemical Pesticide', 'Crop Rotation', 'Natural Soil'],
                correctAnswer: 1,
                explanation: 'Chemical pesticides harm the soil. Use natural methods instead.'
            },
            {
                text: 'What is NOT a water conservation method?',
                options: ['Drip Irrigation', 'Mulching', 'Flood Irrigation', 'Rainwater Harvesting'],
                correctAnswer: 2,
                explanation: 'Flood irrigation wastes water. Drip irrigation is more efficient.'
            },
            {
                text: 'Which is NOT a crop rotation benefit?',
                options: ['Pest Control', 'Increased Yield', 'Reduced Nutrients', 'Improved Soil'],
                correctAnswer: 2,
                explanation: 'Crop rotation improves soil nutrients, not reduces them.'
            },
            {
                text: 'What should NOT be added to compost?',
                options: ['Vegetable Scraps', 'Meat Bones', 'Leaves', 'Grass Clippings'],
                correctAnswer: 1,
                explanation: 'Meat bones attract pests and take long to decompose.'
            },
            {
                text: 'Which is NOT a sustainable farming practice?',
                options: ['Agroforestry', 'Cover Crops', 'Monoculture', 'Terracing'],
                correctAnswer: 2,
                explanation: 'Monoculture depletes soil. Diversity is key to sustainability.'
            },
            {
                text: 'What does NOT help soil health?',
                options: ['Adding Organic Matter', 'Using Fungicides', 'Reducing Tilling', 'Planting Cover Crops'],
                correctAnswer: 1,
                explanation: 'Excessive fungicides harm beneficial soil organisms.'
            },
            {
                text: 'Which practice is NOT efficient for water use?',
                options: ['Sprinkler Systems', 'Soil Sensors', 'Daily Flooding', 'Scheduled Irrigation'],
                correctAnswer: 2,
                explanation: 'Daily flooding wastes water. Smart irrigation saves resources.'
            },
            {
                text: 'What is NOT a renewable farm energy source?',
                options: ['Solar Power', 'Wind Energy', 'Diesel Generators', 'Biogas'],
                correctAnswer: 2,
                explanation: 'Diesel is not renewable. Use solar, wind, or biogas instead.'
            },
            {
                text: 'Which is NOT a nitrogen-fixing crop?',
                options: ['Legumes', 'Beans', 'Corn', 'Peas'],
                correctAnswer: 2,
                explanation: 'Corn does not fix nitrogen naturally. Use legumes instead.'
            },
            {
                text: 'What should NOT be used for pest management?',
                options: ['Neem Oil', 'Companion Planting', 'Chemical Sprays', 'Beneficial Insects'],
                correctAnswer: 2,
                explanation: 'Chemical sprays harm the ecosystem. Use organic methods.'
            }
        ];

        this.init();
    }

    init() {
        console.log('🎯 Initializing Pick Odd Out Game...');
        this.setupEventListeners();
        this.renderMenu();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const startBtn = document.querySelector('.start-btn');
            const backBtn = document.querySelector('.back-btn');
            if (startBtn) startBtn.addEventListener('click', () => this.startGame());
            if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'dashboard.html');
        });
    }

    renderMenu() {
        const menuSection = document.querySelector('.menu-section');
        if (menuSection) {
            menuSection.classList.add('active');
        }
    }

    startGame() {
        this.gameStarted = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;

        document.querySelector('.menu-section').classList.remove('active');
        document.querySelector('.gameplay-section').classList.add('active');
        
        this.loadQuestion();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;

        // Update progress
        document.querySelector('.progress-fill').style.width = progress + '%';
        document.querySelector('.question-number').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
        document.querySelector('.question-title').textContent = question.text;

        // Render options
        const optionsGrid = document.querySelector('.options-grid');
        optionsGrid.innerHTML = '';
        optionsGrid.classList.remove('show');

        setTimeout(() => {
            question.options.forEach((option, index) => {
                const card = document.createElement('div');
                card.className = 'option-card';
                card.textContent = option;
                card.addEventListener('click', () => this.selectAnswer(index, card));
                optionsGrid.appendChild(card);
            });
            optionsGrid.classList.add('show');
        }, 300);

        // Update score display
        document.querySelector('[data-translate="score"]').textContent = `Score: ${this.score}`;
        
        this.isAnswered = false;
        this.selectedAnswer = null;
    }

    selectAnswer(index, element) {
        if (this.isAnswered) return;

        this.selectedAnswer = index;
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        element.classList.add('selected');

        // Show submit button or auto-advance
        this.checkAnswer(index);
    }

    checkAnswer(index) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = index === question.correctAnswer;

        if (isCorrect) {
            this.score += 10;
            this.showFeedback(true, 'Correct! 🎉 ' + question.explanation);
        } else {
            this.showFeedback(false, 'Incorrect! ❌ ' + question.explanation);
        }

        this.isAnswered = true;
        
        // Auto-advance after 2 seconds
        setTimeout(() => this.nextQuestion(), 2000);
    }

    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.totalQuestions) {
            this.gameOver();
        } else {
            this.loadQuestion();
        }
    }

    showFeedback(isCorrect, message) {
        const feedback = document.createElement('div');
        feedback.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${isCorrect ? '#10b981' : '#ef4444'};
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.1rem;
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    gameOver() {
        const gameplaySection = document.querySelector('.gameplay-section');
        const endSection = document.createElement('div');
        endSection.className = 'game-section active';
        endSection.style.cssText = `
            padding: 48px;
            text-align: center;
            display: block;
        `;
        
        const accuracy = ((this.score / 100) * 100).toFixed(0);
        endSection.innerHTML = `
            <h2 style="font-size: 2.5rem; margin-bottom: 16px;">Game Over!</h2>
            <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 32px;">
                You answered ${this.score / 10} out of ${this.totalQuestions} questions correctly!
            </p>
            <div style="font-size: 3rem; font-weight: 700; color: #22c55e; margin-bottom: 24px;">
                ${this.score}/${this.totalQuestions * 10}
            </div>
            <button onclick="location.href='dashboard.html'" style="
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: white;
                padding: 12px 48px;
                border: none;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            ">Back to Dashboard</button>
        `;

        gameplaySection.replaceWith(endSection);

        // Submit score to backend
        this.submitScore(accuracy);
    }

    submitScore(accuracy) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token || !window.backendBridge) return;

        window.backendBridge.saveGameResult({
            game: 'pick-odd-out',
            score: this.score,
            accuracy: accuracy,
            completed: true,
            won: this.score >= 70
        }).catch(err => console.warn('Could not save game stats:', err.message));
    }
}

// Initialize game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PickOddOutGame();
    });
} else {
    new PickOddOutGame();
}
