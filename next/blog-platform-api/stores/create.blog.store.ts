import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { JSONContent } from '@tiptap/core';
import privateApi from "@/lib/api/private.api";
import { handleAxiosError } from "@/lib/utils";


interface CreateStore {
    title: string;
    subtitle: string;
    content: JSONContent;
    image: string;
    category: string;
    isLoadingCreateBlog: boolean;
    errorMessage: string;

    setTitle: (title: string) => void;
    setSubtitle: (subtitle: string) => void;
    setContent: (content: JSONContent) => void;
    setImage: (image: string) => void;
    setCategory: (categories: string) => void;
    resetCreateBlogStore: () => void;
    handleContentChange: (newContent: JSONContent) => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteImage: () => void;
    uploadBlog: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useCreateBlogStore = create<CreateStore>()(
    persist((set, get) => ({
        title: "",
        subtitle: "",
        content: {
            type: 'doc',
            content: []
        }, image: "",
        category: "",
        isLoadingCreateBlog: false,
        errorMessage: "",

        setTitle: (title) => set({ title }),
        setSubtitle: subtitle => set({ subtitle }),
        setContent: content => set({ content }),
        setImage: image => set({ image }),
        setCategory: (category) => set({ category }),

        resetCreateBlogStore: () => set(() => ({
            title: "",
            subtitle: "",
            content: {
                type: 'doc',
                content: []
            },
            image: "",
            category: ""
        })),

        handleContentChange: (newContent) => set({ content: newContent }),
        handleImageChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
            try {
                set({ isLoadingCreateBlog: true });
                const formData = new FormData();
                const file = event.target.files?.[0];

                if (!file) return;
                formData.append('image', file);
                const { data } = await privateApi.post('/images', formData);
                set({ image: data.data });
            } catch (error) {
                const errorMessage = handleAxiosError(error);
                set({ errorMessage });
            } finally {
                set({ isLoadingCreateBlog: false });
            }
        },

        handleDeleteImage: async () => {
            try {
                const image = get().image;
                if (!image) return;
                await privateApi.delete(`/images`, {
                    data: image
                });
                set({ image: "" });
            } catch (error) {
                const errorMessage = handleAxiosError(error);
                set({ errorMessage });
            } finally {
                set({ isLoadingCreateBlog: false });
            }
        },

        uploadBlog: async (e: React.FormEvent<HTMLFormElement>) => {
            try {
                e.preventDefault();
                set({ errorMessage: "" });
                set({ isLoadingCreateBlog: true });
                const { data } = await privateApi.post('/post', {
                    title: get().title,
                    subtitle: get().subtitle,
                    image: get().image,
                    content: get().content,
                    category: get().category,
                });
                return data;
            } catch (error) {
                const errorMessage = handleAxiosError(error);
                set({ errorMessage });
            } finally {
                set({ isLoadingCreateBlog: false });
            }
        }
    }),
        {
            name: "create-blog-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useCreateBlogStore;