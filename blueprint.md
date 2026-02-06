# Project Blueprint: Ambient Reassurance App

## Overview

This document outlines the plan for a mobile-first web app (PWA) designed for elderly individuals living alone and their adult children caregivers. The app's core purpose is to provide ambient reassurance to caregivers without constant monitoring, escalating only when patterns indicate a real risk.

## Core Principles

*   **Simplicity:** Extremely simple interface with large text and buttons.
*   **Passive Signals:** Prioritize passive signals over active reporting.
*   **Exception-Based Escalation:** Alerts are triggered only when patterns deviate significantly.

## Implemented Features & Design

### UI/UX
*   **Layout:** A single-page application with two distinct views: one for the "Parent" and one for the "Caregiver".
*   **Parent View:**
    *   A large, prominent "I'm OK" button for daily check-ins.
    *   A simple self-care checklist.
    *   A digital clock to help with time orientation.
    *   Large, readable fonts and high-contrast colors.
*   **Caregiver View:**
    *   Status indicators for "Alive & Okay", "Routine Normal", and "Self-care".
    *   A clean, easy-to-read summary of the parent's status.
*   **Styling:**
    *   **Color Palette:** A calming and accessible color scheme.
    *   **Typography:** Large, clear fonts for readability.
    *   **Visual Effects:** Subtle shadows to create a sense of depth and lift interactive elements.

### Core Functionality

*   **Daily Check-in:** The "I'm OK" button updates the "Alive & Okay" status in the caregiver's view.
*   **Self-Care Checklist:** The parent can check off items on their to-do list, and the caregiver's view is updated accordingly.
*   **Check-in Deadline:** If the parent has not checked in by 12:00 PM, the "Alive & Okay" status in the caregiver's view will change to "Not OK".

## Current Plan

This phase focused on adding a clock to the Parent view for better time orientation, updating the dashboard titles to "Parent" and "Caregiver", and implementing the 12:00 PM check-in deadline. The next step is to integrate Firebase for data persistence and real-time communication between the two views.
