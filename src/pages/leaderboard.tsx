"use client"

import { BloodDonationLeaderboard } from "@/components/BloodDonationLeaderboard"
import React, { useEffect, useState } from "react"

type Confetti = {
  id: string;
  x: number;
  y: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "heart";
  size: number;
  tilt: number;
  speed: number;
  delay: number;
};

export default function Leaderboard() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const CONFETTI_COLORS = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#f15bb5", "#e53170"];

  const launchConfettiCelebration = (): void => {
    // Generate a large number of confetti particles (150-200)
    const confettiCount = Math.floor(Math.random() * 50) + 150;
    const newConfetti: Confetti[] = [];
    
    // Shapes array for variety
    const shapes: ("circle" | "square" | "triangle" | "heart")[] = ["circle", "square", "triangle", "heart"];
    
    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: `confetti-${Math.random()}-${i}`,
        x: Math.random() * 100, // Position across the full width
        y: Math.random() * 20 - 10, // Start slightly above the top
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 0.4 + 1, // Size between 0.4 and 0.8rem
        tilt: Math.random() * 40 - 20, // Tilt between -20 and 20 degrees
        speed: Math.random() * 2 + 3, // Fall speed
        delay: Math.random() * 0.5 // Slight delay for more natural effect
      });
    }
    
    setConfetti(newConfetti);
    
    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([])
      launchConfettiCelebration();
    }, 6000);
  };

  useEffect(() => {
    launchConfettiCelebration();
  }, [])

  return (
    <main className="min-h-screen bg-amber-500 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-50">
        {confetti.map((particle) => {
          let shapeElement;
          
          // Create different shapes based on the shape property
          switch(particle.shape) {
            case "square":
              shapeElement = <div className="w-full h-full bg-current rounded-sm" />;
              break;
            case "triangle":
              shapeElement = (
                <div className="w-0 h-0 border-l-[0.5rem] border-r-[0.5rem] border-b-[0.8rem] border-l-transparent border-r-transparent border-b-current" />
              );
              break;
            case "heart":
              shapeElement = (
                <div className="text-current" style={{ fontSize: `${particle.size * 1.5}rem` }}>❤️</div>
              );
              break;
            case "circle":
            default:
              shapeElement = <div className="w-full h-full bg-current rounded-full" />;
          }
          
          return (
            <div
              key={particle.id}
              className="absolute confetti"
              style={{
                left: `${particle.x}%`,
                top: `-20px`,
                width: `${particle.size}rem`,
                height: `${particle.size}rem`,
                color: particle.color,
                animationDuration: `${particle.speed}s`,
                animationDelay: `${particle.delay}s`,
                transform: `rotate(${particle.tilt}deg)`,
              }}
            >
              {shapeElement}
            </div>
          );
        })}
      </div>
      {/* Global keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center filter opacity-50"></div>

      {/* Main content */}
      <div className="w-full max-w-4xl z-10">
        <BloodDonationLeaderboard />
      </div>
    </main>
  )
}
