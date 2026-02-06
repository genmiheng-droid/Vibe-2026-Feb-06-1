document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const PARENT_PHONE_NUMBER = '12345678';
    const CAREGIVER_PHONE_NUMBER = '87654321';
    const CHECK_IN_DEADLINE_HOUR = 10; // Use 24-hour format (e.g., 10 for 10 AM, 14 for 2 PM)
    const DEFAULT_SELF_CARE_TASKS = [
        'Ate breakfast',
        'Drank enough water',
        'Took morning medicine'
    ];

    // --- Element Selectors ---
    const checkInBtn = document.getElementById('check-in-btn');
    const notOkBtn = document.getElementById('not-ok-btn');
    const clockElement = document.getElementById('clock');
    const aliveStatusText = document.getElementById('alive-status-text');
    const selfCareStatusText = document.getElementById('self-care-status-text');
    const escalationStatusText = document.getElementById('escalation-status-text');
    const callParentBtn = document.getElementById('call-parent-btn');
    const alertSound = document.getElementById('alert-sound');
    const pingSound = document.getElementById('ping-sound');
    const selfCareList = document.getElementById('self-care-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');

    // --- State ---
    let checkedIn = false;
    let pinged = false;
    let selfCareTasks = [];

    // --- Functions ---

    // 0. Reset Application State
    function resetState() {
        checkedIn = false;
        pinged = false;
        checkInBtn.textContent = "I'm OK";
        checkInBtn.disabled = false;
        checkInBtn.style.backgroundColor = 'oklch(65% 0.2 150)';
        notOkBtn.disabled = false;
        aliveStatusText.textContent = 'Pending';
        aliveStatusText.classList.remove('confirmed', 'not-ok');
        selfCareStatusText.textContent = 'Pending';
        selfCareStatusText.classList.remove('completed');
        escalationStatusText.textContent = 'All clear';
        escalationStatusText.classList.remove('alert');
        callParentBtn.classList.add('hidden');
        populateSelfCareList();
        updateSelfCareStatus();
    }

    // 1. Task Management
    function saveTasks() {
        localStorage.setItem('selfCareTasks', JSON.stringify(selfCareTasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('selfCareTasks');
        selfCareTasks = storedTasks ? JSON.parse(storedTasks) : [...DEFAULT_SELF_CARE_TASKS];
    }

    function addNewTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            selfCareTasks.push(taskText);
            saveTasks();
            populateSelfCareList(); // This will now correctly refresh the list
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
        selfCareTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task-${index}`;
            checkbox.addEventListener('change', updateSelfCareStatus);
            
            const label = document.createElement('label');
            label.htmlFor = `task-${index}`;
            label.textContent = task;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            listItem.appendChild(deleteBtn);
            selfCareList.appendChild(listItem);
        });
    }

    addTaskBtn.addEventListener('click', addNewTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });

    // 2. Update Clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }

    // 3. "I'm OK" Check-in
    checkInBtn.addEventListener('click', () => {
        checkedIn = true;
        aliveStatusText.textContent = 'Confirmed for today';
        aliveStatusText.classList.remove('not-ok');
        aliveStatusText.classList.add('confirmed');
        checkInBtn.textContent = 'Checked In';
        checkInBtn.disabled = true;
        notOkBtn.disabled = true;
        checkInBtn.style.backgroundColor = 'oklch(75% 0.18 160)';
    });

    // 4. "I'm NOT OK" Alert
    notOkBtn.addEventListener('click', () => {
        aliveStatusText.textContent = 'NOT OK';
        aliveStatusText.classList.add('not-ok');
        escalationStatusText.textContent = 'Action Required!';
        escalationStatusText.classList.add('alert');
        callParentBtn.classList.remove('hidden');
        alertSound.play();
        const message = encodeURIComponent("Parent requires immediate attention. Please call them.");
        window.location.href = `sms:${CAREGIVER_PHONE_NUMBER}?body=${message}`;
        checkInBtn.disabled = true;
        notOkBtn.disabled = true;
    });

    // 5. Update Self-Care Status
    function updateSelfCareStatus() {
        const selfCareCheckboxes = document.querySelectorAll('#self-care-list input[type="checkbox"]');
        const totalTasks = selfCareCheckboxes.length;
        let completedTasks = 0;
        selfCareCheckboxes.forEach(cb => {
            if (cb.checked) {
                completedTasks++;
            }
        });

        if (totalTasks === 0) {
            selfCareStatusText.textContent = 'No tasks yet';
             selfCareStatusText.classList.remove('completed');
        } else if (completedTasks === 0) {
            selfCareStatusText.textContent = 'Pending';
            selfCareStatusText.classList.remove('completed');
        } else if (completedTasks < totalTasks) {
            selfCareStatusText.textContent = `${completedTasks} of ${totalTasks} tasks done`;
            selfCareStatusText.classList.remove('completed');
        } else {
            selfCareStatusText.textContent = 'All completed';
            selfCareStatusText.classList.add('completed');
        }
    }

    // 6. Check-in Deadline and Ping
    function checkDeadline() {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= CHECK_IN_DEADLINE_HOUR && !checkedIn && !pinged) {
            pingSound.play();
            pinged = true;
        }

        if (hours >= CHECK_IN_DEADLINE_HOUR && !checkedIn) {
            aliveStatusText.textContent = 'Not OK';
            aliveStatusText.classList.add('not-ok');
            escalationStatusText.textContent = 'Check-in Missed';
            escalationStatusText.classList.add('alert');
            callParentBtn.classList.remove('hidden');
            const message = encodeURIComponent("Parent missed their scheduled check-in. Please call them.");
            window.location.href = `sms:${CAREGIVER_PHONE_NUMBER}?body=${message}`;
        }
    }

    // --- Initializations ---
    callParentBtn.href = `tel:${PARENT_PHONE_NUMBER}`;
    loadTasks();
    resetState();
    updateClock();
    setInterval(updateClock, 1000);

    checkDeadline();
    setInterval(checkDeadline, 60000);

});