import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Generate sparkle positions along the circular path
  const totalSparkles = 12; // Adjust for more/less sparkles
  const radius = 50; // Radius of the progress circle
  const sparkles = Array.from({ length: totalSparkles }).map((_, i) => {
    const angle = (i / totalSparkles) * 2 * Math.PI; // Distribute evenly
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: Math.random() * 1.5, // Random delay for staggered effect
    };
  });

  return (
    <div className="flex flex-col items-center justify-center h-96 text-white relative">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Rotating Circle */}
        <motion.div
          className="absolute w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-32 h-32" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="40" stroke="gray" strokeWidth="8" fill="none" />
            {/* Progress Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="limegreen"
              strokeWidth="8"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (progress / 100) * 251.2}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (progress / 100) * 251.2 }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Non-Rotating Progress Text */}
        <div className="absolute text-2xl font-bold">{progress}%</div>

        {/* Sparkle Border Effect */}
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-green-400 rounded-full shadow-lg"
            style={{
              top: `${sparkle.y + 64}px`,
              left: `${sparkle.x + 64}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.5,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
