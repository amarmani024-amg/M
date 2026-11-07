import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  targetX?: number;
  targetY?: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
}

interface ParticleCanvasProps {
  isFinale: boolean;
  confettiTrigger: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ isFinale, confettiTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Generate target coordinates for the letter "M"
  const generateMTargets = (width: number, height: number): { x: number; y: number }[] => {
    const targets: { x: number; y: number }[] = [];
    const cx = width / 2;
    const cy = height / 2 - 20;
    const scale = Math.min(width, height) * 0.38;

    const addLine = (x1: number, y1: number, x2: number, y2: number, count: number) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        targets.push({
          x: cx + (x1 + (x2 - x1) * t) * scale,
          y: cy + (y1 + (y2 - y1) * t) * scale,
        });
      }
    };

    // Left vertical stem
    addLine(-0.45, 0.45, -0.45, -0.45, 30);
    // Left diagonal to center valley
    addLine(-0.45, -0.45, 0.0, 0.15, 30);
    // Right diagonal from center valley
    addLine(0.0, 0.15, 0.45, -0.45, 30);
    // Right vertical stem
    addLine(0.45, -0.45, 0.45, 0.45, 30);

    // Inner subtle thickness layer
    addLine(-0.4, 0.45, -0.4, -0.4, 15);
    addLine(0.4, -0.4, 0.4, 0.45, 15);

    return targets;
  };

  // Trigger celebration confetti
  useEffect(() => {
    if (confettiTrigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = ['#00F0FF', '#38BDF8', '#F59E0B', '#FCD34D', '#EBF4FF', '#60A5FA'];
    const newConfetti: ConfettiPiece[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      newConfetti.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        life: 0,
        maxLife: Math.random() * 80 + 70,
      });
    }

    confettiRef.current = [...confettiRef.current, ...newConfetti];
  }, [confettiTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (isFinale) {
        assignMTargets();
      }
    };

    window.addEventListener('resize', handleResize);

    // Initialize ambient particles
    const particleCount = Math.min(Math.floor((width * height) / 12000), 140);
    const colors = ['#00F0FF', '#38BDF8', '#F59E0B', '#EBF4FF'];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }
    particlesRef.current = particles;

    const assignMTargets = () => {
      const targets = generateMTargets(width, height);
      particlesRef.current.forEach((p, idx) => {
        const target = targets[idx % targets.length];
        // Jitter slightly for organic cyber glow
        p.targetX = target.x + (Math.random() - 0.5) * 12;
        p.targetY = target.y + (Math.random() - 0.5) * 12;
      });
    };

    if (isFinale) {
      assignMTargets();
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background gradient mesh
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0b1f4d');
      bgGrad.addColorStop(0.5, '#081536');
      bgGrad.addColorStop(1, '#050b1f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update & Draw Particles
      const pts = particlesRef.current;
      const ptsLen = pts.length;

      for (let i = 0; i < ptsLen; i++) {
        const p = pts[i];

        if (isFinale && p.targetX !== undefined && p.targetY !== undefined) {
          // Smooth spring to target "M" shape
          p.x += (p.targetX - p.x) * 0.045;
          p.y += (p.targetY - p.y) * 0.045;
          p.alpha = 0.8 + Math.sin(time * 3 + i) * 0.2;
        } else {
          // Ambient gentle drifting
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 100) * 0.2;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.05, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = isFinale ? 14 : 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isFinale ? p.size * 1.5 : p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Connect nearby particles when in ambient mode
      if (!isFinale) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < ptsLen; i++) {
          for (let j = i + 1; j < ptsLen; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 7200) {
              const alpha = (1 - dist / 7200) * 0.15;
              ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      } else {
        // Draw connective glowing lattice for the "M"
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f0ff';
        for (let i = 0; i < ptsLen; i++) {
          for (let j = i + 1; j < Math.min(i + 8, ptsLen); j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 4000) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Update & Draw Confetti Pieces
      if (confettiRef.current.length > 0) {
        const remaining: ConfettiPiece[] = [];
        for (const c of confettiRef.current) {
          c.life++;
          c.x += c.vx;
          c.y += c.vy;
          c.vy += 0.18; // gentle gravity
          c.vx *= 0.98;
          c.rotation += c.vRot;

          const progress = c.life / c.maxLife;
          const alpha = Math.max(0, 1 - progress);

          if (progress < 1 && c.y < height + 50) {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = c.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = c.color;
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
            ctx.restore();
            remaining.push(c);
          }
        }
        confettiRef.current = remaining;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isFinale]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
