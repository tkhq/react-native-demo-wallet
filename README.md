# React Native Demo Wallet

This project is a React Native application designed to demonstrate wallet functionality. It uses Vercel Serverless Functions to handle API requests and is configured to run on iOS, Android, and web platforms.

## **Demo**

---

## **Table of Contents**

- [Setup Instructions](#setup-instructions)
- [Scripts Explanation](#scripts-explanation)
- [Configuration Files](#configuration-files)
  - [app.json](#appjson)
  - [eas.json](#easjson)
  - [assetlinks.json](#assetlinksjson)
  - [apple-app-site-association](#apple-app-site-association)
  - [Environment Variables](#environment-variables)
- [Passkey & OAuth Configuration](#passkey--oauth-configuration)
  - [Passkeys](#passkeys)
  - [Sign in with Google](#sign-in-with-google)
  - [Sign in with Apple](#sign-in-with-apple)

---

## **Setup Instructions**

### **Prerequisites**

Ensure you have the following installed:

| Requirement           | Version                                                             |
| --------------------- | ------------------------------------------------------------------- |
| Node.js               | >= 20                                                               |
| Xcode (for iOS)       | >= 12                                                               |
| Android Studio        | >= 4.0                                                              |
| (Optional) Vercel CLI | Used for hosting `apple-app-site-association` and `assetlinks.json` |

### **Clone the Repository**

```sh
git clone git@github.com:tkhq/react-native-demo-wallet.git
cd react-native-demo-wallet
```

### **Install Dependencies**

```sh
npm install
```

### **Run the Application**

To start the application, use one of the following:

- **iOS:**
  ```sh
  npm run dev
  ```
- **Android:**
  ```sh
  npm run dev:android
  ```
- **Web:**
  ```sh
  npm run dev:web
  ```

### **Deploy to Vercel**

Install the Vercel CLI:

```sh
npm i -g vercel
```

Run the app locally:

```sh
vercel dev
```

Deploy the app:

```sh
vercel deploy
```

---

## **Scripts Explanation**

| Script        | Description                                         |
| ------------- | --------------------------------------------------- |
| `dev`         | Starts the Expo server for iOS.                     |
| `dev:web`     | Starts the Expo server for web.                     |
| `dev:android` | Starts the Expo server for Android.                 |
| `api`         | Runs the Vercel development server.                 |
| `clean`       | Removes the `.expo` and `node_modules` directories. |
| `postinstall` | Compiles Tailwind CSS for `nativewind`.             |

---

## **Configuration Files**

### **app.json**

This file contains the Expo app configuration:

- `name`: App name
- `slug`: URL-friendly app name
- `version`: App version
- `orientation`: Screen orientation
- `icon`: Path to app icon
- `scheme`: Custom URL scheme for deep linking
- `plugins`: List of Expo plugins

### **eas.json**

Configures Expo Application Services (EAS) for app builds & submissions:

- `cli`: Specifies CLI version
- `build`: Contains build profiles (development, preview, production)
- `submit`: App submission settings

### **assetlinks.json**

Used for Android app linking:

- `relation`: Defines permissions for handling URLs & login credentials
- `target`: Specifies the Android app package name & SHA-256 fingerprint

### **apple-app-site-association**

Used for iOS app linking:

- `webcredentials`: Lists apps that can access web credentials

### **Environment Variables**

Create a `.env` file in the root directory of your project. You can use the provided `.env.example` file as a template:

```env
# ------------------------------
# SERVER-SIDE CONFIGURATION
# ------------------------------

TURNKEY_API_PUBLIC_KEY="<your_turnkey_api_public_key>"
TURNKEY_API_PRIVATE_KEY="<your_turnkey_api_private_key>"

# ------------------------------
# CLIENT-SIDE CONFIGURATION
# ------------------------------

## General App Info
EXPO_PASSKEY_APP_NAME="<your_app_name>"
EXPO_PUBLIC_RPID="<your_rpid_domain>"
EXPO_PUBLIC_BACKEND_API_URL="<your_backend_api_url>"

## Turnkey Configuration
EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID="<your_turnkey_organization_id>"
EXPO_PUBLIC_TURNKEY_API_URL="https://api.turnkey.com"

## Google OAuth Credentials
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID="<your_google_ios_client_id>"
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID="<your_google_android_client_id>"
```

---

## **Passkey & OAuth Configuration**

### **Passkeys**

To allow passkeys to be registered on iOS and Android, you must set up an **associated domain**.

1. **Host the `.well-known` file**

   - Create an `apple-app-site-association` file (iOS) and `assetlinks.json` file (Android).
   - Upload them to your server at:
     ```
     https://your-domain.com/.well-known/apple-app-site-association
     https://your-domain.com/.well-known/assetlinks.json
     ```

2. **Update `app.json` for Expo**

Modify the `app.json` file to include the passkey domain:

```json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "associatedDomains": [
        "webcredentials:your-domain.com",
        "applinks:your-domain.com"
      ]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "category": ["BROWSABLE", "DEFAULT"],
          "data": {
            "scheme": "https",
            "host": "your-domain.com"
          }
        }
      ]
    }
  }
}
```

3. **Set `EXPO_PUBLIC_RPID` in `.env`**
   ```
   EXPO_PUBLIC_RPID="<your_rpid_domain>"
   ```

---

### **Sign in with Google**

1. **Add Google credentials to `.env`**

   ```
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_REDIRECT_SCHEME="your-google-redirect-scheme"
   ```

2. **Modify `app.json`**

```json
{
  "expo": {
    "scheme": "your-google-redirect-scheme"
  }
}
```

---

### **Sign in with Apple**

To enable this feature, simply add the **Sign in with Apple** capability to your app in Xcode.
