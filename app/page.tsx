"use client";

import { Button } from "@/components/ui/button";
import {
  Phone,
  Plus,
  ChevronDown,
  Hash,
  Box,
  Eye,
  Layers,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import Link from "next/link";

type Cube3DProps = {
  size?: number;
  frontColor?: string;
  topColor?: string;
  sideColor?: string;
  borderColor?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
  style?: CSSProperties;
};

const Cube3D = ({
  size = 180,
  frontColor = "#111827",
  topColor = "#1f2937",
  sideColor = "#0f172a",
  borderColor = "rgba(75, 85, 99, 0.6)",
  icon: Icon,
  iconClassName,
  className = "",
  style,
}: Cube3DProps) => {
  const depth = size / 2;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, perspective: "1200px", ...style }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(60deg) rotateZ(45deg)",
        }}
      >
        <div
          className="absolute inset-0 border flex items-center justify-center"
          style={{
            background: frontColor,
            borderColor,
            transform: `translateZ(${depth}px)`,
          }}
        >
          {Icon ? <Icon className={iconClassName} /> : null}
        </div>
        <div
          className="absolute inset-0 border"
          style={{
            background: topColor,
            borderColor,
            transform: `rotateX(90deg) translateZ(${depth}px)`,
          }}
        />
        <div
          className="absolute inset-0 border"
          style={{
            background: sideColor,
            borderColor,
            transform: `rotateY(90deg) translateZ(${depth}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-black"></div>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm tracking-wider">
            <Link href="#about" className="hover:text-gray-400 transition-colors">
              ABOUT US
            </Link>
            <Link href="#advantages" className="hover:text-gray-400 transition-colors">
              ADVANTAGES
            </Link>
            <Link href="#team" className="hover:text-gray-400 transition-colors">
              TEAM
            </Link>
            <Link href="#contacts" className="hover:text-gray-400 transition-colors">
              CONTACTS
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="p-3 hover:bg-gray-900 rounded-lg transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <Button 
            variant="outline" 
            className="bg-white text-black hover:bg-gray-100 border-0 px-8 py-6 text-sm tracking-wider font-medium"
          >
            LET&apos;S TALK
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <div className="container mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Waitlist Badge */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-black"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-black"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 border-2 border-black"></div>
                </div>
                <span className="text-sm tracking-wider text-gray-400">
                  10K CURRENTLY ON THE WAITLIST
                </span>
              </div>

              {/* Hero Text */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  SUBSCRIPTION PACKS<br />
                  WITH DISCOUNTS<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    UP TO 70%
                  </span>
                </h1>
                
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Our pack contains over 100 resources<br />
                  that will help you improve your skills in all areas
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Button 
                  className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-sm tracking-wider font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  JOIN WAITLIST
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-gray-900 px-8 py-6 text-sm tracking-wider font-medium border border-gray-800"
                >
                  READ MORE
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Content - 3D Isometric Cubes */}
            <div className="relative hidden h-[620px] lg:block">
              {/* Background Atmosphere */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937_0%,#030712_70%)] opacity-40" />
              <div className="absolute inset-0 opacity-10">
                <div className="grid h-full w-full grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-800/50" />
                  ))}
                </div>
              </div>

              {/* Isometric Cubes Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[520px] w-[520px]">
                  <Cube3D
                    size={260}
                    frontColor="linear-gradient(135deg,#0f172a,#111827)"
                    topColor="linear-gradient(135deg,#1f2937,#111827)"
                    sideColor="linear-gradient(135deg,#020617,#0f172a)"
                    borderColor="rgba(148,163,184,0.12)"
                    icon={Hash}
                    iconClassName="w-16 h-16 text-white/90 -rotate-45"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_35px_70px_rgba(2,6,23,0.8)]"
                  />

                  <Cube3D
                    size={180}
                    frontColor="linear-gradient(135deg,#111827,#0f172a)"
                    topColor="linear-gradient(135deg,#1f2937,#111827)"
                    sideColor="linear-gradient(135deg,#030712,#0f172a)"
                    borderColor="rgba(148,163,184,0.08)"
                    icon={Box}
                    iconClassName="w-12 h-12 text-white/80 -rotate-45"
                    className="absolute -right-6 top-6 drop-shadow-[0_25px_45px_rgba(2,6,23,0.75)]"
                  />

                  <Cube3D
                    size={160}
                    frontColor="linear-gradient(135deg,#111827,#0b1120)"
                    topColor="linear-gradient(135deg,#1f2937,#111827)"
                    sideColor="linear-gradient(135deg,#030712,#0b1120)"
                    borderColor="rgba(148,163,184,0.1)"
                    icon={Layers}
                    iconClassName="w-10 h-10 text-white/75 -rotate-45"
                    className="absolute -left-8 top-24 drop-shadow-[0_20px_40px_rgba(2,6,23,0.7)]"
                  />

                  <Cube3D
                    size={150}
                    frontColor="linear-gradient(135deg,#101827,#050b16)"
                    topColor="linear-gradient(135deg,#1f2937,#111827)"
                    sideColor="linear-gradient(135deg,#020617,#050b16)"
                    borderColor="rgba(148,163,184,0.08)"
                    icon={Eye}
                    iconClassName="w-10 h-10 text-white/70 -rotate-45"
                    className="absolute left-12 bottom-20 drop-shadow-[0_20px_35px_rgba(2,6,23,0.65)]"
                  />

                  <Cube3D
                    size={140}
                    frontColor="linear-gradient(135deg,#0d1320,#020617)"
                    topColor="linear-gradient(135deg,#1b2539,#0d1627)"
                    sideColor="linear-gradient(135deg,#01030a,#0b1120)"
                    borderColor="rgba(148,163,184,0.06)"
                    className="absolute right-16 bottom-24 drop-shadow-[0_18px_32px_rgba(2,6,23,0.6)]"
                  />

                  <Cube3D
                    size={110}
                    frontColor="linear-gradient(135deg,#0b1120,#020617)"
                    topColor="linear-gradient(135deg,#161f32,#0b1120)"
                    sideColor="linear-gradient(135deg,#01030a,#081021)"
                    borderColor="rgba(148,163,184,0.05)"
                    className="absolute left-1/3 top-8 drop-shadow-[0_15px_28px_rgba(2,6,23,0.55)]"
                  />

                  <Cube3D
                    size={100}
                    frontColor="linear-gradient(135deg,#0a101d,#020617)"
                    topColor="linear-gradient(135deg,#161f32,#0a101d)"
                    sideColor="linear-gradient(135deg,#01030a,#07101f)"
                    borderColor="rgba(148,163,184,0.05)"
                    className="absolute right-1/3 -bottom-4 drop-shadow-[0_12px_24px_rgba(2,6,23,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
