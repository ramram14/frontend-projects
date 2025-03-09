import { IUser } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";


interface IAuthStore {
    userData: IUser | null;
    isAuthenticated: boolean;
    isLoadingAuth: boolean;

    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUserData: (userData: IUser | null) => void;
    setIsLoadingAuth: (isLoadingAuth: boolean) => void;
}

const useAuthStore = create<IAuthStore>()(
    persist(
        (set) => ({
            userData: null,
            isAuthenticated: false,
            isLoadingAuth: false,

            setUserData: (userData) => set({ userData }),
            setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            setIsLoadingAuth: (isLoadingAuth) => set({ isLoadingAuth }),
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
