import { useState } from 'react';
import { urlService } from '../services/api';
import type { UrlResponse } from '../types';

const SHORT_URL_BASE_URL = import.meta.env.VITE_SHORT_URL_BASE_URL || 'http://localhost:8080';

type UrlShortenerProps = {
    onUrlCreated: (response: UrlResponse) => void;
}

export const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [expirationDays, setExpirationDays] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data: any = {
                originalUrl,
            };
            const trimmedAlias = customAlias.trim();
            if (trimmedAlias) {
                data.customAlias = trimmedAlias;
            }
            if(expirationDays && parseInt(expirationDays) > 0) {
                data.expirationDays = parseInt(expirationDays);
            }
            const response = await urlService.createShortUrl(data);
            onUrlCreated(response);
            setOriginalUrl('');
            setCustomAlias('');
            setExpirationDays('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while shortening the URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel panel--tight">
            <h2 className='panel__title'>Shorten Your URL</h2>
            <p className='panel__subtitle mb-6'>Create a polished short link in seconds.</p>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="originalUrl" className="field-label">
                        Original URL
                    </label>
                    <input
                        id="originalUrl"
                        type="url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="https://example.com/very-long-url"
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="customAlias" className='field-label'>
                        Custom Alias
                        <span className='ml-2 text-sm font-normal text-slate-400'>
                            (Optional - max 50 chars)
                        </span>
                    </label>
                    <input
                        id="customAlias"
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="my-custom-link"
                        maxLength={50}
                        className="input-field"
                    />
                    {customAlias && (
                        <p className='helper-text'>
                            Preview: {SHORT_URL_BASE_URL.replace(/^https?:\/\//, '')}/{customAlias}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="expirationDays" className='field-label'>
                        Expiration (Days)
                        <span className='ml-2 text-sm font-normal text-slate-400'>
                            (Default to 30)
                        </span>
                    </label>
                    <input
                        id="expirationDays"
                        type="number"
                        value={expirationDays}
                        onChange={(e) => setExpirationDays(e.target.value)}
                        placeholder="30"
                        min={1}
                        max={365}
                        className="input-field"
                    />
                    <p className='helper-text'>
                        Defaults to 30 days if left empty. Must be between 1 and 365 days.
                    </p>
                </div>

                {error && (
                    <div className='message-box message-box--error'>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !originalUrl}
                    className="btn-primary w-full"
                >
                    {loading ? (
                        <span className='flex items-center justify-center gap-2'>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Shortening...
                        </span>
                    ) : (
                        'Shorten URL'
                    )}
                </button>
            </form >
        </div >
    )
};