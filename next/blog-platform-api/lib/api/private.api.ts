import axios from "axios";

const privateApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Cookie will be sent automatically
});

privateApi.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    
    return config;
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
    (response) => response, // If successful, return the response
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
                await privateApi.get("/auth/refresh-token"); // Refresh token automatically
                isRefreshing = false;
                onRefreshed();
                return privateApi(originalRequest); // Resend the original request
            } catch (refreshError) {
                isRefreshing = false;
                return Promise.reject(refreshError); // If refresh fails, frontend will handle it
            }
        }

        return Promise.reject(error);
    }
);

export default privateApi;
