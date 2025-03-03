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

export default function Home(): JSX.Element {
  const [totalDonations, setTotalDonations] = useState<number>(230);
  const [donorCount, setDonorCount] = useState<number>(48);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [drops, setDrops] = useState<BloodDrop[]>([]);

  const MAX_DONATIONS: number = 1000;
  const fillPercentage: number = (totalDonations / MAX_DONATIONS) * 100;

  useEffect(() => {
    async function loadStats() {
      handleNewDonation();
      const stats = await fetch("/api/donationStats").then((res) => res.json());
      setDonorCount(stats.donors);
      setTotalDonations(stats.units);
    }
    loadStats();

    // Set up polling every 5 seconds (5000ms)
    const intervalId = setInterval(loadStats, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with logo */}
        <header className="text-center mb-12">
          <div className="inline-block p-4 bg-red-600 rounded-full mb-6 shadow-lg">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-4">
            DJS-NSS Blood Donation Drive
          </h1>
          <div className="h-1 w-32 bg-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join our life-saving mission to collect 1,000 units of blood. Every
            drop counts. Every donor matters.
          </p>
        </header>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Left column - Stats */}
          <div className="lg:w-1/4 space-y-6">
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

            <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Next Drive
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-red-600" />
                  <span>March 10, 2025</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-2 text-red-600" />
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
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
                  {totalDonations} of {MAX_DONATIONS} units collected (
                  {Math.round(fillPercentage)}%)
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
                {/* NEW: Bigger Flask with exact shape clipping */}
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
                  onClick={handleNewDonation}
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
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-4">
                Why Donate?
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">1</span>
                  </div>
                  <span className="ml-2 text-gray-700">
                    One donation can save up to 3 lives
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">2</span>
                  </div>
                  <span className="ml-2 text-gray-700">
                    Blood is needed every 2 seconds
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">3</span>
                  </div>
                  <span className="ml-2 text-gray-700">
                    Only 3% of eligible people donate
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">4</span>
                  </div>
                  <span className="ml-2 text-gray-700">
                    Your body replaces blood volume within 24 hours
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs font-bold">5</span>
                  </div>
                  <span className="ml-2 text-gray-700">
                    Most donations take less than an hour
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Become a Hero</h2>
              <p className="mb-4 opacity-90">
                Every 2 seconds, someone in our community needs blood. Your
                donation makes a life-saving difference.
              </p>
              <button className="w-full bg-white hover:bg-gray-100 text-red-600 py-2 px-4 rounded-lg font-medium transition-colors">
                Learn More
              </button>
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
      `}</style>
    </div>
  );
}
