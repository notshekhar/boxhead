import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for Google users (in real app, this would be in your database)
let googleUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Verify the Google OAuth token
    // 2. Get user info from Google's API
    // 3. Create or find user in your database
    
    // For demo purposes, we'll simulate a successful Google login
    const simulatedGoogleUser = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      createdAt: new Date().toISOString(),
    }

    // Store the user (in real app, this would be saved to database)
    googleUsers.push(simulatedGoogleUser)

    // Create session
    const sessionToken = `session_${simulatedGoogleUser.id}_${Date.now()}`
    
    const response = NextResponse.json({
      user: simulatedGoogleUser,
      message: 'Google login successful'
    })

    // Set cookie
    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response

  } catch (error) {
    console.error('Google login error:', error)
    return NextResponse.json(
      { error: 'Google login failed' },
      { status: 500 }
    )
  }
}

// Export the googleUsers array so it can be shared
export { googleUsers } 