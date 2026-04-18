'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
  const [jsWorking, setJsWorking] = useState(false);
  const [tailwindWorking, setTailwindWorking] = useState(false);
  const [reactHydrated, setReactHydrated] = useState(false);

  useEffect(() => {
    // JavaScript is working if this runs
    setJsWorking(true);
    
    // React hydration is working
    setReactHydrated(true);
    
    // Check if Tailwind is working by checking computed styles
    const testEl = document.getElementById('tailwind-test');
    if (testEl) {
      const styles = window.getComputedStyle(testEl);
      const bgColor = styles.backgroundColor;
      // Check if it's the Tailwind blue-500 color (rgb(59, 130, 246))
      if (bgColor.includes('59') && bgColor.includes('130') && bgColor.includes('246')) {
        setTailwindWorking(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Diagnostic Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* JavaScript Test */}
          <div className={`p-6 rounded-xl shadow-lg ${jsWorking ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h2 className="text-xl font-bold mb-3">JavaScript</h2>
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${jsWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{jsWorking ? 'Working ✓' : 'Not Working ✗'}</span>
            </div>
            <p className="text-sm text-gray-600">
              Client-side JavaScript execution
            </p>
          </div>
          
          {/* Tailwind Test */}
          <div className={`p-6 rounded-xl shadow-lg ${tailwindWorking ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h2 className="text-xl font-bold mb-3">Tailwind CSS</h2>
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${tailwindWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{tailwindWorking ? 'Working ✓' : 'Not Working ✗'}</span>
            </div>
            <div 
              id="tailwind-test" 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center mt-2"
              style={{ display: 'none' }}
            >
              Tailwind Test Element
            </div>
            <p className="text-sm text-gray-600">
              CSS framework and styling
            </p>
          </div>
          
          {/* React Hydration Test */}
          <div className={`p-6 rounded-xl shadow-lg ${reactHydrated ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h2 className="text-xl font-bold mb-3">React Hydration</h2>
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${reactHydrated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{reactHydrated ? 'Working ✓' : 'Not Working ✗'}</span>
            </div>
            <p className="text-sm text-gray-600">
              React component hydration
            </p>
          </div>
        </div>
        
        {/* Visual Tests */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Visual Tests</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <p className="text-white font-medium">Gradient Test</p>
            </div>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Hover Button
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Green Button
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Red Button
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-gray-100 rounded-lg">Col 1</div>
              <div className="p-4 bg-gray-100 rounded-lg">Col 2</div>
              <div className="p-4 bg-gray-100 rounded-lg">Col 3</div>
              <div className="p-4 bg-gray-100 rounded-lg">Col 4</div>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">If styling is not working:</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>1. Check browser console for errors (F12 → Console)</li>
            <li>2. Clear browser cache (Ctrl+Shift+Delete)</li>
            <li>3. Try incognito/private mode</li>
            <li>4. Disable browser extensions</li>
            <li>5. Check if CSS file is loading in Network tab</li>
          </ul>
        </div>
        
        <div className="mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}