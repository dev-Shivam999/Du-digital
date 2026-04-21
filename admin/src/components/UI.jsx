// UI Component Library for DU Digital Admin Panel
// Use these components for consistent styling across the admin panel

import { Loader2 } from "lucide-react";

// Loading Spinner Component
export const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="loading">
    <div className="spinner"></div>
    {text}
  </div>
);

// Animated Loading Component
export const AnimatedLoader = ({ size = 24, text = "Loading..." }) => (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{ padding: "2rem" }}>
    <Loader2
      size={size}
      className="animate-spin text-primary"
      style={{ marginRight: "0.5rem" }}
    />
    <span className="text-muted">{text}</span>
  </div>
);

// Page Header Component
export const PageHeader = ({ title, description, actions, stats }) => (
  <div className="d-flex align-items-center justify-content-between mb-4">
    <div>
      <h1 className="mb-2">{title}</h1>
      {description && <p className="text-muted">{description}</p>}
    </div>
    <div className="d-flex align-items-center gap-2">
      {stats &&
        stats.map((stat, index) => (
          <span key={index} className={`badge ${stat.variant || "bg-primary"}`}>
            {stat.label}
          </span>
        ))}
      {actions}
    </div>
  </div>
);

// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="card">
    <div className="card-body text-center">
      {Icon && (
        <Icon size={48} className="text-muted mb-3" style={{ opacity: 0.3 }} />
      )}
      <h3 className="text-muted">{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {action}
    </div>
  </div>
);

// Stat Card Component
export const StatCard = ({
  title,
  count,
  icon: Icon,
  color,
  trend,
  description,
}) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: `${color}15`,
            color: color,
          }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="d-flex align-items-center gap-1 text-success">
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              {trend}
            </span>
          </div>
        )}
      </div>
      <h3 className="mb-1" style={{ fontSize: "2rem", fontWeight: "700" }}>
        {typeof count === "number" ? count.toLocaleString() : count}
      </h3>
      <p
        className="text-muted mb-1"
        style={{ fontSize: "0.875rem", fontWeight: "500" }}>
        {title}
      </p>
      {description && (
        <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
          {description}
        </p>
      )}
    </div>
  </div>
);

// Action Card Component (for quick actions)
export const ActionCard = ({
  to,
  icon: Icon,
  title,
  description,
  color = "#3b82f6",
}) => (
  <a href={to} className="quick-action-card">
    <div className="d-flex align-items-center gap-3">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          backgroundColor: `${color}20`,
          color: color,
        }}>
        <Icon size={20} />
      </div>
      <div>
        <h4
          className="mb-1"
          style={{ fontSize: "0.875rem", fontWeight: "600" }}>
          {title}
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
          {description}
        </p>
      </div>
    </div>
  </a>
);

// Badge Component
export const Badge = ({ children, variant = "primary", size = "md" }) => {
  const variants = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    secondary: "bg-secondary",
  };

  const sizes = {
    sm: { fontSize: "0.75rem", padding: "0.25rem 0.5rem" },
    md: { fontSize: "0.875rem", padding: "0.375rem 0.75rem" },
    lg: { fontSize: "1rem", padding: "0.5rem 1rem" },
  };

  return (
    <span className={`badge ${variants[variant]}`} style={sizes[size]}>
      {children}
    </span>
  );
};

// Button Component
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== "md" ? `btn-${size}` : "";

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

// Form Group Component
export const FormGroup = ({ label, children, error, required = false }) => (
  <div className="form-group">
    {label && (
      <label className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
    )}
    {children}
    {error && (
      <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
        {error}
      </div>
    )}
  </div>
);

// Input Component
export const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  ...props
}) => (
  <input
    type={type}
    className={`form-control ${error ? "is-invalid" : ""}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    {...props}
  />
);

// Textarea Component
export const Textarea = ({
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
  error = false,
  ...props
}) => (
  <textarea
    className={`form-control ${error ? "is-invalid" : ""}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    disabled={disabled}
    {...props}
  />
);
