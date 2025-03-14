import axios from "axios";

// Instance untuk request yang tidak memerlukan autentikasi
export const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

publicApi.defaults.headers.post["Content-Type"] = "application/json";

export default publicApi;

