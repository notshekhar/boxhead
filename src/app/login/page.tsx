import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-gray-lighter dark:from-primary-dark dark:to-gray-darker text-text-light dark:text-text-dark p-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-noise-dark opacity-5 dark:opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid-dark bg-[length:40px_40px] opacity-[0.03] dark:opacity-[0.07] pointer-events-none"></div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-full blur-3xl dark:from-accent-blue/10 dark:to-accent-purple/10"></div>
            <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-full blur-3xl dark:from-accent-pink/10 dark:to-accent-purple/10"></div>

            {/* Back button */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                <Link
                    href="/"
                    className="flex items-center text-sm text-text-light dark:text-text-dark hover:opacity-80 transition-all duration-300 group"
                >
                    <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-all duration-300">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </span>
                    <span className="group-hover:underline">Back to Chat</span>
                </Link>
            </div>

            {/* Main content card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo/App icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white shadow-glow-red">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                </div>

                {/* Content card with glass effect */}
                <div className="backdrop-blur-md bg-white/70 dark:bg-gray-dark/70 rounded-2xl p-8 shadow-glass-light dark:shadow-glass-dark border border-white/20 dark:border-gray-700/20 text-center animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent dark:from-gradient-start dark:to-gradient-end">
                        Welcome to cursor.chat
                    </h1>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">
                        Sign in below (we'll increase your message limits if you do 😉)
                    </p>

                    <button
                        onClick={() => console.log("Google Sign-in clicked (hardcoded)")}
                        className="w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3 mb-6 text-text-light dark:text-text-dark bg-white dark:bg-gray-lighter rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-darker transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue dark:focus:ring-offset-gray-dark group"
                    >
                        <svg
                            className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110"
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
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    <p className="mt-8 text-xs text-text-muted-light dark:text-text-muted-dark">
                        By continuing, you agree to our{" "}
                        <Link href="/terms" className="text-accent-blue hover:text-accent-indigo dark:text-accent-blue dark:hover:text-accent-indigo transition-colors duration-300">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-accent-blue hover:text-accent-indigo dark:text-accent-blue dark:hover:text-accent-indigo transition-colors duration-300">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
