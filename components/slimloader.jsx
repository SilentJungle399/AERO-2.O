import { Html } from '@react-three/drei';
import React, { useState, useEffect } from 'react';

const LoadingBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <Html center>
            <div className="fixed top-0 left-0 w-full h-1 bg-black">
                <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        marginLeft: `${(100 - progress) / 2}%`,
                    }}
                ></div>
            </div>
        </Html>
    );
};

export default LoadingBar;
