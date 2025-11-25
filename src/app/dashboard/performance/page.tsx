"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
    { name: 'Perturba', value: 0.945 },
    { name: 'Model A', value: 0.87 },
    { name: 'Model B', value: 0.78 },
    { name: 'Model C', value: 0.70 }
];

export default function ResponsivePerformancePage() {
    return (
        <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
            <div className="px-3 sm:px-4 md:px-16 py-3 sm:py-4 md:py-12 bg-white md:bg-gray-50">
                <h1 className="text-sm sm:text-base md:text-2xl font-semibold md:font-bold text-gray-900">
                    서비스 성능 보기
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-16 py-3 sm:py-4 md:py-0">
                <div className="space-y-4 sm:space-y-5 md:space-y-10 max-w-7xl pb-4 sm:pb-6 md:pb-0">
                    <section className="hidden md:block">
                        <div className="bg-white rounded-2xl p-8 md:p-10 border-4 border-blue-500 shadow-lg">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                SSIM (Structural Similarity Index)이란?
                            </h2>
                            <p className="text-base font-medium text-gray-700 mb-3 leading-relaxed">
                                SSIM은 원본 이미지와 변환된 이미지의 구조적 유사도를 측정하는 지표입니다.
                                1에 가까울수록 육안으로 구별하기 어려운 고품질 이미지를 의미합니다.
                            </p>
                            <p className="text-base font-medium text-gray-700 leading-relaxed">
                                Perturba는{' '}
                                <span className="text-blue-600 font-bold">0.945의 높은 SSIM 점수</span>
                                를 기록하여 육안으로는 거의 차이가 없으면서도 AI 모델의 인식을 효과적으로 교란시킵니다.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                            Perturba의 강점
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 md:gap-6">
                            <div className="bg-blue-100 md:bg-blue-400/40 md:border md:border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">최고 수준의 품질</h3>
                                <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                                    업계 최고 SSIM 0.945로 육안 구별 불가능
                                </p>
                            </div>

                            <div className="bg-green-100 md:bg-green-600/40 md:border md:border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">빠른 처리 속도</h3>
                                <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                                    평균 2.3초 이내 변환 완료
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="md:hidden">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-blue-500 shadow-sm">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">
                                SSIM (Structural Similarity Index)이란?
                            </h2>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 leading-relaxed">
                                SSIM은 원본 이미지와 변환된 이미지의 구조적 유사도를 측정하는 지표입니다.
                                1에 가까울수록 육안으로 구별하기 어려운 고품질 이미지를 의미합니다.
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
                                Perturba는{' '}
                                <span className="text-blue-600 font-bold">0.945의 높은 SSIM 점수</span>
                                를 기록하여 육안으로는 거의 차이가 없으면서도 AI 모델의 인식을 효과적으로 교란시킵니다.
                            </p>
                        </div>
                    </section>

                    <section className="pb-4 sm:pb-6 md:pb-12">
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                            성능 지표 비교
                        </h2>
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm md:shadow-lg border-2 border-indigo-100 p-3 sm:p-5 md:p-8">
                            <div className="mb-3 sm:mb-4 md:mb-6">
                                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] md:h-[300px]">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#6b7280', fontSize: 10 }}
                                            className="sm:text-xs md:text-sm"
                                            axisLine={{ stroke: '#6b7280' }}
                                        />
                                        <YAxis
                                            domain={[0, 1]}
                                            ticks={[0, 0.25, 0.5, 0.75, 1]}
                                            tick={{ fill: '#6b7280', fontSize: 10 }}
                                            className="sm:text-xs md:text-sm"
                                            axisLine={{ stroke: '#6b7280' }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                            className="sm:w-[50px] md:w-[60px]"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="#3b82f6" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6">
                                <div className="w-2.5 h-2 sm:w-3 sm:h-2 md:w-3.5 md:h-2.5 bg-blue-500"></div>
                                <span className="text-xs sm:text-sm md:text-base text-blue-500 font-medium">SSIM (↑)</span>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 md:p-4">
                                <h3 className="text-xs sm:text-sm md:text-base font-bold text-blue-900 mb-1 md:mb-2">
                                    SSIM (Structural Similarity)
                                </h3>
                                <p className="text-[10px] sm:text-xs md:text-base font-medium text-blue-700">
                                    값이 높을수록 원본과 시각적으로 유사한 고품질 이미지
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
