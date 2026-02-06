document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const checkInBtn = document.getElementById('check-in-btn');
    const notOkBtn = document.getElementById('not-ok-btn');
    const selfCareCheckboxes = document.querySelectorAll('#self-care-list input[type="checkbox"]');
    const clockElement = document.getElementById('clock');
    const aliveStatusText = document.getElementById('alive-status-text');
    const selfCareStatusText = document.getElementById('self-care-status-text');
    const escalationStatusText = document.getElementById('escalation-status-text');
    const callCaregiverBtn = document.getElementById('call-caregiver-btn');
    const alertSound = document.getElementById('alert-sound');
    const pingSound = document.getElementById('ping-sound');

    // --- State ---
    let checkedIn = false;
    let pinged = false;

    // --- Functions ---

    // 0. Reset Application State
    function resetState() {
        checkedIn = false;
        pinged = false;

        // Reset Parent view
        checkInBtn.textContent = "I'm OK";
        checkInBtn.disabled = false;
        checkInBtn.style.backgroundColor = 'oklch(65% 0.2 150)';
        notOkBtn.disabled = false;
        selfCareCheckboxes.forEach(checkbox => checkbox.checked = false);

        // Reset Caregiver view
        aliveStatusText.textContent = 'Pending';
        aliveStatusText.classList.remove('confirmed', 'not-ok');
        selfCareStatusText.textContent = 'Pending';
        selfCareStatusText.classList.remove('completed');
        escalationStatusText.textContent = 'All clear';
        escalationStatusText.classList.remove('alert');
        callCaregiverBtn.classList.add('hidden');

        updateSelfCareStatus();
    }

    // 1. Update Clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }

    // 2. "I'm OK" Check-in
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

    // 3. "I'm NOT OK" Alert
    notOkBtn.addEventListener('click', () => {
        aliveStatusText.textContent = 'NOT OK';
        aliveStatusText.classList.add('not-ok');
        escalationStatusText.textContent = 'Action Required!';
        escalationStatusText.classList.add('alert');
        callCaregiverBtn.classList.remove('hidden');
        alertSound.play();
        window.location.href = 'tel:87654321'; // Automatically call caregiver
        checkInBtn.disabled = true;
        notOkBtn.disabled = true;
    });

    // 4. Self-Care Checklist
    selfCareCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelfCareStatus);
    });

    function updateSelfCareStatus() {
        const totalTasks = selfCareCheckboxes.length;
        let completedTasks = 0;
        selfCareCheckboxes.forEach(cb => {
            if (cb.checked) {
                completedTasks++;
            }
        });

        if (completedTasks === 0) {
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

    // 5. Check-in Deadline and Ping
    function checkDeadline() {
        const now = new Date();
        const hours = now.getHours();

        // Ping at 10 AM if not checked in
        if (hours >= 10 && !checkedIn && !pinged) {
            pingSound.play();
            pinged = true; // Ensure ping only happens once
        }

        // If it's 10 AM or later and still no check-in
        if (hours >= 10 && !checkedIn) {
            aliveStatusText.textContent = 'Not OK';
            aliveStatusText.classList.add('not-ok');
            escalationStatusText.textContent = 'Check-in Missed';
            escalationStatusText.classList.add('alert');
            callCaregiverBtn.classList.remove('hidden');
            window.location.href = 'tel:87654321'; // Automatically call caregiver
        }
    }

    // --- Initializations ---
    resetState(); // Reset the app state on every page load
    updateClock();
    setInterval(updateClock, 1000);

    checkDeadline();
    setInterval(checkDeadline, 60000); // Check every minute

    updateSelfCareStatus();

});