import { useEffect, useRef, useState, useCallback } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import gsap from 'gsap';
import walkData from '../../assets/walk.json';
import idleData from '../../assets/idle.json';
import landingData from '../../assets/landing.json';
import landingMobileData from '../../assets/mobile/Landing_mobile.json';
import useMediaQuery from '../../hooks/useMediaQuery';

interface MascotProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    startLanding?: boolean;
}

const Mascot = ({ containerRef, onLandingComplete, startLanding = true }: MascotProps & { onLandingComplete?: () => void }) => {
    const walkContainerRef = useRef<HTMLDivElement>(null);
    const idleContainerRef = useRef<HTMLDivElement>(null);
    const landingContainerRef = useRef<HTMLDivElement>(null);
    const walkAnimRef = useRef<AnimationItem | null>(null);
    const idleAnimRef = useRef<AnimationItem | null>(null);
    const landingAnimRef = useRef<AnimationItem | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [isWalking, setIsWalking] = useState(false);
    const [isLanding, setIsLanding] = useState(true);

    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const mascotSize = isDesktop ? 150 : 100;

    const scrollTimeout = useRef<number | null>(null);

    // Watch for startLanding signal
    useEffect(() => {
        if (startLanding && landingAnimRef.current && landingAnimRef.current.isPaused) {
            landingAnimRef.current.play();
        }
    }, [startLanding]);

    const handleLandingComplete = useCallback(() => {
        if (!wrapperRef.current) return;



        // Notify parent
        if (onLandingComplete) onLandingComplete();

        setIsLanding(false);
        if (wrapperRef.current) {
            gsap.set(wrapperRef.current, { clearProps: "all" });
        }
    }, [onLandingComplete]);

    // Initialize animations
    useEffect(() => {
        // --- Walk Animation ---
        if (walkContainerRef.current) {
            try {
                if (walkAnimRef.current) walkAnimRef.current.destroy();
                walkAnimRef.current = lottie.loadAnimation({
                    container: walkContainerRef.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: false,
                    animationData: walkData,
                    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
                });
            } catch (error) {
                console.error("Mascot: Failed to load walk animation", error);
            }
        }

        // --- Idle Animation ---
        if (idleContainerRef.current) {
            try {
                if (idleAnimRef.current) idleAnimRef.current.destroy();
                idleAnimRef.current = lottie.loadAnimation({
                    container: idleContainerRef.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: idleData,
                    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
                });
            } catch (error) {
                console.error("Mascot: Failed to load idle animation", error);
            }
        }

        // --- Landing Animation ---
        if (landingContainerRef.current) {
            try {
                const animationData = isDesktop ? landingData : landingMobileData;

                if (landingAnimRef.current) landingAnimRef.current.destroy();
                landingAnimRef.current = lottie.loadAnimation({
                    container: landingContainerRef.current,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false, // Wait for signal
                    animationData: animationData,
                    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
                });

                landingAnimRef.current.addEventListener('DOMLoaded', () => {
                    if (startLanding) {
                        landingAnimRef.current?.play();
                    }
                });

                landingAnimRef.current.addEventListener('complete', () => {
                    handleLandingComplete();
                });

            } catch (error) {
                console.error("Mascot: Failed to load landing animation", error);
            }
        }

        return () => {
            walkAnimRef.current?.destroy();
            idleAnimRef.current?.destroy();
            landingAnimRef.current?.destroy();
        };
    }, [handleLandingComplete, startLanding, isDesktop]); // Re-run if landing handler changes



    // Initial setup for landing position
    useEffect(() => {
        if (isLanding && wrapperRef.current) {

            // Start fullscreen
            gsap.set(wrapperRef.current, {
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
                xPercent: 0,
                yPercent: 0,
                bottom: 'auto',
                zIndex: 9999
            });
        }
    }, [isLanding]); // Run when isLanding status is available

    const lastScrollPos = useRef(0);
    const facingRight = useRef(true);

    // Scroll Handler
    useEffect(() => {
        if (isLanding) return; // Disable scroll movement during landing

        const container = containerRef.current;
        if (!container) return;

        const handleScroll = (isInitial = false) => {
            const scrollPos = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const progress = maxScroll > 0 ? scrollPos / maxScroll : 0;

            const diff = scrollPos - lastScrollPos.current;
            if (Math.abs(diff) > 0.5) {
                if (diff > 0) facingRight.current = true;
                else if (diff < 0) facingRight.current = false;
            }
            lastScrollPos.current = scrollPos;

            const walkAnim = walkAnimRef.current;
            if (walkAnim && walkAnim.isLoaded) {
                const totalFrames = walkAnim.totalFrames > 0 ? walkAnim.totalFrames : 60;
                const pixelsPerFrame = 15;
                let frame = (scrollPos / pixelsPerFrame) % totalFrames;
                if (!facingRight.current) frame = (totalFrames - frame) % totalFrames;
                walkAnim.goToAndStop(frame, true);
            }

            const currentMascotSize = window.innerWidth < 1024 ? 100 : 150;
            const currentPadding = window.innerWidth < 1024 ? 16 : 32;
            const moveDistanceOfScreen = window.innerWidth - currentMascotSize - (currentPadding * 2);

            if (wrapperRef.current) {
                wrapperRef.current.style.transform = `translateX(${progress * moveDistanceOfScreen}px) scaleX(${facingRight.current ? 1 : -1})`;
            }

            if (!isInitial) {
                if (!isWalking) setIsWalking(true);
                if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
                scrollTimeout.current = window.setTimeout(() => setIsWalking(false), 50);
            }
        };

        handleScroll(true);
        const onScroll = () => handleScroll(false);
        container.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', onScroll);
            if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
        };
    }, [containerRef, isWalking, isLanding]);

    return (
        <div
            ref={wrapperRef}
            className={`fixed lg:absolute z-[9999] pointer-events-none ${isLanding ? '' : 'left-4 lg:left-8'}`}
            style={{
                // While landing, we let GSAP control size/pos. 
                // After landing, we use these styles as base.
                bottom: isLanding ? 'auto' : '4px',
                width: isLanding ? '100vw' : `${mascotSize}px`,
                height: isLanding ? '100vh' : `${mascotSize}px`,
                transition: isLanding ? 'none' : 'transform 75ms ease-linear'
            }}
        >
            {/* Landing Container */}
            <div
                ref={landingContainerRef}
                className={`w-full h-full absolute top-0 left-0 transition-opacity duration-0 ${isLanding ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    transform: isLanding ? 'scale(1.4)' : 'scale(1)',
                    transformOrigin: 'center center'
                }}
            />

            {/* Walk Container */}
            <div
                ref={walkContainerRef}
                className={`w-full h-full absolute top-0 left-0 transition-opacity duration-0 ${isWalking && !isLanding ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Idle Container */}
            <div
                ref={idleContainerRef}
                className={`w-full h-full absolute top-0 left-0 transition-opacity duration-0 ${!isWalking && !isLanding ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default Mascot;
