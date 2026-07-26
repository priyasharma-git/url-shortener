import { useState } from 'react';
import { UrlShortener } from './components/UrlShortener';
import type { UrlResponse } from './types';

type View = 'create' | 'stats';

export const App = () => {
  const [ currentView, setCurrentView ] = useState<View>('create');
  const [ urlResult, setUrlResult ] = useState<UrlResponse | null>(null);
  const [ statsShortCode, setStatsShortCode ] = useState<string>('');

  const handleUrlCreated = (response: UrlResponse) => {
    setUrlResult(response);
  };

  return (
    <div className='min-h-screen py-12 px-4'>
      <div className='container mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-3'>
            URL Shortener
          </h1>
          <p className='text-gray-600 text-lg'>
            Fast, reliable, and feature-rick URL shortening service
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
            <></>
          )}
        </main>
      </div>
    </div>
  )
}
