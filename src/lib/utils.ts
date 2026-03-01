/**
 * Utility to get the full-sized image URL from Wafilife and other sources.
 * It removes thumbnail dimensions like '-192x254' or '_192x254' from the URL.
 */
export const getFullSizeImage = (url?: string | null) => {
    if (!url) return '/placeholder-book.png'

    return url
        .replace(/-192x254/g, '')
        .replace(/_192x254/g, '')
        .replace(/-\d+x\d+(?=\.(jpg|png|webp|jpeg))/g, '')
}
