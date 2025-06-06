import { NextRequest, NextResponse } from 'next/server'

// Mock user data - in real app, this would come from a database
const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
  }
]

// In-memory storage for Google users (in real app, this would be in your database)
let googleUsers: any[] = []

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Extract user ID from token (in real app, verify JWT or session)
    const userId = authToken.split('_')[1]
    
    // Find user in regular users first
    let user = mockUsers.find(u => u.id === userId)
    
    // If not found in regular users, check Google users
    if (!user) {
      user = googleUsers.find(u => u.id === userId)
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Return user data (without password if it exists)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the googleUsers array so it can be used by the Google auth route
export { googleUsers } 