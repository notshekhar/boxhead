import { tool } from "ai"
import { z } from "zod"

export const calculator = tool({
    description: "Calculate math problems",
    parameters: z.object({
        expression: z.string().describe("The math expression to calculate"),
    }),
    execute: async ({ expression }) => {
        return {
            result: eval(expression),
        }
    },
})
