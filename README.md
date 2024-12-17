# React Native Demo Wallet

This project is a React Native application designed to demonstrate a wallet functionality. It uses Vercel Serverless Functions to handle API requests and is configured to run on iOS, Android, and web platforms.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Scripts Explanation](#scripts-explanation)
- [Configuration Files](#configuration-files)
  - [app.json](#appjson)
  - [eas.json](#easjson)
  - [assetlinks.json](#assetlinksjson)
  - [apple-app-site-association](#apple-app-site-association)
- [Common Issues](#common-issues)

## Setup Instructions

### Prerequisites

- Node.js (version >= 20)
- Xcode - required for running the iOS simulator
- Android Studio - required for running the Android emulator and viewing logs via Logcat
- (Optional) Vercel CLI - used to host the [apple-app-site-association](public/.well-known/apple-app-site-association) and [assetlinks.json](public/.well-known/assetlinks.json) but you may use any hosting service you want

### Clone the Repository

```bash
git clone git@github.com:tkhq/react-native-demo-wallet.git
cd react-native-demo-wallet
```

### Install Dependencies

```bash
npm install
```

### Run the Application

To start the application, you can use the following scripts:

- **iOS**: `npm run dev`
- **Android**: `npm run dev:android`
- **Web**: `npm run dev:web`

### Deploy to Vercel

1. Install the Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Run the app locally:

   ```bash
   vercel dev
   ```

3. Deploy the app:

   ```bash
   vercel deploy
   ```

## Scripts Explanation

- **`dev`**: Starts the Expo server for iOS.
- **`dev:web`**: Starts the Expo server for web.
- **`dev:android`**: Starts the Expo server for Android.
- **`api`**: Runs the Vercel development server.
- **`clean`**: Removes the `.expo` and `node_modules` directories.
- **`postinstall`**: Compiles Tailwind CSS for nativewind.

## Configuration Files

### app.json

This file contains the configuration for the Expo app, including:

- **name**: The name of the app.
- **slug**: A URL-friendly version of the app name.
- **version**: The app version.
- **orientation**: The screen orientation.
- **icon**: Path to the app icon.
- **scheme**: Custom URL scheme for deep linking.
- **plugins**: List of plugins used, such as `expo-router` and `expo-build-properties`.

### eas.json

This file configures the Expo Application Services (EAS) for building and submitting the app:

- **cli**: Specifies the CLI version and app version source.
- **build**: Contains build profiles for development, preview, and production.
- **submit**: Configuration for app submission.

### assetlinks.json

This file is used for Android app linking:

- **relation**: Defines the permissions for handling URLs and login credentials.
- **target**: Specifies the Android app package name and SHA-256 certificate fingerprint.

### apple-app-site-association

This file is used for iOS app linking:

- **webcredentials**: Lists the apps that can access web credentials.
