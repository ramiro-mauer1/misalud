"use client";

import { useState } from "react";
import { AnimatedTabBar, type TabItem } from "@/components/ui/animated-tab-bar";

const bgColorsBody = ["#ffb457", "#ff96bd", "#9999fb", "#ffe797", "#cffff1"];

const tabItems: TabItem[] = [
  {
    color: "#ff8c00",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3.8,6.6h16.4" />
        <path d="M20.2,12.1H3.8" />
        <path d="M3.8,17.5h16.4" />
      </svg>
    ),
  },
  {
    color: "#f54888",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6.7,4.8h10.7c0.3,0,0.6,0.2,0.7,0.5l2.8,7.3c0,0.1,0,0.2,0,0.3v5.6c0,0.4-0.4,0.8-0.8,0.8H3.8 C3.4,19.3,3,19,3,18.5v-5.6c0-0.1,0-0.2,0.1-0.3L6,5.3C6.1,5,6.4,4.8,6.7,4.8z" />
        <path d="M3.4,12.9H8l1.6,2.8h4.9l1.5-2.8h4.6" />
      </svg>
    ),
  },
  {
    color: "#4343f5",
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3.4,11.9l8.8,4.4l8.4-4.4" />
        <path d="M3.4,16.2l8.8,4.5l8.4-4.5" />
        <path d="M3.7,7.8l8.6-4.5l8,4.5l-8,4.3L3.7,7.8z" />
      </svg>
    ),
  },
];

export default function AnimatedTabBarDemo() {
  const [bgColor, setBgColor] = useState(bgColorsBody[0]);

  const handleTabChange = (index: number) => {
    setBgColor(bgColorsBody[index]);
  };

  return (
    <div className="demo-container p-8 flex items-center justify-center min-h-[200px]" style={{ backgroundColor: bgColor }}>
      <AnimatedTabBar items={tabItems} onTabChange={handleTabChange} />
    </div>
  );
}
