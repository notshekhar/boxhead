import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; // Assuming you have heroicons installed

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark p-4">
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                <Link
                    href="/" // Link back to the main chat page or home
                    className="flex items-center text-sm text-text-light dark:text-text-dark hover:opacity-80 transition-opacity"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Chat
                </Link>
            </div>

            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    Welcome to cursor.chat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    Sign in below (we'll increase your message limits if you do 😉)
                </p>

                <button
                    // Add your onClick handler for Google Sign-in here
                    onClick={() => console.log("Google Sign-in clicked (hardcoded)")}
                    className="w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3 mb-6 text-gray-700 dark:text-gray-900 bg-white dark:bg-gray-100 border border-gray-300 dark:border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-primary-dark"
                >
                    {/* Basic Google G - Replace with a proper SVG icon if available */}
                    <svg
                        className="w-5 h-5 mr-3"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        ></path>
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        ></path>
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.71,36.064,44,30.606,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        ></path>
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-secondary-light dark:hover:text-secondary-dark">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-secondary-light dark:hover:text-secondary-dark">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
