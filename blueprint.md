# Ambient Reassurance App

This Ambient Reassurance App is a web-based tool designed to provide peace of mind for caregivers and a simple way for their loved ones (referred to as "parents") to signal that they are okay. It features a dual-dashboard interface, multilingual support, and several key functionalities to ensure the well-being of the parent.

## Overview of Features

*   **Parent Dashboard**: A simple, accessible interface for the parent. It includes a large clock, prominent "I'm OK" and "I'm NOT OK" buttons, a voice command option, and a customizable list of daily self-care reminders.
*   **Caregiver Dashboard**: A monitoring interface that provides an at-a-glance status of the parent, including their check-in status, routine patterns, self-care task completion, and any alerts that require action.
*   **Multi-Language Support**: The entire application interface can be switched between English, Chinese (Simplified), Malay, and Tamil.
*   **Voice Commands**: The parent can use their voice to check in by saying "I'm OK" or "I'm Not OK" in their selected language. The app provides real-time feedback on the voice command status.
*   **Text-to-Speech (TTS)**: When the parent checks in, the app provides audible confirmation in the selected language.
*   **Check-In with Timestamp & Location**: When a parent checks in, the app captures and displays the time and their geographical location (with permission) on the caregiver's dashboard for added reassurance.
*   **Customizable Reminders**: The list of daily self-care tasks can be easily managed directly within the app.
*   **Automatic Escalation**: If the parent misses the daily check-in deadline (configurable), the app automatically triggers an alert on the caregiver's dashboard.

## Design and Style

*   **Aesthetics**: The app uses a clean, modern design with a light and airy color palette (using the `oklch` color model for modern, vibrant colors). It features soft shadows, rounded corners, and clear typography to create a calming and intuitive user experience.
*   **Responsiveness**: The layout is fully responsive and adapts to different screen sizes, ensuring it works well on both desktop and mobile devices.
*   **Interactivity**: Buttons and interactive elements provide clear visual feedback, such as animations and color changes, to acknowledge user actions.

## Current Plan: Fixes and New Features

This section outlines the plan for the latest round of updates.

1.  **Fix Language Refresh Bug**: The previous implementation did not consistently refresh all UI elements when the language was changed. This has been fixed by creating a centralized `refreshUI()` function that correctly updates all text and component states.
2.  **Add Text-to-Speech (TTS)**: Implemented a `speak()` function that provides audio feedback when the "I'm OK" or "I'm NOT OK" buttons are pressed.
3.  **Implement Robust Voice Commands**: The original voice recording feature has been replaced with a full-fledged voice command system.
    *   The system now actively listens for and interprets "I'm OK" and "I'm Not OK" commands.
    *   It includes comprehensive error handling and visual feedback for microphone permissions, no-speech events, and unrecognized commands.
4.  **Add Timestamp and Location on Check-in**: To provide more context for the caregiver, the application will now capture and display the time and the parent's geographical location when they check in. This information will appear on the caregiver's dashboard.