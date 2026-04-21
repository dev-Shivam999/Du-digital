# Reusable State Components

This folder contains reusable UI components for common application states.

## Components

### 1. LoadingState

A customizable loading spinner component with animated icon and message.

#### Props

| Prop         | Type    | Default        | Description                             |
| ------------ | ------- | -------------- | --------------------------------------- |
| `message`    | string  | `"Loading..."` | Custom loading message                  |
| `bgColor`    | string  | `"bg-black"`   | Background color class                  |
| `textColor`  | string  | `"text-white"` | Text color class                        |
| `size`       | string  | `"md"`         | Size of spinner: `"sm"`, `"md"`, `"lg"` |
| `fullScreen` | boolean | `false`        | Whether to take full screen height      |
| `className`  | string  | `""`           | Additional custom classes               |

#### Usage Examples

```jsx
import { LoadingState } from '../components/reusable';

// Basic usage
<LoadingState />

// Custom message
<LoadingState message="Loading sales experts..." />

// Small size with custom colors
<LoadingState
    message="Please wait..."
    size="sm"
    bgColor="bg-gray-100"
    textColor="text-gray-800"
/>

// Full screen loading
<LoadingState
    message="Initializing application..."
    fullScreen={true}
    size="lg"
/>
```

---

### 2. ErrorState

A comprehensive error display component with retry and navigation options.

#### Props

| Prop             | Type     | Default                          | Description                        |
| ---------------- | -------- | -------------------------------- | ---------------------------------- |
| `error`          | string   | `"An unexpected error occurred"` | Error message to display           |
| `title`          | string   | `"Oops! Something went wrong"`   | Error title                        |
| `bgColor`        | string   | `"bg-black"`                     | Background color class             |
| `textColor`      | string   | `"text-white"`                   | Text color class                   |
| `errorColor`     | string   | `"text-red-500"`                 | Error accent color class           |
| `onRetry`        | function | `undefined`                      | Optional retry callback function   |
| `showHomeButton` | boolean  | `false`                          | Show button to navigate home       |
| `fullScreen`     | boolean  | `false`                          | Whether to take full screen height |
| `className`      | string   | `""`                             | Additional custom classes          |

#### Usage Examples

```jsx
import { ErrorState } from "../components/reusable";
import { useDispatch } from "react-redux";
import { fetchData } from "../redux/slices/dataSlice";

const MyComponent = () => {
  const dispatch = useDispatch();

  // Basic usage
  return <ErrorState error="Failed to load data" />;

  // With retry functionality
  return (
    <ErrorState
      error="Failed to load sales experts"
      title="Connection Error"
      onRetry={() => dispatch(fetchData())}
    />
  );

  // With home button
  return (
    <ErrorState
      error="Page not found"
      title="404 - Not Found"
      showHomeButton={true}
    />
  );

  // Full screen error with custom colors
  return (
    <ErrorState
      error="Server is temporarily unavailable"
      title="Service Unavailable"
      fullScreen={true}
      bgColor="bg-gray-900"
      errorColor="text-orange-500"
      onRetry={() => dispatch(fetchData())}
      showHomeButton={true}
    />
  );
};
```

---

### 3. ImageGalleryModal

A feature-rich image gallery modal with zoom, fullscreen, and sharing capabilities.

#### Props

| Prop         | Type     | Default  | Description                                   |
| ------------ | -------- | -------- | --------------------------------------------- |
| `images`     | Array    | `[]`     | Array of image objects or strings             |
| `startIndex` | number   | `0`      | Initial slide index                           |
| `onClose`    | function | required | Callback when modal closes                    |
| `baseUrl`    | string   | `''`     | Optional base URL to prepend to image sources |

#### Usage Example

```jsx
import { ImageGalleryModal } from "../components/reusable";

const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: "/img1.jpg", name: "Image 1", alt: "Description 1" },
    { src: "/img2.jpg", name: "Image 2", alt: "Description 2" },
  ];

  return (
    <>
      {showModal && (
        <ImageGalleryModal
          images={images}
          startIndex={currentIndex}
          onClose={() => setShowModal(false)}
          baseUrl="https://example.com"
        />
      )}
    </>
  );
};
```

---

## Complete Redux Integration Example

Here's a complete example of using LoadingState and ErrorState with Redux:

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingState, ErrorState } from "../components/reusable";
import { fetchItems } from "../redux/slices/itemsSlice";

const ItemsList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return <LoadingState message="Loading items..." />;
  }

  // Show error state with retry
  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load items"
        onRetry={() => dispatch(fetchItems())}
      />
    );
  }

  // Render actual content
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default ItemsList;
```

---

## Import Methods

### Named Imports (Recommended)

```jsx
import {
  LoadingState,
  ErrorState,
  ImageGalleryModal,
} from "../components/reusable";
```

### Individual Imports

```jsx
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import ImageGalleryModal from "../components/reusable/ImageGalleryModal";
```

---

## Styling Customization

All components use Tailwind CSS classes and can be customized via props:

```jsx
// Dark theme
<LoadingState
    bgColor="bg-gray-900"
    textColor="text-gray-100"
/>

// Light theme
<LoadingState
    bgColor="bg-white"
    textColor="text-gray-900"
/>

// Custom brand colors
<ErrorState
    bgColor="bg-blue-50"
    textColor="text-blue-900"
    errorColor="text-blue-600"
/>
```

---

## Best Practices

1. **Consistent Loading States**: Use the same size and style across similar components
2. **Meaningful Messages**: Provide context-specific loading/error messages
3. **Retry Functionality**: Always provide retry option for network errors
4. **Accessibility**: Components include proper ARIA labels and semantic HTML
5. **Responsive Design**: All components are mobile-friendly by default

---

## Dependencies

- `lucide-react` - For icons (Loader2, AlertCircle, RefreshCw, Home, etc.)
- `react-router-dom` - For Link component in ErrorState
- `swiper` - For ImageGalleryModal carousel functionality
