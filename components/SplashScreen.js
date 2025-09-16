// app/components/SplashScreen.jsx - EVEN FASTER TRANSITION ⚡

"use client";

import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export default function SplashScreen({ onAnimationComplete }) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (typeof onAnimationComplete !== 'function') {
        console.error("SplashScreen ERROR: onAnimationComplete prop is not a function!");
        return;
    }
    
    const sequence = async () => {
      await controls.start({ scale: 1, opacity: 1, transition: { duration: 1, ease: 'easeOut' } });
      
      await new Promise(resolve => setTimeout(resolve, 800));

      // ==========================================================
      // ## THIS IS THE TIMING YOU ASKED TO REDUCE ##
      // I've changed the duration from 0.5 to 0.3
      await controls.start({
        WebkitTextFillColor: '#ffffff',
        background: 'none',
        transition: { duration: 0.1, ease: 'easeOut' } // <-- REDUCED TIMING
      });
      // ==========================================================

      await new Promise(resolve => setTimeout(resolve, 200));
      
      await controls.start({
        rotate: 180,
        scale: 40,
        opacity: 0,
        transition: { duration: 1, ease: 'easeIn' }
      });

      onAnimationComplete();
    };

    sequence();
  }, [controls, onAnimationComplete]);

  return (
    <div className="splash-screen">
      <motion.h1
        className="splash-title"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={controls}
      >
        IDA NAGPUR
      </motion.h1>
    </div>
  );
}