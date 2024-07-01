# Remindify Software Design Development Program

Remindify is a simple reminders program that's easily accessible to a wide range of users. Its simplistic design will allow for it to run in the background without damaging the performance of the user's computer.

## How to install and view the code
You can download this by downloading the zip file by pressing the **GREEN "CODE"** button and pressing **"Download ZIP"** or  you click each file and download the individual raw files individually via the right-hand side download button.

### Extensions
* Prettier - Code formatter v10.4.0

These are accessed and installed through the sidebar on the left of Visual Studio and go to 'Extensions' (or Ctrl + Shift + X).

**NOTE: Please note that the notification system of the program doesn't work consistently when it's run through Visual Studio Code. Rather, when you wish to view the code at its full functionality open this link in the [Verscel App](https://sdd-reminders-app-dgo7.vercel.app/).**

When you want to see the Reminders App Program function, keep the Vercel App link running in the background in your tabs and make sure to **_allow notifications_** when opening up the app as well as **_enabling notifications for Chrome_ (or what other web browser you're using)** within your computer device. 
* When you want to view the code, it's suggested you view it in VSC with the _Prettier Extension_ 

## How to navigate Remindify
Firstly, if you block the notification window either refresh the page and allow it or go to settings and enable notifications on your respective search engine.

Within the app, you're provided with a _Title, Description, Time and Date_ box to input into, this will decide what the schedule is about and shows when and if it's due within the table when the tasks are scheduled. **ALL FIELDS MUST BE FILLED OR ELSE A TASK CAN'T BE SCHEDULED**

There are three reminders in total, the app will send a desktop notification to your computer exactly one day, one hour and on the due date/time, playing a noise to aurally signal the user in case they don't see the notification. 

The countdown under the _Status_ column will count down to how much time there's left. Once time hits, the countdown is replaced with red text saying **Overdue**.

The user is also provided with a delete button next to the task to clear space for any overdue tasks or if they've made a mistake scheduling.  

###
When pressing the _'Save Reminders as a Text File'_ button, the program installs a '.txt' file that stores all the data that the user has inputted and neatly organises it within said text file. 
When the app is rerun or refreshed, the progress will be removed. The _'Choose File'_ button's purpose is to redirect the user to their computer files and they're to choose one of the Remindify text files they've previously saved on their computer to load previous schedules.
