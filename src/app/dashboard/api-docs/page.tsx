"use client";

import ApiKeySection from "@/components/ApiKeySection";
import { Section, Endpoint, CodeBlock } from "@/components/ApiDocsComponents"

export default function ApiDocsPage() {
    return (
        <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
            <div className="px-4 md:px-16 py-4 md:py-16 bg-white md:bg-gray-50">
                <h1 className="text-base md:text-2xl font-semibold md:font-bold text-gray-900 mb-1 md:mb-2">
                    API Documentation
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                    Perturba API를 사용하여 이미지 처리 및 관리 기능을 애플리케이션에 통합할 수 있습니다.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-16 pb-8 space-y-6">

                <Section id="apikey-management" title="1. API 키 관리" defaultExpanded={true}>
                    <ApiKeySection />
                </Section>

                <Section id="external" title="2. 외부 통합 API">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                        <p className="text-sm text-gray-700">
                            <strong>중요:</strong> 외부 통합 API는 모든 요청에{' '}
                            <code className="px-1 py-0.5 bg-yellow-100 rounded text-xs">
                                X-Perturba-External-API-Key
                            </code>{' '}
                            헤더가 필요합니다.
                        </p>
                    </div>

                    <Endpoint
                        method="POST"
                        path="/v1/external/assets/upload"
                        title="이미지 업로드"
                        description="외부 클라이언트용 이미지 업로드. JPEG 형식의 224x224 픽셀 이미지만 허용됩니다."
                        headers={[
                            { name: 'X-Perturba-External-API-Key', value: '<api_key>', required: true },
                            { name: 'Content-Type', value: 'multipart/form-data', required: true },
                        ]}
                        request={{
                            params: [
                                {
                                    name: 'file',
                                    type: 'File',
                                    required: true,
                                    description: 'JPEG 형식, 224x224px 이미지 파일'
                                }
                            ]
                        }}
                        responses={[
                            {
                                status: 200,
                                description: '성공',
                                body: `{
  "ok": true,
  "data": {
    "assetId": 123,
    "width": 224,
    "height": 224,
    "mimeType": "image/jpeg",
    "sizeBytes": 12345
  }
}`
                            },
                            {
                                status: 400,
                                description: '잘못된 형식',
                                body: `{
  "ok": false,
  "error": {
    "code": "UNSUPPORTED_IMAGE_FORMAT",
    "message": "JPEG 형식만 지원합니다."
  }
}`
                            }
                        ]}
                    />

                    <Endpoint
                        method="POST"
                        path="/v1/external/transform"
                        title="변환 작업 생성"
                        description="업로드된 이미지를 기반으로 비동기 변환 작업을 생성합니다."
                        headers={[
                            { name: 'X-Perturba-External-API-Key', value: '<api_key>', required: true },
                            { name: 'Content-Type', value: 'application/json', required: true },
                        ]}
                        request={{
                            body: `{
  "assetId": 123,
  "intensity": "MEDIUM"
}`
                        }}
                        responses={[
                            {
                                status: 200,
                                description: '성공',
                                body: `{
  "ok": true,
  "data": {
    "jobPublicId": "01JABCDEF1234567890ABCDEF"
  }
}`
                            },
                            {
                                status: 403,
                                description: '권한 없음',
                                body: `{
  "ok": false,
  "error": {
    "code": "ASSET_NOT_OWNED_BY_API_KEY",
    "message": "해당 API Key 소유자가 업로드한 이미지가 아닙니다."
  }
}`
                            }
                        ]}
                    />

                    <Endpoint
                        method="GET"
                        path="/v1/external/transform/{jobPublicId}/result"
                        title="변환 결과 조회"
                        description="변환 작업의 결과를 조회합니다. 작업이 완료되지 않은 경우 에러를 반환합니다."
                        headers={[
                            { name: 'X-Perturba-External-API-Key', value: '<api_key>', required: true },
                        ]}
                        responses={[
                            {
                                status: 200,
                                description: '완료됨',
                                body: `{
  "ok": true,
  "data": {
    "jobPublicId": "01JABCDEF1234567890ABCDEF",
    "status": "COMPLETED",
    "input": {
      "assetId": 123,
      "url": "https://cdn.../input.jpg",
      "width": 224,
      "height": 224
    },
    "result": {
      "perturbedUrl": "https://cdn.../perturbed.jpg",
      "deepfakeOutputUrl": "https://cdn.../deepfake.jpg",
      "perturbationVisUrl": "https://cdn.../vis.jpg"
    }
  }
}`
                            },
                            {
                                status: 409,
                                description: '아직 완료되지 않음',
                                body: `{
  "ok": false,
  "error": {
    "code": "JOB_NOT_READY",
    "message": "작업이 아직 완료되지 않았습니다."
  }
}`
                            }
                        ]}
                    />
                </Section>
            </div>
        </div>
    );
}
