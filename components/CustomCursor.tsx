"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState<{ color: string } | null>(null);

  const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Listen for custom hover events from our 3D cards
    const handleHover = (e: any) => setHovered(e.detail);
    const handleUnhover = () => setHovered(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("projectHover", handleHover);
    window.addEventListener("projectUnhover", handleUnhover);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("projectHover", handleHover);
      window.removeEventListener("projectUnhover", handleUnhover);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: hovered ? hovered.color : "#ffffff",
        scale: hovered ? 2.5 : 1,
        border: hovered ? "none" : "2px solid rgba(255,255,255,0.5)",
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {hovered && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ backgroundColor: hovered.color }}
        />
      )}
    </motion.div>
  );
}
