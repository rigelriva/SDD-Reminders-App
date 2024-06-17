// Ask user to allow notification access
if ("Notification" in window) {
    Notification.requestPermission().then(function (permission) {
        if (Notification.permission !== "granted") {
            alert("Please allow notification access!");
            location.reload();
        }
    });
}

var timeoutIds = [];

// ------------------------------------------------------------------------------------------

function scheduleReminder() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    var dateTimeString = date + " " + time;
    var scheduledTime = new Date(dateTimeString);
    var currentTime = new Date();
    var timeDifference = scheduledTime - currentTime;
    var oneDayBefore = timeDifference - (24 * 60 * 60 * 1000);

    if (timeDifference > 0) {
        addReminder(title, description, dateTimeString);

        if (oneDayBefore > 0) {
            var oneDayTimeoutId = setTimeout(function () {
                var notification = new Notification("Reminder: " + title, {
                    body: "This task is due in 1 day.",
                    requireInteraction: true,
                });
            }, oneDayBefore);

            timeoutIds.push(oneDayTimeoutId);
        }

        var dueTimeoutId = setTimeout(function () {
            document.getElementById("notificationSound").play();

            var notification = new Notification(title + " is overdue!", {
                body: description,
                requireInteraction: true,
            });
        }, timeDifference);

        timeoutIds.push(dueTimeoutId);

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";

        // Show success message box
        var successBox = document.getElementById("successBox");
        successBox.style.display = "block";
        setTimeout(function () {
            successBox.style.display = "none";
        }, 2000); // Hide after 2 seconds

    } else {
        alert("The scheduled time is in the past!");
    }
}

// ------------------------------------------------------------------------------------------

function addReminder(title, description, dateTimeString) {
    var tableBody = document.getElementById("reminderTableBody");

    var row = tableBody.insertRow();

    var titleCell = row.insertCell(0);
    var descriptionCell = row.insertCell(1);
    var dateTimeCell = row.insertCell(2);
    var passedCell = row.insertCell(3); // New cell for passed status
    var actionCell = row.insertCell(4);

    titleCell.innerHTML = title;
    descriptionCell.innerHTML = description;
    dateTimeCell.innerHTML = dateTimeString;

    // Calculate time difference
    var reminderTime = new Date(dateTimeString);
    var currentTime = new Date();
    var timeDifference = reminderTime - currentTime;

    // Display countdown or overdue status
    if (timeDifference > 0) {
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        passedCell.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        // Update countdown every second
        var countdownInterval = setInterval(function() {
            timeDifference -= 1000;

            if (timeDifference > 0) {
                days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                passedCell.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
            } else {
                clearInterval(countdownInterval);
                passedCell.innerHTML = "Overdue";
            }
        }, 1000);
    } else {
        passedCell.innerHTML = "Overdue";
    }

    actionCell.innerHTML = '<button onclick="deleteReminder(this);">Delete</button>';
}

// ------------------------------------------------------------------------------------------

function deleteReminder(button) {
    var row = button.closest("tr");
    var index = row.rowIndex;

    clearTimeout(timeoutIds[index - 1]);
    timeoutIds.splice(index - 1, 1);

    row.remove();
}

// ------------------------------------------------------------------------------------------

function saveReminders() {
    var tableBody = document.getElementById("reminderTableBody");
    var reminders = [];

    for (var i = 0; i < tableBody.rows.length; i++) {
        var row = tableBody.rows[i];
        var reminder = [
            row.cells[0].innerHTML,
            row.cells[1].innerHTML,
            row.cells[2].innerHTML
        ].join('|');
        reminders.push(reminder);
    }

    var blob = new Blob([reminders.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'reminders.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function loadReminders(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var reminders = e.target.result.split('\n');
            var tableBody = document.getElementById("reminderTableBody");
            tableBody.innerHTML = ''; // Clear existing reminders
            reminders.forEach(function(reminder) {
                if (reminder.trim() !== '') {
                    var parts = reminder.split('|');
                    addReminder(parts[0], parts[1], parts[2]);
                }
            });
        };
        reader.readAsText(file);
    }
}
