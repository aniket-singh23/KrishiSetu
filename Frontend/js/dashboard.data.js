window.DASHBOARD_DATA = {
    defaults: {
        user: {
            name: 'John Farmer',
            level: 5,
            xp: 650,
            coins: 1540,
            avatar: 'assets/images/user-avatar.png'
        },
        gameStats: {
            gamesPlayed: 12,
            totalScore: 850,
            winStreak: 5,
            accuracy: 76,
            virtualFarmeryHighScore: 3890,
            pickOddOutHighScore: 2650
        }
    },
    quickStats: {
        questsCompleted: 7,
        streak: 12,
        harvest: '2.4kg',
        sustainabilityScore: 8.7,
        cropsPlanted: 127,
        achievements: 23
    },
    notifications: [
        {
            id: 1,
            title: 'Daily Quest Available',
            message: 'New daily quest: Water 10 plants',
            time: '5 min ago',
            type: 'quest',
            unread: true
        },
        {
            id: 2,
            title: 'Weather Alert',
            message: 'Rain expected tomorrow, adjust watering schedule',
            time: '1 hour ago',
            type: 'weather',
            unread: true
        },
        {
            id: 3,
            title: 'Achievement Unlocked',
            message: 'You earned "Green Thumb" badge!',
            time: '2 hours ago',
            type: 'achievement',
            unread: false
        },
        {
            id: 4,
            title: 'Game High Score',
            message: 'New high score in Virtual Farmery!',
            time: '3 hours ago',
            type: 'game',
            unread: true
        },
        {
            id: 5,
            title: 'Marketplace Update',
            message: 'New organic seeds available in marketplace',
            time: '4 hours ago',
            type: 'marketplace',
            unread: false
        }
    ],
    recentActivities: [
        {
            icon: 'seedling',
            title: 'Planted Tomato Seeds',
            desc: 'Successfully planted 25 tomato seeds in sector A',
            time: '2 hours ago'
        },
        {
            icon: 'gamepad',
            title: 'Completed Virtual Farmery',
            desc: 'Achieved high score in farm simulation game',
            time: '3 hours ago'
        },
        {
            icon: 'tint',
            title: 'Watering Completed',
            desc: 'Irrigated crops in sectors B and C',
            time: '4 hours ago'
        },
        {
            icon: 'brain',
            title: 'Solved Pick Odd Out',
            desc: 'Correctly identified farming tools quiz',
            time: '5 hours ago'
        },
        {
            icon: 'award',
            title: 'Quest Completed',
            desc: 'Completed daily quest: Organic Fertilizer Application',
            time: '6 hours ago'
        }
    ],
    quests: [
        {
            id: 1,
            title: 'Water Conservation Challenge',
            description: 'Implement drip irrigation system to save water and improve crop efficiency',
            type: 'daily',
            reward: 50,
            progress: 75,
            status: 'active',
            timeLeft: '2h 30m'
        },
        {
            id: 2,
            title: 'Organic Composting',
            description: 'Create compost from kitchen waste and farm residues to enrich soil naturally',
            type: 'weekly',
            reward: 150,
            progress: 40,
            status: 'active',
            timeLeft: '3 days'
        },
        {
            id: 3,
            title: 'Pest Management',
            description: 'Use natural pest control methods for 1 week to protect crops sustainably',
            type: 'special',
            reward: 200,
            progress: 100,
            status: 'completed',
            timeLeft: 'Completed'
        },
        {
            id: 4,
            title: 'Soil Health Assessment',
            description: 'Test soil pH and nutrient levels to optimize crop growth conditions',
            type: 'daily',
            reward: 75,
            progress: 20,
            status: 'active',
            timeLeft: '1h 15m'
        },
        {
            id: 5,
            title: 'Game Master Challenge',
            description: 'Play both Virtual Farmery and Pick Odd Out games to completion',
            type: 'special',
            reward: 300,
            progress: 60,
            status: 'active',
            timeLeft: '2 days'
        },
        {
            id: 6,
            title: 'Crop Rotation Planning',
            description: "Plan next season's crop rotation for better soil health and yield",
            type: 'weekly',
            reward: 120,
            progress: 0,
            status: 'pending',
            timeLeft: '5 days'
        }
    ],
    farmData: {
        crops: [
            { name: 'Tomatoes', icon: '🍅', status: 'Growing (75%)', health: 'Excellent', daysLeft: 15 },
            { name: 'Carrots', icon: '🥕', status: 'Ready to Harvest', health: 'Good', daysLeft: 0 },
            { name: 'Lettuce', icon: '🥬', status: 'Growing (45%)', health: 'Excellent', daysLeft: 25 },
            { name: 'Peppers', icon: '🌶️', status: 'Flowering', health: 'Good', daysLeft: 20 },
            { name: 'Cucumber', icon: '🥒', status: 'Growing (60%)', health: 'Excellent', daysLeft: 18 },
            { name: 'Herbs', icon: '🌿', status: 'Ready to Harvest', health: 'Excellent', daysLeft: 0 }
        ],
        livestock: [
            { name: 'Chickens', icon: '🐔', count: 12, status: 'Healthy', production: '8-10 eggs/day' },
            { name: 'Goats', icon: '🐐', count: 3, status: 'Healthy', production: '6L milk/day' },
            { name: 'Bees', icon: '🐝', count: 2, status: 'Active Hives', production: '5kg honey/month' }
        ],
        tools: [
            { name: 'Tractor', icon: '🚜', status: 'Working', condition: 'Good', lastMaintenance: '2 weeks ago' },
            { name: 'Irrigation System', icon: '💧', status: 'Active', condition: 'Excellent', coverage: '85%' },
            { name: 'Greenhouse', icon: '🏠', status: 'Operational', condition: 'Good', temperature: '22°C' },
            { name: 'Compost Bin', icon: '♻️', status: 'Full', condition: 'Excellent', readyIn: '1 week' }
        ]
    },
    progressData: {
        achievements: [
            { id: 1, name: 'Green Thumb', desc: 'Planted 100 seeds', icon: '🌱', date: '2 days ago', rarity: 'common' },
            { id: 2, name: 'Water Saver', desc: 'Saved 1000L water', icon: '💧', date: '1 week ago', rarity: 'rare' },
            { id: 3, name: 'Game Master', desc: 'Won 10 games in a row', icon: '🎮', date: '1 week ago', rarity: 'epic' },
            { id: 4, name: 'Organic Master', desc: 'Used only organic methods for 30 days', icon: '🌿', date: '2 weeks ago', rarity: 'epic' },
            { id: 5, name: 'Quiz Champion', desc: 'Perfect score in Pick Odd Out', icon: '🧩', date: '2 weeks ago', rarity: 'rare' },
            { id: 6, name: 'Harvest King', desc: 'Harvested 50kg of crops', icon: '👑', date: '3 weeks ago', rarity: 'legendary' }
        ],
        goals: [
            { title: 'Harvest 10kg vegetables', desc: "This month's target", progress: 65, target: 10, current: 6.5 },
            { title: 'Complete 30 daily quests', desc: 'Quest master challenge', progress: 80, target: 30, current: 24 },
            { title: 'Win 20 games', desc: 'Gaming achievement goal', progress: 60, target: 20, current: 12 },
            { title: 'Achieve 9.0 sustainability score', desc: 'Environmental goal', progress: 45, target: 9.0, current: 8.1 },
            { title: 'Plant 50 trees', desc: 'Reforestation project', progress: 30, target: 50, current: 15 }
        ]
    },
    products: [
        {
            id: 1,
            title: 'Organic Tomato Seeds',
            description: 'High-yield, disease-resistant tomato seeds perfect for sustainable farming',
            price: 299,
            rating: 4.8,
            reviews: 124,
            category: 'seeds',
            image: '🍅',
            seller: 'Green Seeds Co.',
            inStock: true
        },
        {
            id: 2,
            title: 'Drip Irrigation Kit',
            description: 'Complete drip irrigation system for 1 acre - save water and increase yield',
            price: 15999,
            rating: 4.6,
            reviews: 87,
            category: 'equipment',
            image: '💧',
            seller: 'AgriTech Solutions',
            inStock: true
        },
        {
            id: 3,
            title: 'Gaming Tablet for Farming',
            description: 'Educational gaming device loaded with farming simulation games',
            price: 12999,
            rating: 4.9,
            reviews: 67,
            category: 'tools',
            image: '📱',
            seller: 'EduTech Farm',
            inStock: true
        },
        {
            id: 4,
            title: 'Organic Fertilizer',
            description: 'Natural compost-based fertilizer for healthy soil and plants',
            price: 899,
            rating: 4.9,
            reviews: 203,
            category: 'fertilizers',
            image: '🌱',
            seller: 'EcoGrow',
            inStock: true
        },
        {
            id: 5,
            title: 'Smart Soil Tester',
            description: 'Digital pH and nutrient meter for precise soil analysis',
            price: 2499,
            rating: 4.7,
            reviews: 156,
            category: 'tools',
            image: '📊',
            seller: 'FarmTech India',
            inStock: false
        },
        {
            id: 6,
            title: 'Solar Water Pump',
            description: 'Eco-friendly solar-powered water pump for irrigation',
            price: 25999,
            rating: 4.4,
            reviews: 45,
            category: 'equipment',
            image: '☀️',
            seller: 'Solar Farm Solutions',
            inStock: true
        }
    ],
    userListings: [
        { id: 1, title: 'Fresh Organic Tomatoes', price: 80, status: 'Active', views: 45, image: '🍅' },
        { id: 2, title: 'Homemade Compost', price: 150, status: 'Sold', views: 23, image: '♻️' },
        { id: 3, title: 'Gaming Tips eBook', price: 199, status: 'Active', views: 18, image: '📖' },
        { id: 4, title: 'Cucumber Harvest', price: 60, status: 'Active', views: 12, image: '🥒' }
    ],
    leaderboards: {
        'virtual-farmery': [
            { rank: 1, name: 'FarmMaster2024', score: 4580 },
            { rank: 2, name: 'GreenThumb', score: 4320 },
            { rank: 3, name: 'CropKing', score: 4150 },
            { rank: 4, name: 'You', score: 0 },
            { rank: 5, name: 'PlantLover', score: 3760 },
            { rank: 6, name: 'SoilSaver', score: 3650 },
            { rank: 7, name: 'HarvestHero', score: 3540 },
            { rank: 8, name: 'OrganicPro', score: 3420 },
            { rank: 9, name: 'SeedMaster', score: 3310 },
            { rank: 10, name: 'WaterWise', score: 3200 }
        ],
        'pick-odd-out': [
            { rank: 1, name: 'QuizMaster', score: 2850 },
            { rank: 2, name: 'BrainFarmer', score: 2720 },
            { rank: 3, name: 'You', score: 0 },
            { rank: 4, name: 'SmartGrower', score: 2580 },
            { rank: 5, name: 'LogicFarm', score: 2490 },
            { rank: 6, name: 'PuzzlePro', score: 2380 },
            { rank: 7, name: 'ThinkFast', score: 2270 },
            { rank: 8, name: 'CropGenius', score: 2160 },
            { rank: 9, name: 'FarmBrain', score: 2050 },
            { rank: 10, name: 'AgriQuiz', score: 1940 }
        ]
    }
};
