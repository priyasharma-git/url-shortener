import { useEffect, useState } from 'react';
import { UrlShortener, UrlStats, UrlResult } from './components';
import { urlService } from './services/api';
import type { UrlListItem, UrlResponse } from './types';

type View = 'landing' | 'create' | 'admin' | 'stats';

export const App = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [urlResult, setUrlResult] = useState<UrlResponse | null>(null);
  const [statsShortCode, setStatsShortCode] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [statsLookupCode, setStatsLookupCode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUrls, setAdminUrls] = useState<UrlListItem[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [statsReturnView, setStatsReturnView] = useState<'create' | 'admin'>('create');

  const resetFlow = () => {
    setCurrentView('landing');
    setUrlResult(null);
    setStatsShortCode('');
    setStatsLookupCode('');
    setAdminUsername('');
    setAdminPassword('');
    setIsAdminAuthenticated(false);
    setAdminUrls([]);
    setAdminLoading(false);
    setMessage('');
    setStatsReturnView('create');
  };

  const handleUrlCreated = (response: UrlResponse) => {
    setUrlResult(response);
  };

  const handleGoToCreate = () => {
    setCurrentView('create');
    setUrlResult(null);
    setStatsShortCode('');
    setStatsLookupCode('');
    setMessage('');
  };

  const handleGoToAdmin = () => {
    setCurrentView('admin');
    setStatsReturnView('admin');
    setMessage('');
  };

  const handleBackToCreate = () => {
    setCurrentView('create');
    setUrlResult(null);
    setStatsShortCode('');
    setStatsLookupCode('');
    setMessage('');
  };

  const handleBackToAdmin = () => {
    setCurrentView('admin');
    setStatsShortCode('');
    setMessage('');
  };

  const loadAdminUrls = async () => {
    setAdminLoading(true);
    setMessage('');

    try {
      const data = await urlService.getAllUrlsForAdmin();
      setAdminUrls(data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to load analytics records right now.');
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated && currentView === 'admin') {
      void loadAdminUrls();
    }
  }, [isAdminAuthenticated, currentView]);

  const handleAdminSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (adminUsername.trim() === 'admin' && adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setMessage('');
    } else {
      setIsAdminAuthenticated(false);
      setMessage('Invalid admin credentials.');
    }
  };

  const handleViewStatsFromAdmin = (shortCode: string) => {
    setStatsShortCode(shortCode);
    setStatsReturnView('admin');
    setCurrentView('stats');
    setMessage('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4'>
      <div className='container mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3'>
            URL Shortener
          </h1>
          <p className='text-gray-600 text-lg'>
            Fast, reliable, and feature-rich URL shortening service
          </p>
        </header>

        <main>
          {currentView === 'landing' && (
            <div className='mx-auto max-w-5xl'>
              <div className='grid gap-6 md:grid-cols-2'>
                <button
                  type='button'
                  onClick={handleGoToCreate}
                  className='group rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
                >
                  <div className='mb-5 inline-flex rounded-2xl bg-primary-100 p-3 text-primary-700'>
                    <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101' />
                    </svg>
                  </div>
                  <h2 className='text-2xl font-bold text-gray-800'>Generate URL</h2>
                  <p className='mt-3 text-sm leading-6 text-gray-600'>Create a short, memorable link in seconds for your next campaign or share.</p>
                </button>

                <button
                  type='button'
                  onClick={handleGoToAdmin}
                  className='group rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-left text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
                >
                  <div className='mb-5 inline-flex rounded-2xl bg-white/20 p-3'>
                    <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zm0 2c-3.866 0-7 2.462-7 5.5V20h14v-1.5c0-3.038-3.134-5.5-7-5.5z' />
                    </svg>
                  </div>
                  <h2 className='text-2xl font-bold'>View Statistics</h2>
                  <p className='mt-3 text-sm leading-6 text-indigo-100'>Secure admin access for analytics, click counts, and expiry tracking.</p>
                </button>
              </div>
            </div>
          )}

          {currentView === 'create' && (
            <>
              <div className='mb-6 flex justify-start'>
                <button type='button' onClick={resetFlow} className='text-sm font-semibold text-primary-600 hover:text-primary-700'>
                  ← Back to home
                </button>
              </div>
              <UrlShortener onUrlCreated={handleUrlCreated} />
              {urlResult && <UrlResult result={urlResult} showStatsLink={false} />}
            </>
          )}

          {currentView === 'admin' && (
            <div className='card mx-auto max-w-2xl'>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800'>Admin Access</h2>
                  <p className='text-sm text-gray-600'>Sign in to view URL analytics and click data.</p>
                </div>
                <button type='button' onClick={resetFlow} className='text-sm font-semibold text-primary-600 hover:text-primary-700'>
                  Back home
                </button>
              </div>

              {message && (
                <div className='mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
                  {message}
                </div>
              )}

              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminSubmit} className='space-y-4'>
                  <div>
                    <label htmlFor='adminUsername' className='mb-2 block text-left text-sm font-semibold text-gray-700'>
                      Username
                    </label>
                    <input
                      id='adminUsername'
                      type='text'
                      value={adminUsername}
                      onChange={(event) => setAdminUsername(event.target.value)}
                      className='input-field'
                      placeholder='admin'
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor='adminPassword' className='mb-2 block text-left text-sm font-semibold text-gray-700'>
                      Password
                    </label>
                    <input
                      id='adminPassword'
                      type='password'
                      value={adminPassword}
                      onChange={(event) => setAdminPassword(event.target.value)}
                      className='input-field'
                      placeholder='••••••••'
                      required
                    />
                  </div>

                  <button type='submit' className='btn-primary w-full'>
                    Continue to analytics
                  </button>
                </form>
              ) : (
                <div className='space-y-4'>
                  <div className='rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
                    Select a shortened URL below to inspect its analytics in detail.
                  </div>

                  {adminLoading ? (
                    <div className='flex items-center justify-center py-6 text-sm text-gray-600'>
                      <svg className='mr-3 h-5 w-5 animate-spin text-primary-600' viewBox='0 0 24 24' fill='none'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
                      </svg>
                      Loading analytics list...
                    </div>
                  ) : adminUrls.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-gray-500'>
                      No shortened URLs have been created yet.
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {adminUrls.map((item) => (
                        <div key={item.shortCode} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                          <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                            <div className='min-w-0'>
                              <div className='text-sm font-semibold text-primary-700'>/{item.shortCode}</div>
                              <p className='mt-2 break-all text-sm text-gray-700'>{item.originalUrl}</p>
                              <div className='mt-3 flex flex-wrap gap-3 text-xs text-gray-500'>
                                <span>Clicks: {item.clickCount}</span>
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button
                              type='button'
                              onClick={() => handleViewStatsFromAdmin(item.shortCode)}
                              className='rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100'
                            >
                              View more
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className='mt-5 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700'>
                Demo credentials: <span className='font-semibold'>admin</span> / <span className='font-semibold'>admin123</span>
              </div>
            </div>
          )}

          {currentView === 'stats' && (
            <UrlStats shortCode={statsShortCode} onClose={statsReturnView === 'admin' ? handleBackToAdmin : handleBackToCreate} />
          )}
        </main>

        <footer className='text-center mt-16 text-gray-500 text-sm'>
          <p>Built with Spring Boot, React, PostgreSQL and Redis</p>
          <p className='mt-2'>
            Supports custom aliases • Rate limiting • Analytics • Redis caching
          </p>
        </footer>
      </div>
    </div>
  );
};
