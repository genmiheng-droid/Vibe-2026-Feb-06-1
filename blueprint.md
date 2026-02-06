# Ambient Reassurance App

This Ambient Reassurance App is a web-based tool designed to provide peace of mind for caregivers and a simple way for their loved ones (referred to as "parents") to signal that they are okay. It features a dual-dashboard interface, multilingual support, and several key functionalities to ensure the well-being of the parent.

## Overview of Features

*   **Parent Dashboard**: A simple, accessible interface for the parent. It includes a large clock, prominent "I'm OK" and "I'm NOT OK" buttons, a voice command option, and a customizable list of daily self-care reminders.
*   **Caregiver Dashboard**: A monitoring interface that provides an at-a-glance status of the parent, including their check-in status, routine patterns, self-care task completion, and any alerts that require action.
*   **Multi-Language Support**: The entire application interface can be switched between English, Chinese (Simplified), Malay, and Tamil.
*   **Voice Commands**: The parent can use their voice to check in by saying "I'm OK" or "I'm Not OK" in their selected language. The app provides real-time feedback on the voice command status.
*   **Text-to-Speech (TTS)**: When the parent checks in, the app provides audible confirmation in the selected language.
*   **Check-In with Human-Readable Location**: When a parent checks in, the app captures their geographical coordinates and uses a reverse geocoding service (OpenStreetMap) to display a user-friendly address (e.g., street and city) along with the timestamp on the caregiver's dashboard.
*   **Customizable Reminders**: The list of daily self-care tasks can be easily managed directly within the app.
*   **Automatic Escalation**: If the parent misses the daily check-in deadline (configurable), the app automatically triggers an alert on the caregiver's dashboard.

## Design and Style

*   **Aesthetics**: The app uses a clean, modern design with a light and airy color palette (using the `oklch` color model for modern, vibrant colors). It features soft shadows, rounded corners, and clear typography to create a calming and intuitive user experience.
*   **Responsiveness**: The layout is fully responsive and adapts to different screen sizes, ensuring it works well on both desktop and mobile devices.
*   **Interactivity**: Buttons and interactive elements provide clear visual feedback, such as animations and color changes, to acknowledge user actions.

## Current Plan: Fixes and New Features

This section outlines the plan for the latest round of updates.

1.  **Fix Language Refresh Bug**: Addressed an issue where UI elements did not consistently update after a language change.
2.  **Add Text-to-Speech (TTS)**: Implemented audio feedback for check-in actions.
3.  **Implement Robust Voice Commands**: Upgraded the voice feature to a full command system with better feedback and error handling.
4.  **Implement Human-Readable Location**: Replaced GPS coordinates with a user-friendly address from the OpenStreetMap API.
5.  **Improve Location Error Handling**:
    *   **Detailed Error Messages**: Instead of a generic "Location not available" message, the UI now displays specific reasons for failure (e.g., "Location permission was denied," "Request to get location timed out").
    *   **Fix Button Locking Logic**: Corrected a flaw where the check-in buttons would become disabled even if the location lookup failed. The buttons now remain active on error, allowing the user to retry.