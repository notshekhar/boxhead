import { AxiosError } from "axios";
import toast from "react-hot-toast";

export function errorToast(error: unknown) {
    if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "An error occurred");
    } else if (error instanceof Error) {
        toast.error(error?.message || "An error occurred");
    } else if (typeof error === "string") {
        toast.error(error);
    } else {
        toast.error("An error occurred");
    }
}
