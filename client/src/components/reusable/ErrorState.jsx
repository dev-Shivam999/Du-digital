import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Reusable Error State Component
 * 
 * @param {string} error - Error message to display
 * @param {string} title - Error title (default: "Oops! Something went wrong")
 * @param {string} bgColor - Background color class (default: "bg-black")
 * @param {string} textColor - Text color class (default: "text-white")
 * @param {string} errorColor - Error accent color class (default: "text-[#FF1033]")
 * @param {function} onRetry - Optional retry callback function
 * @param {boolean} showHomeButton - Show button to navigate home (default: false)
 * @param {boolean} fullScreen - Whether to take full screen height (default: false)
 * @param {string} className - Additional custom classes
 */
const ErrorState = ({
    error = "An unexpected error occurred",
    title = "Oops! Something went wrong",
    bgColor = "bg-black",
    textColor = "text-white",
    errorColor = "text-[#FF1033]",
    onRetry,
    showHomeButton = false,
    fullScreen = false,
    className = ""
}) => {
    const paddingClasses = fullScreen ? "min-h-screen" : "py-20";

    return (
        <section className={`${bgColor} ${paddingClasses} ${className}`}>
            <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center gap-6">
                {/* Error Icon */}
                <div className={`${errorColor} bg-[#FF1033]/10 p-4 rounded-full`}>
                    <AlertCircle className="w-16 h-16" strokeWidth={2} />
                </div>

                {/* Error Title */}
                <h2 className={`text-2xl md:text-3xl font-bold ${textColor}`}>
                    {title}
                </h2>

                {/* Error Message */}
                <p className={`${errorColor} text-lg max-w-md`}>
                    {error}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center gap-2 bg-[#FF1033] hover:bg-[#511313] transition px-6 py-3 font-semibold text-white rounded-lg"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Try Again
                        </button>
                    )}

                    {showHomeButton && (
                        <Link
                            to="/"
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition px-6 py-3 font-semibold text-white rounded-lg"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ErrorState;
