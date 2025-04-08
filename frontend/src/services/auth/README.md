# Authentication System

This directory contains the authentication system for the CF Hub application. The system uses Firebase for authentication while maintaining user data in our own backend.

## Architecture

The authentication system consists of the following components:

1. **Firebase Authentication**: Handles user authentication (email/password and Google)
2. **Backend User Management**: Stores and manages user data
3. **Auth Context**: Provides authentication state to the application
4. **Auth Service**: Provides authentication methods to the application

## Files

- `authService.js`: Contains all authentication methods
- `README.md`: This documentation file

## Authentication Flow

### Registration

1. User enters email, password, and name
2. Firebase creates a new user
3. Backend creates a new user record with the Firebase UID
4. User is logged in

### Google Authentication

1. User clicks "Sign in with Google"
2. Firebase handles Google authentication
3. Backend creates or updates user record with the Firebase UID
4. User is logged in

### Login

1. User enters email and password
2. Firebase authenticates the user
3. Backend retrieves user data
4. User is logged in

### Logout

1. User clicks "Logout"
2. Firebase logs out the user
3. Backend session is cleared
4. User is logged out

## Usage

```javascript
import { useAuth } from "@/contexts/authContext/authContext";

// In your component
const {
	currentUser,
	userLoggedIn,
	loading,
	error,
	register,
	login,
	loginWithGoogle,
	logout,
	updateUser,
} = useAuth();

// Register a new user
await register(email, password, name);

// Login with email and password
await login(email, password);

// Login with Google
await loginWithGoogle();

// Logout
await logout();

// Update user data
updateUser(userData);
```

## Backend API Endpoints

The authentication system expects the following backend API endpoints:

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `POST /api/auth/google`: Handle Google authentication
- `GET /api/auth/me`: Get the current user
- `POST /api/auth/logout`: Logout a user

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Firebase measurement ID
- `BACKEND_URL`: Backend API URL
