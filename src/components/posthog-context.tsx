"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { usePostHog } from "posthog-js/react"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useAuth } from "./auth-context"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host:
                process.env.NEXT_PUBLIC_POSTHOG_HOST ||
                "https://us.i.posthog.com",
            person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
            defaults: "2025-05-24",
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
        </PHProvider>
    )
}

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname
            if (searchParams.toString()) {
                url = url + "?" + searchParams.toString()
            }

            posthog.capture("$pageview", { $current_url: url })
        }
    }, [pathname, searchParams, posthog])

    return null
}

function PostHogIdentify() {
    const posthog = usePostHog()
    const { user } = useAuth()

    // Identify the user if they are logged in
    useEffect(() => {
        if (user) {
            posthog.identify(String(user.id), user)
        } else {
            posthog.reset()
        }
    }, [user, posthog])

    return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
            <PostHogIdentify />
        </Suspense>
    )
}
