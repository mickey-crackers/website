"use client";
import React, { useEffect, useRef } from 'react';

export default function FireworksCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const rockets = [];
        const particles = [];

        // Bright, opaque color channels (high contrast over light backgrounds)
        const colors = [
            'rgba(212, 175, 55, ',   // Gold Yellow
            'rgba(170, 124, 17, ',   // Metallic Gold
            'rgba(243, 229, 171, ',  // Champagne Gold
            'rgba(255, 191, 0, ',    // Deep Amber
            'rgba(249, 115, 22, ',   // Warm Orange
            'rgba(183, 110, 121, ',  // Rose Gold
            'rgba(250, 246, 230, ',  // White Gold
            'rgba(205, 127, 50, ',   // Bronze Sparkle
        ];

        class Rocket {
            constructor() {
                this.x = Math.random() * width;
                this.y = height;
                this.targetY = Math.random() * (height * 0.5) + (height * 0.1); // Explode in top half
                this.speed = Math.random() * 5 + 9; // Launch speed
                this.angle = Math.PI / 2 + (Math.random() * 0.15 - 0.075);
                this.vx = Math.cos(this.angle) * -this.speed;
                this.vy = Math.sin(this.angle) * -this.speed;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.trail = [];
                this.trailLength = 12;
                this.exploded = false;
            }

            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.trailLength) {
                    this.trail.shift();
                }

                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.05; // Gravity slow down

                if (this.vy >= 0 || this.y <= this.targetY) {
                    this.exploded = true;
                    this.explode();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.strokeStyle = this.color + '0.9)';
                ctx.lineWidth = 3.5; // Thicker launcher line
                if (this.trail.length > 0) {
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                } else {
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x - this.vx, this.y - this.vy);
                }
                ctx.stroke();
            }

            explode() {
                // Generate large particle count (50-80 particles per burst)
                const particleCount = Math.floor(Math.random() * 30) + 50; 
                for (let i = 0; i < particleCount; i++) {
                    // Choose random color for each particle to create a multi-color burst
                    const particleColor = colors[Math.floor(Math.random() * colors.length)];
                    particles.push(new Particle(this.x, this.y, particleColor));
                }
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 7 + 2.5; // High initial speed for large explosions
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                this.color = color;
                this.alpha = 1.0;
                this.decay = Math.random() * 0.012 + 0.01; // Slower fade out
                this.gravity = 0.08;
                this.friction = 0.96;
            }

            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.random() * 2.5 + 2.5, 0, Math.PI * 2); // Larger particle size (3.5px - 5px)
                ctx.fillStyle = this.color + this.alpha + ')';
                
                // Add glowing shadow effect
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color + '1)';
                
                ctx.fill();
                ctx.restore();
            }
        }

        let spawnTimer = 0;
        const spawnInterval = 60; // Launch rocket every 1 second

        const loop = () => {
            if (document.hidden) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }

            // Clean full clear for transparency rendering over page content
            ctx.clearRect(0, 0, width, height);

            spawnTimer++;
            if (spawnTimer >= spawnInterval) {
                spawnTimer = 0;
                rockets.push(new Rocket());
                if (Math.random() > 0.6) {
                    rockets.push(new Rocket());
                }
            }

            // Update & Draw Rockets
            for (let i = rockets.length - 1; i >= 0; i--) {
                const r = rockets[i];
                r.update();
                if (r.exploded) {
                    rockets.splice(i, 1);
                } else {
                    r.draw();
                }
            }

            // Update & Draw Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    p.draw();
                }
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        rockets.push(new Rocket());
        rockets.push(new Rocket());

        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
        />
    );
}
