import React, { useRef, useEffect } from 'react';

const BlogCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20; // Globe radius

    let angle = 0;

    const drawGlobe = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw dots on the globe
      const numDots = 200;
      const dotRadius = 3;
      
      ctx.fillStyle = 'white';
      for (let i = 0; i < numDots; i++) {
        const theta = (i / numDots) * 2 * Math.PI;
        const phi = (i / numDots) * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const screenX = centerX + x;
        const screenY = centerY + y;
        
        ctx.beginPath();
        ctx.arc(screenX, screenY, dotRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.translate(-centerX, -centerY);

      drawGlobe();

      ctx.restore();
      
      angle += 0.01; // Adjust rotation speed as needed
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const canvasStyles = {
    backgroundColor: 'black',
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <div
        className="w-full max-w-2xl"
        style={canvasStyles}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width="1000"
          height="1000"
        >
          Your browser does not support the canvas element.
        </canvas>
      </div>
    </div>
  );
};

export default BlogCanvas;
