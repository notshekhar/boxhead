# Authentication System - cursor.chat

## Overview

I've implemented a complete authentication system with a beautiful popup and context management for cursor.chat. The system includes:

- **Auth Context** for global user state management
- **Auth Popup** with login/signup forms
- **User Menu** with avatar and dropdown
- **API Routes** for authentication operations
- **Beautiful UI** following the project's design system

## Features

### 🔐 Authentication Context (`useAuth`)
- Global user state management
- Popup control (open/close)
- Login, signup, and logout functions
- Automatic authentication checking

### 🎨 Beautiful Auth Popup
- Modern, responsive design
- Dark/light mode support
- Form validation and error handling
- Smooth animations and transitions
- Social login placeholders (Google, GitHub)

### 👤 User Menu Component
- Avatar with user initials
- Dropdown with user info
- Profile and preferences options
- Logout functionality
- Responsive design

### 🛠 API Routes
- `/api/auth/login` - User login
- `/api/auth/signup` - User registration
- `/api/auth/me` - Get current user
- `/api/auth/logout` - User logout

## Usage

### Opening the Auth Popup

From any component, you can open the authentication popup:

```tsx
import { useAuth } from '@/components/auth-context'

function MyComponent() {
  const { openAuthPopup } = useAuth()
  
  return (
    <button onClick={openAuthPopup}>
      Sign In
    </button>
  )
}
```

### Checking User Authentication

```tsx
import { useAuth } from '@/components/auth-context'

function MyComponent() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  if (user) {
    return <div>Welcome, {user.name}!</div>
  }
  
  return <div>Please sign in</div>
}
```

### Complete Auth Example

```tsx
import { useAuth } from '@/components/auth-context'

function MyComponent() {
  const { 
    user, 
    isLoading, 
    openAuthPopup, 
    logout 
  } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return (
      <button onClick={openAuthPopup}>
        Sign In
      </button>
    )
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}
```

## Demo Credentials

For testing, you can use these demo credentials:

- **Email**: `demo@example.com`
- **Password**: `password123`

Or create a new account with any email and password (minimum 6 characters).

## User Interface

### Auth Popup Features
- **Login Tab**: Email and password fields
- **Signup Tab**: Name, email, and password fields
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Animated loading indicators
- **Social Login**: Placeholder buttons for Google and GitHub
- **Responsive**: Works on desktop and mobile

### User Menu Features
- **Avatar**: Shows first letter of user's name
- **User Info**: Name and email display
- **Dropdown Menu**: Profile settings, preferences, and logout
- **Hover States**: Smooth transitions and hover effects

## Styling

The authentication system follows the project's design system:

- Uses the defined color palette from `tailwind.config.js`
- Supports dark/light mode
- Mobile-responsive design
- Consistent with the chat app's aesthetic
- Background variations instead of shadows (as per project guidelines)

## API Implementation

Currently uses mock data for demonstration. In production, you would:

1. Replace mock users with a real database
2. Implement proper password hashing (bcrypt)
3. Use JWT tokens or secure session management
4. Add email verification
5. Implement password reset functionality
6. Add rate limiting for security

## Integration

The authentication system is fully integrated into the app:

- **Layout**: AuthProvider wraps the entire app
- **Header**: UserMenu appears in the top-right corner
- **Global**: Auth popup is available from anywhere via context

To use the auth system from any component, simply import and use the `useAuth` hook! 