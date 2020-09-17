var timer;
var isTimerActive = false;
$(document).ready(() => {
    // Add click listener to start button
    $("#start-timer").click(e=>{
        e.preventDefault();
        // Get notification access
        Notification.requestPermission(result => {
            if (result !== 'granted') {
                M.toast({ html: 'Please allow notification access to send you reminder to drink some water', classes: "amber" });
                return;
            }
            // Start timer
            startTimer();
        });
    });

    // Add click listener to stop button
    $("#stop-timer").click(e => {
        e.preventDefault();
        // Stop timer
        stopTimer();
    });
});

var startTimer = () => {
    isTimerActive = true;
    let mins = $("#mins").val();
    let secs = $("#secs").val();
    if(mins === "" || secs === "") {
        M.toast({ html: 'Please enter a valid time', classes:"red accent-1" });
        return ;
    }
    mins = parseInt(mins);
    secs = parseInt(secs);
    // Save total time in seconds
    var countdown = mins * 60 + secs;

    M.toast({ html: 'Will remind you for water after every ' + countdown + 's', classes: "red accent-1" });
    timer = setInterval(function () {
        if (countdown <= 0) {
            // Send notification
            navigator.serviceWorker.ready.then(registration => {
                console.log("showing notification")
                registration.showNotification('Drink water!', {
                    body: 'A reminder for you to drink some water',
                    icon: '../imgs/water-glass.png',
                    tag: 'vibration-sample'
                });
            });
            // Reset timer
            countdown = mins * 60 + secs;
        }
        countdown--;
        updateCountdown(countdown);
    }, 1000);
}

var stopTimer = () => {
    clearInterval(timer);
    isTimerActive = false;
    updateCountdown(0);
}

var updateCountdown = (countdown) => {
    // Check if  timer is active
    if(isTimerActive) {
        $("#time-remaining").removeClass('hide');
        $("#time-remaining").children('span').html(countdown)
    } else {    // Hide countdown as timer is inactive
        $("#time-remaining").addClass('hide');
    }
}