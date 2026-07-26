import { useState } from 'react';
import { urlService } from '../services/api';
import type { UrlResponse } from '../types';

type UrlShortenerProps = {
    onUrlCreated: (response: UrlResponse) => void;
}

export const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customAlias, setCustomAlias] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await urlService.createShortUrl({ originalUrl, customAlias });
            onUrlCreated(response);
            setOriginalUrl('');
            setCustomAlias('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred while shortening the URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-2xl mx-auto">
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Shorten Your URL</h2>
            <p className='text-gray-600 mb-6'>Create short, memorable links in seconds</p>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="originalUrl" className="block text-left text-sm font-semibold text-gray-700 mb-2">
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
                    <label htmlFor="customAlias" className='block text-left text-sm font-semibold text-gray=700 mb-2'>
                        Custom Alias
                        <span className='text-gray-400 font-normal'>
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
                        <p className='text-xs text-gray-500 mt-1'>
                            Preview: localhost:8080/{customAlias}
                        </p>
                    )}

                    {error && (
                        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
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
                </div>
            </form >
        </div >
    )
};