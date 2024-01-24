import { useRef } from 'react';

type RateLimitedFunction = (...args: any[]) => any;

export function useRateLimiter(waitTime: number) {
    const called = useRef(false);

    return (fn: RateLimitedFunction) => {
        return function (...args: any[]): any {
            if (!called.current) {
                fn(...args);
                called.current = true;
                setTimeout(() => {
                    called.current = false;
                }, waitTime);
                return true;
            } else {
                throw new Error('rate limit exceeded');
            }
        };
    };
}
