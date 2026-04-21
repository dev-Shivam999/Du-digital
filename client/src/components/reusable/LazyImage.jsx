
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({
    src,
    alt,
    className = "",
    fill = false,
    ...props
}) => {
    return (
        <LazyLoadImage
            src={src}
            alt={alt}
            effect="blur"
            loading="lazy"
            decoding="async"
            threshold={300}

            wrapperClassName={
                fill
                    ? "absolute inset-0 w-full h-full"
                    : "inline-block"
            }

            className={
                fill
                    ? `w-full h-full object-cover ${className}`
                    : className
            }

            {...props}
        />
    );
};

export default LazyImage;



// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';

// const LazyImage = ({ src, alt, className, style, ...props }) => {
//     return (
//         <LazyLoadImage
//             alt={alt}
//             src={src}
//             className={className}
//             style={style}
//             effect="blur"
//             visibleByDefault={false}
//             fetchPriority="low"
//             loading="lazy"
//             decoding="async"
//             threshold={500}
//             {...props}
//         />
//     );
// };

// export default LazyImage;
