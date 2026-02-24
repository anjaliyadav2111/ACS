import { useEffect, useRef, useState } from 'react';

const CanvasCursor = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isEnabled, setIsEnabled] = useState(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
        return window.matchMedia('(pointer: fine)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
            return;
        }
        const mediaQuery = window.matchMedia('(pointer: fine)');
        const handleChange = (event: MediaQueryListEvent) => setIsEnabled(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (!isEnabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const mouse = { x: width / 2, y: height / 2 };
        const lastMouse = { x: width / 2, y: height / 2 };
        const trailLength = 20;
        const trail: { x: number; y: number }[] = [];

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            lastMouse.x = lerp(lastMouse.x, mouse.x, 0.15);
            lastMouse.y = lerp(lastMouse.y, mouse.y, 0.15);

            trail.push({ x: lastMouse.x, y: lastMouse.y });
            if (trail.length > trailLength) {
                trail.shift();
            }

            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (trail.length > 1) {
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) {
                    const point = trail[i];
                    ctx.lineWidth = (i / trailLength) * 8;
                    const opacity = i / trailLength;
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                }
            }

            ctx.beginPath();
            ctx.arc(lastMouse.x, lastMouse.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff88';
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isEnabled]);

    if (!isEnabled) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 h-full w-full pointer-events-none z-[9999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default CanvasCursor;
