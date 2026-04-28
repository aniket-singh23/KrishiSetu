/**
 * 🌾 Virtual Farmery - Sustainable Farming Simulation Game
 * Manage crops, water, soil, and weather to maximize yield sustainably
 */

class VirtualFarmeryGame {
    constructor() {
        this.gameStarted = false;
        this.daysPassed = 0;
        this.maxDays = 30;
        this.score = 0;
        this.money = 100;
        this.farmSize = 9; // 3x3 grid
        this.waterLevel = 50;
        this.soilHealth = 75;
        this.pestLevel = 20;
        this.currentLanguage = localStorage.getItem('farmeryLanguage') || 'en';

        this.translations = {
            en: {
                'game-title': 'Virtual Farmery Simulator',
                'subtitle': 'Grow sustainable crops and maximize your yield!',
                'start-game': 'Start Farming',
                'day': 'Day',
                'money': 'Money',
                'water': 'Water',
                'soil-health': 'Soil Health',
                'pests': 'Pest Level',
                'score': 'Score',
                'actions': 'Actions',
                'water-crops': 'Water Crops',
                'add-fertilizer': 'Add Fertilizer',
                'plant-crop': 'Plant Crop',
                'pest-control': 'Pest Control',
                'harvest': 'Harvest',
                'harvest-all': 'Harvest All',
                'game-over': 'Harvest Time!',
                'total-yield': 'Total Yield',
                'sustainability': 'Sustainability Score',
                'back-dashboard': 'Back to Dashboard'
            },
            hi: {
                'game-title': 'आभासी खेती सिम्युलेटर',
                'subtitle': 'टिकाऊ फसलें उगाएं और अपनी पैदावार बढ़ाएं!',
                'start-game': 'खेती शुरू करें',
                'day': 'दिन',
                'money': 'पैसा',
                'water': 'पानी',
                'soil-health': 'मिट्टी का स्वास्थ्य',
                'pests': 'कीट स्तर',
                'score': 'स्कोर',
                'actions': 'कार्य',
                'water-crops': 'फसलों को पानी दें',
                'add-fertilizer': 'खाद जोड़ें',
                'plant-crop': 'फसल बोएं',
                'pest-control': 'कीट नियंत्रण',
                'harvest': 'कटाई',
                'harvest-all': 'सभी कटाई करें',
                'game-over': 'कटाई का समय!',
                'total-yield': 'कुल पैदावार',
                'sustainability': 'स्थिरता स्कोर',
                'back-dashboard': 'डैशबोर्ड पर वापस'
            }
        };

        this.crops = ['Wheat', 'Rice', 'Corn', 'Beans', 'Tomato'];
        this.field = Array(this.farmSize).fill(null).map(() => ({ crop: null, waterNeeded: 0, growth: 0 }));

        this.init();
    }

    init() {
        console.log('🌾 Initializing Virtual Farmery Game...');
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
            menuSection.innerHTML = `
                <h2>${this.t('game-title')}</h2>
                <p>${this.t('subtitle')}</p>
                <button class="start-btn">${this.t('start-game')}</button>
            `;
            menuSection.classList.add('active');
        }
    }

    startGame() {
        this.gameStarted = true;
        this.daysPassed = 0;
        this.score = 0;
        this.money = 100;
        this.waterLevel = 50;
        this.soilHealth = 75;
        this.pestLevel = 20;
        this.field = Array(this.farmSize).fill(null).map(() => ({ crop: null, waterNeeded: 0, growth: 0 }));

        document.querySelector('.menu-section').classList.remove('active');
        this.renderGameplay();
        this.updateDisplay();
        this.simulateDay();
    }

    renderGameplay() {
        const gameplaySection = document.querySelector('.gameplay-section');
        gameplaySection.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div><strong>${this.t('day')}:</strong> <span id="day">${this.daysPassed}</span>/<span>${this.maxDays}</span></div>
                <div><strong>${this.t('money')}:</strong> $<span id="money">${this.money}</span></div>
                <div><strong>${this.t('water')}:</strong> <span id="water">${this.waterLevel}</span>%</div>
                <div><strong>${this.t('soil-health')}:</strong> <span id="soil">${this.soilHealth}</span>%</div>
                <div><strong>${this.t('pests')}:</strong> <span id="pests">${this.pestLevel}</span>%</div>
                <div><strong>${this.t('score')}:</strong> <span id="score">${this.score}</span></div>
            </div>

            <div id="game-board" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;"></div>

            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 20px;">
                <button onclick="game.waterCrops()" style="padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 5px;">💧 ${this.t('water-crops')}</button>
                <button onclick="game.addFertilizer()" style="padding: 10px; background: #8B4513; color: white; border: none; border-radius: 5px;">🧴 ${this.t('add-fertilizer')}</button>
                <button onclick="game.plantCrop()" style="padding: 10px; background: #22c55e; color: white; border: none; border-radius: 5px;">🌱 ${this.t('plant-crop')}</button>
                <button onclick="game.pestControl()" style="padding: 10px; background: #f59e0b; color: white; border: none; border-radius: 5px;">🦗 ${this.t('pest-control')}</button>
                <button onclick="game.nextDay()" style="padding: 10px; background: #9333ea; color: white; border: none; border-radius: 5px;">⏰ Next Day</button>
            </div>
        `;
        gameplaySection.classList.add('active');
        this.renderField();
    }

    renderField() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        this.field.forEach((plot, index) => {
            const cell = document.createElement('div');
            cell.style.cssText = `
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #DEB887, #A0522D);
                border: 2px solid #8B4513;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                cursor: pointer;
                transition: all 0.3s;
            `;

            if (plot.crop) {
                const emoji = plot.crop === 'Wheat' ? '🌾' : plot.crop === 'Rice' ? '🍚' : '🌽';
                cell.textContent = emoji;
                cell.style.opacity = 0.5 + (plot.growth / 100) * 0.5;
            } else {
                cell.textContent = '🌍';
                cell.style.opacity = 0.7;
            }

            cell.addEventListener('click', () => this.plantAt(index));
            gameBoard.appendChild(cell);
        });
    }

    plantAt(index) {
        if (this.field[index].crop || this.money < 10) return;
        const crop = this.crops[Math.floor(Math.random() * this.crops.length)];
        this.field[index] = { crop, waterNeeded: 50, growth: 10 };
        this.money -= 10;
        this.score += 5;
        this.renderField();
        this.updateDisplay();
    }

    waterCrops() {
        if (this.waterLevel < 20 || this.money < 5) return;
        this.waterLevel = Math.min(100, this.waterLevel + 30);
        this.money -= 5;
        this.field.forEach(plot => {
            if (plot.crop) plot.growth += 5;
        });
        this.score += 3;
        this.updateDisplay();
        this.renderField();
    }

    addFertilizer() {
        if (this.money < 15) return;
        this.soilHealth = Math.min(100, this.soilHealth + 20);
        this.money -= 15;
        this.field.forEach(plot => {
            if (plot.crop) plot.growth += 8;
        });
        this.score += 5;
        this.updateDisplay();
        this.renderField();
    }

    plantCrop() {
        this.plantAt(Math.floor(Math.random() * this.farmSize));
    }

    pestControl() {
        if (this.money < 12) return;
        this.pestLevel = Math.max(0, this.pestLevel - 30);
        this.money -= 12;
        this.score += 4;
        this.updateDisplay();
    }

    nextDay() {
        if (this.daysPassed >= this.maxDays) return;
        this.simulateDay();
    }

    simulateDay() {
        this.daysPassed++;
        
        // Weather effects
        if (Math.random() < 0.3) this.waterLevel = Math.max(0, this.waterLevel - 20);
        
        // Pest growth
        this.pestLevel = Math.min(100, this.pestLevel + 5);
        
        // Soil degradation
        this.soilHealth = Math.max(20, this.soilHealth - 3);
        
        // Crop growth
        this.field.forEach(plot => {
            if (plot.crop) {
                plot.growth += 10;
                if (plot.growth > 100) {
                    this.money += 30;
                    this.score += 20;
                    plot.crop = null;
                    plot.growth = 0;
                }
            }
        });

        this.updateDisplay();
        this.renderField();

        if (this.daysPassed >= this.maxDays) {
            this.gameOver();
        }
    }

    updateDisplay() {
        document.getElementById('day').textContent = this.daysPassed;
        document.getElementById('money').textContent = this.money;
        document.getElementById('water').textContent = this.waterLevel;
        document.getElementById('soil').textContent = this.soilHealth;
        document.getElementById('pests').textContent = this.pestLevel;
        document.getElementById('score').textContent = this.score;
    }

    gameOver() {
        const sustainability = Math.round((this.soilHealth + (100 - this.pestLevel)) / 2);
        const endSection = document.querySelector('.gameplay-section');
        endSection.innerHTML = `
            <div style="padding: 48px; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 16px;">${this.t('game-over')}</h2>
                <div style="font-size: 2rem; font-weight: 700; color: #22c55e; margin: 24px 0;">$${this.money}</div>
                <div style="font-size: 1.2rem; color: #6b7280; margin: 12px 0;">${this.t('score')}: ${this.score}</div>
                <div style="font-size: 1.2rem; color: #6b7280; margin: 12px 0;">${this.t('sustainability')}: ${sustainability}%</div>
                <button onclick="location.href='dashboard.html'" style="
                    margin-top: 24px;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                    padding: 12px 48px;
                    border: none;
                    border-radius: 50px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                ">Back to Dashboard</button>
            </div>
        `;

        this.submitScore(sustainability);
    }

    submitScore(sustainability) {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token || !window.backendBridge) return;

        window.backendBridge.saveGameResult({
            game: 'virtual-farmery',
            score: this.score,
            accuracy: sustainability,
            completed: true,
            won: this.score >= 100
        }).catch(err => console.warn('Could not save game stats:', err.message));
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;
    }
}

// Initialize game
let game = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        game = new VirtualFarmeryGame();
    });
} else {
    game = new VirtualFarmeryGame();
}
