declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import Script from 'next/script';
import React, { useEffect } from 'react';

interface AdSenseProps {
  publisherId: string;
}

const AdSense: React.FC<AdSenseProps> = ({ publisherId }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  }, []);

  if (!publisherId) {
    console.error('AdSense: publisherId is required');
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={(error) => {
          console.error('Failed to load AdSense script:', error);
        }}
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${publisherId}`}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
};

export default AdSense;