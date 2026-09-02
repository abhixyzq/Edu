'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleSphereProps {
  particleCount?: number;
  radius?: number;
  className?: string;
}

export function ParticleSphere({
  particleCount = 3800,
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

    let size = 360;
    const updateDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const minDim = Math.min(parent.clientWidth || 360, parent.clientHeight || 360);
      size = minDim > 0 ? minDim : 360;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    interface IndependentParticle {
      theta: number; // Longitude angle (0 to 2*PI)
      phi: number; // Latitude angle (0 to PI)
      baseR: number;
      dTheta: number; // Independent speed along longitude
      dPhi: number; // Independent speed along latitude
      radialWaveAmp: number;
      radialWaveFreq: number;
      phase: number;
      pulseSpeed: number;
      size: number;
      baseAlpha: number;
      isAccent: boolean;
      x: number;
      y: number;
      z: number;
    }

    const points: IndependentParticle[] = [];
    const count = particleCount || 3800;
    const r = radius;

    for (let i = 0; i < count; i++) {
      // Isotropic uniform sphere surface distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      // Random speed and direction for independent flow
      // A mix of slow drifting background particles and faster shimmering orbital particles
      const speedMult = Math.random() < 0.2 ? 1.8 : 0.8;
      const dTheta = (Math.random() - 0.5) * 0.008 * speedMult;
      const dPhi = (Math.random() - 0.5) * 0.005 * speedMult;

      // Slight radial variance for volumetric depth
      const radialOffset = (Math.random() - 0.5) * 12;
      const baseR = r + radialOffset;

      const isPolar = Math.abs(Math.cos(phi)) > 0.75;
      const isAccent = Math.random() < 0.12; // 12% cyan/electric cosmic accent stars

      points.push({
        theta,
        phi,
        baseR,
        dTheta,
        dPhi,
        radialWaveAmp: Math.random() * 4 + 1.5,
        radialWaveFreq: Math.random() * 0.003 + 0.0015,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        size: isPolar
          ? Math.random() * 1.0 + 0.65
          : isAccent
            ? Math.random() * 1.1 + 0.7
            : Math.random() * 0.8 + 0.35,
        baseAlpha: isPolar ? Math.random() * 0.35 + 0.65 : Math.random() * 0.5 + 0.35,
        isAccent,
        x: 0,
        y: 0,
        z: 0,
      });
    }

    let rotX = 0.35; // 3D orbital tilt
    let rotY = 0;
    const angleX = 0.0006;
    const angleY = 0.004;

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

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      frame++;

      if (!isInteracting) {
        rotX += angleX;
        rotY += angleY;
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const center = size / 2;

      // Update independent positions and 3D projection
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Independent angle progression
        p.theta += p.dTheta;
        p.phi += p.dPhi;

        // Longitude wrap-around
        if (p.theta > Math.PI * 2) p.theta -= Math.PI * 2;
        else if (p.theta < 0) p.theta += Math.PI * 2;

        // Latitude boundary bounce (avoids clumping at poles while keeping fluid flow)
        const minPhi = 0.05;
        const maxPhi = Math.PI - 0.05;
        if (p.phi < minPhi) {
          p.phi = minPhi + (minPhi - p.phi);
          p.dPhi = Math.abs(p.dPhi);
        } else if (p.phi > maxPhi) {
          p.phi = maxPhi - (p.phi - maxPhi);
          p.dPhi = -Math.abs(p.dPhi);
        }

        // Independent subtle breathing wave
        const currentR = p.baseR + Math.sin(frame * p.radialWaveFreq + p.phase) * p.radialWaveAmp;
        const sinPhi = Math.sin(p.phi);
        const localX = currentR * sinPhi * Math.cos(p.theta);
        const localY = currentR * Math.cos(p.phi);
        const localZ = currentR * sinPhi * Math.sin(p.theta);

        // Global sphere 3D rotation
        // 1. Rotate around Y-axis
        const x1 = localX * cosY - localZ * sinY;
        const z1 = localZ * cosY + localX * sinY;

        // 2. Rotate around X-axis
        const y2 = localY * cosX - z1 * sinX;
        const z2 = z1 * cosX + localY * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;
      }

      // Depth sorting for authentic 3D layering
      points.sort((a, b) => a.z - b.z);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const projX = center + p.x;
        const projY = center + p.y;

        // Depth & independent twinkling
        const normalizedZ = (p.z + r) / (2 * r); // 0 (back) to 1 (front)
        const twinkle = Math.sin(frame * p.pulseSpeed + p.phase) * 0.25 + 0.75;
        const alpha = Math.min(
          1,
          Math.max(0.1, p.baseAlpha * (0.25 + normalizedZ * 0.75) * twinkle)
        );
        const pointSize = p.size * (0.7 + normalizedZ * 0.5);

        if (p.isAccent && normalizedZ > 0.5) {
          // Cyan glowing accent stars
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        } else {
          // Pure celestial white
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(projX, projY, pointSize, 0, Math.PI * 2);
        ctx.fill();

        // Luminous bloom highlight for front-facing stars
        if (normalizedZ > 0.82 && p.size > 0.85) {
          ctx.fillStyle = p.isAccent
            ? `rgba(56, 189, 248, ${alpha * 0.45})`
            : `rgba(255, 255, 255, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(projX, projY, pointSize * 2.0, 0, Math.PI * 2);
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
