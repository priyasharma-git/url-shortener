import { useState } from 'react';
import type { UrlResponse } from '../types';

type UrlResultProps = {
    result: UrlResponse;
    onViewStats?: (shortCode: string) => void;
    showStatsLink?: boolean;
}

export const UrlResult = ({ result, onViewStats, showStatsLink = false }: UrlResultProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.log('Failed to copy: ', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    return (
        <div className="card max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
                <h3 className='text-xl font-bold text-gray-800'>URL Shortened Successfully</h3>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Your Short URL
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={result.shortUrl}
                        readOnly
                        className="input-field flex-1 bg-gray-50 font-mono text-primary-600 font-semibold"
                    />

                    <button
                        onClick={handleCopy}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${copied
                            ? "bg-green-500 text-white"
                            : "bg-primary-600 hover:bg-primary-700 text-white"
                            }`}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span className="font-semibold">Expires:</span>{" "}
                    {formatDate(result.expiresAt)}
                </div>

                {showStatsLink && onViewStats && (
                    <button
                        onClick={() => onViewStats(result.shortCode)}
                        className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                    >
                        View Statistics
                    </button>
                )}
            </div>
        </div>
    );
};
