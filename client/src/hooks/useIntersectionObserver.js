import { useState, useEffect, useRef } from 'react';

const useIntersectionObserver = ({
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
} = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isElementIntersecting = entry.isIntersecting;

                if (triggerOnce && isElementIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect(); // Stop observing once triggered
                } else {
                    setIsIntersecting(isElementIntersecting);
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, root, rootMargin, triggerOnce]);

    return [ref, isIntersecting];
};

export default useIntersectionObserver;
