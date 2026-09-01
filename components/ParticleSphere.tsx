'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleSphereProps {
  particleCount?: number;
  radius?: number;
  className?: string;
}

export function ParticleSphere({
  particleCount = 1400,
  radius = 170,
  className = '',
}: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Point3D {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      alpha: number;
    }

    // Generate 2200 points for dense, ultra-crisp 3D spherical globe
    const count = 2200;
    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const r = radius;

      // Perfect spherical coordinates: x, y, z
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi); // Y is vertical axis for authentic polar caps
      const z = r * Math.sin(phi) * Math.sin(theta);

      // Polar brightness bonus
      const isPolar = Math.abs(y) > radius * 0.75;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: isPolar ? Math.random() * 1.6 + 0.8 : Math.random() * 1.3 + 0.6,
        alpha: isPolar ? Math.random() * 0.5 + 0.5 : Math.random() * 0.6 + 0.35,
      });
    }

    let rotX = 0.2; // slight tilted angle for 3D depth
    let rotY = 0;
    const angleX = 0.0015;
    const angleY = 0.008;

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
      rotY += deltaX * 0.006;
      rotX -= deltaY * 0.006;
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

    const fov = 420;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += angleX;
      rotY += angleY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      points.sort((a, b) => a.z - b.z);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const scale = fov / (fov + p.z);
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;

        const depthAlpha = ((p.z + radius) / (2 * radius)) * 0.85 + 0.15;
        const finalAlpha = Math.min(1, Math.max(0.1, p.alpha * depthAlpha));

        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);
        ctx.fill();

        if (p.z > radius * 0.4 && p.size > 1.6) {
          ctx.fillStyle = `rgba(186, 230, 253, ${finalAlpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * scale * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
