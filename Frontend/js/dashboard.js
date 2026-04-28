/**
 * 🌾 Krishi Setu Dashboard
 * Complete functionality for all dashboard sections including games
 */

const DASHBOARD_STORAGE_KEYS = {
    language: 'dashboardLanguage',
    userName: 'userName',
    userLevel: 'userLevel',
    userXp: 'userXP',
    userCoins: 'greenCoins',
    userAvatar: 'userAvatar',
    gamesPlayed: 'gamesPlayed',
    totalGameScore: 'totalGameScore',
    winStreak: 'winStreak',
    gameAccuracy: 'gameAccuracy',
    virtualFarmeryScore: 'virtualFarmeryScore',
    pickOddOutScore: 'pickOddOutScore'
};

class SustainableFarmingDashboard {
    constructor() {
        this.seedData = window.DASHBOARD_DATA || {};
        this.currentLanguage = localStorage.getItem(DASHBOARD_STORAGE_KEYS.language) || 'en';
        this.currentSection = 'dashboard';
        this.userData = this.loadUserData();
        this.notifications = [];
        this.quests = [];
        this.products = [];
        this.gameStats = this.loadGameStats();
        
        this.init();
    }

    init() {
        console.log('🌾 Initializing Krishi Setu Dashboard...');
        
        this.setupLanguageSystem();
        this.setupEventListeners();
        this.loadInitialData();
        this.setupAnimations();
        this.hideLoadingScreen();
        this.syncUserFromBackend();
        
        console.log('✅ Dashboard initialized successfully');
    }

    async syncUserFromBackend() {
        if (!window.backendBridge) {
            return;
        }

        try {
            const result = await window.backendBridge.fetchCurrentUser();
            const user = result?.user;
            if (!user) {
                return;
            }

            this.userData = {
                ...this.userData,
                name: user.name || this.userData.name,
                level: Number.isFinite(user.level) ? user.level : this.userData.level,
                xp: Number.isFinite(user.xp) ? user.xp : this.userData.xp,
                coins: Number.isFinite(user.coins) ? user.coins : this.userData.coins
            };

            if (user.gameStats) {
                this.gameStats = {
                    ...this.gameStats,
                    gamesPlayed: Number.isFinite(user.gameStats.gamesPlayed) ? user.gameStats.gamesPlayed : this.gameStats.gamesPlayed,
                    totalScore: Number.isFinite(user.gameStats.totalScore) ? Math.round(user.gameStats.totalScore) : this.gameStats.totalScore,
                    winStreak: Number.isFinite(user.gameStats.winStreak) ? user.gameStats.winStreak : this.gameStats.winStreak,
                    gameAccuracy: Number.isFinite(user.gameStats.gameAccuracy) ? Math.round(user.gameStats.gameAccuracy) : this.gameStats.gameAccuracy,
                    virtualFarmeryHighScore: Number.isFinite(user.gameStats.virtualFarmeryScore) ? Math.round(user.gameStats.virtualFarmeryScore) : this.gameStats.virtualFarmeryHighScore,
                    pickOddOutHighScore: Number.isFinite(user.gameStats.pickOddOutScore) ? Math.round(user.gameStats.pickOddOutScore) : this.gameStats.pickOddOutHighScore
                };
            }

            this.updateStats();
            this.updateGameStats();
            this.loadLeaderboard('virtual-farmery');
        } catch (error) {
            console.warn('Unable to sync dashboard user from backend:', error.message);
        }
    }

    setupLanguageSystem() {
        // Multi-language translations
        this.translations = {
            en: {
                'page-title': 'Krishi Setu Dashboard',
                'loading': 'Loading Dashboard...',
                'loading-subtitle': 'Preparing your farming experience',
                'platform-name': 'Krishi Setu',
                'search-placeholder': 'Search crops, tips, or tools...',
                'sunny': 'Sunny',
                'notifications': 'Notifications',
                'clear-all': 'Clear All',
                'level': 'Level 5',
                'my-profile': 'My Profile',
                'settings': 'Settings',
                'help': 'Help & Support',
                'logout': 'Logout',
                'dashboard': 'Dashboard',
                'daily-quests': 'Daily Quests',
                'workplace': 'My Farm',
                'progress': 'Progress',
                'marketplace': 'Marketplace',
                'games': 'Games',
                'learning': 'Learning Hub',
                'quick-stats': 'Quick Stats',
                'crops-planted': 'Crops Planted',
                'achievements': 'Achievements',
                'green-coins': 'Green Coins',
                'welcome-back': 'Welcome back, Farmer!',
                'dashboard-subtitle': 'Here\'s your farming progress overview',
                'daily-quests-completed': 'Quests Completed Today',
                'day-streak': 'Day Streak',
                'total-harvest': 'Total Harvest',
                'sustainability-score': 'Sustainability Score',
                'recent-activity': 'Recent Activity',
                'quick-actions': 'Quick Actions',
                'start-daily-quest': 'Start Daily Quest',
                'visit-farm': 'Visit My Farm',
                'play-games': 'Play Games',
                'browse-market': 'Browse Marketplace',
                'quests-subtitle': 'Complete tasks to earn rewards and improve your farming skills',
                'all-quests': 'All Quests',
                'active-quests': 'Active',
                'completed-quests': 'Completed',
                'featured-quests': 'Featured',
                'my-farm': 'My Farm',
                'farm-subtitle': 'Manage your crops, livestock, and farm infrastructure',
                'farm-area': 'Farm Area',
                'soil-health': 'Soil Health',
                'water-level': 'Water Level',
                'crop-fields': 'Crop Fields',
                'livestock': 'Livestock',
                'farm-tools': 'Farm Tools & Equipment',
                'progress-tracking': 'Progress Tracking',
                'progress-subtitle': 'Monitor your farming journey and achievements',
                'farmer-level': 'Farmer Level 5',
                'next-level': '350 XP until Level 6',
                'recent-achievements': 'Recent Achievements',
                'harvest-trends': 'Harvest Trends',
                'sustainability-metrics': 'Sustainability Metrics',
                'current-goals': 'Current Goals',
                'marketplace-subtitle': 'Buy and sell farming supplies, crops, and equipment',
                'all-categories': 'All Categories',
                'seeds': 'Seeds',
                'tools': 'Tools',
                'fertilizers': 'Fertilizers',
                'equipment': 'Equipment',
                'all-prices': 'All Prices',
                'low-to-high': 'Low to High',
                'high-to-low': 'High to Low',
                'search-products': 'Search products...',
                'my-listings': 'My Listings',
                'add-listing': 'Add New Listing',
                'quest-details': 'Quest Details',
                'product-details': 'Product Details',
                'footer-text': '© 2025 Krishi Setu Platform. Empowering farmers worldwide.',
                'about': 'About',
                'contact': 'Contact',
                'privacy': 'Privacy',
                'terms': 'Terms',
                // Games translations
                'games-subtitle': 'Learn farming through fun and engaging games',
                'featured-games': 'Featured Games',
                'virtual-farmery': 'Virtual Farmery',
                'farmery-desc': 'Build and manage your own sustainable farm. Plant crops, care for animals, and harvest rewards!',
                'pick-odd-out': 'Pick Odd Out',
                'pick-odd-desc': 'Test your farming knowledge! Identify which item doesn\'t belong in farming categories.',
                'game-categories': 'Game Categories',
                'simulation-games': 'Simulation Games',
                'simulation-desc': 'Build and manage virtual farms',
                'puzzle-games': 'Puzzle Games',
                'puzzle-desc': 'Test your farming knowledge',
                'strategy-games': 'Strategy Games',
                'strategy-desc': 'Plan and optimize farming',
                'arcade-games': 'Arcade Games',
                'arcade-desc': 'Fast-paced farming fun',
                'leaderboards': 'Leaderboards',
                'your-game-stats': 'Your Game Stats',
                'games-played': 'Games Played',
                'total-score': 'Total Score',
                'win-streak': 'Win Streak',
                'accuracy': 'Accuracy',
                'game-loading': 'Loading Game...'
            },
            hi: {
                'page-title': 'कृषि सेतु डैशबोर्ड',
                'loading': 'डैशबोर्ड लोड हो रहा है...',
                'loading-subtitle': 'आपका कृषि अनुभव तैयार कर रहे हैं',
                'platform-name': 'कृषि सेतु',
                'search-placeholder': 'फसलें, सुझाव या उपकरण खोजें...',
                'sunny': 'धूप',
                'notifications': 'सूचनाएं',
                'clear-all': 'सभी साफ करें',
                'level': 'स्तर 5',
                'my-profile': 'मेरी प्रोफ़ाइल',
                'settings': 'सेटिंग्स',
                'help': 'सहायता और समर्थन',
                'logout': 'लॉग आउट',
                'dashboard': 'डैशबोर्ड',
                'daily-quests': 'दैनिक चुनौतियां',
                'workplace': 'मेरा खेत',
                'progress': 'प्रगति',
                'marketplace': 'बाज़ार',
                'games': 'खेल',
                'learning': 'शिक्षा केंद्र',
                'quick-stats': 'त्वरित आंकड़े',
                'crops-planted': 'बोई गई फसलें',
                'achievements': 'उपलब्धियां',
                'green-coins': 'हरे सिक्के',
                'welcome-back': 'वापस स्वागत है, किसान!',
                'dashboard-subtitle': 'यहाँ आपकी कृषि प्रगति का अवलोकन है',
                'recent-activity': 'हाल की गतिविधि',
                'quick-actions': 'त्वरित क्रियाएं',
                'start-daily-quest': 'दैनिक चुनौती शुरू करें',
                'visit-farm': 'मेरे खेत पर जाएं',
                'play-games': 'खेल खेलें',
                'browse-market': 'बाज़ार देखें',
                'footer-text': '© 2025 कृषि सेतु मंच। विश्वभर के किसानों को सशक्त बनाना।',
                'games-subtitle': 'मजेदार और आकर्षक खेलों के माध्यम से कृषि सीखें',
                'featured-games': 'विशेष खेल',
                'virtual-farmery': 'वर्चुअल फार्मरी',
                'pick-odd-out': 'विषम चुनें',
                'games-played': 'खेले गए खेल',
                'total-score': 'कुल स्कोर'
            },
            ml: {
                'page-title': 'കൃഷി സേതു ഡാഷ്ബോർഡ്',
                'loading': 'ഡാഷ്ബോർഡ് ലോഡ് ചെയ്യുന്നു...',
                'loading-subtitle': 'നിങ്ങളുടെ കൃഷി അനുഭവം തയ്യാറാക്കുന്നു',
                'platform-name': 'കൃഷി സേതു',
                'search-placeholder': 'വിളകൾ, നുറുങ്ങുകൾ അല്ലെങ്കിൽ ഉപകരണങ്ങൾ തിരയുക...',
                'sunny': 'വെയിലുള്ള',
                'notifications': 'അറിയിപ്പുകൾ',
                'clear-all': 'എല്ലാം മായ്ക്കുക',
                'level': 'ലെവൽ 5',
                'dashboard': 'ഡാഷ്ബോർഡ്',
                'daily-quests': 'ദൈനിക ദൗത്യങ്ങൾ',
                'workplace': 'എന്റെ കൃഷിയിടം',
                'progress': 'പുരോഗതി',
                'marketplace': 'മാർക്കറ്റ്പ്ലേസ്',
                'games': 'ഗെയിമുകൾ',
                'learning': 'പഠന കേന്ദ്രം',
                'welcome-back': 'തിരികെ സ്വാഗതം, കർഷകൻ!',
                'recent-activity': 'സമീപകാല പ്രവർത്തനം',
                'quick-actions': 'വേഗമുള്ള പ്രവർത്തനങ്ങൾ',
                'play-games': 'ഗെയിമുകൾ കളിക്കുക',
                'footer-text': '© 2025 കൃഷി സേതു പ്ലാറ്റ്ഫോം। ലോകമെമ്പാടുമുള്ള കർഷകരെ ശാക്തീകരിക്കുന്നു।',
                'games-subtitle': 'രസകരവും ആകർഷകവുമായ ഗെയിമുകളിലൂടെ കൃഷി പഠിക്കുക',
                'featured-games': 'പ്രധാന ഗെയിമുകൾ'
            },
            te: {
                'page-title': 'కృషి సేతు డ్యాష్‌బోర్డ్',
                'loading': 'డ్యాష్‌బోర్డ్ లోడ్ చేస్తోంది...',
                'loading-subtitle': 'మీ వ్యవసాయ అనుభవాన్ని సిద్ధం చేస్తోంది',
                'platform-name': 'కృషి సేతు',
                'search-placeholder': 'పంటలు, చిట్కాలు లేదా సాధనాలను వెతకండి...',
                'sunny': 'ఎండ',
                'notifications': 'నోటిఫికేషన్‌లు',
                'clear-all': 'అన్నింటినీ క్లియర్ చేయండి',
                'level': 'స్థాయి 5',
                'dashboard': 'డ్యాష్‌బోర్డ్',
                'daily-quests': 'దైనిక అన్వేషణలు',
                'workplace': 'నా పొలం',
                'progress': 'పురోగతి',
                'marketplace': 'మార్కెట్‌ప్లేస్',
                'games': 'గేములు',
                'learning': 'లెర్నింగ్ హబ్',
                'welcome-back': 'తిరిగి స్వాగతం, రైతు!',
                'recent-activity': 'ఇటీవలి కార్యకలాపం',
                'quick-actions': 'త్వరిత చర్యలు',
                'play-games': 'గేములు ఆడండి',
                'footer-text': '© 2025 కృషి సేతు ప్లాట్‌ఫారం। ప్రపంచవ్యాప్తంగా రైతులను శక్తివంతం చేయడం।',
                'games-subtitle': 'సరదా మరియు ఆకర్షణీయమైన గేముల ద్వారా వ్యవసాయం నేర్చుకోండి',
                'featured-games': 'ప్రత్యేక గేములు'
            }
        };

        // Apply current language
        this.applyLanguage();
    }

    applyLanguage() {
        const currentTranslations = this.translations[this.currentLanguage] || this.translations.en;
        
        // Update document language class
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${this.currentLanguage}`);
        
        // Update language display
        const langCodes = { en: 'EN', hi: 'हिं', ml: 'മല', te: 'తె' };
        const currentLangElement = document.getElementById('current-language');
        if (currentLangElement) {
            currentLangElement.textContent = langCodes[this.currentLanguage] || 'EN';
        }
        
        // Apply translations
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (currentTranslations[key]) {
                element.innerHTML = currentTranslations[key];
            }
        });
        
        // Apply placeholder translations
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (currentTranslations[key]) {
                element.placeholder = currentTranslations[key];
            }
        });
    }

    setupEventListeners() {
        // Language selector
        const languageBtn = document.getElementById('language-btn');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (languageBtn && languageDropdown) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('active');
                languageBtn.setAttribute('aria-expanded', languageDropdown.classList.contains('active') ? 'true' : 'false');
            });
            
            document.addEventListener('click', () => {
                languageDropdown.classList.remove('active');
                languageBtn.setAttribute('aria-expanded', 'false');
            });
            
            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    this.changeLanguage(lang);
                    languageDropdown.classList.remove('active');
                    languageBtn.setAttribute('aria-expanded', 'false');
                });

                option.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                    }
                });
            });
        }

        // Navigation
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Notifications
        const notificationsBtn = document.getElementById('notifications');
        const notificationsDropdown = document.getElementById('notifications-dropdown');
        
        if (notificationsBtn && notificationsDropdown) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('active');
                notificationsBtn.setAttribute('aria-expanded', notificationsDropdown.classList.contains('active') ? 'true' : 'false');
            });

            notificationsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    notificationsBtn.click();
                }
            });
        }

        // User profile
        const userProfile = document.getElementById('user-profile');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (userProfile && profileDropdown) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
                userProfile.setAttribute('aria-expanded', profileDropdown.classList.contains('active') ? 'true' : 'false');
            });

            userProfile.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    userProfile.click();
                }
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Quest filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                e.target.classList.add('active');
                e.target.setAttribute('aria-pressed', 'true');
                this.filterQuests(e.target.dataset.filter);
            });
        });

        // Marketplace filters
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const marketplaceSearch = document.getElementById('marketplace-search');
        
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterProducts());
        if (priceFilter) priceFilter.addEventListener('change', () => this.filterProducts());
        if (marketplaceSearch) marketplaceSearch.addEventListener('input', () => this.filterProducts());

        // Games leaderboard tabs
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.loadLeaderboard(e.target.dataset.game);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications')) {
                document.getElementById('notifications-dropdown')?.classList.remove('active');
                document.getElementById('notifications')?.setAttribute('aria-expanded', 'false');
            }
            if (!e.target.closest('.user-profile')) {
                document.getElementById('profile-dropdown')?.classList.remove('active');
                document.getElementById('user-profile')?.setAttribute('aria-expanded', 'false');
            }
            if (!e.target.closest('.language-selector')) {
                document.getElementById('language-dropdown')?.classList.remove('active');
                document.getElementById('language-btn')?.setAttribute('aria-expanded', 'false');
            }
        });

        // Modal functionality
        this.setupModals();
    }

    setupModals() {
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    loadInitialData() {
        this.loadNotifications();
        this.loadRecentActivity();
        this.loadQuests();
        this.loadFarmData();
        this.loadProgressData();
        this.loadMarketplaceData();
        this.loadGameData();
        this.updateStats();
    }

    cloneSeed(path, fallback = []) {
        const value = path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), this.seedData);
        const safeValue = value === undefined ? fallback : value;
        return JSON.parse(JSON.stringify(safeValue));
    }

    loadUserData() {
        const defaults = this.seedData.defaults?.user || {};

        return {
            name: localStorage.getItem(DASHBOARD_STORAGE_KEYS.userName) || defaults.name || 'John Farmer',
            level: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.userLevel), 10) || defaults.level || 5,
            xp: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.userXp), 10) || defaults.xp || 650,
            coins: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.userCoins), 10) || defaults.coins || 1540,
            avatar: localStorage.getItem(DASHBOARD_STORAGE_KEYS.userAvatar) || defaults.avatar || 'assets/images/user-avatar.png'
        };
    }

    loadGameStats() {
        const defaults = this.seedData.defaults?.gameStats || {};

        return {
            gamesPlayed: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.gamesPlayed), 10) || defaults.gamesPlayed || 12,
            totalScore: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.totalGameScore), 10) || defaults.totalScore || 850,
            winStreak: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.winStreak), 10) || defaults.winStreak || 5,
            accuracy: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.gameAccuracy), 10) || defaults.accuracy || 76,
            virtualFarmeryHighScore: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.virtualFarmeryScore), 10) || defaults.virtualFarmeryHighScore || 3890,
            pickOddOutHighScore: parseInt(localStorage.getItem(DASHBOARD_STORAGE_KEYS.pickOddOutScore), 10) || defaults.pickOddOutHighScore || 2650
        };
    }

    loadNotifications() {
        this.notifications = this.cloneSeed('notifications', []);

        this.renderNotifications();
    }

    renderNotifications() {
        const notificationsList = document.getElementById('notification-list');
        const notificationCount = document.getElementById('notification-count');
        
        if (!notificationsList) return;

        const unreadCount = this.notifications.filter(n => n.unread).length;
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        notificationsList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.unread ? 'unread' : ''}" 
                 style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; ${notification.unread ? 'background: #f0f9ff;' : ''}">
                <div class="notification-content">
                    <h4 style="font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; color: #1f2937;">${notification.title}</h4>
                    <p style="font-size: 0.8rem; color: #6b7280; margin-bottom: 4px;">${notification.message}</p>
                    <small style="font-size: 0.75rem; color: #9ca3af;">${notification.time}</small>
                </div>
                <div class="notification-actions" style="margin-left: auto;">
                    <button onclick="dashboard.markAsRead(${notification.id})" 
                            style="background: none; border: none; color: #22c55e; cursor: pointer; padding: 4px;">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadRecentActivity() {
        const activities = this.cloneSeed('recentActivities', []);

        const activityList = document.getElementById('activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-desc">${activity.desc}</div>
                    </div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `).join('');
        }
    }

    loadQuests() {
        this.quests = this.cloneSeed('quests', []);

        this.renderQuests();
    }

    renderQuests(filter = 'all') {
        const questsGrid = document.getElementById('quests-grid');
        if (!questsGrid) return;

        let filteredQuests = this.quests;
        if (filter !== 'all') {
            filteredQuests = this.quests.filter(quest => {
                if (filter === 'active') return quest.status === 'active';
                if (filter === 'completed') return quest.status === 'completed';
                if (filter === 'featured') return quest.type === 'special';
                return true;
            });
        }

        questsGrid.innerHTML = filteredQuests.map(quest => `
            <div class="quest-card" onclick="dashboard.openQuest(${quest.id})">
                <div class="quest-header">
                    <span class="quest-type ${quest.type}">${quest.type.toUpperCase()}</span>
                    <div class="quest-reward">
                        <i class="fas fa-coins"></i>
                        ${quest.reward}
                    </div>
                </div>
                <div class="quest-title">${quest.title}</div>
                <div class="quest-description">${quest.description}</div>
                <div class="quest-progress">
                    <div class="quest-progress-text">
                        <span>Progress</span>
                        <span>${quest.progress}%</span>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="width: ${quest.progress}%"></div>
                    </div>
                </div>
                <div class="quest-actions">
                    ${quest.status === 'completed' 
                        ? '<button class="quest-btn secondary">✓ Completed</button>'
                        : quest.status === 'active'
                            ? `<button class="quest-btn primary" onclick="event.stopPropagation(); dashboard.continueQuest(${quest.id})">Continue</button>
                               <button class="quest-btn secondary">${quest.timeLeft}</button>`
                            : `<button class="quest-btn primary" onclick="event.stopPropagation(); dashboard.startQuest(${quest.id})">Start Quest</button>`
                    }
                </div>
            </div>
        `).join('');
    }

    loadFarmData() {
        const farmData = this.cloneSeed('farmData', {});
        const crops = farmData.crops || [];
        const livestock = farmData.livestock || [];
        const tools = farmData.tools || [];

        this.renderFarmSection('crops-grid', crops, 'crop');
        this.renderFarmSection('livestock-grid', livestock, 'livestock');
        this.renderFarmSection('tools-grid', tools, 'tool');
    }

    renderFarmSection(gridId, items, type) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = items.map(item => `
            <div class="${type}-card" onclick="dashboard.viewDetails('${type}', '${item.name}')">
                <div class="${type}-icon">${item.icon}</div>
                <div class="${type}-name">${item.name}</div>
                <div class="${type}-status">
                    ${type === 'livestock' ? `Count: ${item.count}<br>${item.production}` : 
                      type === 'crop' ? `${item.status}<br>${item.daysLeft ? item.daysLeft + ' days left' : 'Ready!'}` :
                      `${item.status}<br>${item.condition}`}
                </div>
            </div>
        `).join('');
    }

    loadProgressData() {
        const progressData = this.cloneSeed('progressData', {});
        const achievements = progressData.achievements || [];
        const goals = progressData.goals || [];

        this.renderAchievements(achievements);
        this.renderGoals(goals);
    }

    renderAchievements(achievements) {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item" onclick="dashboard.viewAchievement(${achievement.id})" 
                 style="padding: 12px; margin-bottom: 8px; background: #f9fafb; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                <div class="achievement-icon" style="font-size: 2rem; margin-bottom: 8px;">${achievement.icon}</div>
                <div class="achievement-content">
                    <div class="achievement-name" style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${achievement.name}</div>
                    <div class="achievement-desc" style="font-size: 0.8rem; color: #6b7280; margin-bottom: 4px;">${achievement.desc}</div>
                    <div class="achievement-date" style="font-size: 0.75rem; color: #9ca3af;">${achievement.date}</div>
                </div>
            </div>
        `).join('');
    }

    renderGoals(goals) {
        const goalsList = document.getElementById('goals-list');
        if (!goalsList) return;

        goalsList.innerHTML = goals.map(goal => `
            <div class="goal-item">
                <div class="goal-info">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-desc">${goal.desc} (${goal.current}/${goal.target})</div>
                </div>
                <div class="goal-progress">
                    <div class="stat-progress" style="width: 80px;">
                        <div class="progress-bar" style="width: ${goal.progress}%"></div>
                    </div>
                    <span>${goal.progress}%</span>
                </div>
            </div>
        `).join('');
    }

    loadMarketplaceData() {
        this.products = this.cloneSeed('products', []);
        this.userListings = this.cloneSeed('userListings', []);

        this.renderMarketplace();
        this.renderUserListings();
    }

    renderMarketplace() {
        const marketplaceGrid = document.getElementById('marketplace-grid');
        if (!marketplaceGrid) return;

        marketplaceGrid.innerHTML = this.products.map(product => `
            <div class="product-card" onclick="dashboard.viewProduct(${product.id})">
                <div class="product-image">${product.image}</div>
                <div class="product-content">
                    <div class="product-title">${product.title}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">
                        <span class="price">₹${product.price}</span>
                        <div class="product-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="product-btn ${product.inStock ? 'primary' : 'secondary'}" 
                                ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="product-btn secondary" onclick="event.stopPropagation(); dashboard.addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderUserListings() {
        const listingsGrid = document.getElementById('listings-grid');
        if (!listingsGrid) return;

        listingsGrid.innerHTML = this.userListings.map(listing => `
            <div class="listing-card" onclick="dashboard.editListing(${listing.id})">
                <div class="listing-header">
                    <span class="listing-status ${listing.status.toLowerCase()}">${listing.status}</span>
                    <span class="listing-views">${listing.views} views</span>
                </div>
                <div class="listing-content">
                    <div class="listing-image">${listing.image}</div>
                    <div class="listing-info">
                        <div class="listing-title">${listing.title}</div>
                        <div class="listing-price">₹${listing.price}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadGameData() {
        // Load leaderboard for default game
        this.loadLeaderboard('virtual-farmery');
        
        // Update game stats in player stats section
        this.updateGameStats();
    }

    loadLeaderboard(gameType) {
        const leaderboardData = this.cloneSeed('leaderboards', {});

        const leaderboardContent = document.getElementById('leaderboard-content');
        if (!leaderboardContent) return;

        const playerScore = gameType === 'virtual-farmery'
            ? this.gameStats.virtualFarmeryHighScore
            : this.gameStats.pickOddOutHighScore;
        const data = (leaderboardData[gameType] || []).map((player) => {
            if (player.name === 'You') {
                return { ...player, score: playerScore };
            }

            return player;
        });
        leaderboardContent.innerHTML = data.map(player => `
            <div class="leaderboard-item">
                <div class="leaderboard-player">
                    <div class="leaderboard-rank ${player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : ''}">${player.rank}</div>
                    <span class="leaderboard-name ${player.name === 'You' ? 'player-highlight' : ''}">${player.name}</span>
                </div>
                <span class="leaderboard-score">${player.score.toLocaleString()}</span>
            </div>
        `).join('');
    }

    updateGameStats() {
        // Update player stats cards
        const statsMapping = {
            'games-played': this.gameStats.gamesPlayed,
            'total-score': this.gameStats.totalScore,
            'win-streak': this.gameStats.winStreak,
            'accuracy': this.gameStats.accuracy + '%'
        };

        Object.entries(statsMapping).forEach(([id, value]) => {
            const element = document.querySelector(`.player-stat-card:nth-child(${Object.keys(statsMapping).indexOf(id) + 1}) h4`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateStats() {
        // Update stat displays with current data
        const stats = {
            ...(this.seedData.quickStats || {}),
            greenCoins: this.userData.coins
        };

        // Update stat elements
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                element.textContent = value;
            }
        });

        // Update user info
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = this.userData.name;
    }

    setupAnimations() {
        // Add stagger animation to cards
        const cards = document.querySelectorAll('.stat-card, .quest-card, .product-card, .game-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-fadeInUp');
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    // Public methods for UI interactions
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem(DASHBOARD_STORAGE_KEYS.language, lang);
        this.applyLanguage();
        
        // Trigger language change event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`).closest('.nav-item').classList.add('active');
        
        // Update content
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        this.currentSection = sectionName;
        
        // Load section-specific data if needed
        this.loadSectionData(sectionName);
    }

    loadSectionData(section) {
        switch (section) {
            case 'quests':
                this.renderQuests();
                break;
            case 'marketplace':
                this.renderMarketplace();
                break;
            case 'progress':
                this.loadProgressCharts();
                break;
            case 'games':
                this.loadLeaderboard('virtual-farmery');
                this.updateGameStats();
                break;
        }
    }

    loadProgressCharts() {
        // Simple chart simulation (you can integrate Chart.js here)
        const harvestChart = document.getElementById('harvest-chart');
        const sustainabilityChart = document.getElementById('sustainability-chart');
        
        if (harvestChart) {
            harvestChart.innerHTML = '<div style="text-align: center; padding: 60px; color: #6b7280;">📊 Chart data will be displayed here</div>';
        }
        
        if (sustainabilityChart) {
            sustainabilityChart.innerHTML = '<div style="text-align: center; padding: 60px; color: #6b7280;">📈 Sustainability metrics chart</div>';
        }
    }

    performSearch(query) {
        console.log('Searching for:', query);
        // Implement search functionality
        if (query.length > 2) {
            // Show search results
            this.showSearchResults(query);
        }
    }

    showSearchResults(query) {
        // Create and show search results overlay
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.innerHTML = `
            <div class="search-overlay">
                <div class="search-content">
                    <h3>Search Results for "${query}"</h3>
                    <p>Search functionality will be implemented here</p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(searchResults);
    }

    filterQuests(filter) {
        this.renderQuests(filter);
    }

    filterProducts() {
        const category = document.getElementById('category-filter')?.value || 'all';
        const priceSort = document.getElementById('price-filter')?.value || 'all';
        const searchTerm = document.getElementById('marketplace-search')?.value.toLowerCase() || '';
        
        let filtered = this.products;
        
        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(product => product.category === category);
        }
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Sort by price
        if (priceSort === 'low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (priceSort === 'high') {
            filtered.sort((a, b) => b.price - a.price);
        }
        
        // Render filtered products
        const marketplaceGrid = document.getElementById('marketplace-grid');
        if (marketplaceGrid) {
            marketplaceGrid.innerHTML = filtered.map(product => `
                <div class="product-card" onclick="dashboard.viewProduct(${product.id})">
                    <div class="product-image">${product.image}</div>
                    <div class="product-content">
                        <div class="product-title">${product.title}</div>
                        <div class="product-description">${product.description}</div>
                        <div class="product-price">
                            <span class="price">₹${product.price}</span>
                            <div class="product-rating">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                                <span>${product.rating} (${product.reviews})</span>
                            </div>
                        </div>
                        <div class="product-actions">
                            <button class="product-btn ${product.inStock ? 'primary' : 'secondary'}" 
                                    ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button class="product-btn secondary" onclick="event.stopPropagation(); dashboard.addToWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Game-related methods
    playGame(gameType) {
        console.log('🎮 Starting game:', gameType);
        
        switch (gameType) {
            case 'virtual-farmery':
                this.showGameModal('Virtual Farmery', 'games/virtual-farmery.html');
                break;
            case 'pick-odd-out':
                this.showGameModal('Pick Odd Out', 'games/pick-odd-out.html');
                break;
            default:
                this.switchSection('games');
        }
    }

    showGameModal(gameName, gameUrl) {
        const modal = document.getElementById('game-modal');
        const content = document.getElementById('game-modal-content');
        
        modal.style.display = 'block';
        content.innerHTML = `
            <div class="game-loading">
                <div class="loading-spinner"></div>
                <h3>Loading ${gameName}...</h3>
                <p>Preparing your gaming experience</p>
                <div class="game-actions" style="margin-top: 20px;">
                    <button class="product-btn primary" onclick="window.open('${gameUrl}', '_blank'); document.getElementById('game-modal').style.display = 'none';">
                        <i class="fas fa-external-link-alt"></i>
                        Open Game in New Tab
                    </button>
                    <button class="product-btn secondary" onclick="document.getElementById('game-modal').style.display = 'none';">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Auto-open game after 2 seconds
        setTimeout(() => {
            window.open(gameUrl, '_blank');
            modal.style.display = 'none';
        }, 2000);
    }

    filterGames(category) {
        console.log('🎯 Filtering games by category:', category);
        this.showNotification(`Showing ${category} games`, 'info');
        
        // Filter games based on category
        const games = document.querySelectorAll('.game-card');
        games.forEach(game => {
            const gameTitle = game.querySelector('.game-title').textContent.toLowerCase();
            let shouldShow = false;
            
            switch (category) {
                case 'simulation':
                    shouldShow = gameTitle.includes('farmery') || gameTitle.includes('virtual');
                    break;
                case 'puzzle':
                    shouldShow = gameTitle.includes('odd') || gameTitle.includes('quiz') || gameTitle.includes('puzzle');
                    break;
                default:
                    shouldShow = true;
            }
            
            game.style.display = shouldShow ? 'block' : 'none';
        });
    }

    updateGameScore(gameType, score) {
        // Update game statistics
        this.gameStats.gamesPlayed++;
        this.gameStats.totalScore += score;
        
        if (gameType === 'virtual-farmery' && score > this.gameStats.virtualFarmeryHighScore) {
            this.gameStats.virtualFarmeryHighScore = score;
            localStorage.setItem('virtualFarmeryScore', score);
            this.showNotification('New Virtual Farmery high score!', 'success');
        }
        
        if (gameType === 'pick-odd-out' && score > this.gameStats.pickOddOutHighScore) {
            this.gameStats.pickOddOutHighScore = score;
            localStorage.setItem('pickOddOutScore', score);
            this.showNotification('New Pick Odd Out high score!', 'success');
        }
        
        // Save updated stats
        localStorage.setItem('gamesPlayed', this.gameStats.gamesPlayed);
        localStorage.setItem('totalGameScore', this.gameStats.totalScore);
        
        // Update UI
        this.updateGameStats();
        this.loadLeaderboard(gameType);
    }

    // Action methods
    startQuest(questId) {
        if (questId) {
            const quest = this.quests.find(q => q.id === questId);
            if (quest) {
                quest.status = 'active';
                this.renderQuests();
                this.showNotification(`Started quest: ${quest.title}`, 'success');
            }
        } else {
            // Start first available quest
            window.location.href = 'games/daily-quest.html';
        }
    }

    continueQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest) {
            if (quest.id === 5) { // Game Master Challenge
                this.switchSection('games');
            } else {
                window.location.href = `games/daily-quest.html?quest=${questId}`;
            }
        }
    }

    openFarm() {
        this.switchSection('workplace');
    }

    openMarket() {
        this.switchSection('marketplace');
    }

    openQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest) {
            const modal = document.getElementById('quest-modal');
            const content = document.getElementById('quest-modal-content');
            
            content.innerHTML = `
                <div class="quest-detail">
                    <div class="quest-detail-header">
                        <span class="quest-type ${quest.type}">${quest.type.toUpperCase()}</span>
                        <div class="quest-reward">
                            <i class="fas fa-coins"></i>
                            ${quest.reward} Green Coins
                        </div>
                    </div>
                    <h3>${quest.title}</h3>
                    <p>${quest.description}</p>
                    <div class="quest-progress-detail">
                        <div class="progress-header">
                            <span>Progress: ${quest.progress}%</span>
                            <span>Time Left: ${quest.timeLeft}</span>
                        </div>
                        <div class="stat-progress">
                            <div class="progress-bar" style="width: ${quest.progress}%"></div>
                        </div>
                    </div>
                    <div class="quest-detail-actions">
                        ${quest.status === 'completed' 
                            ? '<button class="quest-btn secondary" disabled>✓ Completed</button>'
                            : quest.status === 'active'
                                ? `<button class="quest-btn primary" onclick="dashboard.continueQuest(${quest.id}); document.getElementById('quest-modal').style.display = 'none';">Continue Quest</button>`
                                : `<button class="quest-btn primary" onclick="dashboard.startQuest(${quest.id}); document.getElementById('quest-modal').style.display = 'none';">Start Quest</button>`
                        }
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const modal = document.getElementById('product-modal');
            const content = document.getElementById('product-modal-content');
            
            content.innerHTML = `
                <div class="product-detail">
                    <div class="product-detail-image">${product.image}</div>
                    <div class="product-detail-info">
                        <h3>${product.title}</h3>
                        <p class="product-seller">By ${product.seller}</p>
                        <p class="product-detail-desc">${product.description}</p>
                        <div class="product-detail-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span>${product.rating} (${product.reviews} reviews)</span>
                        </div>
                        <div class="product-detail-price">₹${product.price}</div>
                        <div class="product-detail-actions">
                            <button class="product-btn primary ${!product.inStock ? 'disabled' : ''}" 
                                    ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button class="product-btn secondary" onclick="dashboard.addToWishlist(${product.id})">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    addToWishlist(productId) {
        this.showNotification('Added to wishlist!', 'success');
    }

    addListing() {
        this.showNotification('Add listing functionality will be implemented', 'info');
    }

    editListing(listingId) {
        this.showNotification(`Edit listing ${listingId}`, 'info');
    }

    viewDetails(type, name) {
        this.showNotification(`Viewing ${type}: ${name}`, 'info');
    }

    viewAchievement(achievementId) {
        this.showNotification(`Viewing achievement ${achievementId}`, 'info');
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.unread = false;
            this.renderNotifications();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            font-size: 0.9rem;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new SustainableFarmingDashboard();
    
    // Make it globally accessible
    window.dashboard = dashboard;
    
    console.log('🌾 Krishi Setu Dashboard ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SustainableFarmingDashboard;
}
