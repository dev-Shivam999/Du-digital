import { Loader2 } from "lucide-react";

/**
 * Reusable Loading State Component
 * 
 * @param {string} message - Custom loading message (default: "Loading...")
 * @param {string} bgColor - Background color class (default: "bg-black")
 * @param {string} textColor - Text color class (default: "text-white")
 * @param {string} size - Size of the spinner: "sm", "md", "lg" (default: "md")
 * @param {boolean} fullScreen - Whether to take full screen height (default: false)
 * @param {string} className - Additional custom classes
 */
const LoadingState = ({
    message = "Loading...",
    bgColor = "bg-black",
    textColor = "text-white",
    size = "md",
    fullScreen = false,
    className = ""
}) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16"
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-xl",
        lg: "text-2xl"
    };

    const paddingClasses = fullScreen ? "min-h-screen" : "py-20";

    return (
        <section className={`${bgColor} ${paddingClasses} ${className}`}>
            <div className="max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center gap-4">
                <Loader2
                    className={`${sizeClasses[size]} ${textColor} animate-spin`}
                    strokeWidth={2}
                />
                <p className={`${textColor} ${textSizeClasses[size]} font-medium`}>
                    {message}
                </p>
            </div>
        </section>
    );
};

export default LoadingState;
