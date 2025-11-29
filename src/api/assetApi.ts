import type {
    ApiResponse,
    UploadUrlRequest,
    UploadUrlResponse,
    CompleteUploadRequest,
    CompleteUploadResponse,
} from "@/types/api";
import axiosInstance from "./axios";


export const getUploadUrl = async (request: UploadUrlRequest) => {
    const { data } = await axiosInstance.post<ApiResponse<UploadUrlResponse>>(
        "/v1/assets/upload-url",
        request
    );
    return data;
};

export const completeUpload = async (request: CompleteUploadRequest) => {
    const { data } = await axiosInstance.post<ApiResponse<CompleteUploadResponse>>(
        "/v1/assets/complete",
        request
    );
    return data;
};

/**
 * 이미지 업로드 헬퍼 함수
 * 1. upload URL 발급
 * 2. S3/Cloud Storage에 직접 업로드
 * 3. 업로드 완료 처리
 */
export const uploadImage = async (
    file: File,
    onProgress?: (progress: number) => void
) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const dimensions = await getImageDimensions(file);

    const uploadUrlResponse = await getUploadUrl({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        sha256Hex,
        width: dimensions.width,
        height: dimensions.height,
    });

    if (!uploadUrlResponse.ok || !uploadUrlResponse.data) {
        throw new Error("Failed to get upload URL");
    }

    const { uploadUrl, headers, objectKey, method } = uploadUrlResponse.data;

    // 1) 중복 이미지 → S3 업로드 생략하고 곧바로 complete
    if (method === "SKIP" || !uploadUrl) {
        const completeResponse = await completeUpload({ objectKey });
        if (!completeResponse.ok || !completeResponse.data) {
            throw new Error("Failed to complete upload");
        }
        return completeResponse.data;
    }

    // 2) 실제 업로드가 필요한 경우에만 S3 PUT 수행
    const xhr = new XMLHttpRequest();

    return new Promise<CompleteUploadResponse>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress((e.loaded / e.total) * 100);
            }
        });

        xhr.addEventListener("load", async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const completeResponse = await completeUpload({ objectKey });
                    if (completeResponse.ok && completeResponse.data) {
                        resolve(completeResponse.data);
                    } else {
                        reject(new Error("Failed to complete upload"));
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error("Upload failed"));
        });

        xhr.open("PUT", uploadUrl);

        Object.entries(headers).forEach(([key, values]) => {
            if (values && values.length > 0) {
                xhr.setRequestHeader(key, values[0]);
            }
        });

        xhr.send(file);
    });
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };

        img.src = url;
    });
};
