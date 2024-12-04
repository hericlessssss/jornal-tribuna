/**
 * Get the base URL for the site based on environment
 */
export const getBaseUrl = (): string => {
  // Use environment variable if available, otherwise fallback to production URL
  return import.meta.env.VITE_SITE_URL || 'https://jornaltribuna.net';
};

/**
 * Generate a shareable URL for a news article
 * @param newsId - The ID of the news article
 */
export const generateNewsUrl = (newsId: string | number): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/noticias/${newsId}`;
};

/**
 * Get the current page URL, replacing development URLs with production ones
 * @param currentUrl - The current URL from window.location
 * @param newsId - The ID of the news article
 */
export const getShareableUrl = (currentUrl: string, newsId: string | number): string => {
  // If we're in development, generate the production URL
  if (currentUrl.includes('localhost') || currentUrl.includes('webcontainer')) {
    return generateNewsUrl(newsId);
  }
  return currentUrl;
};