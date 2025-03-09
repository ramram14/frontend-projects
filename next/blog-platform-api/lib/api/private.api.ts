import axios from "axios";

const privateApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Cookie akan dikirim otomatis
    headers: {
        "Content-Type": "application/json"
    }
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
};

privateApi.interceptors.response.use(
    (response) => response, // Jika sukses, langsung return response
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        originalRequest._retry = true;
                        resolve(privateApi(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await privateApi.get("/auth/refresh-token"); // Refresh token otomatis via cookie
                isRefreshing = false;
                onRefreshed();
                return privateApi(originalRequest); // Kirim ulang request asli
            } catch (refreshError) {
                isRefreshing = false;
                return Promise.reject(refreshError); // Jika gagal, biarkan error diproses oleh frontend
            }
        }

        return Promise.reject(error);
    }
);

export default privateApi;
