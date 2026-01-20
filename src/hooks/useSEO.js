/**
 * Custom hook for managing SEO meta tags dynamically
 * Works with React 19 (alternative to react-helmet-async)
 */
import { useEffect } from 'react';

export const useSEO = ({ title, description, keywords, ogImage, canonical }) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('description', description);
    updateMetaTag('og:description', description, true);
    updateMetaTag('twitter:description', description, true);

    // Update keywords
    updateMetaTag('keywords', keywords);

    // Update Open Graph image
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('twitter:image', ogImage, true);

    // Update canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, keywords, ogImage, canonical]);
};
