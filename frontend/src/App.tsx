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
    <div className='app-shell'>
      <div className='app-container'>
        <header className='mb-12 text-center'>
          <h1 className='hero-title'>
            <span className='hero-title--accent'>URL Shortener</span>
          </h1>
          <p className='hero-subtitle'>
            A refined platform for creating concise links and reviewing their analytics with confidence.
          </p>
        </header>

        <main>
          {currentView === 'landing' && (
            <div className='mx-auto max-w-5xl'>
              <div className='choice-grid'>
                <button type='button' onClick={handleGoToCreate} className='choice-card'>
                  <div className='choice-card__icon'>
                    <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101' />
                    </svg>
                  </div>
                  <h2 className='choice-card__title'>Generate URL</h2>
                  <p className='choice-card__text'>Create a concise, professional link in seconds for campaigns, outreach, or internal sharing.</p>
                </button>

                <button type='button' onClick={handleGoToAdmin} className='choice-card choice-card--dark'>
                  <div className='choice-card__icon'>
                    <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zm0 2c-3.866 0-7 2.462-7 5.5V20h14v-1.5c0-3.038-3.134-5.5-7-5.5z' />
                    </svg>
                  </div>
                  <h2 className='choice-card__title'>View Statistics</h2>
                  <p className='choice-card__text'>Secure admin access for reviewing click performance, status, and link history.</p>
                </button>
              </div>
            </div>
          )}

          {currentView === 'create' && (
            <>
              <div className='mb-6 flex justify-start'>
                <button type='button' onClick={resetFlow} className='back-link'>
                  ← Back to home
                </button>
              </div>
              <UrlShortener onUrlCreated={handleUrlCreated} />
              {urlResult && <UrlResult result={urlResult} showStatsLink={false} />}
            </>
          )}

          {currentView === 'admin' && (
            <div className='panel panel--wide'>
              <div className='panel__header'>
                <div>
                  <h2 className='panel__title'>Admin Access</h2>
                  <p className='panel__subtitle'>Sign in to review link-level analytics and performance.</p>
                </div>
                <button type='button' onClick={resetFlow} className='back-link'>
                  Back home
                </button>
              </div>

              {message && (
                <div className='message-box'>
                  {message}
                </div>
              )}

              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminSubmit} className='space-y-4'>
                  <div>
                    <label htmlFor='adminUsername' className='field-label'>
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
                    <label htmlFor='adminPassword' className='field-label'>
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
                  <div className='message-box'>
                    Select a shortened URL below to inspect its analytics in detail.
                  </div>

                  {adminLoading ? (
                    <div className='flex items-center justify-center py-6 text-sm text-slate-600'>
                      <svg className='mr-3 h-5 w-5 animate-spin text-primary-600' viewBox='0 0 24 24' fill='none'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
                      </svg>
                      Loading analytics list...
                    </div>
                  ) : adminUrls.length === 0 ? (
                    <div className='rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500'>
                      No shortened URLs have been created yet.
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {adminUrls.map((item) => (
                        <div key={item.shortCode} className='admin-list-item'>
                          <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                            <div className='min-w-0'>
                              <div className='admin-list-item__code'>/{item.shortCode}</div>
                              <p className='mt-2 break-all text-sm text-slate-700'>{item.originalUrl}</p>
                              <div className='admin-list-item__meta'>
                                <span>Clicks: {item.clickCount}</span>
                                <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button
                              type='button'
                              onClick={() => handleViewStatsFromAdmin(item.shortCode)}
                              className='admin-list-item__button'
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

              <div className='message-box mt-5'>
                Demo credentials: <span className='font-semibold'>admin</span> / <span className='font-semibold'>admin123</span>
              </div>
            </div>
          )}

          {currentView === 'stats' && (
            <UrlStats shortCode={statsShortCode} onClose={statsReturnView === 'admin' ? handleBackToAdmin : handleBackToCreate} />
          )}
        </main>

        <footer className='footer-text'>
          <p><strong>Built with</strong> Spring Boot, React, PostgreSQL, and Redis</p>
          <p className='mt-2'>
            Supports custom aliases • rate limiting • analytics • resilient caching
          </p>
        </footer>
      </div>
    </div>
  );
};
