export default function ApiDocsPage() {
    return (
        <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
            <div className="px-4 md:px-16 py-4 md:py-16 bg-white md:bg-gray-50">
                <h1 className="text-base md:text-2xl font-semibold md:font-bold text-gray-900 mb-1 md:mb-2">
                    API Documentation
                </h1>
                <p className="hidden md:block text-gray-600 text-base">
                    Perturba API를 사용하여 이미지 처리 및 관리 기능을 애플리케이션에 통합할 수 있습니다.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 md:py-0">
                <div className="space-y-6 md:space-y-12 max-w-4xl md:mx-0">
                    <section className="md:hidden">
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Perturba API를 사용하여 이미지 처리 및 관리 기능을 애플리케이션에 통합할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-bold text-gray-800 md:text-gray-900 mb-2 md:mb-3">
                            인증 (Authentication)
                        </h2>
                        <p className="text-sm md:text-base text-gray-700 md:text-gray-600 mb-3 md:mb-4">
                            모든 API 요청에는 인증 키가 필요합니다. 헤더에 포함시켜 주세요.
                        </p>
                        <div className="bg-slate-900 text-white rounded-xl md:rounded-md px-4 py-3 font-mono text-xs md:text-sm">
                            X-API-Key: &lt;key&gt;
                        </div>
                    </section>

                    <section>
                        <h2 className="text-base md:text-lg font-bold text-gray-800 md:text-gray-900 mb-3 md:mb-4">
                            엔드포인트 (Endpoints)
                        </h2>
                        <div className="bg-white rounded-2xl md:rounded-lg shadow-sm md:shadow-md overflow-hidden border md:border-0">
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 font-bold rounded-md text-xs">
                                        POST
                                    </span>
                                    <code className="text-xs md:text-sm text-gray-800">/v1/external/transform</code>
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 md:mb-2">
                                    파일 업로드
                                </h3>
                                <p className="text-xs md:text-sm text-gray-700 md:text-gray-600">
                                    이미지 파일을 서버에 업로드합니다.
                                </p>
                            </div>

                            <div className="px-4 md:px-6 py-3 md:py-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Parameters</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-blue-600 text-xs md:text-sm font-bold">file</span>
                                            <span className="text-xs text-gray-600">File</span>
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                                required
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 md:text-gray-500">
                                            업로드할 이미지 파일 (최대 10MB, jpg, png, gif 형식)
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-blue-600 text-xs md:text-sm font-bold">intensity</span>
                                            <span className="text-xs text-gray-600">string</span>
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                                required
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 md:text-gray-500">
                                            Perturbation 강도
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
                                <div className="flex gap-2 mb-3">
                                    <button className="px-3 py-1.5 md:py-1 bg-gray-200 text-gray-700 md:text-gray-600 rounded-lg md:rounded text-sm font-semibold">
                                        Request
                                    </button>
                                    <button className="px-3 py-1.5 md:py-1 bg-gray-100 text-gray-600 rounded-lg md:rounded text-sm">
                                        Response
                                    </button>
                                </div>
                                <pre className="bg-slate-900 text-white p-4 rounded-xl md:rounded-md text-xs md:text-sm overflow-x-auto font-mono leading-relaxed">
                                    {`const formData = new FormData();
formData.append('file', imageFile);
formData.append('title', '샘플 이미지');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});`}
                                </pre>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
