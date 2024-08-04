import React from 'react';

export default function Loading() {
  return (
    <div className="loader-container bg-transparent">
      <video className="loader-video" autoPlay loop muted>
        <source src="/loading.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

