import { create } from "zustand";

interface UploadedImage {
    file: File;
    assetId: number;
    preview: string;
}

interface ImageUploadState {
    uploadedImage: UploadedImage | null;
    setUploadedImage: (image: UploadedImage | null) => void;
    clearUploadedImage: () => void;
}

export const useImageUploadStore = create<ImageUploadState>((set) => ({
    uploadedImage: null,

    setUploadedImage: (image) => set({ uploadedImage: image }),

    clearUploadedImage: () => set({ uploadedImage: null }),
}));
