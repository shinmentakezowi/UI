"use client";

import { useEffect, useRef } from "react";

/**
 * Premium background with three layers:
 * 1. Mesh gradient orbs (CSS, slow floating)
 * 2. Grid pattern overlay (CSS, faded radial mask)
 * 3. Neural particle network (Canvas, connected floating dots)
 */
export function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      o: number;
      p: number;
      ps: number;
    }

    let nodes: Node[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initNodes() {
      nodes = [];
      const count = Math.min(
        Math.floor((canvas!.width * canvas!.height) / 30000),
        50
      );
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.5 + 0.5,
          o: Math.random() * 0.2 + 0.05,
          p: Math.random() * Math.PI * 2,
          ps: Math.random() * 0.015 + 0.003,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx!.strokeStyle = `rgba(124,91,245,${(1 - dist / 140) * 0.04})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      // Draw + update nodes
      for (const node of nodes) {
        node.p += node.ps;
        const pf = 0.5 + Math.sin(node.p) * 0.5;

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.r * (0.8 + pf * 0.4), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(124,91,245,${node.o * pf})`;
        ctx!.fill();

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -10) node.x = canvas!.width + 10;
        if (node.x > canvas!.width + 10) node.x = -10;
        if (node.y < -10) node.y = canvas!.height + 10;
        if (node.y > canvas!.height + 10) node.y = -10;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();

    const onResize = () => {
      resize();
      initNodes();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* Layer 1: Mesh gradient orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full blur-[150px] mix-blend-screen"
          style={{ background: "rgba(124, 58, 237, 0.08)", animation: "orbit 30s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[5%] w-[600px] h-[600px] rounded-full blur-[150px] mix-blend-screen"
          style={{ background: "rgba(6, 214, 160, 0.05)", animation: "orbit 25s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full blur-[150px] mix-blend-screen"
          style={{ background: "rgba(34, 211, 238, 0.04)", animation: "orbit 35s ease-in-out infinite -10s" }}
        />
      </div>

      {/* Layer 2: Grid pattern */}
      <div className="fixed inset-0 z-0 bg-grid [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,black_20%,transparent_70%)]" />

      {/* Layer 3: Neural particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
    </div>
  );
}
