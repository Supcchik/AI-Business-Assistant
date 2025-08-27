"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

export type AgentStatus = "idle" | "listening" | "thinking" | "loading" | "success" | "error";
export type OrbSize = "sm" | "md" | "lg";

const sizeMap: Record<OrbSize, string> = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-[420px] h-[420px] max-w-[60vw] max-h-[60vh]",
};

export interface OrbProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'onDrop' |
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' |
  'onTransitionEnd' | 'onTransitionStart' | 'onTransitionRun' | 'onTransitionCancel'> {
  status?: AgentStatus;
  /** Use the same value for center & dock instances to enable shared layout fly animation */
  layoutId?: string; // default "orb"
  size?: OrbSize;    // center: "lg", dock: "sm" or "md"
  subtle?: boolean;  // if true, tone down effects (for dock)
  showIcon?: boolean;// render Brain icon overlay
}

export function Orb({
  status = "idle",
  layoutId = "orb",
  size = "lg",
  subtle = false,
  showIcon = true,
  className,
  ...rest
}: OrbProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseGlow = subtle 
    ? status === "thinking" 
      ? "shadow-[0_0_24px_rgba(168,85,247,0.4)]" // світліша тінь для thinking
      : "shadow-[0_0_24px_rgba(139,92,246,0.25)]"
    : status === "thinking"
      ? "shadow-[0_0_72px_rgba(168,85,247,0.6)]" // світліша тінь для thinking
      : "shadow-[0_0_72px_var(--orb-glow)]";

  // Status-driven framer variants
  const animate = (() => {
    if (prefersReducedMotion) return {};
    switch (status) {
      case "listening": return { scale: [1, 1.04, 1], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } };
      case "thinking":  return { 
        scale: [1, 1.05, 1], 
        rotate: [0, 5, -5, 0],
        transition: { 
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        } 
      };
      case "loading":   return { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } };
      case "success":   return { scale: [1, 1.08, 1], transition: { duration: 0.6, ease: "easeOut" } };
      case "error":     return { rotate: [0, -2, 2, -2, 0], transition: { duration: 0.45, ease: "easeInOut" } };
      default:          return {};
    }
  })();

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "relative rounded-full isolate",
        sizeMap[size],
        baseGlow,
        !prefersReducedMotion && status === "idle" && "animate-breath",
        className
      )}
      animate={animate}
      {...rest}
    >
      {/* Core gradient disc */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500",
          status === "thinking" 
            ? "bg-[radial-gradient(circle_at_30%_30%,#22d3ee,transparent_60%),radial-gradient(circle_at_70%_70%,#a855f7,transparent_62%)]" // світліші кольори
            : "bg-[radial-gradient(circle_at_30%_30%,var(--orb-from),transparent_60%),radial-gradient(circle_at_70%_70%,var(--orb-to),transparent_62%)]",
          subtle ? "opacity-90" : "opacity-100"
        )}
      />
      {/* Soft outer glow ring */}
      <div
        className={cn(
          "absolute -inset-1 rounded-full blur-2xl transition-all duration-500",
          status === "thinking"
            ? "bg-[conic-gradient(from_0deg,rgba(168,85,247,.4),rgba(34,211,238,.4),rgba(168,85,247,.4))]" // світліші кольори
            : "bg-[conic-gradient(from_0deg,rgba(139,92,246,.25),rgba(6,182,212,.25),rgba(139,92,246,.25))]",
          subtle ? "opacity-30" : "opacity-60",
          !subtle && "animate-spin-slow"
        )}
        aria-hidden
      />
      {/* Shimmer sweep when thinking */}
      {status === "thinking" && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-[160%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent)] animate-shimmer" />
          <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-[160%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(139,92,246,.3),transparent)] animate-shimmer" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      {/* Success flash overlay */}
      {status === "success" && !prefersReducedMotion && (
        <div className="absolute inset-0 rounded-full animate-flash" aria-hidden />
      )}
      
      {/* Thinking pulse overlay */}
      {status === "thinking" && !prefersReducedMotion && (
        <div className="absolute inset-0 rounded-full bg-white/10 animate-thinking-pulse" aria-hidden />
      )}
      {/* Icon for readability (esp. in dock) */}
      {showIcon && (
        <div className="absolute inset-0 grid place-items-center text-white/90">
          <Brain className={cn(subtle ? "w-5 h-5" : "w-10 h-10")} />
        </div>
      )}
      {/* Decorative inner ring */}
      <div className={cn(
        "absolute inset-0 rounded-full ring-1",
        subtle ? "ring-white/10" : "ring-white/15"
      )}/>
    </motion.div>
  );
}
