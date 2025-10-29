# ECG HeartScape - ECG Analysis Application

## Overview

ECG HeartScape is an advanced ECG analysis application that uses AI to detect heart abnormalities and provide health insights.

## Features

- Real-time ECG data analysis
- AI-powered heart abnormality detection
- Secure user authentication
- Detailed health insights and recommendations
- Interactive visualization of ECG data

## Getting Started

### Prerequisites

- Node.js 16 or higher
- Docker Desktop (for local development)
- Git

### Development Setup

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server.
npm run dev

## Localhost & Network Access

Once the development server is running, you can access the app at:

- Local: http://localhost:3000
- Network: http://<your-ip-address>:3000

Replace `<your-ip-address>` with your actual local network IP (shown in the terminal when you run `npm run dev`).


# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
