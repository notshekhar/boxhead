import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import "prismjs/themes/prism.css"
import "prismjs/themes/prism-tomorrow.css"

import { PostHogProvider } from "@/components/posthog-context"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "boxhead.chat - AI Powered Chat",
    description:
        "Use the power of boxhead.chat to chat with any model you want",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <PostHogProvider>
                    <noscript>
                        <div className="fixed top-0 left-0 w-full bg-primary-500 text-white p-4 text-center z-[1000]">
                            JavaScript is disabled in your browser. Please
                            enable JavaScript to use all features of this
                            application.
                        </div>
                    </noscript>
                    {children}
                </PostHogProvider>
            </body>
        </html>
    )
}
