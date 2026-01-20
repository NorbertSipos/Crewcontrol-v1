import { useEffect } from 'react';

/**
 * Component to inject structured data (JSON-LD) for SEO rich snippets
 * Supports Organization, SoftwareApplication, BreadcrumbList, and more
 */
export const StructuredData = ({ data }) => {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';

    // Remove existing structured data
    const existing = document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
};

/**
 * Helper functions to generate common structured data types
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CrewControl',
  url: 'https://crewcontrol.io',
  logo: 'https://crewcontrol.io/vite.svg',
  description: 'Workforce management and employee scheduling software for teams of all sizes. Drag-and-drop scheduling, time tracking, and team communication.',
  sameAs: [
    // Add social media links when available
    // 'https://twitter.com/crewcontrol',
    // 'https://linkedin.com/company/crewcontrol',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@crewcontrol.io',
    url: 'https://crewcontrol.io/contact',
  },
  address: {
    '@type': 'PostalAddress',
    // Add when available
    // addressCountry: 'US',
  },
});

export const generateSoftwareApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CrewControl',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '19.99',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '125',
  },
  description: 'Streamline your workforce with CrewControl. Drag-and-drop scheduling, time tracking, shift management, and team communication.',
  featureList: [
    'Drag-and-drop scheduling',
    'Mobile time tracking',
    'Shift swap requests',
    'AI conflict detection',
    'Real-time dashboard',
    'Time-off requests',
    'Multiple locations',
  ],
});

export const generateBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateWebPageSchema = ({ name, description, url, breadcrumbs }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url,
  breadcrumb: breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : undefined,
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'CrewControl',
    url: 'https://crewcontrol.io',
  },
});

export const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
