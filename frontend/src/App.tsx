import { useState } from 'react';
import { UrlShortener, UrlStats, UrlResult } from './components';
import type { UrlResponse } from './types';

type View = 'landing' | 'create' | 'admin' | 'stats';

export const App = () => {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [urlResult, setUrlResult] = useState<UrlResponse | null>(null);
  const [statsShortCode, setStatsShortCode] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [statsLookupCode, setStatsLookupCode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [message, setMessage] = useState('');

  const resetFlow = () => {
    setCurrentView('landing');
    setUrlResult(null);
    setStatsShortCode('');
    setStatsLookupCode('');
    setAdminUsername('');
    setAdminPassword('');
    setIsAdminAuthenticated(false);
    setMessage('');
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
    setMessage('');
  };

  const handleBackToCreate = () => {
    setCurrentView('create');
    setUrlResult(null);
    setStatsShortCode('');
    setStatsLookupCode('');
    setMessage('');
  };

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

  const handleStatsLookup = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedCode = statsLookupCode.trim();

    if (!trimmedCode) {
      setMessage('Please enter a short code to look up its stats.');
      return;
    }

    setStatsShortCode(trimmedCode);
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
                    Continue to stats
                  </button>
                </form>
              ) : (
                <form onSubmit={handleStatsLookup} className='space-y-4'>
                  <div>
                    <label htmlFor='statsLookupCode' className='mb-2 block text-left text-sm font-semibold text-gray-700'>
                      Short code
                    </label>
                    <input
                      id='statsLookupCode'
                      type='text'
                      value={statsLookupCode}
                      onChange={(event) => setStatsLookupCode(event.target.value)}
                      className='input-field'
                      placeholder='abc123'
                      required
                    />
                  </div>

                  <button type='submit' className='btn-primary w-full'>
                    View statistics
                  </button>
                </form>
              )}

              <div className='mt-5 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700'>
                Demo credentials: <span className='font-semibold'>admin</span> / <span className='font-semibold'>admin123</span>
              </div>
            </div>
          )}

          {currentView === 'stats' && (
            <UrlStats shortCode={statsShortCode} onClose={handleBackToCreate} />
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
