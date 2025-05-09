# Interviewer Scheduler

**Interviewer Scheduler** is a React (v19.x) app that lets recruiters easily book and manage technical interviews between candidates and engineering interviewers.

## Features

- **Interactive Calendar**  
  Powered by [react‑big‑calendar](https://github.com/jquense/react-big-calendar), you can quickly create, move or resize interview slots.  
- **Dynamic Filters**  
  Narrow down your view by candidate name, interviewer (engineer) or time range.  

## Tech Stack

- **Frontend:** React v19.x  
- **Calendar:** react‑big‑calendar  

## Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/AlejoE02/interviewer-scheduler.git
   cd interviewer-scheduler
2. **Install dependencies**
   ```bash
   npm i
3. **Run in development**
   ```bash
   npm run start

## Data Configuration

By default, engineer and candidate data are stored as static JSON files in `public/data/`.

- **Files:** `engineers.json`, `candidates.json`
- **Location:** `public/data/`

You can update these files at any time to change which slots appear on the calendar.

> **Note:** The sample data is set to display slots during the week of **May 12 – 18, 2025**. If you run the app after that week, edit the dates in the JSON files so your events fall within the current calendar view.

## Video

The video explanation of the code
- **Location:** `public/video/`
