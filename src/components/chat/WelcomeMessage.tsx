"use client";

export function WelcomeMessage() {
  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold mb-6">Learnrithm Ai Chat</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="font-medium mb-2"></h2>
          <p className="text-sm text-gray-600">
            &quot;Explain quantum computing in simple terms&quot;
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="font-medium mb-2">Example</h2>
          <p className="text-sm text-gray-600">
            &quot;Got any creative ideas for a 10 year old&apos;s birthday?&quot;
          </p>
        </div>
      </div>
    </div>
  );
}