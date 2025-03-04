"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Department data with scores and emojis
const departmentData = [
  { id: "it", name: "IT 💻", score: 95, food: "/biryani.png" },
  { id: "comps", name: "COMPS 🖥️", score: 88, food: "/chhole.png" },
  { id: "extc", name: "EXTC 📡", score: 92, food: "/rice.png" },
  { id: "allied", name: "ALLIED 🔬", score: 75, food: "/vadapav.png" },
  { id: "mech", name: "MECH ⚙️", score: 80, food: "/pavbhaji.png" },
  { id: "cseds", name: "CSEDS 🔋", score: 90, food: "/thali.png" },
]

export function BloodDonationLeaderboard() {
  const [animatedScores, setAnimatedScores] = useState<number[]>(departmentData.map(() => 0))

  // Animate the scores on load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScores((prev) => {
        const newScores = [...prev]
        let completed = true

        for (let i = 0; i < departmentData.length; i++) {
          if (newScores[i] < departmentData[i].score) {
            newScores[i] += 1
            completed = false
          }
        }

        if (completed) {
          clearInterval(interval)
        }

        return newScores
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full rounded-3xl bg-gradient-to-r from-amber-300 to-amber-200 p-6 shadow-xl border-4 border-amber-600">
      {/* Title */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <Image src="/peacock.svg" alt="Decorative peacock" width={90} height={90} className="object-contain" />
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            BLOOD DONATION 🩸
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 tracking-wide mt-1 italic">
            LEADERBOARD
          </h2>
        </div>
        <Image
          src="/peacock.svg"
          alt="Decorative peacock"
          width={90}
          height={90}
          className="object-contain transform scale-x-[-1]"
        />
      </div>

      {/* Leaderboard bars */}
      <div className="space-y-8">
        {departmentData.map((dept, index) => (
          <div key={dept.id} className="flex items-center gap-4">
            {/* Department name */}
            <div className="w-24 text-right">
              <span className="font-bold text-xl text-red-700 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                {dept.name}
              </span>
            </div>

            {/* Progress bar container with visible overflow */}
            <div className="relative flex-1 h-12 rounded-full shadow-inner overflow-visible">
              {/* Animated progress bar clipped within a rounded sub-container */}
              <div className="overflow-hidden h-full rounded-full">
                <div
                  className="h-full bg-pattern-bar transition-all duration-300 ease-out"
                  style={{ width: `${animatedScores[index]}%` }}
                />
              </div>
              
              {/* Food image positioned absolutely so it overlaps the bar */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 z-10 w-20 h-20 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: `calc(${animatedScores[index]}% - 40px)` }}
              >
                <Image
                  src={dept.food || "/placeholder.svg"}
                  alt={`${dept.name} food`}
                  fill
                  className="object-cover rounded-full hover:scale-110 transition-transform"
                  style={{ filter: "drop-shadow(3px 3px 5px rgba(0,0,0,0.4))" }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="w-16 text-center">
              <span className="font-bold text-2xl text-red-700 bg-amber-100 px-3 py-1 rounded-full">
                {animatedScores[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
