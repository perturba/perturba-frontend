export interface ApiResponse<T> {
    ok: boolean;
    data: T;
    error?: ApiError;
    meta?: ApiMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string>;
}

export interface ApiMeta {
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    rateLimit?: number;
    rateRemaining?: number;
    rateResetEpochSec?: number;
    requestId?: string;
}

export type JobStatus = "PROGRESS" | "COMPLETED" | "FAILED";
export type Intensity = "LOW" | "MEDIUM" | "HIGH";
export type NotifyVia = "NONE" | "EMAIL" | "WEBHOOK";
export type ClientChannel = "WEB" | "MOBILE" | "API";
export type RequestMode = "SYNC" | "ASYNC";

export interface Job {
    jobId: number;
    publicId: string;
    status: JobStatus;
    inputObjectKey: string;
    width: number;
    height: number;
    createdAt: string;
    completedAt: string;
}

export interface JobListResponse {
    items: Job[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface CreateJobRequest {
    inputAssetId: number;
    intensity: Intensity;
    notifyVia?: NotifyVia;
    clientChannel?: ClientChannel;
    requestMode?: RequestMode;
}

export interface CreateJobResponse {
    publicId: string;
    status: JobStatus;
}

export interface AssetInfo {
    assetId: number;
    objectKey: string;
    url: string;
    mimeType: string;
    width: number;
    height: number;
}

export interface JobResultResponse {
    input: AssetInfo;
    perturbed: AssetInfo;
    deepfakeOutput: AssetInfo;
    perturbationVis: AssetInfo;
    createdAt: string;
    completedAt: string;
}

export type StrengthEval = "VERY_WEAK" | "WEAK" | "MODERATE" | "STRONG" | "VERY_STRONG";
export type DistortionEval = "VERY_LOW" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

export interface FeedbackRequest {
    strengthEval: StrengthEval;
    distortionEval: DistortionEval;
}

export type AssetKind = "INPUT" | "PERTURBED" | "DEEPFAKE" | "VISUALIZATION";

export interface UploadUrlRequest {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    sha256Hex: string;
    width: number;
    height: number;
}

export interface UploadUrlResponse {
    assetId: number;
    method: string;
    uploadUrl: string;
    headers: Record<string, string[]>;
    objectKey: string;
    expiresInSec: number;
}

export interface CompleteUploadRequest {
    objectKey: string;
}

export interface CompleteUploadResponse {
    assetId: number;
    kind: AssetKind;
    objectKey: string;
    url: string;
    mimeType: string;
    sizeBytes: number;
    width: number;
    height: number;
    sha256Hex: string;
}

export interface TokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface MeResponse {
    userId: number;
}

export interface GuestSessionResponse {
    expiresAt: string;
}

export type ApiKeyStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export interface ApiKeyMetaResponse {
    label: string;
    status: ApiKeyStatus;
    createdAt: string;
    lastUsedAt?: string;
    expiresAt?: string;
    ratePerMin: number;
    dailyQuota: number;
}

export interface IssueApiKeyRequest {
    label: string;
    scopesJson?: string;
    ratePerMin?: number;
    dailyQuota?: number;
    ttlHours?: number;
}

export interface IssueApiKeyResponse extends ApiKeyMetaResponse {
    plaintext: string;
}

export interface ExternalTransformRequest {
    inputAssetPublicId: string;
    intensity: Intensity;
}

export interface ExternalTransformResponse {
    jobPublicId: string;
}

export interface ExternalJobResultResponse {
    status: JobStatus;
    failReason?: string;
    perturbedImageUrl?: string;
    deepfakeOutputUrl?: string;
    perturbationVisUrl?: string;
}

export interface ExternalUploadImageRequest {
    file: string;
}

export interface ExternalUploadImageResponse {
    assetPublicId: string;
}

export interface JobFailRequest {
    reason: string;
}

export interface ResultUploadUrlItem {
    method: string;
    uploadUrl: string;
    headers: Record<string, string[]>;
    objectKey: string;
}

export interface ResultUploadUrlResponse {
    perturbed: ResultUploadUrlItem;
    deepfake: ResultUploadUrlItem;
    perturbationVis: ResultUploadUrlItem;
}

export interface CompleteResultRequest {
    perturbedObjectKey: string;
    deepfakeObjectKey: string;
    perturbationVisObjectKey: string;
}