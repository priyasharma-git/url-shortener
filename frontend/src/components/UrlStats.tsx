import { useState, useEffect, useCallback } from 'react';
import { urlService } from '../services/api';
import type { UrlStatsResponse } from '../types';

type UrlStatsProps = {
    shortCode: string;
    onClose: () => void;
}

export const UrlStats = ({ shortCode, onClose }: UrlStatsProps) => {
    const [ stats, setStats ] = useState<UrlStatsResponse | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');

    const loadStats = useCallback(async () => {
        setLoading(true);
            setError('');

            try {
                const data = await urlService.getUrlStats(shortCode);
                setStats(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load statistics');
            } finally {
                setLoading(false);
            }
    }, [shortCode]);

    useEffect(() => {
        void loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if(loading) {
        return (
            <div className="card max-w-3xl mx-auto">
                <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-gray-600">Loading statistics...</span>
                </div>
            </div>
        );
    }

    if(error) {
        return (
            <div className="card max-w-3xl mx-auto bg-red-50 border-2 border-red-200">
                <p className='text-red-700 mb-4'>{error}</p>
                <button onClick={onClose} className='btn-secondary'>
                    Go Back
                </button>
            </div>
        );
    }

    if(!stats) return null;

    return (
        <div className='card max-w-3xl mx-auto animate-fade-in'>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>URL Statistics</h2>
                <button
                    onClick={onClose}
                    className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
                    aria-label="Close"
                >
                    x
                </button>
            </div>

            <div className='mb-6'>
                {stats.isExpired ? (
                    <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800'>
                        Expired
                    </span>
                ) : (
                    <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800'>
                        Active
                    </span>
                )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl'>
                    <div className='text-sm font-semibold text-blue-800 mb-1'>Short Code</div>
                    <div className='text-2xl font-bold text-blue-900 font-mono'>{stats.shortCode}</div>
                </div>

                <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl'>
                    <div className='text-sm font-semibold text-purple-800 mb-1'>Total Clicks</div>
                    <div className='text-2xl font-bold text-purple-900'>{stats.clickCount.toLocaleString()}</div>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl'>
                    <div className='text-sm font-semibold text-green-800 mb-1'>Created</div>
                    <div className='text-lg font-semibold text-green-900'>{formatDate(stats.createdAt)}</div>
                </div>

                <div className='bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl'>
                    <div className='text-sm font-semibold text-orange-800 mb-1'>Expires</div>
                    <div className='text-lg font-semibold text-orange-900'>{formatDate(stats.expiresAt)}</div>
                </div>
            </div>

            <div className='bg-gray-50 p-5 rounded-xl mb-6'>
                <div className='text-sm font-semibold text-gray-700 mb-2'>
                    Original URL
                </div>
                <a
                    href={stats.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium break-all hover:underline"
                >
                    {stats.originalUrl}
                </a>
            </div>

            {stats.customAlias && (
                <div className='bg-indigo-50 p-5 rounded-xl mb-6'>
                    <div className='text-sm font-semibold text-indigo-800 mb-2'>Custom Alias</div>
                    <div className='text-lg font-mono font-bold text-indigo-900'>{stats.customAlias}</div>
                </div>
            )}

            <div className='flex gap-3'>
                <button onClick={loadStats} className="btn-secondary flex-1">
                    Refresh
                </button>
                <button onClick={onClose} className="btn-primary flex-1">
                    Create New URL
                </button>
            </div>
        </div>
    )
}