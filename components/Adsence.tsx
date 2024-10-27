'use client';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

interface AdSenseProps {
  publisherId: string;
}

const AdSense: React.FC<AdSenseProps> = ({ publisherId }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  }, [isClient]);

  if (!publisherId) {
    console.error('AdSense: publisherId is required');
    return null;
  }

  return (
    <>
      {isClient && (
        <>
          <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${publisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onError={(error) => {
              console.error('Failed to load AdSense script:', error);
            }}
          />
          {/* For Auto Ads, you don't need to define the <ins> element */}
        </>
      )}
    </>
  );
};

export default AdSense;
