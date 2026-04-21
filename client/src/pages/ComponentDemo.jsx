import { useState } from 'react';
import { LoadingState, ErrorState } from '../components/reusable';
import SEO from '../components/reusable/SEO';

/**
 * Demo page to showcase reusable state components
 * This file can be used for testing and reference
 * Route: /component-demo (add to router if needed)
 */
const ComponentDemo = () => {
    const [showLoading, setShowLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleRetry = () => {
        alert('Retry button clicked!');
        setShowError(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
               <SEO />
            <div className="max-w-6xl mx-auto px-6 md:px-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Reusable Components Demo
                </h1>

                {/* Controls */}
                <div className="bg-white rounded-lg   p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Controls</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowLoading(!showLoading)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                        >
                            Toggle Loading State
                        </button>
                        <button
                            onClick={() => setShowError(!showError)}
                            className="bg-[#FF1033] hover:bg-[#511313] text-white px-6 py-2 rounded"
                        >
                            Toggle Error State
                        </button>
                    </div>
                </div>

                {/* Loading State Examples */}
                {showLoading && (
                    <div className="space-y-8 mb-8">
                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Default Loading State</h3>
                            </div>
                            <LoadingState />
                        </div>

                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Small Size with Custom Message</h3>
                            </div>
                            <LoadingState
                                message="Fetching data..."
                                size="sm"
                            />
                        </div>

                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Large Size with Light Theme</h3>
                            </div>
                            <LoadingState
                                message="Processing your request..."
                                size="lg"
                                bgColor="bg-white"
                                textColor="text-gray-900"
                            />
                        </div>
                    </div>
                )}

                {/* Error State Examples */}
                {showError && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Default Error State</h3>
                            </div>
                            <ErrorState error="Something went wrong!" />
                        </div>

                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Error with Retry Button</h3>
                            </div>
                            <ErrorState
                                error="Failed to load data from server"
                                title="Connection Error"
                                onRetry={handleRetry}
                            />
                        </div>

                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Error with Retry and Home Button</h3>
                            </div>
                            <ErrorState
                                error="The page you're looking for doesn't exist"
                                title="404 - Page Not Found"
                                onRetry={handleRetry}
                                showHomeButton={true}
                            />
                        </div>

                        <div className="bg-white rounded-lg   overflow-hidden">
                            <div className="bg-gray-800 text-white px-6 py-3">
                                <h3 className="font-semibold">Light Theme Error</h3>
                            </div>
                            <ErrorState
                                error="Unable to process your request at this time"
                                title="Service Temporarily Unavailable"
                                bgColor="bg-gray-50"
                                textColor="text-gray-900"
                                errorColor="text-orange-600"
                                onRetry={handleRetry}
                            />
                        </div>
                    </div>
                )}

                {/* Code Examples */}
                {!showLoading && !showError && (
                    <div className="bg-white rounded-lg   p-6">
                        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">LoadingState</h3>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                                    {`import { LoadingState } from '../components/reusable';

// Basic usage
<LoadingState />

// Custom message and size
<LoadingState 
    message="Loading sales experts..." 
    size="md"
/>`}
                                </pre>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">ErrorState</h3>
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                                    {`import { ErrorState } from '../components/reusable';

// With retry functionality
<ErrorState 
    error="Failed to load data"
    title="Connection Error"
    onRetry={() => dispatch(fetchData())}
/>

// With home button
<ErrorState 
    error="Page not found"
    showHomeButton={true}
/>`}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentDemo;
