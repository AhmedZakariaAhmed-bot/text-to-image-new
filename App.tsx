
import React, { useState, useCallback } from 'react';
import { generateImageFromText } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ImagePlaceholderIcon, SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('تکایە داواکارییەک بنووسە.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generateImageFromText(prompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'هەڵەیەکی نەزانراو ڕوویدا لە کاتی دروستکردنی وێنەکەدا.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white" dir="rtl">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              وێنەکێشی زیرەک
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            دەقەکانت بگۆڕە بۆ وێنەی سەرنجڕاکێش. پشتگیری لە هەموو زمانەکان دەکات.
          </p>
        </header>

        <main className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-1 text-right">
                داواکاری وێنەکەت بنووسە
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="بۆ نموونە، قەڵایەکی کوردی شکۆدار لەسەر لوتکەی شاخێکی بەفراوی، وەک وێنەی ڕاستەقینە"
                rows={4}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-slate-500 resize-none text-right"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt.trim()}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out group"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-5 h-5 ml-3" /> {/* Adjusted margin for RTL */}
                  دروست دەکرێت...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" /> {/* Adjusted margin for RTL */}
                  وێنەکە دروست بکە
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-700/30 border border-red-600 text-red-300 p-3 rounded-md text-sm text-right">
                <p><strong>هەڵە:</strong> {error}</p>
              </div>
            )}
          </div>
        </main>

        <section aria-live="polite" className="mt-8">
          {isLoading && !generatedImageUrl && (
            <div className="flex flex-col items-center justify-center h-80 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-700 text-slate-400">
              <LoadingSpinner className="w-12 h-12 mb-4 text-purple-400" />
              <p className="text-lg">شاكارەكەت دروست دەكرێت...</p>
              <p className="text-sm">لەوانەیە ئەمە کەمێک کات بخایەنێت.</p>
            </div>
          )}

          {!isLoading && generatedImageUrl && (
            <div className="bg-slate-800/70 backdrop-blur-md shadow-2xl rounded-xl p-2 sm:p-4">
              <img
                src={generatedImageUrl}
                alt="وێنەی دروستکراو بە زیرەکی دەستکرد لەسەر بنەمای داواکارییەکە"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          )}

          {!isLoading && !generatedImageUrl && !error && (
             <div className="flex flex-col items-center justify-center h-80 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-700 text-slate-400 p-6 text-center">
              <ImagePlaceholderIcon className="w-16 h-16 mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold text-slate-300">وێنەکەت لێرە دەردەکەوێت</h3>
              <p className="mt-1 text-sm">داواکارییەک لە سەرەوە بنووسە و کرتە لە "وێنەکە دروست بکە" بکە بۆ دەستپێکردن.</p>
            </div>
          )}
        </section>
        
        <footer className="text-center text-sm text-slate-500 pt-8">
            <p>powered by ahmed rawandzy</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
