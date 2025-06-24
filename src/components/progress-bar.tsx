"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

export const NextProgressBar = () => {
    return (
        <ProgressBar
            height="4px"
            color="#fffd00"
            options={{ showSpinner: false }}
            shallowRouting
        />
    )
}
