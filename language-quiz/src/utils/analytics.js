// Google Analytics integration
export const initAnalytics = () => {
  if (process.env.REACT_APP_GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', process.env.REACT_APP_GA_TRACKING_ID);
    
    console.log('Analytics initialized');
  }
};

// Track events
export const trackEvent = (category, action, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${category}: ${action}`, { label, value });
  }
};

// Track page views
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: path
    });
  }
};

// Custom event types for our app
export const AnalyticsEvents = {
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_RESTARTED: 'quiz_restarted',
  FLASHCARD_REVIEWED: 'flashcard_reviewed',
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  LANGUAGE_SELECTED: 'language_selected',
  CHALLENGE_SENT: 'challenge_sent'
};
