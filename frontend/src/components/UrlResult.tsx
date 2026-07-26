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
        <div className="panel panel--tight mt-6">
            <div className="mb-4">
                <h3 className='panel__title'>URL Shortened Successfully</h3>
            </div>

            <div className="result-box">
                <label className="field-label">
                    Your Short URL
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={result.shortUrl}
                        readOnly
                        className="input-field flex-1 bg-white font-mono text-slate-900"
                    />

                    <button
                        onClick={handleCopy}
                        className={`copy-button ${copied ? 'copy-button--copied' : ''}`}
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>

            <div className="result-meta">
                <div>
                    <span className="font-semibold text-slate-800">Expires:</span>{" "}
                    {formatDate(result.expiresAt)}
                </div>

                {showStatsLink && onViewStats && (
                    <button
                        onClick={() => onViewStats(result.shortCode)}
                        className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors duration-200 hover:text-slate-950"
                    >
                        View Statistics
                    </button>
                )}
            </div>
        </div>
    );
};
