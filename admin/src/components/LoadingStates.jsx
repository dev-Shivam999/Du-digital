import { Loader2 } from "lucide-react";

// Skeleton loader for cards
export const SkeletonCard = ({ height = "120px" }) => (
  <div className="card">
    <div className="card-body">
      <div
        className="skeleton-loader"
        style={{ height, borderRadius: "0.5rem" }}></div>
    </div>
  </div>
);

// Skeleton loader for form fields
export const SkeletonForm = () => (
  <div className="card">
    <div className="card-header">
      <div
        className="skeleton-loader"
        style={{ width: "200px", height: "24px" }}></div>
    </div>
    <div className="card-body">
      <div className="form-group">
        <div
          className="skeleton-loader"
          style={{
            width: "100px",
            height: "16px",
            marginBottom: "0.5rem",
          }}></div>
        <div
          className="skeleton-loader"
          style={{ width: "100%", height: "40px" }}></div>
      </div>
      <div className="form-group">
        <div
          className="skeleton-loader"
          style={{
            width: "120px",
            height: "16px",
            marginBottom: "0.5rem",
          }}></div>
        <div
          className="skeleton-loader"
          style={{ width: "100%", height: "40px" }}></div>
      </div>
      <div className="form-group">
        <div
          className="skeleton-loader"
          style={{
            width: "80px",
            height: "16px",
            marginBottom: "0.5rem",
          }}></div>
        <div
          className="skeleton-loader"
          style={{ width: "100%", height: "100px" }}></div>
      </div>
    </div>
  </div>
);

// Skeleton loader for table rows
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="card">
    <div className="card-body">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <div
                  className="skeleton-loader"
                  style={{ width: "100px", height: "16px" }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div
                    className="skeleton-loader"
                    style={{ width: "80px", height: "16px" }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Loading overlay for forms
export const FormLoadingOverlay = ({ message = "Saving..." }) => (
  <div className="form-loading-overlay">
    <div className="form-loading-content">
      <Loader2 size={32} className="animate-spin text-primary mb-2" />
      <p className="text-muted mb-0">{message}</p>
    </div>
  </div>
);

// Page loading component
export const PageLoader = ({ message = "Loading..." }) => (
  <div className="page-loader">
    <div className="page-loader-content">
      <div className="loader-animation">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      <h3 className="mt-3 mb-2">Loading</h3>
      <p className="text-muted">{message}</p>
    </div>
  </div>
);

// Data loading states for different content types
export const EventLoadingCard = () => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div
          className="skeleton-loader"
          style={{ width: "48px", height: "48px", borderRadius: "50%" }}></div>
        <div className="flex-1">
          <div
            className="skeleton-loader"
            style={{
              width: "200px",
              height: "20px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{ width: "150px", height: "16px" }}></div>
        </div>
      </div>
      <div
        className="skeleton-loader"
        style={{ width: "100%", height: "60px" }}></div>
    </div>
  </div>
);

export const NewsLoadingCard = () => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex gap-3">
        <div
          className="skeleton-loader"
          style={{
            width: "80px",
            height: "60px",
            borderRadius: "0.5rem",
          }}></div>
        <div className="flex-1">
          <div
            className="skeleton-loader"
            style={{
              width: "250px",
              height: "18px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{
              width: "180px",
              height: "14px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{ width: "100%", height: "40px" }}></div>
        </div>
      </div>
    </div>
  </div>
);

export const LocationLoadingCard = () => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-start gap-3">
        <div
          className="skeleton-loader"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "0.5rem",
          }}></div>
        <div className="flex-1">
          <div
            className="skeleton-loader"
            style={{
              width: "180px",
              height: "20px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{
              width: "120px",
              height: "14px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{ width: "100%", height: "50px" }}></div>
        </div>
      </div>
    </div>
  </div>
);

export const CareerLoadingCard = () => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="flex-1">
          <div
            className="skeleton-loader"
            style={{
              width: "220px",
              height: "20px",
              marginBottom: "0.5rem",
            }}></div>
          <div
            className="skeleton-loader"
            style={{ width: "160px", height: "16px" }}></div>
        </div>
        <div
          className="skeleton-loader"
          style={{ width: "80px", height: "32px", borderRadius: "1rem" }}></div>
      </div>
      <div
        className="skeleton-loader"
        style={{ width: "100%", height: "80px" }}></div>
    </div>
  </div>
);

// Button loading state
export const LoadingButton = ({ children, loading, ...props }) => (
  <button {...props} disabled={loading || props.disabled}>
    {loading && <Loader2 size={16} className="animate-spin mr-2" />}
    {children}
  </button>
);
