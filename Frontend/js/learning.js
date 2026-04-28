/**
 * 🎓 Krishi Setu Learning Hub
 * Complete functionality for educational video platform with real YouTube videos
 */

class LearningHub {
    constructor() {
        this.currentLanguage = localStorage.getItem('learningLanguage') || 'en';
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.videosPerLoad = 12;
        this.currentVideoIndex = 0;
        this.watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
        this.userProgress = this.loadUserProgress();
        
        this.videos = this.initializeVideos();
        this.learningActivities = [];
        
        this.init();
    }

    init() {
        console.log('🎓 Initializing Krishi Setu Learning Hub...');
        
        this.setupLanguageSystem();
        this.setupEventListeners();
        this.loadInitialContent();
        this.setupAnimations();
        this.hideLoadingScreen();
        
        console.log('✅ Learning Hub initialized successfully');
    }

    setupLanguageSystem() {
        // Multi-language translations
        this.translations = {
            en: {
                'page-title': 'Krishi Setu - Learning Hub',
                'loading': 'Loading Learning Hub...',
                'loading-subtitle': 'Preparing your educational content',
                'back-dashboard': 'Back to Dashboard',
                'learning-hub': 'Krishi Setu Learning Hub',
                'level': 'Level 5',
                'hero-title': 'Master Sustainable Farming',
                'hero-subtitle': 'Learn from expert farmers and agricultural scientists through comprehensive video tutorials',
                'video-lessons': 'Video Lessons',
                'learners': 'Learners',
                'rating': 'Rating',
                'start-learning': 'Start Learning Now',
                'search-videos': 'Search for farming topics, techniques, or crops...',
                'all-videos': 'All Videos',
                'beginner': 'Beginner',
                'intermediate': 'Intermediate',
                'advanced': 'Advanced',
                'trending': 'Trending',
                'learning-categories': 'Learning Categories',
                'categories-subtitle': 'Explore different aspects of sustainable farming',
                'farming-basics': 'Sustainable Farming Basics',
                'basics-desc': 'Learn the fundamentals of sustainable agriculture and organic farming methods',
                'crop-management': 'Crop Management',
                'crops-desc': 'Master crop rotation, planting techniques, and harvest optimization',
                'pest-control': 'Organic Pest Control',
                'pest-desc': 'Natural methods to protect crops without harmful chemicals',
                'soil-health': 'Soil Health & Nutrition',
                'soil-desc': 'Understanding soil composition, testing, and natural fertilization',
                'water-management': 'Water Management',
                'water-desc': 'Efficient irrigation systems and water conservation techniques',
                'farm-technology': 'Modern Farm Technology',
                'tech-desc': 'Smart farming tools, sensors, and automation for better yields',
                'featured-videos': 'Featured Learning Videos',
                'featured-subtitle': 'Hand-picked content from farming experts',
                'load-more': 'Load More Videos',
                'your-progress': 'Your Learning Progress',
                'progress-subtitle': 'Track your farming education journey',
                'videos-watched': 'Videos Watched',
                'learning-time': 'Learning Time',
                'certificates': 'Certificates',
                'skill-level': 'Skill Level',
                'recent-learning': 'Recent Learning Activity',
                'expert-instructors': 'Learn from Expert Farmers',
                'instructors-subtitle': 'Experienced agricultural professionals sharing their knowledge',
                'agricultural-scientist': 'Agricultural Scientist',
                'organic-expert': 'Organic Farming Expert',
                'sustainable-farmer': 'Sustainable Farming Pioneer',
                'footer-text': '© 2025 Krishi Setu Learning Hub. Empowering farmers through education.',
                'dashboard': 'Dashboard',
                'about': 'About',
                'contact': 'Contact',
                'help': 'Help'
            },
            hi: {
                'page-title': 'कृषि सेतु - शिक्षा केंद्र',
                'loading': 'शिक्षा केंद्र लोड हो रहा है...',
                'loading-subtitle': 'आपकी शैक्षणिक सामग्री तैयार कर रहे हैं',
                'back-dashboard': 'डैशबोर्ड पर वापस',
                'learning-hub': 'कृषि सेतु शिक्षा केंद्र',
                'level': 'स्तर 5',
                'hero-title': 'स्थायी कृषि में महारत हासिल करें',
                'hero-subtitle': 'विशेषज्ञ किसानों और कृषि वैज्ञानिकों से व्यापक वीडियो ट्यूटोरियल के माध्यम से सीखें',
                'video-lessons': 'वीडियो पाठ',
                'learners': 'शिक्षार्थी',
                'rating': 'रेटिंग',
                'start-learning': 'अभी सीखना शुरू करें',
                'search-videos': 'कृषि विषयों, तकनीकों या फसलों की खोज करें...',
                'all-videos': 'सभी वीडियो',
                'beginner': 'शुरुआती',
                'intermediate': 'मध्यम',
                'advanced': 'उन्नत',
                'trending': 'ट्रेंडिंग',
                'learning-categories': 'सीखने की श्रेणियां',
                'categories-subtitle': 'स्थायी कृषि के विभिन्न पहलुओं का अन्वेषण करें',
                'farming-basics': 'स्थायी कृषि की मूल बातें',
                'crop-management': 'फसल प्रबंधन',
                'pest-control': 'जैविक कीट नियंत्रण',
                'soil-health': 'मिट्टी का स्वास्थ्य और पोषण',
                'water-management': 'जल प्रबंधन',
                'farm-technology': 'आधुनिक कृषि तकनीक',
                'featured-videos': 'चुनिंदा शिक्षण वीडियो',
                'load-more': 'और वीडियो लोड करें',
                'your-progress': 'आपकी सीखने की प्रगति',
                'videos-watched': 'देखे गए वीडियो',
                'learning-time': 'सीखने का समय',
                'certificates': 'प्रमाण पत्र',
                'skill-level': 'कौशल स्तर',
                'recent-learning': 'हाल की सीखने की गतिविधि'
            },
            ml: {
                'page-title': 'കൃഷി സേതു - പഠന കേന്ദ്രം',
                'loading': 'പഠന കേന്ദ്രം ലോഡ് ചെയ്യുന്നു...',
                'loading-subtitle': 'നിങ്ങളുടെ വിദ്യാഭ്യാസ ഉള്ളടക്കം തയ്യാറാക്കുന്നു',
                'back-dashboard': 'ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക',
                'learning-hub': 'കൃഷി സേതു പഠന കേന്ദ്രം',
                'hero-title': 'സുസ്ഥിര കൃഷിയിൽ വൈദഗ്ദ്ധ്യം നേടുക',
                'hero-subtitle': 'വിദഗ്ദ്ധ കർഷകരിൽ നിന്നും കാർഷിക ശാസ്ത്രജ്ഞരിൽ നിന്നും സമഗ്ര വീഡിയോ ട്യൂട്ടോറിയലുകളിലൂടെ പഠിക്കുക',
                'video-lessons': 'വീഡിയോ പാഠങ്ങൾ',
                'learners': 'പഠിതാക്കൾ',
                'start-learning': 'ഇപ്പോൾ പഠിക്കാൻ തുടങ്ങുക',
                'learning-categories': 'പഠന വിഭാഗങ്ങൾ',
                'farming-basics': 'സുസ്ഥിര കൃഷിയുടെ അടിസ്ഥാനങ്ങൾ',
                'crop-management': 'വിള പരിപാലനം',
                'pest-control': 'ജൈവ കീട നിയന്ത്രണം',
                'featured-videos': 'തിരഞ്ഞെടুത്ത പഠന വീഡിയോകൾ'
            },
            te: {
                'page-title': 'కృషి సేతు - అభ్యాస కేంద్రం',
                'loading': 'అభ్యాస కేంద్రం లోడ్ అవుతోంది...',
                'loading-subtitle': 'మీ విద్యా కంటెంట్‌ను సిద్ధం చేస్తోంది',
                'back-dashboard': 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు',
                'learning-hub': 'కృషి సేతు అభ్యాస కేంద్రం',
                'hero-title': 'స్థిరమైన వ్యవసాయంలో నైపుణ్యం పొందండి',
                'hero-subtitle': 'నిపుణ రైతులు మరియు వ్యవసాయ శాస్త్రవేత్తల నుండి సమగ్ర వీడియో ట్యుటోరియల్స్ ద్వారా నేర్చుకోండి',
                'video-lessons': 'వీడియో పాఠాలు',
                'learners': 'అభ్యాసకులు',
                'start-learning': 'ఇప్పుడే నేర్చుకోవడం ప్రారంభించండి',
                'learning-categories': 'అభ్యాస వర్గాలు',
                'farming-basics': 'స్థిరమైన వ్యవసాయ ప్రాథమికాలు',
                'crop-management': 'పంట నిర్వహణ',
                'featured-videos': 'ప్రత్యేక అభ్యాస వీడియోలు'
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

    initializeVideos() {
        return [
            // Featured Videos from your provided links
            {
                id: 1,
                title: 'Modern Sustainable Farming Techniques',
                description: 'Comprehensive guide to implementing sustainable farming practices in modern agriculture for better yields and environmental protection.',
                category: 'basics',
                difficulty: 'beginner',
                duration: '15:45',
                views: '125.3K',
                rating: 4.9,
                youtubeId: 'UGx_Q4VEazc',
                instructor: 'Agricultural Expert',
                tags: ['sustainable', 'modern', 'farming', 'techniques', 'environment'],
                featured: true
            },
            {
                id: 2,
                title: 'Advanced Crop Management Systems',
                description: 'Learn advanced techniques for managing crops efficiently using modern technology and traditional wisdom combined.',
                category: 'crops',
                difficulty: 'intermediate',
                duration: '22:18',
                views: '89.7K',
                rating: 4.8,
                youtubeId: 'J3Ok4Nv3rWU',
                instructor: 'Crop Specialist',
                tags: ['crop', 'management', 'advanced', 'systems', 'technology'],
                featured: true
            },
            {
                id: 3,
                title: 'Soil Health and Fertilizer Management',
                description: 'Understanding soil composition, health indicators, and proper fertilizer application for maximum crop productivity.',
                category: 'soil',
                difficulty: 'intermediate',
                duration: '28:33',
                views: '76.4K',
                rating: 4.7,
                youtubeId: 'weovm6S_B_4',
                instructor: 'Soil Scientist',
                tags: ['soil', 'health', 'fertilizer', 'management', 'productivity'],
                featured: true
            },
            {
                id: 4,
                title: 'Water Conservation and Irrigation Techniques',
                description: 'Efficient water management strategies including drip irrigation, rainwater harvesting, and conservation methods.',
                category: 'water',
                difficulty: 'intermediate',
                duration: '25:12',
                views: '93.2K',
                rating: 4.8,
                youtubeId: 'KOleUb6djXQ',
                instructor: 'Water Management Expert',
                tags: ['water', 'conservation', 'irrigation', 'drip', 'harvesting'],
                featured: true
            },
            
            // Additional Educational Videos
            {
                id: 5,
                title: 'Introduction to Organic Farming',
                description: 'Learn the fundamental principles of organic agriculture and why it matters for our future.',
                category: 'basics',
                difficulty: 'beginner',
                duration: '18:32',
                views: '45.2K',
                rating: 4.6,
                youtubeId: 'jgCgDEHfKWE',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['organic', 'farming', 'introduction', 'basics', 'principles']
            },
            {
                id: 6,
                title: 'Organic Farming Methods',
                description: 'Discover traditional and modern organic farming techniques that improve soil health.',
                category: 'basics',
                difficulty: 'beginner',
                duration: '22:18',
                views: '38.7K',
                rating: 4.9,
                youtubeId: '6RlxySFrkIM',
                instructor: 'Priya Sharma',
                tags: ['organic', 'methods', 'soil-health', 'natural', 'techniques']
            },
            {
                id: 7,
                title: 'Permaculture Design Principles',
                description: 'Understanding permaculture and how to design sustainable agricultural systems.',
                category: 'basics',
                difficulty: 'intermediate',
                duration: '28:45',
                views: '29.1K',
                rating: 4.7,
                youtubeId: 'hftgE2yXKYI',
                instructor: 'Amit Patel',
                tags: ['permaculture', 'design', 'systems', 'sustainable', 'principles']
            },
            
            // Crop Management
            {
                id: 8,
                title: 'Crop Rotation Techniques',
                description: 'Master the art of crop rotation to maximize yield and soil health.',
                category: 'crops',
                difficulty: 'intermediate',
                duration: '19:23',
                views: '52.3K',
                rating: 4.8,
                youtubeId: 'CjdDRyiTW1o',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['rotation', 'crops', 'soil', 'yield', 'planning']
            },
            {
                id: 9,
                title: 'Companion Planting Guide',
                description: 'Learn which plants grow well together and boost each other\'s growth.',
                category: 'crops',
                difficulty: 'beginner',
                duration: '16:17',
                views: '41.8K',
                rating: 4.6,
                youtubeId: 'VlYdH7_zumg',
                instructor: 'Priya Sharma',
                tags: ['companion', 'planting', 'growth', 'natural', 'symbiosis']
            },
            {
                id: 10,
                title: 'Seed Starting and Transplanting',
                description: 'Perfect techniques for starting seeds indoors and transplanting seedlings.',
                category: 'crops',
                difficulty: 'beginner',
                duration: '21:34',
                views: '36.9K',
                rating: 4.7,
                youtubeId: '8VqKjjqL5iU',
                instructor: 'Amit Patel',
                tags: ['seeds', 'transplanting', 'seedlings', 'techniques', 'indoor']
            },

            // Pest Control
            {
                id: 11,
                title: 'Natural Pest Control Methods',
                description: 'Chemical-free ways to protect your crops from pests and diseases.',
                category: 'pest-control',
                difficulty: 'intermediate',
                duration: '24:12',
                views: '48.5K',
                rating: 4.9,
                youtubeId: 'Rg_VhZGJKdE',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['pest-control', 'natural', 'organic', 'protection', 'chemical-free']
            },
            {
                id: 12,
                title: 'Beneficial Insects in Agriculture',
                description: 'How to attract and maintain beneficial insects that help control pests.',
                category: 'pest-control',
                difficulty: 'intermediate',
                duration: '18:48',
                views: '33.2K',
                rating: 4.8,
                youtubeId: 'aFaJm0mWF0w',
                instructor: 'Priya Sharma',
                tags: ['beneficial', 'insects', 'biological', 'control', 'ecosystem']
            },
            {
                id: 13,
                title: 'Homemade Organic Pesticides',
                description: 'DIY recipes for effective organic pesticides using kitchen ingredients.',
                category: 'pest-control',
                difficulty: 'beginner',
                duration: '14:26',
                views: '61.7K',
                rating: 4.7,
                youtubeId: 'FBr-qgKj7wI',
                instructor: 'Amit Patel',
                tags: ['homemade', 'organic', 'diy', 'pesticides', 'kitchen']
            },

            // Soil Health (including your featured video)
            {
                id: 14,
                title: 'Soil Testing and Analysis',
                description: 'Understanding soil composition and how to test for nutrients and pH levels.',
                category: 'soil',
                difficulty: 'intermediate',
                duration: '26:33',
                views: '42.1K',
                rating: 4.8,
                youtubeId: 'MJTGwjehkVE',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['soil', 'testing', 'analysis', 'nutrients', 'ph']
            },
            {
                id: 15,
                title: 'Composting Made Easy',
                description: 'Step-by-step guide to creating nutrient-rich compost for your garden.',
                category: 'soil',
                difficulty: 'beginner',
                duration: '20:15',
                views: '67.4K',
                rating: 4.9,
                youtubeId: '8bH4PsPSFRA',
                instructor: 'Priya Sharma',
                tags: ['composting', 'organic', 'nutrients', 'waste', 'recycling']
            },

            // Water Management (including your featured video)
            {
                id: 16,
                title: 'Drip Irrigation Systems',
                description: 'Installing and maintaining efficient drip irrigation for water conservation.',
                category: 'water',
                difficulty: 'intermediate',
                duration: '31:17',
                views: '58.3K',
                rating: 4.8,
                youtubeId: 'JoVn9LtN8Cg',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['irrigation', 'water', 'conservation', 'efficiency', 'drip']
            },
            {
                id: 17,
                title: 'Rainwater Harvesting Techniques',
                description: 'Collecting and storing rainwater for agricultural use.',
                category: 'water',
                difficulty: 'beginner',
                duration: '17:29',
                views: '44.6K',
                rating: 4.7,
                youtubeId: 'vWJSxlj_xeE',
                instructor: 'Priya Sharma',
                tags: ['rainwater', 'harvesting', 'storage', 'conservation', 'collection']
            },
            {
                id: 18,
                title: 'Mulching for Water Retention',
                description: 'Using organic mulches to conserve water and suppress weeds.',
                category: 'water',
                difficulty: 'beginner',
                duration: '12:55',
                views: '39.2K',
                rating: 4.6,
                youtubeId: 'H8Ry4V7VTLQ',
                instructor: 'Amit Patel',
                tags: ['mulching', 'water-retention', 'organic', 'weeds', 'conservation']
            },

            // Farm Technology
            {
                id: 19,
                title: 'Smart Sensors in Agriculture',
                description: 'Using IoT sensors to monitor soil moisture, temperature, and crop health.',
                category: 'technology',
                difficulty: 'advanced',
                duration: '35:22',
                views: '28.9K',
                rating: 4.9,
                youtubeId: 'q8LaT5Iiwo4',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['sensors', 'iot', 'monitoring', 'smart-farming', 'technology']
            },
            {
                id: 20,
                title: 'GPS and Precision Agriculture',
                description: 'Leveraging GPS technology for precise planting and resource management.',
                category: 'technology',
                difficulty: 'advanced',
                duration: '29:14',
                views: '22.7K',
                rating: 4.7,
                youtubeId: 'WJ5-m6-2aYk',
                instructor: 'Priya Sharma',
                tags: ['gps', 'precision', 'technology', 'management', 'planting']
            },
            {
                id: 21,
                title: 'Automated Irrigation Control',
                description: 'Setting up automated irrigation systems with timers and sensors.',
                category: 'technology',
                difficulty: 'intermediate',
                duration: '27:38',
                views: '34.1K',
                rating: 4.8,
                youtubeId: 'AE5CTKj_Qcc',
                instructor: 'Amit Patel',
                tags: ['automation', 'irrigation', 'control', 'sensors', 'timers']
            },

            // Advanced Topics
            {
                id: 22,
                title: 'Vertical Farming Basics',
                description: 'Introduction to vertical farming and growing more in less space.',
                category: 'basics',
                difficulty: 'intermediate',
                duration: '25:47',
                views: '71.3K',
                rating: 4.9,
                youtubeId: 'OmhqGNEME34',
                instructor: 'Dr. Rajesh Kumar',
                tags: ['vertical', 'farming', 'space', 'urban', 'innovation']
            },
            {
                id: 23,
                title: 'Hydroponics for Beginners',
                description: 'Getting started with soilless farming using hydroponic systems.',
                category: 'technology',
                difficulty: 'intermediate',
                duration: '33:12',
                views: '49.8K',
                rating: 4.8,
                youtubeId: 'YLTIbOCKKXw',
                instructor: 'Priya Sharma',
                tags: ['hydroponics', 'soilless', 'systems', 'beginner', 'nutrients']
            },
            {
                id: 24,
                title: 'Climate-Smart Agriculture',
                description: 'Adapting farming practices to climate change challenges.',
                category: 'basics',
                difficulty: 'advanced',
                duration: '38:51',
                views: '31.5K',
                rating: 4.7,
                youtubeId: '9pKC-JRJIJg',
                instructor: 'Amit Patel',
                tags: ['climate', 'adaptation', 'smart', 'resilience', 'sustainability']
            }
        ];
    }

    loadUserProgress() {
        return {
            videosWatched: parseInt(localStorage.getItem('videosWatched')) || 24,
            learningTime: parseFloat(localStorage.getItem('learningTime')) || 12.5,
            certificates: parseInt(localStorage.getItem('certificates')) || 3,
            skillLevel: parseInt(localStorage.getItem('skillLevel')) || 65,
            categoryProgress: JSON.parse(localStorage.getItem('categoryProgress')) || {
                basics: 60,
                crops: 40,
                'pest-control': 75,
                soil: 30,
                water: 55,
                technology: 20
            }
        };
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

        // Search functionality
        const searchInput = document.getElementById('video-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchVideos(e.target.value);
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                e.target.classList.add('active');
                e.target.setAttribute('aria-pressed', 'true');
                this.currentFilter = e.target.dataset.filter;
                this.filterVideos();
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                }
            });
        });

        // Video modal
        const videoModal = document.getElementById('video-modal');
        const videoClose = document.getElementById('video-close');
        
        if (videoClose) {
            videoClose.addEventListener('click', () => {
                this.closeVideoModal();
            });
        }

        // Close modal when clicking outside
        if (videoModal) {
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    this.closeVideoModal();
                }
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) {
                document.getElementById('language-dropdown')?.classList.remove('active');
                document.getElementById('language-btn')?.setAttribute('aria-expanded', 'false');
            }
        });
    }

    loadInitialContent() {
        this.loadVideos();
        this.loadLearningActivity();
        this.updateProgressStats();
        this.updateCategoryProgress();
        this.updateHeroVideo();
    }

    updateHeroVideo() {
        // Update hero section with first featured video
        const featuredVideo = this.videos.find(v => v.featured) || this.videos[0];
        const heroVideoPreview = document.querySelector('.hero-video-preview iframe');
        
        if (heroVideoPreview && featuredVideo) {
            heroVideoPreview.src = `https://www.youtube.com/embed/${featuredVideo.youtubeId}`;
            heroVideoPreview.title = featuredVideo.title;
        }
    }

    loadVideos() {
        const videosGrid = document.getElementById('videos-grid');
        if (!videosGrid) return;

        let filteredVideos = this.getFilteredVideos();
        const videosToShow = filteredVideos.slice(0, this.videosPerLoad);

        videosGrid.innerHTML = videosToShow.map((video, index) => `
            <div class="video-card animate-fadeInUp ${video.featured ? 'featured-video' : ''}" 
                 onclick="learningHub.openVideoModal(${video.id})" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="video-thumbnail">
                    <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                            title="${video.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                    <div class="video-duration">${video.duration}</div>
                    <div class="video-difficulty ${video.difficulty}">${video.difficulty}</div>
                    ${video.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                    <div class="video-instructor">
                        <i class="fas fa-user-graduate"></i>
                        <span>${video.instructor}</span>
                    </div>
                    <div class="video-meta">
                        <div class="video-views">
                            <i class="fas fa-eye"></i>
                            <span>${video.views} views</span>
                        </div>
                        <div class="video-rating">
                            <i class="fas fa-star"></i>
                            <span>${video.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Update load more button visibility
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filteredVideos.length > this.videosPerLoad ? 'block' : 'none';
        }

        this.currentVideoIndex = videosToShow.length;
    }

    loadMoreVideos() {
        const videosGrid = document.getElementById('videos-grid');
        if (!videosGrid) return;

        let filteredVideos = this.getFilteredVideos();
        const videosToShow = filteredVideos.slice(this.currentVideoIndex, this.currentVideoIndex + this.videosPerLoad);

        if (videosToShow.length === 0) return;

        const newVideosHTML = videosToShow.map((video, index) => `
            <div class="video-card animate-fadeInUp ${video.featured ? 'featured-video' : ''}" 
                 onclick="learningHub.openVideoModal(${video.id})" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="video-thumbnail">
                    <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                            title="${video.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                    <div class="video-duration">${video.duration}</div>
                    <div class="video-difficulty ${video.difficulty}">${video.difficulty}</div>
                    ${video.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                    <div class="video-instructor">
                        <i class="fas fa-user-graduate"></i>
                        <span>${video.instructor}</span>
                    </div>
                    <div class="video-meta">
                        <div class="video-views">
                            <i class="fas fa-eye"></i>
                            <span>${video.views} views</span>
                        </div>
                        <div class="video-rating">
                            <i class="fas fa-star"></i>
                            <span>${video.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        videosGrid.insertAdjacentHTML('beforeend', newVideosHTML);
        this.currentVideoIndex += videosToShow.length;

        // Hide load more button if no more videos
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn && this.currentVideoIndex >= filteredVideos.length) {
            loadMoreBtn.style.display = 'none';
        }

        this.showNotification('More videos loaded!', 'success');
    }

    getFilteredVideos() {
        let filtered = this.videos;

        // Filter by difficulty/type
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'trending') {
                filtered = filtered.sort((a, b) => parseFloat(b.views.replace('K', '')) - parseFloat(a.views.replace('K', '')));
            } else {
                filtered = filtered.filter(video => video.difficulty === this.currentFilter);
            }
        }

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(video => video.category === this.currentCategory);
        }

        // Show featured videos first
        return filtered.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
    }

    searchVideos(query) {
        if (query.length < 2) {
            this.currentVideoIndex = 0;
            this.loadVideos();
            return;
        }

        const videosGrid = document.getElementById('videos-grid');
        if (!videosGrid) return;

        const searchResults = this.videos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase()) ||
            video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            video.instructor.toLowerCase().includes(query.toLowerCase())
        );

        videosGrid.innerHTML = searchResults.map((video, index) => `
            <div class="video-card animate-fadeInUp ${video.featured ? 'featured-video' : ''}" 
                 onclick="learningHub.openVideoModal(${video.id})" 
                 style="animation-delay: ${index * 0.1}s">
                <div class="video-thumbnail">
                    <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                            title="${video.title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                    <div class="video-duration">${video.duration}</div>
                    <div class="video-difficulty ${video.difficulty}">${video.difficulty}</div>
                    ${video.featured ? '<div class="featured-badge">FEATURED</div>' : ''}
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                    <div class="video-instructor">
                        <i class="fas fa-user-graduate"></i>
                        <span>${video.instructor}</span>
                    </div>
                    <div class="video-meta">
                        <div class="video-views">
                            <i class="fas fa-eye"></i>
                            <span>${video.views} views</span>
                        </div>
                        <div class="video-rating">
                            <i class="fas fa-star"></i>
                            <span>${video.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Hide load more button during search
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }

        if (searchResults.length === 0) {
            videosGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--gray-600); margin-bottom: 0.5rem;">No videos found</h3>
                    <p style="color: var(--gray-500);">Try different keywords or browse by category</p>
                </div>
            `;
        } else {
            this.showNotification(`Found ${searchResults.length} videos`, 'info');
        }
    }

    filterVideos() {
        this.currentVideoIndex = 0;
        this.loadVideos();
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.currentVideoIndex = 0;
        this.loadVideos();
        
        // Scroll to videos section
        const videosSection = document.querySelector('.featured-videos-section');
        if (videosSection) {
            videosSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        const categoryNames = {
            'basics': 'Farming Basics',
            'crops': 'Crop Management',
            'pest-control': 'Pest Control',
            'soil': 'Soil Health',
            'water': 'Water Management',
            'technology': 'Farm Technology'
        };
        
        this.showNotification(`Showing ${categoryNames[category] || category} videos`, 'info');
    }

    openVideoModal(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (!video) return;

        const modal = document.getElementById('video-modal');
        const videoContainer = document.getElementById('video-container');
        const videoInfo = document.getElementById('video-info');

        if (!modal || !videoContainer || !videoInfo) return;

        // Set video content
        videoContainer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;

        // Set video info
        videoInfo.innerHTML = `
            <div class="video-modal-header">
                <h2>${video.title}</h2>
                <div class="video-modal-meta">
                    <span class="video-difficulty ${video.difficulty}">${video.difficulty.toUpperCase()}</span>
                    <span class="video-category">${video.category.replace('-', ' ').toUpperCase()}</span>
                    <span class="video-duration"><i class="fas fa-clock"></i> ${video.duration}</span>
                    ${video.featured ? '<span class="featured-tag">FEATURED</span>' : ''}
                </div>
            </div>
            <div class="video-modal-description">
                <p>${video.description}</p>
                <div class="video-modal-instructor">
                    <i class="fas fa-user-graduate"></i>
                    <strong>Instructor:</strong> ${video.instructor}
                </div>
                <div class="video-modal-stats">
                    <span><i class="fas fa-eye"></i> ${video.views} views</span>
                    <span><i class="fas fa-star"></i> ${video.rating} rating</span>
                </div>
                <div class="video-modal-tags">
                    ${video.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <div class="video-modal-actions">
                <button class="action-btn primary" onclick="learningHub.markAsWatched(${video.id})">
                    <i class="fas fa-check"></i>
                    Mark as Watched
                </button>
                <button class="action-btn secondary" onclick="learningHub.addToFavorites(${video.id})">
                    <i class="fas fa-heart"></i>
                    Add to Favorites
                </button>
                <button class="action-btn secondary" onclick="learningHub.shareVideo(${video.id})">
                    <i class="fas fa-share"></i>
                    Share
                </button>
                <button class="action-btn secondary" onclick="window.open('https://youtube.com/watch?v=${video.youtubeId}', '_blank')">
                    <i class="fab fa-youtube"></i>
                    Watch on YouTube
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Track video view
        this.trackVideoView(video.id);
    }

    closeVideoModal() {
        const modal = document.getElementById('video-modal');
        const videoContainer = document.getElementById('video-container');
        
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Stop video playback
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }
    }

    markAsWatched(videoId) {
        if (!this.watchedVideos.includes(videoId)) {
            this.watchedVideos.push(videoId);
            localStorage.setItem('watchedVideos', JSON.stringify(this.watchedVideos));
            
            // Update progress
            this.userProgress.videosWatched++;
            this.userProgress.learningTime += 0.5; // Assume 30 minutes average
            localStorage.setItem('videosWatched', this.userProgress.videosWatched);
            localStorage.setItem('learningTime', this.userProgress.learningTime);
            
            this.updateProgressStats();
            this.addLearningActivity(`Completed: ${this.videos.find(v => v.id === videoId)?.title}`);
            this.showNotification('Video marked as watched! +50 XP earned', 'success');
        } else {
            this.showNotification('Already marked as watched', 'info');
        }
    }

    addToFavorites(videoId) {
        const favorites = JSON.parse(localStorage.getItem('favoriteVideos')) || [];
        if (!favorites.includes(videoId)) {
            favorites.push(videoId);
            localStorage.setItem('favoriteVideos', JSON.stringify(favorites));
            this.showNotification('Added to favorites!', 'success');
        } else {
            this.showNotification('Already in favorites', 'info');
        }
    }

    shareVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId);
        if (video && navigator.share) {
            navigator.share({
                title: video.title,
                text: video.description,
                url: `https://youtube.com/watch?v=${video.youtubeId}`
            });
        } else {
            // Fallback to copying URL
            const url = `https://youtube.com/watch?v=${video.youtubeId}`;
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Video URL copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Share feature not available', 'info');
            });
        }
    }

    trackVideoView(videoId) {
        // Track video views for analytics
        const viewedVideos = JSON.parse(localStorage.getItem('viewedVideos')) || {};
        viewedVideos[videoId] = (viewedVideos[videoId] || 0) + 1;
        localStorage.setItem('viewedVideos', JSON.stringify(viewedVideos));
    }

    loadLearningActivity() {
        this.learningActivities = [
            {
                icon: 'play',
                title: 'Watched: Modern Sustainable Farming',
                desc: 'Completed featured video on sustainable practices',
                time: '1 hour ago'
            },
            {
                icon: 'star',
                title: 'Rated: Water Conservation Techniques',
                desc: 'Gave 5 stars to irrigation management video',
                time: '2 hours ago'
            },
            {
                icon: 'certificate',
                title: 'Earned Certificate',
                desc: 'Sustainable Farming Basics certification earned',
                time: '1 day ago'
            },
            {
                icon: 'bookmark',
                title: 'Bookmarked: Soil Health Management',
                desc: 'Saved fertilizer video for later viewing',
                time: '2 days ago'
            },
            {
                icon: 'comments',
                title: 'Left Comment',
                desc: 'Shared experience on crop management video',
                time: '3 days ago'
            }
        ];

        const activityList = document.getElementById('learning-activity');
        if (activityList) {
            activityList.innerHTML = this.learningActivities.map(activity => `
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

    addLearningActivity(title, description = '') {
        const newActivity = {
            icon: 'check-circle',
            title: title,
            desc: description || 'Learning progress updated',
            time: 'Just now'
        };

        this.learningActivities.unshift(newActivity);
        if (this.learningActivities.length > 10) {
            this.learningActivities = this.learningActivities.slice(0, 10);
        }

        this.loadLearningActivity();
    }

    updateProgressStats() {
        // Update progress statistics displays
        const statsMapping = {
            'videos-watched': this.userProgress.videosWatched,
            'learning-time': this.userProgress.learningTime + 'h',
            'certificates': this.userProgress.certificates,
            'skill-level': this.userProgress.skillLevel + '%'
        };

        Object.entries(statsMapping).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateCategoryProgress() {
        // Update category progress bars
        Object.entries(this.userProgress.categoryProgress).forEach(([category, progress]) => {
            const categoryCard = document.querySelector(`[data-category="${category}"]`);
            if (categoryCard) {
                const progressBar = categoryCard.querySelector('.progress-bar');
                const progressText = categoryCard.querySelector('.category-progress span');
                
                if (progressBar) {
                    progressBar.style.setProperty('--width', progress + '%');
                }
                if (progressText) {
                    progressText.textContent = progress + '% Complete';
                }
            }
        });
    }

    setupAnimations() {
        // Add stagger animation to cards
        const cards = document.querySelectorAll('.category-card, .video-card, .instructor-card');
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

    // Utility methods
    scrollToCategories() {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    playFeaturedVideo() {
        // Play the first featured video
        const featuredVideo = this.videos.find(v => v.featured);
        if (featuredVideo) {
            this.openVideoModal(featuredVideo.id);
        }
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('learningLanguage', lang);
        this.applyLanguage();
        
        // Trigger language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
        
        this.showNotification('Language updated!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `learning-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            z-index: 10001;
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

// Initialize Learning Hub when DOM is loaded
let learningHub;

document.addEventListener('DOMContentLoaded', () => {
    learningHub = new LearningHub();
    
    // Make it globally accessible
    window.learningHub = learningHub;
    
    console.log('🎓 Krishi Setu Learning Hub ready!');
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningHub;
}

// Additional styles for featured videos and enhanced modal
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .featured-video {
        border: 2px solid var(--primary-green);
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
    }

    .featured-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary-green);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .video-instructor {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        color: var(--gray-600);
        font-size: 0.85rem;
    }

    .video-instructor i {
        color: var(--primary-green);
    }

    .featured-tag {
        background: var(--primary-green);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .video-modal-header {
        margin-bottom: 1.5rem;
    }

    .video-modal-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--gray-900);
        margin-bottom: 1rem;
    }

    .video-modal-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .video-modal-meta .video-difficulty {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .video-modal-meta .video-category {
        background: var(--gray-200);
        color: var(--gray-700);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .video-modal-meta .video-duration {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--gray-600);
        font-size: 0.9rem;
    }

    .video-modal-description {
        margin-bottom: 2rem;
    }

    .video-modal-description p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    .video-modal-instructor {
        margin: 1rem 0;
        font-size: 0.95rem;
        color: var(--gray-700);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .video-modal-instructor i {
        color: var(--primary-green);
    }

    .video-modal-stats {
        display: flex;
        gap: 2rem;
        margin: 1rem 0;
        font-size: 0.9rem;
        color: var(--gray-600);
    }

    .video-modal-tags {
        margin: 1rem 0;
    }

    .tag {
        display: inline-block;
        background: var(--primary-green);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        margin: 2px 4px 2px 0;
    }

    .video-modal-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .action-btn.primary {
        background: var(--primary-green);
        color: white;
    }

    .action-btn.secondary {
        background: var(--gray-200);
        color: var(--gray-700);
    }

    .action-btn:hover {
        transform: translateY(-2px);
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .video-modal-actions {
            flex-direction: column;
        }
        
        .action-btn {
            justify-content: center;
        }
    }
`;
document.head.appendChild(enhancedStyles);
