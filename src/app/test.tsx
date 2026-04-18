export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SwiftLogistics Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Premium logistics platform is ready!
        </p>
        <div className="space-x-4">
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Home
          </a>
          <a 
            href="/tracking" 
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Go to Tracking
          </a>
        </div>
      </div>
    </div>
  );
}