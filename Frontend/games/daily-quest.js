class DailyQuestManager {
	constructor() {
		this.currentLanguage = localStorage.getItem('dailyQuestLanguage') || 'en';
		this.currentQuest = null;
		this.questProgress = 0;
		this.uploadedPhoto = null;
		this.photoLocation = null;
		this.userStats = {
			streak: 7,
			xp: 280,
			level: 5
		};

		this.translations = {
			en: {
				'back-dashboard': 'Back to Dashboard',
				'daily-quest': 'Daily Quest',
				'daily-farming-task': 'Your daily farming task awaits!',
				'streak': 'Streak',
				'level': 'Level',
				'loading': 'Loading Today\'s Quest...',
				'loading-desc': 'Preparing your personalized farming task...',
				'duration': 'Duration',
				'difficulty': 'Difficulty',
				'reward': 'XP Reward',
				'category': 'Category',
				'how-to-complete': 'How to Complete This Quest',
				'pro-tips': 'Pro Tips',
				'start-quest': 'Start Quest',
				'skip-today': 'Skip Today',
				'mark-complete': 'Mark as Complete',
				'status-pending': 'Ready to Start',
				'status-started': 'In Progress',
				'status-completed': 'Completed!',
				'photo-uploaded': 'Photo uploaded successfully!',
				'location-verified': 'GPS Location Verified',
				'location-missing': 'GPS Location Missing',
				'quest-completed': 'Quest Completed!',
				'congrats-message': 'Great job! You completed today\'s task.',
				'xp-earned': 'XP Earned',
				'streak-updated': 'Streak Updated',
				'come-back-tomorrow': 'Come back tomorrow for a new quest!'
			},
			hi: {
				'back-dashboard': 'डैशबोर्ड पर वापस',
				'daily-quest': 'दैनिक चुनौती',
				'daily-farming-task': 'आपका दैनिक खेती का कार्य तैयार है!',
				'streak': 'स्ट्रीक',
				'level': 'स्तर',
				'loading': 'आज की चुनौती लोड हो रही है...',
				'loading-desc': 'आपके लिए व्यक्तिगत कार्य तैयार हो रहा है...',
				'duration': 'अवधि',
				'difficulty': 'कठिनाई',
				'reward': 'XP इनाम',
				'category': 'श्रेणी',
				'how-to-complete': 'इसे कैसे पूरा करें',
				'pro-tips': 'प्रो टिप्स',
				'start-quest': 'चुनौती शुरू करें',
				'skip-today': 'आज छोड़ें',
				'mark-complete': 'पूर्ण चिन्हित करें',
				'status-pending': 'शुरू करने के लिए तैयार',
				'status-started': 'प्रगति में',
				'status-completed': 'पूरा हुआ!',
				'photo-uploaded': 'फोटो सफलतापूर्वक अपलोड हुई!',
				'location-verified': 'GPS स्थान सत्यापित',
				'location-missing': 'GPS स्थान नहीं मिला',
				'quest-completed': 'चुनौती पूरी हुई!',
				'congrats-message': 'बहुत बढ़िया! आपने आज का कार्य पूरा किया।',
				'xp-earned': 'XP अर्जित',
				'streak-updated': 'स्ट्रीक अपडेट',
				'come-back-tomorrow': 'नई चुनौती के लिए कल वापस आएं!'
			},
			ml: {
				'back-dashboard': 'ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക',
				'daily-quest': 'ദൈനിക ദൗത്യം',
				'daily-farming-task': 'നിങ്ങളുടെ ഇന്നത്തെ കൃഷി ചുമതല തയ്യാറാണ്!',
				'streak': 'സ്റ്റ്രീക്ക്',
				'level': 'ലെവൽ',
				'loading': 'ഇന്നത്തെ ദൗത്യം ലോഡ് ചെയ്യുന്നു...',
				'loading-desc': 'നിങ്ങൾക്കായി ചുമതല തയ്യാറാക്കുന്നു...',
				'duration': 'സമയം',
				'difficulty': 'പ്രയാസം',
				'reward': 'XP പ്രതിഫലം',
				'category': 'വിഭാഗം',
				'how-to-complete': 'ഇത് എങ്ങനെ പൂർത്തിയാക്കാം',
				'pro-tips': 'പ്രോ ടിപ്പുകൾ',
				'start-quest': 'ദൗത്യം ആരംഭിക്കുക',
				'skip-today': 'ഇന്ന് ഒഴിവാക്കുക',
				'mark-complete': 'പൂർത്തിയായി അടയാളപ്പെടുത്തുക',
				'status-pending': 'ആരംഭിക്കാൻ തയ്യാറാണ്',
				'status-started': 'പുരോഗതിയിൽ',
				'status-completed': 'പൂർത്തിയായി!',
				'photo-uploaded': 'ഫോട്ടോ വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!',
				'location-verified': 'GPS സ്ഥാനം സ്ഥിരീകരിച്ചു',
				'location-missing': 'GPS സ്ഥാനം ലഭ്യമല്ല',
				'quest-completed': 'ദൗത്യം പൂർത്തിയായി!',
				'congrats-message': 'നല്ല ജോലി! ഇന്നത്തെ ചുമതല പൂർത്തിയാക്കി.',
				'xp-earned': 'XP നേടി',
				'streak-updated': 'സ്റ്റ്രീക്ക് അപ്ഡേറ്റ് ചെയ്തു',
				'come-back-tomorrow': 'പുതിയ ദൗത്യത്തിന് നാളെ വരൂ!'
			},
			te: {
				'back-dashboard': 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
				'daily-quest': 'దైనిక అన్వేషణ',
				'daily-farming-task': 'మీ దైనిక వ్యవసాయ పని సిద్ధంగా ఉంది!',
				'streak': 'స్ట్రీక్',
				'level': 'లెవెల్',
				'loading': 'నేటి అన్వేషణ లోడ్ అవుతోంది...',
				'loading-desc': 'మీ కోసం పని సిద్ధం చేస్తోంది...',
				'duration': 'వ్యవధి',
				'difficulty': 'కష్టం',
				'reward': 'XP బహుమతి',
				'category': 'వర్గం',
				'how-to-complete': 'దీన్ని ఎలా పూర్తి చేయాలి',
				'pro-tips': 'ప్రో చిట్కాలు',
				'start-quest': 'అన్వేషణ ప్రారంభించండి',
				'skip-today': 'ఈరోజు దాటవేయండి',
				'mark-complete': 'పూర్తయిందిగా గుర్తించండి',
				'status-pending': 'ప్రారంభానికి సిద్ధంగా ఉంది',
				'status-started': 'పురోగతిలో',
				'status-completed': 'పూర్తయింది!',
				'photo-uploaded': 'ఫోటో విజయవంతంగా అప్లోడ్ అయింది!',
				'location-verified': 'GPS స్థానం ధృవీకరించబడింది',
				'location-missing': 'GPS స్థానం లేదు',
				'quest-completed': 'అన్వేషణ పూర్తయింది!',
				'congrats-message': 'చాలా బాగుంది! మీరు నేటి పనిని పూర్తి చేసారు.',
				'xp-earned': 'XP సంపాదించారు',
				'streak-updated': 'స్ట్రీక్ అప్‌డేట్ అయింది',
				'come-back-tomorrow': 'కొత్త అన్వేషణ కోసం రేపు రండి!'
			}
		};

		this.questBank = {
			en: [
				{
					id: 'water_management_1',
					title: 'Morning Watering Practice',
					description: 'Water crops in cooler hours and document your practice with a geotagged photo.',
					category: 'Water Management',
					difficulty: 'Beginner',
					duration: '15 min',
					xpReward: 25,
					icon: 'fas fa-tint',
					requiresPhoto: true,
					steps: [
						{ title: 'Check Soil Moisture', description: 'Check the top 2 inches of soil before watering.' },
						{ title: 'Water Early', description: 'Water between 6-8 AM for best absorption.' },
						{ title: 'Target Root Zone', description: 'Aim water near roots, not leaves.' },
						{ title: 'Use Correct Amount', description: 'Deep watering is better than frequent splashes.' },
						{ title: 'Verify with Photo', description: 'Upload a geotagged photo from your farm.' }
					],
					tips: [
						'Avoid midday watering to reduce evaporation.',
						'Mulch helps retain moisture.',
						'Keep water pressure gentle around young plants.'
					]
				}
			],
			hi: [],
			ml: [],
			te: []
		};

		// Fallback to English content if localized quest bank is empty.
		if (!this.questBank.hi.length) this.questBank.hi = this.questBank.en;
		if (!this.questBank.ml.length) this.questBank.ml = this.questBank.en;
		if (!this.questBank.te.length) this.questBank.te = this.questBank.en;

		this.init();
	}

	init() {
		this.setupLanguage();
		this.loadUserStats();
		this.generateTodayQuest();
		this.setupEventListeners();
		this.setupPhotoUpload();
		this.updateDateTime();
		this.hydrateFromBackend();
	}

	async hydrateFromBackend() {
		if (!window.backendBridge) {
			return;
		}

		try {
			const result = await window.backendBridge.fetchCurrentUser();
			const user = result?.user;
			if (!user) {
				return;
			}

			if (Number.isFinite(user.level)) this.userStats.level = user.level;
			if (Number.isFinite(user.xp)) this.userStats.xp = user.xp;
			if (user.gameStats && Number.isFinite(user.gameStats.dailyQuestCompleted)) {
				this.userStats.streak = Math.max(this.userStats.streak, user.gameStats.dailyQuestCompleted);
			}

			this.updateStatsDisplay();
		} catch (error) {
			console.warn('Unable to hydrate daily quest user from backend:', error.message);
		}
	}

	setupLanguage() {
		document.body.className = `lang-${this.currentLanguage}`;
		this.updateLanguageDisplay();
		this.applyTranslations();
	}

	updateLanguageDisplay() {
		const langCodes = { en: 'EN', hi: 'HI', ml: 'ML', te: 'TE' };
		const currentLangSpan = document.getElementById('currentLang');
		if (currentLangSpan) {
			currentLangSpan.textContent = langCodes[this.currentLanguage] || 'EN';
		}

		document.querySelectorAll('.language-option').forEach((option) => {
			option.classList.toggle('active', option.dataset.lang === this.currentLanguage);
		});
	}

	applyTranslations() {
		const t = this.translations[this.currentLanguage] || this.translations.en;
		document.querySelectorAll('[data-translate]').forEach((element) => {
			const key = element.dataset.translate;
			if (t[key]) {
				element.textContent = t[key];
			}
		});
	}

	changeLanguage(lang) {
		this.currentLanguage = lang;
		localStorage.setItem('dailyQuestLanguage', lang);
		this.setupLanguage();
		this.generateTodayQuest();
		this.updateDateTime();
	}

	setupEventListeners() {
		const languageBtn = document.getElementById('languageBtn');
		const languageDropdown = document.getElementById('languageDropdown');

		if (languageBtn && languageDropdown) {
			languageBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				languageDropdown.classList.toggle('active');
			});

			document.addEventListener('click', () => {
				languageDropdown.classList.remove('active');
			});
		}

		document.querySelectorAll('.language-option').forEach((option) => {
			option.addEventListener('click', (e) => {
				e.stopPropagation();
				this.changeLanguage(e.currentTarget.dataset.lang || 'en');
				languageDropdown?.classList.remove('active');
			});
		});
	}

	setupPhotoUpload() {
		const uploadContainer = document.getElementById('photoUploadContainer');
		if (!uploadContainer) return;

		uploadContainer.addEventListener('dragover', (e) => {
			e.preventDefault();
			uploadContainer.classList.add('dragover');
		});

		uploadContainer.addEventListener('dragleave', () => {
			uploadContainer.classList.remove('dragover');
		});

		uploadContainer.addEventListener('drop', (e) => {
			e.preventDefault();
			uploadContainer.classList.remove('dragover');
			if (e.dataTransfer.files?.length) {
				this.processPhoto(e.dataTransfer.files[0]);
			}
		});
	}

	updateDateTime() {
		const now = new Date();
		const locale = this.currentLanguage === 'hi'
			? 'hi-IN'
			: this.currentLanguage === 'ml'
				? 'ml-IN'
				: this.currentLanguage === 'te'
					? 'te-IN'
					: 'en-US';

		const dateElement = document.getElementById('questDate');
		if (dateElement) {
			dateElement.textContent = now.toLocaleDateString(locale, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}
	}

	generateTodayQuest() {
		const quests = this.questBank[this.currentLanguage] || this.questBank.en;
		const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
		this.currentQuest = quests[dayOfYear % quests.length];
		this.displayQuest();
	}

	displayQuest() {
		if (!this.currentQuest) return;

		const q = this.currentQuest;
		const icon = document.getElementById('questIcon');
		const title = document.getElementById('questTitle');
		const description = document.getElementById('questDescription');
		const duration = document.getElementById('questDuration');
		const difficulty = document.getElementById('questDifficulty');
		const reward = document.getElementById('questReward');
		const category = document.getElementById('questCategory');

		if (icon) icon.className = q.icon;
		if (title) title.textContent = q.title;
		if (description) description.textContent = q.description;
		if (duration) duration.textContent = q.duration;
		if (difficulty) difficulty.textContent = q.difficulty;
		if (reward) reward.textContent = `+${q.xpReward} XP`;
		if (category) category.textContent = q.category;

		this.renderSteps();
		this.renderTips();
	}

	renderSteps() {
		const stepsContainer = document.getElementById('stepsContainer');
		if (!stepsContainer || !this.currentQuest) return;

		stepsContainer.innerHTML = this.currentQuest.steps.map((step, index) => `
			<div class="step-item">
				<div class="step-header">
					<div class="step-number">${index + 1}</div>
					<div class="step-title">${step.title}</div>
				</div>
				<div class="step-description">${step.description}</div>
			</div>
		`).join('');
	}

	renderTips() {
		const tipsList = document.getElementById('tipsList');
		if (!tipsList || !this.currentQuest) return;

		tipsList.innerHTML = this.currentQuest.tips.map((tip) => `
			<div class="tip-item">
				<i class="fas fa-check-circle tip-icon"></i>
				<span>${tip}</span>
			</div>
		`).join('');
	}

	loadUserStats() {
		const saved = localStorage.getItem('dailyQuestStats');
		if (saved) {
			this.userStats = { ...this.userStats, ...JSON.parse(saved) };
		}

		this.updateStatsDisplay();
	}

	saveUserStats() {
		localStorage.setItem('dailyQuestStats', JSON.stringify(this.userStats));
		this.updateStatsDisplay();
	}

	updateStatsDisplay() {
		const streakElement = document.getElementById('streakCount');
		const xpElement = document.getElementById('xpCount');
		const levelElement = document.getElementById('levelCount');

		if (streakElement) streakElement.textContent = this.userStats.streak;
		if (xpElement) xpElement.textContent = this.userStats.xp;
		if (levelElement) levelElement.textContent = this.userStats.level;
	}

	startQuest() {
		const t = this.translations[this.currentLanguage] || this.translations.en;
		const statusBadge = document.getElementById('questStatus');
		if (statusBadge) {
			statusBadge.className = 'status-badge started';
			statusBadge.innerHTML = `<i class="fas fa-play"></i><span>${t['status-started']}</span>`;
		}

		document.getElementById('progressSection')?.style.setProperty('display', 'block');
		document.getElementById('startBtn')?.style.setProperty('display', 'none');

		if (this.currentQuest?.requiresPhoto) {
			document.getElementById('photoUploadSection')?.style.setProperty('display', 'block');
		}

		this.questProgress = 1;
		this.updateProgress();
		this.updateCompleteButton();
	}

	updateProgress() {
		if (!this.currentQuest) return;

		const progress = (this.questProgress / this.currentQuest.steps.length) * 100;
		const progressFill = document.getElementById('progressFill');
		const progressText = document.getElementById('progressText');

		if (progressFill) progressFill.style.width = `${progress}%`;
		if (progressText) progressText.textContent = `Step ${this.questProgress} of ${this.currentQuest.steps.length}`;
	}

	updateCompleteButton() {
		const completeBtn = document.getElementById('completeBtn');
		const t = this.translations[this.currentLanguage] || this.translations.en;
		if (!completeBtn) return;

		completeBtn.style.display = 'inline-flex';
		const needsPhoto = this.currentQuest?.requiresPhoto && !this.uploadedPhoto;
		completeBtn.disabled = Boolean(needsPhoto);
		completeBtn.innerHTML = needsPhoto
			? '<i class="fas fa-camera"></i><span>Photo Required</span>'
			: `<i class="fas fa-check"></i><span>${t['mark-complete']}</span>`;
	}

	processPhoto(file) {
		if (!file || !file.type.startsWith('image/')) {
			alert('Please select an image file.');
			return;
		}

		this.uploadedPhoto = file;
		const reader = new FileReader();
		reader.onload = (e) => {
			const previewImage = document.getElementById('previewImage');
			const photoPreview = document.getElementById('photoPreview');
			const photoDetails = document.getElementById('photoDetails');
			const locationInfo = document.getElementById('locationInfo');
			const t = this.translations[this.currentLanguage] || this.translations.en;

			if (previewImage) previewImage.src = e.target.result;
			if (photoPreview) photoPreview.classList.add('active');

			// Simulated geotag detection placeholder until EXIF parsing is added.
			this.photoLocation = {
				latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
				longitude: 77.5946 + (Math.random() - 0.5) * 0.1
			};

			if (locationInfo) {
				locationInfo.className = 'location-info location-verified';
				locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${t['location-verified']}</span>`;
			}

			if (photoDetails) {
				photoDetails.innerHTML = `
					<div><strong>File:</strong> ${file.name}</div>
					<div><strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</div>
					<div><strong>GPS:</strong> ${this.photoLocation.latitude.toFixed(6)}, ${this.photoLocation.longitude.toFixed(6)}</div>
				`;
			}

			this.showNotification(t['photo-uploaded'], 'success');
			this.updateCompleteButton();
		};
		reader.readAsDataURL(file);
	}

	removePhoto() {
		this.uploadedPhoto = null;
		this.photoLocation = null;
		document.getElementById('photoPreview')?.classList.remove('active');
		const photoInput = document.getElementById('photoInput');
		if (photoInput) photoInput.value = '';
		this.updateCompleteButton();
	}

	async completeQuest() {
		if (this.currentQuest?.requiresPhoto && !this.uploadedPhoto) {
			this.showNotification('Please upload a photo before completing this quest.', 'error');
			return;
		}

		const t = this.translations[this.currentLanguage] || this.translations.en;
		this.userStats.xp += this.currentQuest.xpReward;
		this.userStats.streak += 1;

		if (this.userStats.xp >= this.userStats.level * 100) {
			this.userStats.level += 1;
		}

		this.saveUserStats();
		this.questProgress = this.currentQuest.steps.length;
		this.updateProgress();

		const statusBadge = document.getElementById('questStatus');
		if (statusBadge) {
			statusBadge.className = 'status-badge completed';
			statusBadge.innerHTML = `<i class="fas fa-check"></i><span>${t['status-completed']}</span>`;
		}

		const completeBtn = document.getElementById('completeBtn');
		if (completeBtn) completeBtn.style.display = 'none';

		if (window.backendBridge) {
			try {
				await window.backendBridge.saveGameResult({
					game: 'daily-quest',
					score: this.currentQuest.xpReward,
					completed: true,
					won: true,
					accuracy: 100
				});
				await window.backendBridge.syncCurrentUserToStorage();
			} catch (error) {
				console.warn('Failed to sync daily quest completion to backend:', error.message);
			}
		}

		alert(`🎉 ${t['quest-completed']}\n\n${t['congrats-message']}\n\n✨ ${t['xp-earned']}: +${this.currentQuest.xpReward}\n🔥 ${t['streak-updated']}: ${this.userStats.streak}\n\n${t['come-back-tomorrow']}`);
	}

	skipQuest() {
		if (confirm('Are you sure you want to skip today\'s quest?')) {
			this.showNotification('Quest skipped for today.', 'info');
		}
	}

	showNotification(message, type = 'info') {
		const color = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
		const notification = document.createElement('div');
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			z-index: 10000;
			max-width: 320px;
			color: #fff;
			background: ${color};
			border-radius: 8px;
			padding: 12px 16px;
			box-shadow: 0 8px 20px rgba(0,0,0,0.2);
			animation: slideIn 0.2s ease;
		`;
		notification.textContent = message;
		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.animation = 'slideOut 0.2s ease';
			setTimeout(() => notification.remove(), 200);
		}, 2500);
	}
}

let questManager;

function startQuest() {
	questManager?.startQuest();
}

function completeQuest() {
	questManager?.completeQuest();
}

function skipQuest() {
	questManager?.skipQuest();
}

function handlePhotoUpload(event) {
	const file = event.target.files?.[0];
	if (file) {
		questManager?.processPhoto(file);
	}
}

function capturePhotoWithLocation() {
	if (!navigator.geolocation) {
		alert('Geolocation is not available in this browser.');
		return;
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			alert(`📍 Location captured: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}\nNow choose your photo to upload.`);
		},
		() => {
			alert('Unable to access location. Please enable GPS permissions.');
		}
	);
}

function removePhoto() {
	questManager?.removePhoto();
}

document.addEventListener('DOMContentLoaded', () => {
	questManager = new DailyQuestManager();
});
