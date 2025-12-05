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
 * 파일을 ArrayBuffer로 변환하고 SHA-256 해시 계산
 */
const calculateFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

/**
 * 이미지 크기 추출
 */
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

/**
 * XHR을 사용한 파일 업로드 (진행률 추적 포함)
 */
const uploadFileWithProgress = (
    uploadUrl: string,
    headers: Record<string, string[]>,
    file: File,
    onProgress?: (progress: number) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    onProgress((e.loaded / e.total) * 100);
                }
            });
        }

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error("Upload failed"));
        });

        xhr.open("PUT", uploadUrl);

        // 헤더 설정
        Object.entries(headers).forEach(([key, values]) => {
            if (values?.length > 0) {
                xhr.setRequestHeader(key, values[0]);
            }
        });

        xhr.send(file);
    });
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
): Promise<CompleteUploadResponse> => {
    // 1. 파일 해시 및 이미지 크기 계산 (병렬 처리)
    const [sha256Hex, dimensions] = await Promise.all([
        calculateFileHash(file),
        getImageDimensions(file)
    ]);

    // 2. 업로드 URL 요청
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

    // 3. 중복 이미지인 경우 업로드 생략
    if (method === "SKIP" || !uploadUrl) {
        const completeResponse = await completeUpload({ objectKey });
        if (!completeResponse.ok || !completeResponse.data) {
            throw new Error("Failed to complete upload");
        }
        return completeResponse.data;
    }

    // 4. 실제 파일 업로드
    await uploadFileWithProgress(uploadUrl, headers, file, onProgress);

    // 5. 업로드 완료 처리
    const completeResponse = await completeUpload({ objectKey });
    if (!completeResponse.ok || !completeResponse.data) {
        throw new Error("Failed to complete upload");
    }

    return completeResponse.data;
};
