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
            <div className="panel panel--stats">
                <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-slate-600">Loading statistics...</span>
                </div>
            </div>
        );
    }

    if(error) {
        return (
            <div className="panel panel--stats">
                <p className='message-box message-box--error mb-4'>{error}</p>
                <button onClick={onClose} className='btn-secondary'>
                    Go Back
                </button>
            </div>
        );
    }

    if(!stats) return null;

    return (
        <div className='panel panel--stats'>
            <div className='panel__header'>
                <h2 className='panel__title'>URL Statistics</h2>
                <button
                    onClick={onClose}
                    className='text-2xl font-semibold text-slate-500 transition-colors duration-200 hover:text-slate-900'
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <div className='mb-6'>
                {stats.isExpired ? (
                    <span className='stats-badge stats-badge--expired'>
                        Expired
                    </span>
                ) : (
                    <span className='stats-badge stats-badge--active'>
                        Active
                    </span>
                )}
            </div>

            <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='metric-card'>
                    <div className='metric-card__label'>Short Code</div>
                    <div className='metric-card__value font-mono'>{stats.shortCode}</div>
                </div>

                <div className='metric-card'>
                    <div className='metric-card__label'>Total Clicks</div>
                    <div className='metric-card__value'>{stats.clickCount.toLocaleString()}</div>
                </div>

                <div className='metric-card'>
                    <div className='metric-card__label'>Created</div>
                    <div className='metric-card__value text-lg'>{formatDate(stats.createdAt)}</div>
                </div>

                <div className='metric-card'>
                    <div className='metric-card__label'>Expires</div>
                    <div className='metric-card__value text-lg'>{formatDate(stats.expiresAt)}</div>
                </div>
            </div>

            <div className='detail-block'>
                <div className='detail-block__label'>
                    Original URL
                </div>
                <a
                    href={stats.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                >
                    {stats.originalUrl}
                </a>
            </div>

            {stats.customAlias && (
                <div className='detail-block'>
                    <div className='detail-block__label'>Custom Alias</div>
                    <div className='text-lg font-mono font-semibold text-slate-950'>{stats.customAlias}</div>
                </div>
            )}

            <div className='flex flex-col gap-3 sm:flex-row'>
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