export const trackEvent = (
    event: string,
    params?: Record<string, any>
) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, params)
    }
}
