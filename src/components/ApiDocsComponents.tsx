import { useState } from 'react';
import { BiCopy, BiCheck, BiChevronDown } from 'react-icons/bi';

interface CodeBlockProps {
    code: string;
    id: string;
}

export function CodeBlock({ code, id }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <pre className="bg-slate-900 text-white p-4 rounded-lg text-xs md:text-sm overflow-x-auto font-mono leading-relaxed">
                {code}
            </pre>
            <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded transition"
            >
                {copied ? (
                    <BiCheck className="text-green-400" size={16} />
                ) : (
                    <BiCopy className="text-gray-300" size={16} />
                )}
            </button>
        </div>
    );
}

interface MethodBadgeProps {
    method: string;
}

export function MethodBadge({ method }: MethodBadgeProps) {
    const colors: Record<string, string> = {
        GET: 'bg-blue-100 text-blue-700',
        POST: 'bg-green-100 text-green-700',
        DELETE: 'bg-red-100 text-red-700',
        PUT: 'bg-yellow-100 text-yellow-700',
        PATCH: 'bg-purple-100 text-purple-700',
    };

    return (
        <span className={`px-3 py-1 ${colors[method] || 'bg-gray-100 text-gray-700'} font-bold rounded-md text-xs`}>
            {method}
        </span>
    );
}

interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
}

export function Section({ id, title, children, defaultExpanded = false }: SectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
            >
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <BiChevronDown
                    className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    size={24}
                />
            </button>
            {isExpanded && (
                <div className="p-6 space-y-6">
                    {children}
                </div>
            )}
        </div>
    );
}

interface EndpointProps {
    method: string;
    path: string;
    title: string;
    description: string;
    headers?: { name: string; value: string; required: boolean }[];
    request?: {
        body?: string;
        params?: { name: string; type: string; required: boolean; description: string }[]
    };
    responses: { status: number; description: string; body: string }[];
}

export function Endpoint({
    method,
    path,
    title,
    description,
    headers,
    request,
    responses,
}: EndpointProps) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <MethodBadge method={method} />
                    <code className="text-sm text-gray-800">{path}</code>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="p-4 space-y-4">
                {headers && headers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Headers</h4>
                        {headers.map((header, idx) => (
                            <div key={idx} className="mb-2">
                                <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono text-blue-600">{header.name}</code>
                                    {header.required && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                            required
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{header.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {request?.params && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Parameters</h4>
                        {request.params.map((param, idx) => (
                            <div key={idx} className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="text-xs font-mono text-blue-600">{param.name}</code>
                                    <span className="text-xs text-gray-500">{param.type}</span>
                                    {param.required && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                                            required
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600">{param.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {request?.body && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Request Body</h4>
                        <CodeBlock code={request.body} id={`req-${path}`} />
                    </div>
                )}

                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Responses</h4>
                    {responses.map((response, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${response.status === 200 || response.status === 201 ? 'bg-green-100 text-green-700' :
                                        response.status === 400 || response.status === 409 ? 'bg-yellow-100 text-yellow-700' :
                                            response.status === 401 || response.status === 403 || response.status === 404 ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {response.status}
                                </span>
                                <span className="text-sm text-gray-700">{response.description}</span>
                            </div>
                            <CodeBlock code={response.body} id={`res-${path}-${response.status}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
