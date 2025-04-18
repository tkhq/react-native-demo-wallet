# React Native Demo Wallet

This project is a React Native application designed to demonstrate wallet functionality. It is built on top of the [Expo Turnkey Template](https://github.com/tkhq/expo-template) and has been modified to serve as a full-fledged example application.

## **Demo**

https://github.com/user-attachments/assets/e4cff012-11e9-4636-b67a-5dbf75355832

## **Setup Instructions**

### **Clone the Repository**

```sh
git clone https://github.com/tkhq/react-native-demo-wallet.git
cd react-native-demo-wallet
```

### **Install Dependencies**

```sh
npm install
```

## **Configuration Files**

### **Environment Variables**

Both the frontend and backend require environment variables to function properly. Example environment variable files are included in the repository:

- **Frontend**: `.env.example` in the root directory
- **Backend**: `.env.example` in the `example-server` directory

You should copy these files and rename them to `.env`, then update the values as needed.

#### **Frontend (`.env` in `react-native-demo-wallet`)**

```ini
## General App Info
EXPO_PUBLIC_PASSKEY_APP_NAME="<your_app_name>"
EXPO_PUBLIC_RPID="<your_rpid_domain>"
EXPO_PUBLIC_BACKEND_API_URL="<your_backend_api_url>"
EXPO_PUBLIC_APP_SCHEME="<your_app_scheme>"   # Replace with your app scheme (myapp or myapp://)

## Turnkey Configuration
EXPO_PUBLIC_TURNKEY_ORGANIZATION_ID="<your_turnkey_organization_id>"
EXPO_PUBLIC_TURNKEY_API_URL="https://api.turnkey.com"

## Google OAuth Credentials
EXPO_PUBLIC_GOOGLE_CLIENT_ID="<your_google_web_client_id>"
```

#### **Backend (`.env` in `example-server`)**

```ini
PORT="3000"

TURNKEY_API_URL="https://api.turnkey.com"
TURNKEY_ORGANIZATION_ID="<your_turnkey_organization_id>"

TURNKEY_API_PUBLIC_KEY="<your_turnkey_api_public_key>"
TURNKEY_API_PRIVATE_KEY="<your_turnkey_api_private_key>"
```

### **Start the Development Server**

#### **iOS (default platform)**

```sh
npm run dev
```

#### **Start the Example Backend Server**

```sh
cd example-server
npm install
npm run start
```

## **Passkey Setup**

To enable passkeys, you must configure your app’s `app.json` file and set up an associated domain. For details on setting up Apple's **Associated Domains**, refer to [Apple's Documentation](https://developer.apple.com/documentation/xcode/supporting-associated-domains). For Android, you must configure **Digital Asset Links** by setting up an `assetlinks.json` file. Refer to [Google's Documentation](https://developer.android.com/training/app-links/verify-android-applinks).

### **1. Update `app.json` with associated domains:**

```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "<your_bundle_identifier>",
    "associatedDomains": ["webcredentials:<your_domain>"]
  },
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "category": ["BROWSABLE", "DEFAULT"],
        "data": {
          "scheme": "https",
          "host": "<your_domain>"
        }
      }
    ]
  }
}
```

### **2. Ensure `EXPO_PUBLIC_RPID` is set correctly in your `.env` file:**

```ini
EXPO_PUBLIC_RPID="<your_rpid_domain>"
```

## OAuth Setup

To configure Google OAuth, follow these steps:

### 1. Create a Google Web Client ID:
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Create a new OAuth client ID.
- Set the authorized origin to:
  ```
  https://oauth-origin.turnkey.com
  ```
- Set the authorized redirect URI to:
  ```
  https://oauth-redirect.turnkey.com?scheme=react-native-demo-wallet
  ```

### 2. Set your Client ID in `.env`:

In your project's `.env` file, add the following:

```ini
EXPO_PUBLIC_GOOGLE_CLIENT_ID="<your_google_web_client_id>"
```