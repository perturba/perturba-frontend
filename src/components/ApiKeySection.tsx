"use client";

import { useState, useEffect } from "react";
import { BiKey, BiCopy, BiCheck, BiTrash, BiShow, BiHide } from "react-icons/bi";
import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";

interface ApiKeyData {
    label: string;
    status: "ACTIVE" | "REVOKED" | "EXPIRED";
    createdAt: string;
    lastUsedAt?: string;
    expiresAt?: string;
    ratePerMin: number;
    dailyQuota: number;
}

interface ApiKeyWithPlaintext extends ApiKeyData {
    plaintext?: string;
}

export default function ApiKeySection() {
    const [apiKey, setApiKey] = useState<ApiKeyWithPlaintext | null>(null);
    const [loading, setLoading] = useState(true);
    const [showKey, setShowKey] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        label: "",
        ratePerMin: 60,
        dailyQuota: 5000,
        ttlHours: 0,
    });

    useEffect(() => {
        loadApiKey();
    }, []);

    const loadApiKey = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/v1/apikeys");
            if (data.ok && data.data) {
                setApiKey(data.data);
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status !== 404) {
                console.error("Failed to load API key:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const createApiKey = async () => {
        try {
            setIsCreating(true);
            const { data } = await axiosInstance.post("/v1/apikeys", {
                label: formData.label || "My API Key",
                ratePerMin: formData.ratePerMin,
                dailyQuota: formData.dailyQuota,
                ttlHours: formData.ttlHours > 0 ? formData.ttlHours : null,
            });

            if (data.ok && data.data) {
                setApiKey(data.data);
                setShowKey(true);
                setShowCreateModal(false);

                window.dispatchEvent(
                    new CustomEvent("job-toast", {
                        detail: {
                            type: "success",
                            message: "API 키가 생성되었습니다!",
                        },
                    })
                );
            }
        } catch (error) {
            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "API 키 생성에 실패했습니다.",
                    },
                })
            );
        } finally {
            setIsCreating(false);
        }
    };

    const deleteApiKey = async () => {
        if (!confirm("정말로 API 키를 폐기하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            return;
        }

        try {
            await axiosInstance.delete("/v1/apikeys/1");
            setApiKey(null);

            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "success",
                        message: "API 키가 폐기되었습니다.",
                    },
                })
            );
        } catch (error) {
            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "API 키 폐기에 실패했습니다.",
                    },
                })
            );
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("ko-KR");
    };

    const maskKey = (key: string) => {
        if (!key) return "";
        return key.slice(0, 12) + "•".repeat(24) + key.slice(-4);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
            </div>
        );
    }

    if (!apiKey) {
        return (
            <>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BiKey size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                API 키가 필요합니다
                            </h3>
                            <p className="text-sm text-gray-700 mb-4">
                                외부 서비스와 Perturba를 통합하려면 먼저 API 키를 발급받아야 합니다.
                                발급받은 키는 한 번만 표시되므로 안전한 곳에 보관하세요.
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                            >
                                API 키 발급하기
                            </button>
                        </div>
                    </div>
                </div>

                {showCreateModal && (
                    <CreateApiKeyModal
                        formData={formData}
                        setFormData={setFormData}
                        isCreating={isCreating}
                        onClose={() => setShowCreateModal(false)}
                        onCreate={createApiKey}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {apiKey.plaintext && (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="font-bold text-gray-900 text-sm mb-1">
                                    이 키는 다시 표시되지 않습니다!
                                </p>
                                <p className="text-xs text-gray-700">
                                    지금 안전한 곳에 복사해두세요. 페이지를 새로고침하면 다시 볼 수 없습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-slate-100 border-b border-gray-200">
                        <h3 className="font-bold text-gray-900">활성 API 키</h3>
                    </div>

                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API 키
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-lg font-mono text-xs md:text-sm">
                                    <span className="flex-1 truncate">
                                        {apiKey.plaintext
                                            ? showKey
                                                ? apiKey.plaintext
                                                : maskKey(apiKey.plaintext)
                                            : "pk_live_••••••••••••••••••••••••"}
                                    </span>
                                    {apiKey.plaintext && (
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-1 hover:bg-slate-200 rounded transition"
                                        >
                                            {showKey ? (
                                                <BiShow size={18} className="text-gray-600" />
                                            ) : (
                                                <BiHide size={18} className="text-gray-600" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                {apiKey.plaintext && (
                                    <button
                                        onClick={() => copyToClipboard(apiKey.plaintext!)}
                                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {copiedKey ? (
                                            <BiCheck size={18} />
                                        ) : (
                                            <BiCopy size={18} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    라벨
                                </label>
                                <p className="text-sm font-medium text-gray-900">{apiKey.label}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    상태
                                </label>
                                <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${apiKey.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {apiKey.status}
                                </span>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    분당 제한
                                </label>
                                <p className="text-sm font-medium text-gray-900">{apiKey.ratePerMin} req/min</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    일일 할당
                                </label>
                                <p className="text-sm font-medium text-gray-900">{apiKey.dailyQuota} req/day</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    생성일
                                </label>
                                <p className="text-sm text-gray-900">{formatDate(apiKey.createdAt)}</p>
                            </div>
                            {apiKey.lastUsedAt && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        마지막 사용
                                    </label>
                                    <p className="text-sm text-gray-900">{formatDate(apiKey.lastUsedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-slate-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={deleteApiKey}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                            <BiTrash size={16} />
                            키 폐기
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">📖 사용 예시</h4>
                    <div className="bg-slate-900 text-white p-3 rounded-lg text-xs font-mono overflow-x-auto">
                        <pre>{`curl -X POST ${process.env.NEXT_PUBLIC_SERVER_API_URL || 'https://api.perturba.io'}/v1/external/assets/upload \\
  -H "X-Perturba-External-API-Key: ${apiKey.plaintext || 'YOUR_API_KEY'}" \\
  -F "file=@image.jpg"`}</pre>
                    </div>
                </div>
            </div>
        </>
    );
}

interface ApiKeyFormData {
    label: string;
    ratePerMin: number;
    dailyQuota: number;
    ttlHours: number;
}

interface CreateApiKeyModalProps {
    formData: ApiKeyFormData;
    setFormData: (data: ApiKeyFormData) => void;
    isCreating: boolean;
    onClose: () => void;
    onCreate: () => void;
}

function CreateApiKeyModal({ formData, setFormData, isCreating, onClose, onCreate }: CreateApiKeyModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-900 mb-4">새 API 키 발급</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            라벨 (선택)
                        </label>
                        <input
                            type="text"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            placeholder="예: Production Server"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                분당 요청 제한
                            </label>
                            <input
                                type="number"
                                value={formData.ratePerMin}
                                onChange={(e) =>
                                    setFormData({ ...formData, ratePerMin: parseInt(e.target.value) || 0 })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                일일 할당량
                            </label>
                            <input
                                type="number"
                                value={formData.dailyQuota}
                                onChange={(e) =>
                                    setFormData({ ...formData, dailyQuota: parseInt(e.target.value) || 0 })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            유효 기간 (시간, 0 = 무제한)
                        </label>
                        <input
                            type="number"
                            value={formData.ttlHours}
                            onChange={(e) =>
                                setFormData({ ...formData, ttlHours: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                        취소
                    </button>
                    <button
                        onClick={onCreate}
                        disabled={isCreating}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                    >
                        {isCreating ? "생성 중..." : "발급하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
