'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleSphereProps {
  particleCount?: number;
  radius?: number;
  className?: string;
}

export function ParticleSphere({
  particleCount = 3600,
  radius = 135,
  className = '',
}: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    let size = 320;
    const updateDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const minDim = Math.min(parent.clientWidth || 320, parent.clientHeight || 320, 360);
      size = minDim;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    interface Point3D {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      baseAlpha: number;
    }

    const points: Point3D[] = [];
    const count = 4200;
    const r = radius;

    // Mathematically isotropic uniform sphere surface distribution (Muller-Marsaglia method)
    for (let i = 0; i < count; i++) {
      // Uniform spherical surface distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0); // uniformly distributed from 0 to PI

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * sinPhi * Math.sin(theta);

      // Polar brightness bonus matching the user's reference GIF
      const isPolar = Math.abs(y) > r * 0.75;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: isPolar ? Math.random() * 1.0 + 0.6 : Math.random() * 0.8 + 0.35,
        baseAlpha: isPolar ? Math.random() * 0.4 + 0.6 : Math.random() * 0.5 + 0.3,
      });
    }

    let rotX = 0.35; // Authentic 3D orbital tilt
    let rotY = 0;
    const angleX = 0.001;
    const angleY = 0.006;

    let isInteracting = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isInteracting = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX;
      lastY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isInteracting) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;
      rotY += deltaX * 0.007;
      rotX -= deltaY * 0.007;
      lastX = clientX;
      lastY = clientY;
    };

    const onPointerUp = () => {
      isInteracting = false;
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      if (!isInteracting) {
        rotX += angleX;
        rotY += angleY;
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const center = size / 2;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Rotate around Y-axis
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X-axis
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // Depth sorting
      points.sort((a, b) => a.z - b.z);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Symmetrical projection ensuring 100% circular silhouette
        const projX = center + p.x;
        const projY = center + p.y;

        // Depth shading: foreground is bright and sharp, background is subtle
        const normalizedZ = (p.z + r) / (2 * r); // 0 (back) to 1 (front)
        const alpha = Math.min(1, Math.max(0.12, p.baseAlpha * (0.3 + normalizedZ * 0.7)));
        const pointSize = p.size * (0.75 + normalizedZ * 0.45);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projX, projY, pointSize, 0, Math.PI * 2);
        ctx.fill();

        // Luminous highlight for top poles and front stars
        if (normalizedZ > 0.8 && p.size > 0.9) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(projX, projY, pointSize * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDimensions);
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [particleCount, radius]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
