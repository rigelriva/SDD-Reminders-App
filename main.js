// Check if Notifications are supported in the current browser environment
if ("Notification" in window) {
    // Request permission to show notifications if permission is not already granted or denied
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        // Prompt user for permission to display notifications
        Notification.requestPermission().then(function (permission) {
            // If permission is not granted, alert the user to allow notification access
            if (permission !== "granted") {
                alert("Please allow notification access!");
            }
        });
    }
}

// Array to store timeout IDs of scheduled reminders
var timeoutIds = [];

// Function to schedule a reminder based on user input
function scheduleReminder() {
    // Fetch values from input fields and trim whitespace
    var title = document.getElementById("title").value.trim();
    var description = document.getElementById("description").value.trim();
    var date = document.getElementById("date").value.trim();
    var time = document.getElementById("time").value.trim();

    // Check if any required fields are empty
    if (title === "" || description === "" || date === "" || time === "") {
        // Highlight missing fields in red and provide alert message
        if (title === "") document.getElementById("title").style.outline = "1px solid red";
        else document.getElementById("title").style.outline = "";

        if (description === "") document.getElementById("description").style.outline = "1px solid red";
        else document.getElementById("description").style.outline = "";

        if (date === "") document.getElementById("date").style.outline = "1px solid red";
        else document.getElementById("date").style.outline = "";

        if (time === "") document.getElementById("time").style.outline = "1px solid red";
        else document.getElementById("time").style.outline = "";

        alert("Please fill in all fields.");
        return;
    }

    // Combine date and time inputs into a single string representing the reminder's date and time
    var dateTimeString = date + " " + time;

    // Convert the combined string into a JavaScript Date object representing the scheduled time of the reminder
    var scheduledTime = new Date(dateTimeString);

    // Get the current time
    var currentTime = new Date();

    // Calculate the difference in milliseconds between the scheduled time and the current time
    var timeDifference = scheduledTime - currentTime;

    // Calculate times for 1 day and 1 hour before the scheduled time
    var oneDayBefore = timeDifference - (24 * 60 * 60 * 1000);
    var oneHourBefore = timeDifference - (60 * 60 * 1000);

    // Check if the scheduled time is in the future
    if (timeDifference > 0) {
        // Add the reminder to the UI and update the reminder table
        addReminder(title, description, dateTimeString);

        // Schedule a notification one day before the scheduled time, if applicable
        if (oneDayBefore > 0) {
            var oneDayTimeoutId = setTimeout(function () {
                // Play the notification sound
                document.getElementById("notificationSound").play();

                // Create a notification for the reminder one day before its due date
                var notification = new Notification("Reminder: " + title, {
                    body: "This task is due in 1 day.",
                    requireInteraction: true,  // Ensure the notification stays visible until interacted with
                });
            }, oneDayBefore);

            // Store the timeout ID in the array for later reference (e.g., to cancel the timeout if needed)
            timeoutIds.push(oneDayTimeoutId);
        }

        // Schedule a notification one hour before the scheduled time, if applicable
        if (oneHourBefore > 0) {
            var oneHourTimeoutId = setTimeout(function () {
                // Play the notification sound
                document.getElementById("notificationSound").play();

                // Create a notification for the reminder one hour before its due date
                var notification = new Notification("Reminder: " + title, {
                    body: "This task is due in 1 hour.",
                    requireInteraction: true,  // Ensure the notification stays visible until interacted with
                });
            }, oneHourBefore);

            // Store the timeout ID in the array for later reference (e.g., to cancel the timeout if needed)
            timeoutIds.push(oneHourTimeoutId);
        }

        // Schedule a notification for when the reminder is due
        var dueTimeoutId = setTimeout(function () {
            // Play the notification sound
            document.getElementById("notificationSound").play();

            // Create a notification for the overdue reminder
            var notification = new Notification(title + " is overdue!", {
                body: description,
                requireInteraction: true,  // Ensure the notification stays visible until interacted with
            });
        }, timeDifference);

        // Store the timeout ID in the array for later reference (e.g., to cancel the timeout if needed)
        timeoutIds.push(dueTimeoutId);

        // Clear input fields after scheduling the reminder
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";

        // Show a success message box briefly to indicate the reminder was successfully scheduled
        var successBox = document.getElementById("successBox");
        successBox.style.display = "block";
        setTimeout(function () {
            successBox.style.display = "none";
        }, 2000); // Hide the success message box after 2 seconds

    } else {
        // If the scheduled time is in the past, display an alert message
        alert("The scheduled time is in the past! Please input an upcoming time.");
    }   
}

// Function to add a reminder to the reminder table in the UI
function addReminder(title, description, dateTimeString) {
    var tableBody = document.getElementById("reminderTableBody");

    // Create a new row in the reminder table
    var row = tableBody.insertRow();

    // Insert cells into the new row for displaying reminder details and actions
    var titleCell = row.insertCell(0);
    var descriptionCell = row.insertCell(1);
    var dateTimeCell = row.insertCell(2);
    var passedCell = row.insertCell(3); // Cell to display countdown or overdue status
    var actionCell = row.insertCell(4); // Cell for action buttons (e.g., delete button)

    // Set the inner HTML of each cell with the corresponding reminder information
    titleCell.innerHTML = title;
    descriptionCell.innerHTML = description;
    dateTimeCell.innerHTML = dateTimeString;

    // Convert the combined string into a JavaScript Date object representing the reminder's date and time
    var reminderTime = new Date(dateTimeString);

    // Get the current time
    var currentTime = new Date();

    // Calculate the difference in milliseconds between the reminder's scheduled time and the current time
    var timeDifference = reminderTime - currentTime;

    // Display countdown or overdue status in the 'passedCell' cell of the reminder table
    if (timeDifference > 0) {
        // Calculate days, hours, minutes, and seconds remaining until the reminder's scheduled time
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        // Display the remaining time until the reminder's scheduled time as a countdown
        passedCell.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

        // Update the countdown timer every second
        var countdownInterval = setInterval(function() {
            timeDifference -= 1000;

            if (timeDifference > 0) {
                days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                passedCell.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
            } else {
                // If the reminder's scheduled time has passed, display "Overdue" in the 'passedCell'
                clearInterval(countdownInterval);
                passedCell.innerHTML = "Overdue";
            }
        }, 1000);
    } else {
        // If the reminder's scheduled time has passed, display "Overdue" in the 'passedCell'
        passedCell.innerHTML = "Overdue";
    }

    // Insert a delete button in the 'actionCell' cell of the reminder table row
    actionCell.innerHTML = '<button onclick="deleteReminder(this);">Delete</button>';
}

// Function to delete a reminder from the reminder table in the UI
function deleteReminder(button) {
    var row = button.closest("tr");   // Find the row containing the reminder to be deleted
    var index = row.rowIndex;    // Get the index of the row in the reminder table
    clearTimeout(timeoutIds[index - 1]);     // Clear the timeout associated with the reminder being deleted from the 'timeoutIds' array

    // Remove the timeout ID from the 'timeoutIds' array
    timeoutIds.splice(index - 1, 1);

    // Remove the row containing the reminder from the reminder table in the UI
    row.remove();
}

// Function to save reminders to a text file for later retrieval
function saveReminders() {
    var tableBody = document.getElementById("reminderTableBody");
    var reminders = [];

    // Iterate through each row in the reminder table
    for (var i = 0; i < tableBody.rows.length; i++) {
        var row = tableBody.rows[i];

        // Format reminder information with labels for title, description, and date/time
        var reminder = "Title: " + row.cells[0].innerHTML + "\n" +
                       "Description: " + row.cells[1].innerHTML + "\n" +
                       "DateTime: " + row.cells[2].innerHTML + "\n";

        // Add formatted reminder information to the 'reminders' array
        reminders.push(reminder);
    }

    var blob = new Blob([reminders.join('\n')], { type: 'text/plain' });     // Create a Blob containing all reminders formatted as text
    var url = URL.createObjectURL(blob);   // Create a URL for the Blob object
    var downloadLink = document.createElement('a');    // Create a new download link element   
    downloadLink.href = url;  // Set the download link's URL to the Blob URL
    downloadLink.download = 'remindify_save.txt';     // Set the filename for the downloaded file

    // Programmatically trigger a click event on the download link to initiate the download
    downloadLink.click();

    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(url);
}

// Function to load reminders from a text file into the reminder table in the UI
function loadReminders(event) {
    // Retrieve the selected file from the file input element
    var file = event.target.files[0];

    // Check if a file was selected
    if (file) {
        var reader = new FileReader();

        // Define behavior when the FileReader finishes reading the file
        reader.onload = function(e) {
            // Split the file content into an array of reminder strings based on double line breaks
            var reminders = e.target.result.split('\n\n');

            // Get the reminder table body element
            var tableBody = document.getElementById("reminderTableBody");

            // Clear existing reminders from the reminder table in the UI
            tableBody.innerHTML = '';

            // Iterate through each reminder string in the 'reminders' array
            reminders.forEach(function(reminder) {
                if (reminder.trim() !== '') {
                    // Split each reminder string into parts based on single line breaks
                    var parts = reminder.split('\n');

                    // Extract title, description, and date/time from the reminder parts
                    var title = parts[0].replace("Title:", "").trim();
                    var description = parts[1].replace("Description:", "").trim();
                    var dateTimeString = parts[2].replace("DateTime:", "").trim();

                    // Add the extracted reminder information to the reminder table in the UI
                    addReminder(title, description, dateTimeString);
                }
            });
        };

        // Read the selected file as text using the FileReader
        reader.readAsText(file);
    }
}
