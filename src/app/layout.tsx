import type { Metadata } from "next";
import { BotIdClient } from "botid/client";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-tomorrow.css";

import { PostHogProvider } from "@/components/posthog-context";
import { AuthProvider, User } from "@/components/auth-context";
import { getUser } from "@/lib/queries";
import { auth } from "@/helpers/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { NextProgressBar } from "@/components/progress-bar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "boxhead.chat - AI Powered Chat",
    description:
        "Use the power of boxhead.chat to chat with any model you want",
};

const protectedRoutes = [
    {
        path: "/api/chat",
        method: "POST",
    },
    {
        path: "/api/chat",
        method: "GET",
    },
    {
        path: "/api/auth/google",
        method: "GET",
    },
    {
        path: "/api/auth/google/callback",
        method: "GET",
    },
    {
        path: "/api/auth/me",
        method: "GET",
    },
    {
        path: "/",
        method: "GET",
    },
];

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const authUser = await auth();

    let user = null;

    if (authUser) {
        user = (await getUser(authUser.email)) as unknown as User;
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <BotIdClient protect={protectedRoutes} />
            </head>
            <body
                className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextProgressBar />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider initialUser={user}>
                        <PostHogProvider>
                            <noscript>
                                <div className="fixed top-0 left-0 w-full bg-orange-500 text-foreground p-4 text-center z-[1000]">
                                    JavaScript is disabled in your browser.
                                    Please enable JavaScript to use all features
                                    of this application.
                                </div>
                            </noscript>
                            {children}
                        </PostHogProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
