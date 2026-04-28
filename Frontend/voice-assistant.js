/**
 * 🌍 Multilingual Voice Assistant for Sustainable Farming
 * Supports English, Hindi, Malayalam, Telugu with basic platform functions
 */

class MultilingualVoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isEnabled = false;
        this.currentLanguage = localStorage.getItem('assistantLanguage') || 'en-IN';
        this.userName = localStorage.getItem('userName') || 'Farmer';
        
        // Initialize Web APIs
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        
        // Voice assistant state
        this.isWelcomeDone = false;
        this.lastInteraction = Date.now();
        
        this.init();
    }

    init() {
        console.log('🎤 Initializing Multilingual Voice Assistant...');
        this.checkBrowserSupport();
        this.setupSpeechRecognition();
        this.loadVoices();
        this.setupMultilingualCommands();
        this.createUI();
        
        // Load voices when they're ready
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
        
        console.log('✅ Multilingual Voice Assistant initialized');
    }

    checkBrowserSupport() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech Recognition not supported');
            this.showError('Voice recognition not supported in this browser');
            return false;
        }
        
        if (!('speechSynthesis' in window)) {
            console.warn('Speech Synthesis not supported');
            this.showError('Voice synthesis not supported in this browser');
            return false;
        }
        
        return true;
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) return;
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.currentLanguage;
        
        this.recognition.onstart = () => {
            console.log('🎤 Voice recognition started');
            this.updateUI('listening');
        };
        
        this.recognition.onresult = (event) => {
            const result = event.results[0][0].transcript.toLowerCase();
            console.log('🗣️ Voice input:', result);
            this.processMultilingualCommand(result);
            this.updateUI('processing');
        };
        
        this.recognition.onerror = (event) => {
            console.error('❌ Speech recognition error:', event.error);
            this.handleError(event.error);
        };
        
        this.recognition.onend = () => {
            console.log('🛑 Voice recognition ended');
            this.isListening = false;
            this.updateUI('idle');
        };
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        console.log('🔊 Available voices:', this.voices.length);
        
        // Filter voices by language with better matching
        this.languageVoices = {
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
            )
        };
    }

    setupMultilingualCommands() {
        // Multilingual command patterns
        this.multilingualCommands = {
            // Login/Authentication Commands
            login: {
                'en-IN': ['login', 'sign in', 'log in', 'i want to login', 'take me to login', 'open login page'],
                'hi-IN': ['लॉगिन', 'लॉग इन', 'साइन इन', 'मैं लॉगिन करना चाहता हूं', 'लॉगिन पेज खोलें'],
                'ml-IN': ['ലോഗിൻ', 'സൈൻ ഇൻ', 'ലോഗിൻ ചെയ്യുക', 'ലോഗിൻ പേജ് തുറക്കുക'],
                'te-IN': ['లాగిన్', 'సైన్ ఇన్', 'లాగిన్ చేయాలి', 'లాగిన్ పేజీ తెరువు']
            },
            
            // Registration Commands
            register: {
                'en-IN': ['register', 'sign up', 'create account', 'new account', 'registration'],
                'hi-IN': ['रजिस्टर', 'साइन अप', 'खाता बनाएं', 'नया खाता', 'पंजीकरण'],
                'ml-IN': ['രജിസ്റ്റർ', 'സൈൻ അപ്പ്', 'അക്കൗണ്ട് സൃഷ്ടിക്കുക', 'പുതിയ അക്കൗണ്ട്'],
                'te-IN': ['రిజిస్టర్', 'సైన్ అప్', 'ఖాతా సృష్టించు', 'కొత్త ఖాతా']
            },
            
            // Navigation Commands
            dashboard: {
                'en-IN': ['dashboard', 'go to dashboard', 'open dashboard', 'main page'],
                'hi-IN': ['डैशबोर्ड', 'डैशबोर्ड पर जाएं', 'मुख्य पृष्ठ'],
                'ml-IN': ['ഡാഷ്ബോർഡ്', 'ഡാഷ്ബോർഡിലേക്ക് പോകുക', 'പ്രധാന പേജ്'],
                'te-IN': ['డ్యాష్‌బోర్డ్', 'డ్యాష్‌బోర్డ్‌కు వెళ్ళు', 'ప్రధాన పేజీ']
            },
            
            // Game Commands
            games: {
                'en-IN': ['games', 'play games', 'gaming', 'start game', 'virtual farmery'],
                'hi-IN': ['गेम्स', 'खेल', 'गेमिंग', 'खेल शुरू करें', 'वर्चुअल फार्मरी'],
                'ml-IN': ['ഗെയിമുകൾ', 'കളികൾ', 'ഗെയിമിംഗ്', 'കളി ആരംഭിക്കുക'],
                'te-IN': ['గేములు', 'ఆటలు', 'గేమింగ్', 'ఆట మొదలుపెట్టు', 'వర్చువల్ ఫార్మరీ']
            },
            
            // Quest Commands
            quests: {
                'en-IN': ['quest', 'daily quest', 'missions', 'tasks', 'farming tasks'],
                'hi-IN': ['क्वेस्ट', 'दैनिक चुनौती', 'मिशन', 'कार्य', 'कृषि कार्य'],
                'ml-IN': ['ക്വസ്റ്റ്', 'ദൈനിക ദൗത്യം', 'മിഷൻ', 'ചുമതലകൾ'],
                'te-IN': ['క్వెస్ట్', 'దైనిక అన్వేషణ', 'మిషన్', 'పనులు', 'వ్యవసాయ పనులు']
            },
            
            // Help Commands
            help: {
                'en-IN': ['help', 'help me', 'what can you do', 'assistance', 'support'],
                'hi-IN': ['मदद', 'सहायता', 'आप क्या कर सकते हैं', 'सहारा'],
                'ml-IN': ['സഹായം', 'എന്നെ സഹായിക്കുക', 'നിങ്ങൾക്ക് എന്ത് ചെയ്യാൻ കഴിയും'],
                'te-IN': ['సహాయం', 'నాకు సహాయం చేయండి', 'మీరు ఏమి చేయగలరు', 'మద్దతు']
            },
            
            // Weather Commands
            weather: {
                'en-IN': ['weather', 'weather today', 'how is weather', 'weather forecast'],
                'hi-IN': ['मौसम', 'आज का मौसम', 'मौसम कैसा है', 'मौसम पूर्वानुमान'],
                'ml-IN': ['കാലാവസ്ഥ', 'ഇന്നത്തെ കാലാവസ്ഥ', 'കാലാവസ്ഥ എങ്ങനെയാണ്'],
                'te-IN': ['వాతావరణం', 'ఈరోజు వాతావరణం', 'వాతావరణం ఎలా ఉంది']
            },
            
            // Farming Information Commands
            farming: {
                'en-IN': ['farming', 'agriculture', 'farming tips', 'crop advice', 'plant care'],
                'hi-IN': ['कृषि', 'खेती', 'कृषि सुझाव', 'फसल सलाह', 'पौधों की देखभाल'],
                'ml-IN': ['കൃഷി', 'കർഷകത', 'കൃഷി നുറുങ്ങുകൾ', 'വിള ഉപദേശം'],
                'te-IN': ['వ్యవసాయం', 'కృషి', 'వ్యవసాయ చిట్కాలు', 'పంట సలహా', 'మొక్కల సంరక్షణ']
            },
            
            // Language Change Commands
            language: {
                'en-IN': ['change language', 'language settings', 'switch language'],
                'hi-IN': ['भाषा बदलें', 'भाषा सेटिंग्स', 'भाषा स्विच करें'],
                'ml-IN': ['ഭാഷ മാറ്റുക', 'ഭാഷാ ക്രമീകരണങ്ങൾ'],
                'te-IN': ['భాష మార్చు', 'భాష సెట్టింగులు', 'భాష మారుస్తాయి']
            }
        };

        // Multilingual responses
        this.responses = {
            'en-IN': {
                welcome: `Hello ${this.userName}! I'm your farming assistant. I can help you navigate, answer questions, and provide farming guidance. How can I help you today?`,
                login: "Taking you to the login page. You can sign in with your credentials.",
                register: "Opening registration page. You can create a new farming account here.",
                dashboard: "Navigating to your farming dashboard where you can see your progress.",
                games: "Opening games section. You can play Virtual Farmery and complete daily quests.",
                quests: "Taking you to daily quests. Complete farming tasks to earn rewards and learn new techniques.",
                help: "I can help you login, navigate the platform, play games, complete quests, get weather updates, and provide farming tips. What would you like to do?",
                weather: "Today's weather is good for farming activities. Remember to water your plants appropriately based on conditions.",
                farming: "Here's a farming tip: Always check soil moisture before watering. Insert your finger 2 inches into soil - if it's dry, it's time to water.",
                language: "You can change language by saying 'Hindi', 'Malayalam', 'Telugu', or 'English'. Which language would you prefer?",
                unknown: "I didn't understand that. Try saying 'help me' or 'login' or ask about farming, weather, or games.",
                error: "Sorry, there was an issue. Please try again or speak more clearly."
            },
            'hi-IN': {
                welcome: `नमस्ते ${this.userName}! मैं आपका कृषि सहायक हूं। मैं आपको नेविगेट करने, सवालों के जवाब देने और कृषि मार्गदर्शन प्रदान करने में मदद कर सकता हूं।`,
                login: "आपको लॉगिन पेज पर ले जा रहा हूं। आप अपनी जानकारी के साथ साइन इन कर सकते हैं।",
                register: "पंजीकरण पेज खोल रहा हूं। आप यहां नया कृषि खाता बना सकते हैं।",
                dashboard: "आपके कृषि डैशबोर्ड पर जा रहा हूं जहां आप अपनी प्रगति देख सकते हैं।",
                games: "गेम्स सेक्शन खोल रहा हूं। आप वर्चुअल फार्मरी खेल सकते हैं और दैनिक चुनौतियां पूरी कर सकते हैं।",
                quests: "दैनिक चुनौतियों पर ले जा रहा हूं। कृषि कार्य पूरे करके पुरस्कार जीतें।",
                help: "मैं आपको लॉगिन, नेविगेशन, गेम्स, चुनौतियां, मौसम अपडेट और कृषि सुझाव देने में मदद कर सकता हूं।",
                weather: "आज का मौसम कृषि गतिविधियों के लिए अच्छा है। मौसम के अनुसार पौधों को पानी दें।",
                farming: "कृषि सुझाव: पानी देने से पहले हमेशा मिट्टी की नमी जांचें। अपनी उंगली मिट्टी में 2 इंच डालें।",
                language: "आप 'हिंदी', 'मलयालम', 'तेलुगु', या 'अंग्रेजी' कहकर भाषा बदल सकते हैं।",
                unknown: "मैं समझ नहीं पाया। 'मदद' या 'लॉगिन' कहें या कृषि, मौसम या गेम्स के बारे में पूछें।",
                error: "माफ करें, कोई समस्या हुई। कृपया फिर से कोशिश करें।"
            },
            'ml-IN': {
                welcome: `നമസ്കാരം ${this.userName}! ഞാൻ നിങ്ങളുടെ കൃഷി സഹായകനാണ്। നാവിഗേറ്റ് ചെയ്യാനും ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകാനും കൃഷി മാർഗനിർദേശം നൽകാനും ഞാൻ സഹായിക്കും।`,
                login: "ലോഗിൻ പേജിലേക്ക് കൊണ്ടുപോകുന്നു. നിങ്ങളുടെ വിവരങ്ങൾ ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യാം.",
                register: "രജിസ്ട്രേഷൻ പേജ് തുറക്കുന്നു. ഇവിടെ പുതിയ കൃഷി അക്കൗണ്ട് സൃഷ്ടിക്കാം.",
                dashboard: "നിങ്ങളുടെ കൃഷി ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു, അവിടെ പുരോഗതി കാണാം.",
                games: "ഗെയിമുകളുടെ വിഭാഗം തുറക്കുന്നു. വെർച്വൽ ഫാർമറി കളിക്കാനും ദൈനിക ദൗത്യങ്ങൾ പൂർത്തിയാക്കാനും കഴിയും.",
                quests: "ദൈനിക ദൗത്യങ്ങളിലേക്ക് കൊണ്ടുപോകുന്നു. കൃഷി ജോലികൾ പൂർത്തിയാക്കി പുരസ്കാരങ്ങൾ നേടുക.",
                help: "ലോഗിൻ, നാവിഗേഷൻ, ഗെയിമുകൾ, ദൗത്യങ്ങൾ, കാലാവസ്ഥാ അപ്ഡേറ്റുകൾ, കൃഷി നുറുങ്ങുകൾ എന്നിവയിൽ സഹായിക്കാം.",
                weather: "ഇന്നത്തെ കാലാവസ്ഥ കൃഷിപ്പണികൾക്ക് നല്ലതാണ്. കാലാവസ്ഥ അനുസരിച്ച് ചെടികൾക്ക് വെള്ളം കൊടുക്കുക.",
                farming: "കൃഷി നുറുങ്ങ്: വെള്ളം കൊടുക്കുന്നതിനുമുമ്പ് എപ്പോഴും മണ്ണിന്റെ ഈർപ്പം പരിശോധിക്കുക.",
                language: "'ഹിന്ദി', 'മലയാളം', 'തെലുങ്ക്', അല്ലെങ്കിൽ 'ഇംഗ്ലീഷ്' എന്ന് പറഞ്ഞ് ഭാഷ മാറ്റാം.",
                unknown: "എനിക്ക് മനസ്സിലായില്ല. 'സഹായം' അല്ലെങ്കിൽ 'ലോഗിൻ' എന്ന് പറയുക അല്ലെങ്കിൽ കൃഷി, കാലാവസ്ഥ, ഗെയിമുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.",
                error: "ക്ഷമിക്കണം, എന്തോ പ്രശ്നമുണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക."
            },
            'te-IN': {
                welcome: `నమస్కారం ${this.userName}! నేను మీ వ్యవసాయ సహాయకుడిని. నావిగేట్ చేయడంలో, ప్రశ్నలకు సమాధానాలు ఇవ్వడంలో మరియు వ్యవసాయ మార్గదర్శకత్వం అందించడంలో సహాయం చేస్తాను.`,
                login: "లాగిన్ పేజీకి తీసుకెళ్తున్నాను. మీ వివరాలతో సైన్ ఇన్ చేయవచ్చు.",
                register: "రిజిస్ట్రేషన్ పేజీ తెరుస్తున్నాను. ఇక్కడ కొత్త వ్యవసాయ ఖాతా సృష్టించవచ్చు.",
                dashboard: "మీ వ్యవసాయ డ్యాష్‌బోర్డ్‌కు వెళ్తున్నాను, అక్కడ పురోగతిని చూడవచ్చు.",
                games: "గేముల విభాగం తెరుస్తున్నాను. వర్చువల్ ఫార్మరీ ఆడవచ్చు మరియు దైనిక అన్వేషణలు పూర్తి చేయవచ్చు.",
                quests: "దైనిక అన్వేషణలకు తీసుకెళ్తున్నాను. వ్యవసాయ పనులు పూర్తి చేసి బహుమతులు గెలుచుకోండి.",
                help: "లాగిన్, నావిగేషన్, గేములు, అన్వేషణలు, వాతావరణ అప్‌డేట్‌లు మరియు వ్యవసాయ చిట్కాలలో సహాయం చేయగలను.",
                weather: "ఈరోజు వాతావరణం వ్యవసాయ కార్యకలాపాలకు మంచిది. వాతావరణ పరిస్థితుల ప్రకారం మొక్కలకు నీరు పెట్టండి.",
                farming: "వ్యవసాయ చిట్కా: నీరు పెట్టే ముందు ఎల్లప్పుడూ మట్టిలోని తేమను తనిఖీ చేయండి.",
                language: "'హిందీ', 'మలయాళం', 'తెలుగు', లేదా 'ఇంగ్లీష్' అని చెప్పి భాష మార్చవచ్చు.",
                unknown: "నాకు అర్థం కాలేదు. 'సహాయం' లేదా 'లాగిన్' అని చెప్పండి లేదా వ్యవసాయం, వాతావరణం, గేముల గురించి అడగండి.",
                error: "క్షమించండి, ఏదో సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి."
            }
        };

        // Farming knowledge in multiple languages
        this.farmingKnowledge = {
            'en-IN': {
                'watering': 'Water your plants early morning or evening. Check soil moisture by inserting your finger 2 inches deep.',
                'fertilizer': 'Use organic fertilizers like compost or cow manure. Apply during the growing season for best results.',
                'pests': 'Use neem oil or companion planting to control pests naturally. Avoid chemical pesticides when possible.',
                'soil': 'Good soil should be well-draining, rich in organic matter, and have a pH between 6.0 and 7.0.',
                'seasons': 'Plant according to seasons. Monsoon is good for rice, winter for vegetables, summer for heat-resistant crops.'
            },
            'hi-IN': {
                'watering': 'अपने पौधों को सुबह जल्दी या शाम को पानी दें। मिट्टी की नमी जांचने के लिए अपनी उंगली को 2 इंच गहरा डालें।',
                'fertilizer': 'कंपोस्ट या गाय के गोबर जैसे जैविक उर्वरकों का उपयोग करें। बेहतर परिणामों के लिए बढ़ते मौसम में लगाएं।',
                'pests': 'कीटों को प्राकृतिक रूप से नियंत्रित करने के लिए नीम का तेल या साथी रोपण का उपयोग करें।',
                'soil': 'अच्छी मिट्टी अच्छी जल निकासी वाली, जैविक पदार्थों से भरपूर होनी चाहिए।',
                'seasons': 'मौसम के अनुसार बुआई करें। मानसून चावल के लिए, सर्दी सब्जियों के लिए अच्छी है।'
            },
            'ml-IN': {
                'watering': 'ചെടികൾക്ക് അതിരാവിലെയോ വൈകുന്നേരമോ വെള്ളം കൊടുക്കുക। മണ്ണിന്റെ ഈർപ്പം പരിശോധിക്കാൻ വിരൽ 2 ഇഞ്ച് ആഴത്തിൽ ഇടുക.',
                'fertilizer': 'കമ്പോസ്റ്റ് അല്ലെങ്കിൽ പശുവിൻറെ ചാണകം പോലുള്ള ജൈവ വളങ്ങൾ ഉപയോഗിക്കുക.',
                'pests': 'കീടങ്ങളെ പ്രകൃതിദത്തമായി നിയന്ത്രിക്കാൻ വേപ്പെണ്ണ അല്ലെങ്കിൽ കൂട്ടുകൃഷി ഉപയോഗിക്കുക.',
                'soil': 'നല്ല മണ്ണ് നല്ല ഡ്രെയിനേജുള്ളതും ജൈവവസ്തുക്കളാൽ സമ്പന്നമായതുമായിരിക്കണം.',
                'seasons': 'സീസൺ അനുസരിച്ച് നടുക. മഴക്കാലം നെല്ലിന്, ശീതകാലം പച്ചക്കറികൾക്ക് നല്ലതാണ്.'
            },
            'te-IN': {
                'watering': 'మీ మొక్కలకు తెల్లవారుజామున లేదా సాయంత్రం నీరు పెట్టండి. మట్టిలోని తేమను తనిఖీ చేయడానికి వేలును 2 అంగుళాలు లోతుగా ఉంచండి.',
                'fertilizer': 'కంపోస్ట్ లేదా ఆవు పేడ వంటి సేంద్రీయ ఎరువులను ఉపయోగించండి.',
                'pests': 'కీటకాలను సహజంగా నియంత్రించడానికి వేప నూనె లేదా సహచర మొక్కలను ఉపయోగించండి.',
                'soil': 'మంచి మట్టి బాగా ఎండిపోయే, సేంద్రీయ పదార్థాలతో కూడినదిగా ఉండాలి.',
                'seasons': 'సీజన్ ప్రకారం నాటండి. వర్షాకాలం వరికి, శీతాకాలం కుండగూరలకి మంచిది.'
            }
        };
    }

    processMultilingualCommand(command) {
        console.log('🧠 Processing multilingual command:', command);
        
        // Normalize command
        const normalizedCommand = command.toLowerCase().trim();
        
        // Check commands in all languages
        for (const [action, languages] of Object.entries(this.multilingualCommands)) {
            for (const [lang, patterns] of Object.entries(languages)) {
                for (const pattern of patterns) {
                    if (this.fuzzyMatch(normalizedCommand, pattern)) {
                        this.executeAction(action, lang);
                        return;
                    }
                }
            }
        }
        
        // Check farming knowledge in current language
        const currentLangKnowledge = this.farmingKnowledge[this.currentLanguage] || this.farmingKnowledge['en-IN'];
        for (const [topic, info] of Object.entries(currentLangKnowledge)) {
            if (normalizedCommand.includes(topic)) {
                this.speak(info);
                return;
            }
        }
        
        // Default response
        this.handleUnknownCommand(normalizedCommand);
    }

    executeAction(action, detectedLanguage) {
        // Switch to detected language if different
        if (detectedLanguage !== this.currentLanguage) {
            this.currentLanguage = detectedLanguage;
            localStorage.setItem('assistantLanguage', detectedLanguage);
            if (this.recognition) {
                this.recognition.lang = detectedLanguage;
            }
        }

        const responses = this.responses[this.currentLanguage] || this.responses['en-IN'];
        
        switch (action) {
            case 'login':
                this.speak(responses.login);
                setTimeout(() => this.navigate('login.html'), 2000);
                break;
                
            case 'register':
                this.speak(responses.register);
                setTimeout(() => this.navigate('register.html'), 2000);
                break;
                
            case 'dashboard':
                this.speak(responses.dashboard);
                setTimeout(() => this.navigate('dashboard.html'), 2000);
                break;
                
            case 'games':
                this.speak(responses.games);
                setTimeout(() => this.showGameOptions(), 2000);
                break;
                
            case 'quests':
                this.speak(responses.quests);
                setTimeout(() => this.navigate('games/daily-quest.html'), 2000);
                break;
                
            case 'help':
                this.speak(responses.help);
                break;
                
            case 'weather':
                this.speak(responses.weather);
                break;
                
            case 'farming':
                this.speak(responses.farming);
                break;
                
            case 'language':
                this.speak(responses.language);
                this.showLanguageOptions();
                break;
                
            default:
                this.speak(responses.unknown);
        }
    }

    showGameOptions() {
        const currentResponses = this.responses[this.currentLanguage] || this.responses['en-IN'];
        
        // Create a simple game selection popup
        const gameMenu = document.createElement('div');
        gameMenu.className = 'voice-popup';
        gameMenu.innerHTML = `
            <h3>🎮 ${this.currentLanguage.includes('hi') ? 'गेम्स चुनें' : 
                     this.currentLanguage.includes('ml') ? 'ഗെയിം തിരഞ്ഞെടുക്കുക' :
                     this.currentLanguage.includes('te') ? 'గేమ్ ఎంచుకోండి' : 'Choose Game'}</h3>
            <button onclick="voiceAssistant.navigate('games/virtual-farmery.html'); this.parentElement.remove();">
                🌾 Virtual Farmery
            </button>
            <button onclick="voiceAssistant.navigate('games/daily-quest.html'); this.parentElement.remove();">
                📝 Daily Quest
            </button>
            <button onclick="this.parentElement.remove();">
                ❌ ${this.currentLanguage.includes('hi') ? 'बंद करें' : 
                     this.currentLanguage.includes('ml') ? 'അടയ്ക്കുക' :
                     this.currentLanguage.includes('te') ? 'మూసివేయండి' : 'Close'}
            </button>
        `;
        
        document.body.appendChild(gameMenu);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (gameMenu.parentElement) {
                gameMenu.remove();
            }
        }, 10000);
    }

    showLanguageOptions() {
        const languageMenu = document.createElement('div');
        languageMenu.className = 'voice-popup';
        languageMenu.innerHTML = `
            <h3>🌍 Select Language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക / భాష ఎంచుకోండి</h3>
            <button onclick="voiceAssistant.changeLanguage('en-IN'); this.parentElement.remove();">
                🇺🇸 English
            </button>
            <button onclick="voiceAssistant.changeLanguage('hi-IN'); this.parentElement.remove();">
                🇮🇳 हिन्दी (Hindi)
            </button>
            <button onclick="voiceAssistant.changeLanguage('ml-IN'); this.parentElement.remove();">
                🇮🇳 മലയാളം (Malayalam)
            </button>
            <button onclick="voiceAssistant.changeLanguage('te-IN'); this.parentElement.remove();">
                🇮🇳 తెలుగు (Telugu)
            </button>
            <button onclick="this.parentElement.remove();">❌ Close</button>
        `;
        
        // Add styles for popup buttons
        const popupStyles = `
            .voice-popup button {
                display: block;
                width: 100%;
                padding: 12px;
                margin: 5px 0;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #22c55e, #10b981);
                color: white;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            .voice-popup button:hover {
                background: linear-gradient(135deg, #16a34a, #059669);
                transform: translateY(-2px);
            }
            .voice-popup h3 {
                margin-bottom: 15px;
                color: #374151;
                text-align: center;
            }
        `;
        
        if (!document.getElementById('voice-popup-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'voice-popup-styles';
            styleElement.textContent = popupStyles;
            document.head.appendChild(styleElement);
        }
        
        document.body.appendChild(languageMenu);
        
        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (languageMenu.parentElement) {
                languageMenu.remove();
            }
        }, 15000);
    }

    fuzzyMatch(input, command, threshold = 0.5) {
        // Enhanced fuzzy matching for multilingual support
        const inputWords = input.split(' ');
        const commandWords = command.split(' ');
        
        let matches = 0;
        inputWords.forEach(word => {
            commandWords.forEach(cmdWord => {
                // Direct match
                if (word === cmdWord) {
                    matches += 1;
                }
                // Partial match
                else if (word.includes(cmdWord) || cmdWord.includes(word)) {
                    matches += 0.7;
                }
                // Phonetic similarity (basic)
                else if (this.phoneticSimilarity(word, cmdWord) > 0.7) {
                    matches += 0.5;
                }
            });
        });
        
        return (matches / Math.max(inputWords.length, commandWords.length)) >= threshold;
    }

    phoneticSimilarity(word1, word2) {
        // Basic phonetic similarity check
        const maxLen = Math.max(word1.length, word2.length);
        let matches = 0;
        
        for (let i = 0; i < Math.min(word1.length, word2.length); i++) {
            if (word1[i] === word2[i]) {
                matches++;
            }
        }
        
        return matches / maxLen;
    }

    speak(text, options = {}) {
        if (!this.synthesis) return;
        
        // Stop any current speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings based on language
        utterance.rate = options.rate || (this.currentLanguage.includes('en') ? 0.9 : 0.8);
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 0.8;
        
        // Select appropriate voice based on current language
        const availableVoices = this.languageVoices[this.currentLanguage] || this.languageVoices['en-IN'];
        if (availableVoices && availableVoices.length > 0) {
            utterance.voice = availableVoices[0];
        }
        
        utterance.onstart = () => {
            console.log('🔊 Speaking:', text);
            this.updateUI('speaking');
        };
        
        utterance.onend = () => {
            console.log('🔇 Speech ended');
            this.updateUI('idle');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
            this.updateUI('idle');
        };
        
        this.synthesis.speak(utterance);
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('assistantLanguage', lang);
        
        if (this.recognition) {
            this.recognition.lang = lang;
        }
        
        const responses = this.responses[lang] || this.responses['en-IN'];
        this.speak(responses.language || "Language changed successfully");
    }

    navigate(url) {
        console.log('🧭 Navigating to:', url);
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    }

    handleUnknownCommand(command) {
        const responses = this.responses[this.currentLanguage] || this.responses['en-IN'];
        this.speak(responses.unknown);
    }

    handleError(error) {
        const responses = this.responses[this.currentLanguage] || this.responses['en-IN'];
        let message = responses.error;
        
        switch (error) {
            case 'no-speech':
                message = this.currentLanguage.includes('hi') ? "मुझे कुछ सुनाई नहीं दिया। कृपया फिर से कोशिश करें।" :
                         this.currentLanguage.includes('ml') ? "ഞാൻ ഒന്നും കേട്ടില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക." :
                         this.currentLanguage.includes('te') ? "నేను ఏమీ వినలేదు. దయచేసి మళ్లీ ప్రయత్నించండి." :
                         "I didn't hear anything. Please try again.";
                break;
            case 'audio-capture':
                message = this.currentLanguage.includes('hi') ? "आपका माइक्रोफोन काम नहीं कर रहा। सेटिंग्स जांचें।" :
                         this.currentLanguage.includes('ml') ? "നിങ്ങളുടെ മൈക്രോഫോൺ പ്രവർത്തിക്കുന്നില്ല." :
                         this.currentLanguage.includes('te') ? "మీ మైక్రోఫోన్ పనిచేయడం లేదు." :
                         "Your microphone might not be working.";
                break;
            case 'not-allowed':
                message = this.currentLanguage.includes('hi') ? "कृपया माइक्रोफोन की अनुमति दें।" :
                         this.currentLanguage.includes('ml') ? "ദയവായി മൈക്രോഫോൺ അനുമതി നൽകുക." :
                         this.currentLanguage.includes('te') ? "దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి." :
                         "Please allow microphone access.";
                break;
        }
        
        this.speak(message);
        this.updateUI('idle');
    }

    // UI methods remain the same as previous version
    createUI() {
        const voiceButton = document.createElement('div');
        voiceButton.id = 'voice-assistant';
        voiceButton.className = 'voice-assistant-btn';
        voiceButton.innerHTML = `
            <div class="voice-btn-content">
                <i class="fas fa-microphone" id="voice-icon"></i>
                <div class="voice-status" id="voice-status">Click to talk</div>
            </div>
            <div class="voice-controls" id="voice-controls" style="display: none;">
                <button class="voice-control-btn" onclick="voiceAssistant.toggleListening()" title="Toggle Voice">
                    <i class="fas fa-microphone"></i>
                </button>
                <button class="voice-control-btn" onclick="voiceAssistant.stopSpeaking()" title="Stop Speaking">
                    <i class="fas fa-volume-mute"></i>
                </button>
                <button class="voice-control-btn" onclick="voiceAssistant.showLanguageOptions()" title="Language">
                    <i class="fas fa-globe"></i>
                </button>
                <button class="voice-control-btn" onclick="voiceAssistant.toggleAssistant()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add CSS styles (same as before but with additional popup styles)
        const styles = document.createElement('style');
        styles.textContent = `
            .voice-assistant-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
                background: linear-gradient(135deg, #22c55e, #10b981);
                color: white;
                border-radius: 50px;
                padding: 15px 20px;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
                transition: all 0.3s ease;
                user-select: none;
                min-width: 60px;
            }

            .voice-assistant-btn:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 35px rgba(34, 197, 94, 0.4);
            }

            .voice-assistant-btn.listening {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                animation: pulse 1s infinite;
            }

            .voice-assistant-btn.processing {
                background: linear-gradient(135deg, #f59e0b, #d97706);
            }

            .voice-assistant-btn.speaking {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                animation: speaking 0.5s infinite alternate;
            }

            .voice-btn-content {
                display: flex;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
            }

            .voice-status {
                font-size: 0.9rem;
                font-weight: 500;
            }

            .voice-controls {
                display: flex;
                gap: 8px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.2);
            }

            .voice-control-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .voice-control-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: scale(1.1);
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes speaking {
                0% { transform: scale(1); }
                100% { transform: scale(1.02); }
            }

            .voice-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 400px;
                width: 90%;
                border: 3px solid #22c55e;
            }

            @media (max-width: 768px) {
                .voice-assistant-btn {
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 15px;
                }
                
                .voice-status {
                    font-size: 0.8rem;
                }
                
                .voice-popup {
                    width: 95%;
                    padding: 20px;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(voiceButton);

        // Add click event
        voiceButton.addEventListener('click', () => this.toggleAssistant());

        // Welcome message after page load
        setTimeout(() => this.welcomeUser(), 3000);
    }

    // Rest of the methods remain the same...
    toggleAssistant() {
        this.isEnabled = !this.isEnabled;
        const controls = document.getElementById('voice-controls');
        
        if (this.isEnabled) {
            controls.style.display = 'flex';
            const responses = this.responses[this.currentLanguage] || this.responses['en-IN'];
            this.speak(responses.welcome);
        } else {
            controls.style.display = 'none';
            this.stopListening();
            this.stopSpeaking();
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition || this.isListening) return;
        
        try {
            this.isListening = true;
            this.recognition.start();
            const statusMsg = this.currentLanguage.includes('hi') ? 'सुन रहा हूं... बोलें!' :
                             this.currentLanguage.includes('ml') ? 'കേൾക്കുന്നു... സംസാരിക്കുക!' :
                             this.currentLanguage.includes('te') ? 'వింటున్నాను... మాట్లాడండి!' :
                             'Listening... Speak now!';
            this.updateStatus(statusMsg);
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.handleError('start_error');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            const statusMsg = this.currentLanguage.includes('hi') ? 'बोलने के लिए क्लिक करें' :
                             this.currentLanguage.includes('ml') ? 'സംസാരിക്കാൻ ക്ലിക്ക് ചെയ്യുക' :
                             this.currentLanguage.includes('te') ? 'మాట్లాడటానికి క్లిక్ చేయండి' :
                             'Click to talk';
            this.updateStatus(statusMsg);
        }
    }

    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.updateUI('idle');
    }

    updateUI(state) {
        const voiceBtn = document.getElementById('voice-assistant');
        const voiceIcon = document.getElementById('voice-icon');
        
        if (!voiceBtn || !voiceIcon) return;
        
        voiceBtn.className = `voice-assistant-btn ${state}`;
        
        switch (state) {
            case 'listening':
                voiceIcon.className = 'fas fa-microphone-slash';
                break;
            case 'processing':
                voiceIcon.className = 'fas fa-brain';
                break;
            case 'speaking':
                voiceIcon.className = 'fas fa-volume-up';
                break;
            default:
                voiceIcon.className = 'fas fa-microphone';
        }
    }

    updateStatus(message) {
        const statusElement = document.getElementById('voice-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    welcomeUser() {
        if (!this.isWelcomeDone && this.isEnabled) {
            const responses = this.responses[this.currentLanguage] || this.responses['en-IN'];
            this.speak(responses.welcome);
            this.isWelcomeDone = true;
        }
    }

    showError(message) {
        console.error('Voice Assistant Error:', message);
    }
}

// Initialize multilingual voice assistant when DOM is ready
let voiceAssistant;

document.addEventListener('DOMContentLoaded', () => {
    voiceAssistant = new MultilingualVoiceAssistant();
});

// Export for global access
window.voiceAssistant = voiceAssistant;
