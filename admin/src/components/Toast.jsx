import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

// Toast notification component
export const Toast = ({ message, type = "info", duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: {
      bg: "#dcfce7",
      border: "#16a34a",
      text: "#15803d",
      icon: "#16a34a",
    },
    error: {
      bg: "#fef2f2",
      border: "#dc2626",
      text: "#dc2626",
      icon: "#dc2626",
    },
    warning: {
      bg: "#fef3c7",
      border: "#d97706",
      text: "#92400e",
      icon: "#d97706",
    },
    info: {
      bg: "#dbeafe",
      border: "#2563eb",
      text: "#1d4ed8",
      icon: "#2563eb",
    },
  };

  const colorScheme = colors[type];

  return (
    <div
      className={`toast ${isVisible ? "toast-visible" : "toast-hidden"}`}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        backgroundColor: colorScheme.bg,
        border: `1px solid ${colorScheme.border}`,
        borderRadius: "0.5rem",
        padding: "1rem",
        minWidth: "300px",
        maxWidth: "500px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
      <div style={{ color: colorScheme.icon, flexShrink: 0 }}>
        {icons[type]}
      </div>
      <div
        style={{
          flex: 1,
          color: colorScheme.text,
          fontSize: "0.875rem",
          fontWeight: "500",
        }}>
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: "none",
          border: "none",
          color: colorScheme.text,
          cursor: "pointer",
          padding: "0.25rem",
          borderRadius: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <X size={16} />
      </button>
    </div>
  );
};

// Toast container component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 9999 }}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration) =>
    addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) =>
    addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
