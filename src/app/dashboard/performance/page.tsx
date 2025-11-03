"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function PerformancePage() {
    const chartData = [
        { name: 'Perturba', value: 0.945 },
        { name: 'Model A', value: 0.87 },
        { name: 'Model B', value: 0.78 },
        { name: 'Model C', value: 0.70 }
    ];

    // TODO: performance fetch API

    return (
        <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900">서비스 성능 보기</h1>

                    <div className="bg-white rounded-2xl shadow-lg border-4 border-blue-500 p-6 md:p-8 lg:p-10">
                        <h2 className="text-base font-bold text-gray-900 mb-4">
                            SSIM (Structural Similarity Index)이란?
                        </h2>
                        <p className="text-base font-medium text-gray-700 mb-3">
                            SSIM은 원본 이미지와 변환된 이미지의 구조적 유사도를 측정하는 지표입니다. 1에 가까울수록 육안으로 구별하기 어려운 고품질 이미지를 의미합니다.
                        </p>
                        <p className="text-base font-medium text-gray-700">
                            Perturba는{' '}
                            <span className="text-blue-600 font-bold">0.945의 높은 SSIM 점수</span>
                            를 기록하여 육안으로는 거의 차이가 없으면서도 AI 모델의 인식을 효과적으로 교란시킵니다.
                        </p>
                    </div>

                    <section>
                        <h2 className="text-base font-bold text-gray-900 mb-6">성능 지표 비교</h2>

                        <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-6 md:p-8">
                            <div className="mb-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            axisLine={{ stroke: '#6b7280' }}
                                        />
                                        <YAxis
                                            domain={[0, 1]}
                                            ticks={[0, 0.25, 0.5, 0.75, 1]}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            axisLine={{ stroke: '#6b7280' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="#3b82f6" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <div className="w-3.5 h-2.5 bg-blue-500"></div>
                                    <span className="text-base text-blue-500">SSIM (↑)</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-base font-bold text-blue-900 mb-2">
                                    SSIM (Structural Similarity)
                                </h3>
                                <p className="text-base font-medium text-blue-700">
                                    값이 높을수록 원본과 시각적으로 유사한 고품질 이미지
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900 mb-6">Perturba의 강점</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-blue-400/40 border border-blue-200 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">최고 수준의 품질</h3>
                                <p className="text-base font-medium text-gray-700">
                                    SSIM 0.945로 육안 구별 불가능
                                </p>
                            </div>

                            <div className="bg-green-600/40 border border-green-200 rounded-2xl p-6">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">빠른 처리 속도</h3>
                                <p className="text-base font-medium text-gray-700">
                                    평균 2.3초 이내 변환 완료
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}