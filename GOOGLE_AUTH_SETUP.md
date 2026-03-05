# Google Authentication Setup Guide

This guide will help you set up Google OAuth for the Feenixs website, allowing users to sign in with their Google accounts.

## 🔧 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on "Select a project" → "NEW PROJECT"
4. Enter project name: "Feenixs Web Auth"
5. Click "CREATE"

## 🔧 Step 2: Enable Google Sign-In API

1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Sign-In API"
3. Click on it and press "ENABLE"

## 🔧 Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Configure consent screen:
   - Choose "External" for User Type
   - Click "CREATE"
   - Fill in app information:
     - App name: "Feenixs AI Platform"
     - User support email: your-email@example.com
     - Developer contact: your-email@example.com
   - Click "SAVE AND CONTINUE"
   - Add scopes (click "ADD OR REMOVE SCOPES"):
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `openid`
   - Click "SAVE AND CONTINUE"
   - Add test users (your email address)
   - Click "SAVE AND CONTINUE" → "BACK TO DASHBOARD"

4. Now create the OAuth client:
   - Go back to "Credentials" → "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Feenixs Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:8008`
     - `https://rithish-codecraft.github.io`
     - `https://feenixs.com` (your custom domain)
   - Authorized redirect URIs:
     - `http://localhost:8008/pages/callback.html`
     - `https://rithish-codecraft.github.io/feenixs-website/pages/callback.html`
     - `https://feenixs.com/pages/callback.html`
   - Click "CREATE"

## 🔧 Step 4: Get Your Client ID

1. After creating the OAuth client, you'll see a modal with your credentials
2. Copy the **Client ID** (it looks like: `123456789-abcdef.apps.googleusercontent.com`)
3. Keep this Client ID safe - you'll need it for the next step

## 🔧 Step 5: Update the Code

1. Open `js/google-auth.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdef.apps.googleusercontent.com'; // Replace with your actual Google Client ID
```

## 🔧 Step 6: Test the Integration

1. Start your local server: `start-web.bat`
2. Open `http://localhost:8008`
3. Click "Login" button
4. Click "Sign in with Google"
5. Sign in with your Google account
6. Verify that you're logged in and see your profile picture

## 🔧 Step 7: Deploy to Production

1. Commit and push your changes to GitHub
2. The Google Auth will work on your GitHub Pages site
3. For custom domains, make sure your domain is added to the authorized origins

## 🎯 Features Included

### ✅ What Works:
- **Google Sign-In** - Users can authenticate with Google accounts
- **Profile Integration** - User profile picture and name displayed
- **Session Management** - Automatic login state persistence
- **Mixed Authentication** - Works alongside existing email/password system
- **User Data Storage** - Google users are saved to the same user database
- **Responsive Design** - Works on all devices

### 🔒 Security Features:
- **OAuth 2.0** - Secure Google authentication protocol
- **JWT Token Validation** - Verified Google user tokens
- **Email Verification** - Only verified Google emails accepted
- **Session Management** - Secure local storage handling

### 📱 User Experience:
- **One-Click Sign-In** - Fast and convenient authentication
- **Profile Pictures** - Automatic Google profile picture integration
- **Seamless Integration** - Works with existing UI/UX
- **Cross-Platform** - Works on desktop and mobile

## 🚀 Advanced Configuration

### Custom Scopes:
You can request additional Google API permissions by modifying the scope in the Google Cloud Console.

### Custom Styling:
The Google Sign-In button can be customized in `google-auth.js`:
- Theme: `filled_blue`, `outline`, `filled_black`
- Size: `small`, `medium`, `large`
- Text: `signin_with`, `signup_with`, `continue_with`
- Shape: `rectangular`, `pill`, `square`

### Error Handling:
The system includes comprehensive error handling for:
- Network failures
- Invalid tokens
- User cancellation
- Account conflicts

## 📞 Support

If you encounter issues:

1. **Check Console Errors** - Open browser dev tools to see error messages
2. **Verify Origins** - Ensure your domain is in the authorized origins
3. **Check Client ID** - Verify the Client ID is correctly copied
4. **Test Locally** - Always test on localhost first

## 🔍 Troubleshooting

### Common Issues:

**"Origin not allowed" error:**
- Add your domain to authorized JavaScript origins in Google Cloud Console

**"Popup blocked" error:**
- Enable popups for your site in browser settings
- Some browsers block automatic popups

**"Invalid client" error:**
- Verify Client ID is correct
- Check for extra spaces or characters

**No redirect after sign-in:**
- Check that redirect URIs are correctly configured
- Verify the callback URL matches exactly

---

**Your Feenixs website will now support Google authentication!** 🎉
