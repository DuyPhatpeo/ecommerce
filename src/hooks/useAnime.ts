"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function useFloatingAnimation(elementRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!elementRef.current) return;

    const anim = animate(elementRef.current, {
      translateY: [-12, 12],
      rotate: [-1.5, 1.5],
      duration: 3200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      if (anim && typeof anim.pause === "function") {
        anim.pause();
      }
    };
  }, [elementRef]);
}

export function useNeonPulseAnimation(elementRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!elementRef.current) return;

    const anim = animate(elementRef.current, {
      opacity: [0.85, 1],
      scale: [0.99, 1.02],
      duration: 2000,
      ease: "inOutQuad",
      loop: true,
      alternate: true,
    });

    return () => {
      if (anim && typeof anim.pause === "function") {
        anim.pause();
      }
    };
  }, [elementRef]);
}
