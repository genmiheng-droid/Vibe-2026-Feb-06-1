document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const PARENT_PHONE_NUMBER = '12345678';
    const CAREGIVER_PHONE_NUMBER = '87654321';
    const CHECK_IN_DEADLINE_HOUR = 10;
    const DEFAULT_SELF_CARE_TASKS = {
        en: ['Ate breakfast', 'Drank enough water', 'Took morning medicine'],
        zh: ['吃了早餐', '喝了足够的水', '吃了早上的药'],
        ms: ['Makan sarapan', 'Minum air secukupnya', 'Makan ubat pagi'],
        ta: ['காலை உணவு உண்டேன்', 'போதுமான தண்ணீர் குடித்தேன்', 'காலை மருந்து எடுத்துக்கொண்டேன்']
    };

    // --- Element Selectors ---
    const languageSelector = document.getElementById('language-selector');
    const checkInBtn = document.getElementById('check-in-btn');
    const notOkBtn = document.getElementById('not-ok-btn');
    const recordAudioBtn = document.getElementById('record-audio-btn');
    const clockElement = document.getElementById('clock');
    const aliveStatusText = document.getElementById('alive-status-text');
    const routineStatusText = document.getElementById('routine-status-text');
    const selfCareStatusText = document.getElementById('self-care-status-text');
    const escalationStatusText = document.getElementById('escalation-status-text');
    const callParentBtn = document.getElementById('call-parent-btn');
    const alertSound = document.getElementById('alert-sound');
    const pingSound = document.getElementById('ping-sound');
    const selfCareList = document.getElementById('self-care-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const voiceTranscript = document.getElementById('voice-transcript');
    const checkInDetails = document.getElementById('check-in-details');

    // --- State ---
    let checkedIn = false;
    let pinged = false;
    let selfCareTasks = [];
    let isRecording = false;
    let currentLanguage = 'en';
    let recognition;

    // --- Translations ---
    const translations = {
        en: {
            appTitle: 'Ambient Reassurance App', parentTitle: 'Parent', caregiverTitle: 'Caregiver',
            imOk: "I'm OK", imNotOk: "I'm NOT OK", recordAudio: 'Voice', listening: 'Listening...',
            remindersTitle: "Today's Reminders", addTaskPlaceholder: 'Add a new reminder...', addTaskBtn: 'Add', deleteTaskBtn: 'Delete',
            aliveStatus: 'Alive & Okay', routineStatus: 'Routine Normal', selfCareStatus: 'Self-Care', escalationStatus: 'Exception Alerts',
            pending: 'Pending', confirmed: 'Confirmed', notOk: 'NOT OK', routineNormal: 'No unusual patterns',
            tasksDone: (c, t) => `${c} of ${t} tasks done`, allTasksCompleted: 'All completed', noTasks: 'No tasks yet',
            allClear: 'All clear', actionRequired: 'Action Required!', checkInMissed: 'Check-in Missed', callParentBtn: 'Call Parent',
            voiceFeedback: {
                listening: "Listening... Say 'I'm OK' or 'I'm not OK'.",
                permission: "Voice command requires microphone permission.",
                noSpeech: "Didn't hear anything. Please try again.",
                noMatch: "Didn't understand. Please say 'I'm OK' or 'I'm not OK'.",
                error: "Sorry, a voice error occurred. Please try again.",
                transcript: (t) => `Heard: "${t}"`
            },
            checkInDetails: (t, l) => `at ${t} from ${l}`,
            locationError: "Location not available",
            okKeywords: ["i'm ok", 'i am ok', 'okay', 'yes', 'fine'], notOkKeywords: ["i'm not ok", 'i am not ok', 'not okay', 'no', 'help']
        },
        zh: {
            appTitle: '环境安抚应用', parentTitle: '家长', caregiverTitle: '看护人',
            imOk: '我很好', imNotOk: '我不好', recordAudio: '语音', listening: '听取中...',
            remindersTitle: '今日提醒', addTaskPlaceholder: '添加新提醒...', addTaskBtn: '添加', deleteTaskBtn: '删除',
            aliveStatus: '存活并安好', routineStatus: '日常正常', selfCareStatus: '自我关怀', escalationStatus: '异常警报',
            pending: '待定', confirmed: '已确认', notOk: '不好', routineNormal: '无异常模式',
            tasksDone: (c, t) => `完成 ${c}/${t} 个任务`, allTasksCompleted: '全部完成', noTasks: '暂无任务',
            allClear: '一切正常', actionRequired: '需要采取行动！', checkInMissed: '错过签到', callParentBtn: '呼叫家长',
            voiceFeedback: {
                listening: "听取中... 请说 ‘我很好’ 或 ‘我不好’。",
                permission: "语音指令需要麦克风权限。",
                noSpeech: "没有听到声音。请重试。",
                noMatch: "无法理解。请说 ‘我很好’ 或 ‘我不好’。",
                error: "抱歉，发生语音错误。请重试。",
                transcript: (t) => `听到： “${t}”`
            },
            checkInDetails: (t, l) => `于 ${t} 从 ${l}`,
            locationError: "无法获取位置",
            okKeywords: ['我很好', '好的', '可以'], notOkKeywords: ['我不好', '不行', '救命']
        },
        ms: {
            appTitle: 'Aplikasi Penenteram Persekitaran', parentTitle: 'Ibu Bapa', caregiverTitle: 'Penjaga',
            imOk: 'Saya OK', imNotOk: 'Saya TIDAK OK', recordAudio: 'Suara', listening: 'Mendengar...',
            remindersTitle: 'Peringatan Hari Ini', addTaskPlaceholder: 'Tambah peringatan baru...', addTaskBtn: 'Tambah', deleteTaskBtn: 'Padam',
            aliveStatus: 'Hidup & Sihat', routineStatus: 'Rutin Normal', selfCareStatus: 'Penjagaan Diri', escalationStatus: 'Makluman Pengecualian',
            pending: 'Menunggu', confirmed: 'Disahkan', notOk: 'TIDAK OK', routineNormal: 'Tiada corak luar biasa',
            tasksDone: (c, t) => `${c} dari ${t} tugas selesai`, allTasksCompleted: 'Semua selesai', noTasks: 'Belum ada tugas',
            allClear: 'Semua jelas', actionRequired: 'Tindakan Diperlukan!', checkInMissed: 'Terlepas Daftar Masuk', callParentBtn: 'Panggil Ibu Bapa',
            voiceFeedback: {
                listening: "Mendengar... Sebut 'Saya OK' atau 'Saya tidak OK'.",
                permission: "Perintah suara memerlukan kebenaran mikrofon.",
                noSpeech: "Tidak mendengar apa-apa. Sila cuba lagi.",
                noMatch: "Tidak faham. Sila sebut 'Saya OK' atau 'Saya tidak OK'.",
                error: "Maaf, ralat suara berlaku. Sila cuba lagi.",
                transcript: (t) => `Didengar: "${t}"`
            },
            checkInDetails: (t, l) => `pada ${t} dari ${l}`,
            locationError: "Lokasi tidak tersedia",
            okKeywords: ['saya ok', 'ok', 'baik'], notOkKeywords: ['saya tidak ok', 'tidak ok', 'bantuan']
        },
        ta: {
            appTitle: 'சுற்றுச்சூழல் உறுதிமொழி செயலி', parentTitle: 'பெற்றோர்', caregiverTitle: 'பராமரிப்பாளர்',
            imOk: 'நான் நலம்', imNotOk: 'நான் சரியில்லை', recordAudio: 'குரல்', listening: 'கேட்கிறது...',
            remindersTitle: 'இன்றைய நினைவூட்டல்கள்', addTaskPlaceholder: 'புதிய நினைவூட்டலைச் சேர்க்கவும்...', addTaskBtn: 'சேர்', deleteTaskBtn: 'நீக்கு',
            aliveStatus: 'உயிருடன் & நலமாக', routineStatus: 'இயல்பு நிலை', selfCareStatus: 'சுய பாதுகாப்பு', escalationStatus: 'விதிவிலக்கு எச்சரிக்கைகள்',
            pending: 'நிலுவையில்', confirmed: 'உறுதிசெய்யப்பட்டது', notOk: 'சரியில்லை', routineNormal: 'அசாதாரண வடிவங்கள் இல்லை',
            tasksDone: (c, t) => `${t} பணிகளில் ${c} முடிந்தது`, allTasksCompleted: 'அனைத்தும் முடிந்தது', noTasks: 'இன்னும் பணிகள் இல்லை',
            allClear: 'எல்லாம் தெளிவாக உள்ளது', actionRequired: 'நடவடிக்கை தேவை!', checkInMissed: 'செக்-இன் தவறவிட்டது', callParentBtn: ' பெற்றோரை அழைக்கவும்',
            voiceFeedback: {
                listening: "கேட்கிறது... 'நான் நலம்' அல்லது 'நான் சரியில்லை' என்று சொல்லுங்கள்.",
                permission: "குரல் கட்டளைக்கு மைக்ரோஃபோன் அனுமதி தேவை.",
                noSpeech: "ஒன்றும் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
                noMatch: "புரியவில்லை. 'நான் நலம்' அல்லது 'நான் சரியில்லை' என்று சொல்லுங்கள்.",
                error: "மன்னிக்கவும், குரல் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
                transcript: (t) => `கேட்டது: "${t}"`
            },
            checkInDetails: (t, l) => `${t} மணிக்கு ${l} இருந்து`,
            locationError: "இடம் கிடைக்கவில்லை",
            okKeywords: ['நான் நலம்', 'சரி', 'ஆம்'], notOkKeywords: ['நான் சரியில்லை', 'இல்லை', 'உதவி']
        }
    };

    // --- Functions ---

    // 1. Language, UI, and TTS
    const langMap = { en: 'en-US', zh: 'zh-CN', ms: 'ms-MY', ta: 'ta-IN' };
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langMap[currentLanguage];
            window.speechSynthesis.speak(utterance);
        }
    }

    function refreshUI() {
        const lang = translations[currentLanguage];
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if(lang[key]) el.textContent = lang[key] || el.textContent; // Fallback
        });
        document.querySelectorAll('[data-translate-key-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-key-placeholder');
            if(lang[key]) el.placeholder = lang[key];
        });

        const isNotOk = aliveStatusText.classList.contains('not-ok');
        const alertIsActive = escalationStatusText.classList.contains('alert');

        checkInBtn.textContent = checkedIn && !isNotOk ? lang.confirmed : lang.imOk;
        checkInBtn.disabled = checkedIn;
        notOkBtn.disabled = checkedIn;
        recordAudioBtn.disabled = checkedIn;
        recordAudioBtn.querySelector('span').textContent = isRecording ? lang.listening : lang.recordAudio;
        
        if (isRecording) recordAudioBtn.classList.add('recording');
        else recordAudioBtn.classList.remove('recording');

        if (checkedIn && !isNotOk) {
            aliveStatusText.textContent = lang.confirmed;
        } else if (isNotOk) {
            aliveStatusText.textContent = lang.notOk;
        } else {
            aliveStatusText.textContent = lang.pending;
            checkInDetails.textContent = ''; // Clear details if pending
        }

        routineStatusText.textContent = lang.routineNormal;
        escalationStatusText.textContent = alertIsActive ? (pinged ? lang.checkInMissed : lang.actionRequired) : lang.allClear;

        populateSelfCareList();
        updateSelfCareStatus();
    }

    function updateLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        loadTasks();
        setupSpeechRecognition(); // Re-setup with new language
        refreshUI();
    }

    // 2. State Handlers
    function handleCheckIn() {
        if(checkedIn) return;
        checkedIn = true;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                // In a real app, you'd use a reverse geocoding service.
                // For this demo, we'll just show the coordinates.
                const locationString = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                checkInDetails.textContent = translations[currentLanguage].checkInDetails(timeString, locationString);
            }, error => {
                checkInDetails.textContent = translations[currentLanguage].checkInDetails(timeString, translations[currentLanguage].locationError);
            });
        } else {
            checkInDetails.textContent = translations[currentLanguage].checkInDetails(timeString, translations[currentLanguage].locationError);
        }

        aliveStatusText.classList.remove('not-ok');
        aliveStatusText.classList.add('confirmed');
        escalationStatusText.classList.remove('alert');
        callParentBtn.classList.add('hidden');
        voiceTranscript.textContent = '';
        refreshUI();
    }

    function handleNotOk() {
        if(checkedIn) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        checkInDetails.textContent = translations[currentLanguage].checkInDetails(timeString, translations[currentLanguage].notOk);

        aliveStatusText.classList.add('not-ok');
        escalationStatusText.classList.add('alert');
        callParentBtn.classList.remove('hidden');
        alertSound.play();
        checkedIn = true; // Prevents further state changes
        voiceTranscript.textContent = '';
        refreshUI();
    }

    function resetState() {
        checkedIn = false;
        pinged = false;
        aliveStatusText.classList.remove('confirmed', 'not-ok');
        escalationStatusText.classList.remove('alert');
        callParentBtn.classList.add('hidden');
        voiceTranscript.textContent = '';
        checkInDetails.textContent = '';
        updateLanguage(localStorage.getItem('preferredLanguage') || 'en');
    }

    // 3. Task Management
    function saveTasks() { localStorage.setItem(`selfCareTasks_${currentLanguage}`, JSON.stringify(selfCareTasks)); }
    function loadTasks() {
        const storedTasks = localStorage.getItem(`selfCareTasks_${currentLanguage}`);
        selfCareTasks = storedTasks ? JSON.parse(storedTasks) : [...(DEFAULT_SELF_CARE_TASKS[currentLanguage] || DEFAULT_SELF_CARE_TASKS.en)];
    }

    function addNewTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            selfCareTasks.push(taskText);
            saveTasks();
            populateSelfCareList();
            updateSelfCareStatus();
            newTaskInput.value = '';
        }
    }

    function deleteTask(index) {
        selfCareTasks.splice(index, 1);
        saveTasks();
        populateSelfCareList();
        updateSelfCareStatus();
    }

    function populateSelfCareList() {
        selfCareList.innerHTML = '';
        const deleteBtnText = translations[currentLanguage].deleteTaskBtn;
        selfCareTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" id="task-${index}">
                <label for="task-${index}">${task}</label>
                <button class="delete-btn">${deleteBtnText}</button>
            `;
            li.querySelector('input').addEventListener('change', updateSelfCareStatus);
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));
            selfCareList.appendChild(li);
        });
    }

    function updateSelfCareStatus() {
        const checkboxes = selfCareList.querySelectorAll('input[type="checkbox"]');
        const completed = Array.from(checkboxes).filter(i => i.checked).length;
        const total = checkboxes.length;
        const lang = translations[currentLanguage];

        if (total === 0) selfCareStatusText.textContent = lang.noTasks;
        else if (completed < total) selfCareStatusText.textContent = lang.tasksDone(completed, total);
        else {
            selfCareStatusText.textContent = lang.allTasksCompleted;
            selfCareStatusText.classList.add('completed');
        }
        if(completed < total) selfCareStatusText.classList.remove('completed');
    }

    // 4. Speech Recognition
    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            recordAudioBtn.style.display = 'none';
            voiceTranscript.textContent = "Voice commands not supported by this browser.";
            return;
        }

        if (recognition) {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
        }

        recognition = new SpeechRecognition();
        recognition.lang = langMap[currentLanguage];
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isRecording = true;
            voiceTranscript.textContent = translations[currentLanguage].voiceFeedback.listening;
            voiceTranscript.classList.remove('error');
            refreshUI();
        };

        recognition.onend = () => {
            isRecording = false;
            refreshUI();
        };

        recognition.onerror = (event) => {
            isRecording = false;
            const feedback = translations[currentLanguage].voiceFeedback;
            let errorMsg = feedback.error;
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMsg = feedback.permission;
            } else if (event.error === 'no-speech') {
                errorMsg = feedback.noSpeech;
            }
            voiceTranscript.textContent = errorMsg;
            voiceTranscript.classList.add('error');
            refreshUI();
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            const lang = translations[currentLanguage];
            voiceTranscript.textContent = lang.voiceFeedback.transcript(transcript);

            if (lang.okKeywords.some(k => transcript.includes(k))) {
                handleCheckIn();
            } else if (lang.notOkKeywords.some(k => transcript.includes(k))) {
                handleNotOk();
            } else {
                setTimeout(() => { // Show the transcript briefly before showing the error
                    voiceTranscript.textContent = lang.voiceFeedback.noMatch;
                    voiceTranscript.classList.add('error');
                }, 1500)
            }
        };
    }

    // 5. Utilities
    function updateClock() {
        const now = new Date();
        clockElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function checkDeadline() {
        const now = new new Date();
        if (now.getHours() >= CHECK_IN_DEADLINE_HOUR && !checkedIn) {
            if (!pinged) {
                pingSound.play();
                pinged = true;
            }
            handleNotOk();
        }
    }

    // --- Event Listeners & Initialization ---
    languageSelector.addEventListener('change', (e) => updateLanguage(e.target.value));
    checkInBtn.addEventListener('click', () => { speak(translations[currentLanguage].imOk); handleCheckIn(); });
    notOkBtn.addEventListener('click', () => { speak(translations[currentLanguage].imNotOk); handleNotOk(); });
    addTaskBtn.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addNewTask(); });
    recordAudioBtn.addEventListener('click', () => {
        if(checkedIn) return;
        if(isRecording) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch(e) {
                isRecording = false; // Ensure state is correct on error
                voiceTranscript.textContent = translations[currentLanguage].voiceFeedback.error;
                voiceTranscript.classList.add('error');
                refreshUI();
            }
        }
    });
    callParentBtn.href = `tel:${PARENT_PHONE_NUMBER}`;
    
    // --- Initial Load ---
    updateClock();
    setInterval(updateClock, 1000);
    resetState();
    setInterval(checkDeadline, 60000);
});