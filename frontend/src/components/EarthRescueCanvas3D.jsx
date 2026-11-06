import React, { useRef, useEffect } from 'react';

const EarthRescueCanvas3D = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotationY = (x / (width / 2)) * 0.45;
      targetRotationX = -(y / (height / 2)) * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const numPoints = 220;
    const radius = Math.min(width, height) * 0.38;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const isBeacon = i % 14 === 0;
      const color = isBeacon
        ? '#34d399'
        : i % 7 === 0
        ? '#2dd4bf'
        : '#10b981';

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
        size: isBeacon ? 3.5 : Math.random() * 1.8 + 1,
        color,
        isBeacon,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const ringPointsCount = 70;
    const ringRadius = radius * 1.25;
    const ringPoints = [];
    for (let i = 0; i < ringPointsCount; i++) {
      const angle = (i / ringPointsCount) * Math.PI * 2;
      ringPoints.push({
        x: Math.cos(angle) * ringRadius,
        y: Math.sin(angle) * 0.25 * ringRadius,
        z: Math.sin(angle) * ringRadius,
      });
    }

    let angleY = 0;
    let angleX = 0.25;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      angleY += 0.004;

      const cosY = Math.cos(angleY + currentRotationY);
      const sinY = Math.sin(angleY + currentRotationY);
      const cosX = Math.cos(angleX + currentRotationX);
      const sinX = Math.sin(angleX + currentRotationX);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 450;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.15
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      gradient.addColorStop(0.5, 'rgba(20, 184, 166, 0.06)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      const projected = [];
      const now = Date.now() * 0.003;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          scale,
          alpha,
          color: p.color,
          isBeacon: p.isBeacon,
          size: p.size,
          pulse: p.isBeacon ? Math.sin(now + p.pulseOffset) * 1.5 + 2 : 0,
        });
      }

      projected.sort((a, b) => a.z - b.z);

      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z < -radius * 0.3) continue;
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          if (distSq < 2200) {
            const lineAlpha = (1 - distSq / 2200) * 0.18 * p1.alpha;
            ctx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.beginPath();
      let first = true;
      for (let i = 0; i < ringPoints.length; i++) {
        const rp = ringPoints[i];
        let x1 = rp.x * cosY - rp.z * sinY;
        let z1 = rp.z * cosY + rp.x * sinY;
        let y2 = rp.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + rp.y * sinX;

        const scale = fov / (fov + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.22)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        if (p.isBeacon) {
          ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (p.size + p.pulse) * p.scale * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#6ee7b7';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default EarthRescueCanvas3D;
