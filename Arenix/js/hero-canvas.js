/**
 * ARENIX HERO CANVAS ENGINE
 * Aesthetic: Architectural, spatial, intelligent, abstract vector field.
 * Zero sci-fi/cyberpunk clutter. 60fps GPU-efficient mathematical simulation.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isVisible = true;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Mouse & Touch interaction state
  const mouse = {
    x: width * 0.5,
    y: height * 0.45,
    targetX: width * 0.5,
    targetY: height * 0.45,
    isHovering: false,
    radius: 220
  };

  // Node class for architectural geometry
  class SpatialNode {
    constructor(layer) {
      this.layer = layer; // 1 (far), 2 (mid), 3 (near)
      this.reset();
    }

    reset() {
      this.baseX = Math.random() * width;
      this.baseY = Math.random() * height;
      this.x = this.baseX;
      this.y = this.baseY;
      this.vx = (Math.random() - 0.5) * 0.35 * this.layer;
      this.vy = (Math.random() - 0.5) * 0.35 * this.layer;
      this.size = this.layer === 3 ? 2 : this.layer === 2 ? 1.5 : 1;
      this.baseAlpha = this.layer === 3 ? 0.6 : this.layer === 2 ? 0.35 : 0.18;
      this.alpha = this.baseAlpha;
    }

    update() {
      if (prefersReducedMotion) return;

      this.baseX += this.vx;
      this.baseY += this.vy;

      // Wrap around edges smoothly
      if (this.baseX < -40) this.baseX = width + 40;
      if (this.baseX > width + 40) this.baseX = -40;
      if (this.baseY < -40) this.baseY = height + 40;
      if (this.baseY > height + 40) this.baseY = -40;

      // Cursor spatial displacement based on layer
      const dx = mouse.x - this.baseX;
      const dy = mouse.y - this.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && mouse.isHovering) {
        const force = (1 - dist / mouse.radius) * 28 * this.layer;
        const angle = Math.atan2(dy, dx);
        this.x = this.baseX - Math.cos(angle) * force;
        this.y = this.baseY - Math.sin(angle) * force;
        this.alpha = Math.min(1, this.baseAlpha + 0.3);
      } else {
        // Soft return to base
        this.x += (this.baseX - this.x) * 0.08;
        this.y += (this.baseY - this.y) * 0.08;
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }
    }

    draw() {
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fillRect(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
    }
  }

  // Initialize nodes across 3 spatial layers
  const nodeCount = window.innerWidth < 768 ? 32 : 64;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const layer = i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1;
    nodes.push(new SpatialNode(layer));
  }

  // Draw architectural vector grid & connective lines
  function drawConnections() {
    const maxDist = window.innerWidth < 768 ? 100 : 140;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Only connect nodes of compatible or adjacent layers
        if (Math.abs(nodes[i].layer - nodes[j].layer) > 1) continue;

        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const strength = 1 - dist / maxDist;
          const lineAlpha = strength * 0.16 * (nodes[i].alpha + nodes[j].alpha) * 0.5;

          ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Subtle coordinate grid intersection crosshairs
  function drawArchitecturalGrid() {
    const spacing = 180;
    const offsetX = (mouse.x - width * 0.5) * 0.02;
    const offsetY = (mouse.y - height * 0.5) * 0.02;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 0.5;

    for (let x = (offsetX % spacing); x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = (offsetY % spacing); y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Render loop
  function render() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Ease mouse position
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    drawArchitecturalGrid();
    drawConnections();

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle Resize
  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', handleResize, { passive: true });
  handleResize();

  // Mouse & Touch listeners
  window.addEventListener('mousemove', function (e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isHovering = true;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.isHovering = false;
    mouse.targetX = width * 0.5;
    mouse.targetY = height * 0.45;
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isHovering = true;
    }
  }, { passive: true });

  // Intersection Observer to save power when hero is off-screen
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          render();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(heroSection);
  } else {
    render();
  }
})();
