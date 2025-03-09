import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError } from "axios";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const handleAxiosError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response) {
            // Server merespons dengan kode status di luar 2xx
            return `${error.response.data?.message}${error.response.data.errors ? ": " + error.response.data.errors : ""}` || `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            // Request dikirim tetapi tidak ada respons dari server
            return "No response from server. Please check your connection.";
        } else {
            // Kesalahan saat mengonfigurasi request
            return `Request error: ${error.message}`;
        }
    }
    return "An unknown error occurred.";
};