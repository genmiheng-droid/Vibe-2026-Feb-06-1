This Ambient Reassurance App is designed to provide a sense of connection and peace of mind for a parent and their caregiver. The app offers a simple way for the parent to signal they are okay, while also allowing the caregiver to monitor their well-being without being intrusive.

## Key Features

*   **Parent Dashboard:** A simple interface for the parent to check in, with a clear "I'm OK" button. It also includes a customizable list of daily reminders to help the parent keep track of their self-care tasks.
*   **Caregiver Dashboard:** An at-a-glance view of the parent's status, including their check-in confirmation, routine patterns, and any exceptions that may require attention.
*   **Customizable Reminders:** The daily reminders can be easily customized to fit the parent's needs. New reminders can be added, and existing ones can be edited or removed.
*   **Check-In Deadline:** The app includes a customizable deadline for the parent to check in. If the deadline is missed, the caregiver is notified so they can follow up.
*   **Multi-Language Support:** The app can be displayed in English, Chinese (Simplified), Malay, and Tamil.
*   **Voice Commands:** The parent can use their voice to check in. The app understands "I'm OK" and "I'm Not OK" in all supported languages.
*   **Text-to-Speech Feedback:** The app provides audio feedback for check-ins, announcing the status in the selected language.

## Customization

### Daily Reminders

The list of daily reminders can be modified directly in the app. To add a new reminder, simply type it into the input field on the Parent dashboard and click the "Add" button. To remove a reminder, click the "Delete" button next to it.

### Check-In Time

The check-in deadline can be adjusted by changing the `CHECK_IN_DEADLINE_HOUR` constant in the `main.js` file. The time is set in 24-hour format, so for example, `10` would be 10:00 AM.

### Language

The display language can be changed using the dropdown menu on the Parent dashboard. The selected language is saved in the browser's local storage.

## Current Plan

My plan is to enhance the app by allowing users to add new reminders directly from the Parent dashboard. This will make the app more flexible and user-friendly.

1.  **Update `index.html`:** Add a new input field and an "Add Task" button to the parent's dashboard.
2.  **Update `main.js`:** Add an event listener to the "Add Task" button to add the new reminder to the checklist and save it to local storage.
3.  **Update `style.css`:** Style the new input field and button to match the app's design.
4.  **Update `blueprint.md`:** Reflect these new customization options.
5.  **Fix Refresh Bug & Add Delete Functionality:** I will fix a bug where the reminder list doesn't automatically refresh after adding a new item. I will also add a "Delete" button to each reminder, allowing for easy removal.
6.  **Add Multi-Language Support:** I will add a language switcher to allow the app to be displayed in Chinese (Simplified), Malay, and Tamil.
7.  **Add Voice Commands and Text-to-Speech:** I will add the ability for the parent to use voice commands to check in, and the app will provide text-to-speech feedback.