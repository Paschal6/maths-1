let duration = 60 * 60; // 60 minutes in seconds
let timerInterval = null;

function startTimer(onExpire) {

    const timerDisplay = document.getElementById("timer");

    function update() {

        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        timerDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (duration <= 0) {

            clearInterval(timerInterval);

            if (onExpire) onExpire();

        }

        duration--;

    }

    update();
    timerInterval = setInterval(update, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}