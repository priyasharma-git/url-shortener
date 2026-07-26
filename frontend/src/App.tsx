import { useState } from 'react';
import { UrlShortener, UrlStats } from './components';
import type { UrlResponse } from './types';

type View = 'create' | 'stats';

export const App = () => {
  const [ currentView, setCurrentView ] = useState<View>('create');
  const [ urlResult, setUrlResult ] = useState<UrlResponse | null>(null);
  const [ statsShortCode, setStatsShortCode ] = useState<string>('');

  const handleUrlCreated = (response: UrlResponse) => {
    setUrlResult(response);
  };

  const handleBackToCreate = () => {
    setCurrentView('create');
    setUrlResult(null);
    setStatsShortCode('');
  }

  return (
    <div className='min-h-screen py-12 px-4'>
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
          {currentView === 'create' ? (
            <>
              <UrlShortener onUrlCreated={handleUrlCreated} />
              {urlResult && (
                <div>Hi</div>
              )}
            </>
          ): (
            < UrlStats shortCode={statsShortCode} onClose={handleBackToCreate} />
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
  )
}
