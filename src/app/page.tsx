"use client";
import React, { useState, useEffect, type JSX } from "react";
import { Heart, Droplet, Award, Users, Calendar, Clock } from "lucide-react";
import { FlaskStatic } from "@/components/FlaskStatic";

// Define types for our component
type BloodDrop = {
  id: string;
  left: number;
  delay: number;
};

// Type for confetti particle
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

// New type for donor information
type Donor = {
  name: string;
  // timestamp: string;
};

export default function Home(): JSX.Element {
  const [totalDonations, setTotalDonations] = useState<number>(230);
  const [previousDonations, setPreviousDonations] = useState<number>(230);
  const [donorCount, setDonorCount] = useState<number>(48);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [drops, setDrops] = useState<BloodDrop[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showCelebrationText, setShowCelebrationText] = useState<boolean>(false);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [latestDonor, setLatestDonor] = useState<Donor | null>();

  const MAX_DONATIONS: number = 1000;
  const fillPercentage: number = (totalDonations / MAX_DONATIONS) * 100;
  const CONFETTI_COLORS = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#f15bb5", "#e53170"];

  useEffect(() => {
    async function loadStats() {
      const stats = await fetch("/api/donationStats").then((res) => res.json());
      
      // Check if total donations has increased
      if (stats.units > totalDonations) {
        // Save previous donation value before updating
        setPreviousDonations(totalDonations);
        
        // Update the donation count
        setTotalDonations(stats.units);
        
        // Trigger animations
        handleNewDonation();
        launchConfettiCelebration();
        
        // Show the celebration text
        setShowCelebrationText(true);
        setTimeout(() => setShowCelebrationText(false), 4000);
      } else {
        setTotalDonations(stats.units);
      }
      
      setDonorCount(stats.donors);
      
      // Set recent donors and latest donor from API response
      if (stats.recentDonors && stats.recentDonors.length > 0) {
        setRecentDonors(stats.recentDonors.reverse());
        setLatestDonor(stats.recentDonors[0]);
      }
    }
    loadStats();

    // Set up polling every 5 seconds (5000ms)
    const intervalId = setInterval(loadStats, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [totalDonations]);

  const handleNewDonation = (): void => {
    if (totalDonations < MAX_DONATIONS) {
      setIsAnimating(true);

      // Create multiple drops
      const dropCount: number = Math.floor(Math.random() * 3) + 3; // 3–5 drops
      for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
          setDrops((prev) => [
            ...prev,
            {
              id: `${Math.random()}-${i}`,
              left: Math.random() * 10 + 40,
              delay: Math.random() * 0.5,
            },
          ]);
        }, 500);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, dropCount * 200 + 1000);

      // Clean up drops
      setTimeout(() => {
        setDrops([]);
      }, dropCount * 200 + 2000);
    }
  };

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
        size: Math.random() * 0.4 + 0.4, // Size between 0.4 and 0.8rem
        tilt: Math.random() * 40 - 20, // Tilt between -20 and 20 degrees
        speed: Math.random() * 2 + 3, // Fall speed
        delay: Math.random() * 0.5 // Slight delay for more natural effect
      });
    }
    
    setConfetti(newConfetti);
    
    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([]);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 p-4 md:p-8 relative overflow-hidden">
      {/* Confetti container - positioned absolute to cover the whole page */}
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
      
      {/* Celebration text overlay - shows when donation increases */}
      {showCelebrationText && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="celebration-text bg-white bg-opacity-80 px-8 py-4 rounded-2xl shadow-lg transform">
            <p className="text-3xl md:text-5xl font-bold text-red-600 text-center">
              +{totalDonations - previousDonations} Donations!
            </p>
            <p className="text-xl md:text-2xl text-red-800 text-center mt-2">
              Thank you for saving lives! 🩸
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header with logo */}
        <header className="text-center mb-6">
          <div className="inline-block p-4 bg-red-600 rounded-full mb-6 shadow-lg">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
            DJS-NSS Blood Donation Drive
          </h1>
          <div className="h-1 w-32 bg-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join our life-saving mission to collect blood. Every
            drop counts. Every donor matters.
          </p>
        </header>

        {/* Latest donor notification */}
        {latestDonor && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-600 font-bold">
              {latestDonor.name} just saved 3 lives!
            </p>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Left column - Stats */}
          <div className="lg:w-1/4 content-center space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Impact Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-2 text-red-600" />
                    Donors
                  </span>
                  <span className="font-bold text-xl text-gray-800">
                    {donorCount}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="flex items-center text-gray-700">
                    <Droplet className="h-5 w-5 mr-2 text-red-600" />
                    Units
                  </span>
                  <span className="font-bold text-xl text-gray-800">
                    {totalDonations}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-gray-700">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Lives Saved
                  </span>
                  <span className="font-bold text-xl text-gray-800">
                    ~{Math.floor(totalDonations * 3)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Become a Hero</h2>
              <p className="opacity-90">
                Every 2 seconds, someone in our community needs blood. Your
                donation makes a life-saving difference.
              </p>
            </div>
          </div>

          {/* Center column - Flask */}
          <div className="lg:w-1/2">            
            <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6 flex flex-col h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-red-800">
                  Blood Collection Progress
                </h2>
                <p className="text-gray-600">
                  {totalDonations} units collected
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-red-600 h-2.5 rounded-full max-w-full transition-all duration-1000 ease-out"
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-center relative">
                {/* Flask with SVG clipping */}
                <div className="flex justify-center w-full max-w-md mx-auto">
                  <div className="relative">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="250" 
                      height="350" 
                      viewBox="3 2 18 20" 
                      className="text-gray-400"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        zIndex: 0,
                      }}
                    >
                      <defs>
                        <clipPath id="flaskClip">
                          <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
                        </clipPath>
                        <linearGradient id="bloodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f00" />
                          <stop offset="50%" stopColor="#d90000" />
                          <stop offset="100%" stopColor="#a80000" />
                        </linearGradient>
                        {/* Enhanced filter for smoother, more fluid motion */}
                        <filter id="flowFilter">
                          {/* Generate a noise pattern that animates */}
                          <feTurbulence 
                            type="fractalNoise" 
                            baseFrequency="0.02" 
                            numOctaves="2" 
                            result="noise"
                          >
                            <animate 
                              attributeName="baseFrequency" 
                              dur="6s" 
                              values="0.02;0.04;0.02" 
                              repeatCount="indefinite" 
                            />
                          </feTurbulence>
                          {/* Blur the noise for a softer effect */}
                          <feGaussianBlur in="noise" stdDeviation="1" result="blurredNoise" />
                          {/* Displace the blood fill using the blurred noise */}
                          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                      </defs>

                      <g clipPath="url(#flaskClip)">
                        <rect
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                          fill="url(#bloodGradient)"
                          style={{
                            transform: `translateY(${(1 - Math.min(fillPercentage / 100, 1)) * 24}px)`,
                            transition: 'transform 1s ease-in-out',
                          }}
                          filter="url(#flowFilter)"  // Apply our enhanced filter
                        />
                      </g>
                    </svg>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <FlaskStatic />
                    </div>
                  </div>

                  {/* Animated blood drops (falling from top) */}
                  {drops.map((drop) => (
                    <div
                      key={drop.id}
                      className="absolute"
                      style={{
                        left: `${drop.left}%`,
                        top: "0px",
                        animation: `fall 1.5s ease-in forwards`,
                        animationDelay: `${drop.delay}s`,
                        willChange: "transform",
                      }}
                      onAnimationEnd={() =>
                        setDrops((prev) => prev.filter((d) => d.id !== drop.id))
                      }
                    >
                      <div className="w-6 h-8 bg-red-600 rounded-t-full rounded-b-full transform origin-top">
                        <div className="absolute left-1 top-1 w-2 h-2 bg-red-300 rounded-full opacity-70"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    // Set previous donations to current before updating
                    setPreviousDonations(totalDonations);
                    // Simulate a new donation (add 5 units)
                    setTotalDonations(prev => prev + 5);
                    handleNewDonation();
                    launchConfettiCelebration();
                    setShowCelebrationText(true);
                    setTimeout(() => setShowCelebrationText(false), 4000);
                  }}
                  className={`
                    px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-all 
                    transform hover:scale-105 active:scale-95 
                    ${
                      totalDonations >= MAX_DONATIONS
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }
                  `}
                  disabled={totalDonations >= MAX_DONATIONS}
                >
                  {totalDonations >= MAX_DONATIONS
                    ? "Goal Reached! 🎉"
                    : "Simulate Donation"}
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Info */}
          <div className="lg:w-1/4 content-center space-y-6">
            {/* New section for recent donors */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Recent Donors
              </h2>
              <ul className="space-y-3 text-gray-700">
                {recentDonors.length > 0 ? (
                  recentDonors.map((donor, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{donor.name}</p>
                        {/* <p className="text-xs text-gray-500">{new Date(donor.timestamp).toLocaleString()}</p> */}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No recent donors</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-200 to-transparent mb-6"></div>
          <div className="text-gray-600">
            <p className="font-medium">DJS-NSS Blood Donation Initiative</p>
            <p className="text-sm mt-1">
              For inquiries: djs-nss@example.com • {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) scale(1); }
          70% { transform: translateY(5rem) scale(1); }
          100% { transform: translateY(10rem) scale(0); opacity: 0; }
        }

        @keyframes bubbleAnimation {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }

        .animate-bubble {
          animation: bubbleAnimation 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes celebrationTextAnimation {
          0% { 
            transform: scale(0.8); 
            opacity: 0;
          }
          10% {
            transform: scale(1.1);
            opacity: 1;
          }
          20% {
            transform: scale(1);
          }
          80% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0;
          }
        }
        
        .celebration-text {
          animation: celebrationTextAnimation 4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
