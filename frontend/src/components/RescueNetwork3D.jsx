import React, { useRef, useEffect } from 'react';

const RescueNetwork3D = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodes = [];
    const nodeCount = 38;

    for (let i = 0; i < nodeCount; i++) {
      const type = i % 3 === 0 ? 'donor' : i % 3 === 1 ? 'ngo' : 'food';
      const color =
        type === 'donor'
          ? '#10b981'
          : type === 'ngo'
          ? '#14b8a6'
          : '#f59e0b';

      nodes.push({
        x: (Math.random() - 0.5) * 380,
        y: (Math.random() - 0.5) * 220,
        z: (Math.random() - 0.5) * 380,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        radius: type === 'food' ? 2.8 : 4.5,
        color,
        type,
        pulse: Math.random() * Math.PI,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.003;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 350;

      const projected = nodes.map((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > 190) node.vx *= -1;
        if (Math.abs(node.y) > 110) node.vy *= -1;
        if (Math.abs(node.z) > 190) node.vz *= -1;

        const rotX = node.x * cos - node.z * sin;
        const rotZ = node.z * cos + node.x * sin;
        const rotY = node.y;

        const scale = fov / (fov + rotZ + 200);
        const px = centerX + rotX * scale;
        const py = centerY + rotY * scale;

        return {
          ...node,
          px,
          py,
          scale,
          depth: rotZ,
        };
      });

      projected.sort((a, b) => a.depth - b.depth);

      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.25;
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      const time = Date.now() * 0.004;
      projected.forEach((p) => {
        const pulseSize = Math.sin(time + p.pulse) * 1.5;
        const r = Math.max(1.5, (p.radius + pulseSize) * p.scale);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default RescueNetwork3D;
