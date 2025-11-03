export default function ApiDocsPage() {
    return (
        <div className="flex-1 min-h-0 flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto">
                <div className="p-16 flex flex-col gap-12">
                    <section>
                        <h1 className="text-2xl text-gray-900 font-semibold mb-2">API Documentation</h1>
                        <p className="text-gray-600">
                            Perturba API를 사용하여 이미지 처리 및 관리 기능을 애플리케이션에 통합할 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg text-gray-800 font-semibold mb-2">인증 (Authentication)</h2>
                        <p className="text-gray-600 mb-4">
                            모든 API 요청에는 인증 키가 필요합니다. 헤더에 포함시켜 주세요.
                        </p>
                        <div className="bg-slate-900 text-white rounded-md px-4 py-3 font-mono text-sm">
                            X-API-Key: &lt;key&gt;
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg text-gray-800 font-semibold mb-4">엔드포인트 (Endpoints)</h2>
                        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-md text-sm">
                                    POST
                                </span>
                                <code className="text-gray-800">/v1/external/transform</code>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900">파일 업로드</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    이미지 파일을 서버에 업로드합니다.
                                </p>

                                <h4 className="text-gray-800 font-semibold mb-2">Parameters</h4>
                                <ul className="text-sm space-y-1">
                                    <li className="text-gray-500">
                                        <span className="font-mono text-blue-600">file</span>{" "}
                                        <span className="text-gray-500">(File, required)</span>
                                        <br />
                                        업로드할 이미지 파일 (최대 10MB, jpg, png, gif 형식)
                                    </li>
                                    <li className="text-gray-500">
                                        <span className="font-mono text-blue-600">intensity</span>{" "}
                                        <span className="text-gray-500">(string, required)</span>
                                        <br />
                                        Perturbation 강도
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <div className="flex gap-2 mb-2">
                                    <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-sm">Request</button>
                                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">Response</button>
                                </div>
                                <pre className="bg-slate-900 text-white p-4 rounded-md text-sm overflow-x-auto">
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
