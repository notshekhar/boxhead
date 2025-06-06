import toast from "react-hot-toast"

export function errorToast(error: Error) {
    toast.error(error?.message || "An error occurred")
}
