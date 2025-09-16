"use client";
import React, { useRef, useEffect } from 'react';

const BackgroundVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // This function tries to play the video once the component is ready
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          // This catch block will log any autoplay errors to your console
          console.error("Video play failed:", error);
        });
      }
    };
    
    playVideo();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        // These 3 attributes are essential for autoplay
        muted
        loop
        playsInline
      >
        <source src="/video/bg-vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default BackgroundVideo;