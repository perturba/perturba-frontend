const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TARGET_WIDTH = 224;
const TARGET_HEIGHT = 224;

interface ValidationResult {
    valid: boolean;
    error?: string;
    needsResize?: boolean;
}

interface ResizeResult {
    file: File;
    resized: boolean;
}

/**
 * 이미지 파일 검증
 */
export const validateImageFile = (file: File): ValidationResult => {
    if (file.type !== "image/jpeg") {
        return { valid: false, error: "JPEG 형식만 지원합니다." };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: "파일 크기는 10MB 이하여야 합니다." };
    }

    return { valid: true };
};

/**
 * 이미지 크기 확인
 */
export const checkImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("이미지를 읽을 수 없습니다."));
        };

        img.src = url;
    });
};

/**
 * 이미지를 224x224로 리사이징
 */
export const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            const canvas = document.createElement('canvas');
            canvas.width = TARGET_WIDTH;
            canvas.height = TARGET_HEIGHT;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error("Canvas를 생성할 수 없습니다."));
                return;
            }

            ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("이미지 변환에 실패했습니다."));
                        return;
                    }

                    const resizedFile = new File(
                        [blob],
                        file.name,
                        {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        }
                    );

                    resolve(resizedFile);
                },
                'image/jpeg',
                0.95
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("이미지를 읽을 수 없습니다."));
        };

        img.src = url;
    });
};

/**
 * 이미지 처리 메인 함수
 * - 검증 후 필요시 자동 리사이징
 */
export const processImageFile = async (file: File): Promise<ResizeResult> => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    try {
        const { width, height } = await checkImageDimensions(file);

        if (width === TARGET_WIDTH && height === TARGET_HEIGHT) {
            return { file, resized: false };
        }

        const resizedFile = await resizeImage(file);
        return { file: resizedFile, resized: true };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "이미지 처리에 실패했습니다.");
    }
};
