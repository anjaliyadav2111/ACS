import { useRef, useEffect, useState } from 'react';
import { createSmoothHorizontalScroller } from '../../utils/smoothHorizontalScroll';
import Mascot from '../mascot/Mascot';

interface HorizontalScrollContainerProps {
    children: React.ReactNode;
    scrollerRef?: React.RefObject<HTMLDivElement | null>;
    isDesktop?: boolean;
    onLandingComplete?: () => void;
    startLanding?: boolean;
}

const HorizontalScrollContainer = ({
    children,
    scrollerRef: externalScrollerRef,
    isDesktop = true,
    onLandingComplete,
    startLanding = true
}: HorizontalScrollContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const internalScrollerRef = useRef<HTMLDivElement>(null);
    // Use external ref if provided, otherwise use internal
    const scrollerRef = (externalScrollerRef || internalScrollerRef) as React.RefObject<HTMLDivElement>;



    // State to track mascot landing animation
    const [isMascotLanding, setIsMascotLanding] = useState(true);

    useEffect(() => {
        const container = scrollerRef.current;
        if (!container) return;

        let cleanupScroller = () => { };
        let scrollTo = (pos: number, _immediate = false, _duration = 1000) => { container.scrollLeft = pos; }; // Default

        if (isDesktop) {
            const scroller = createSmoothHorizontalScroller(container);
            cleanupScroller = scroller.cleanup;
            scrollTo = scroller.scrollTo;
        }

        const handleNavigate = (e: CustomEvent<{ sectionId: string }>) => {
            const section = document.getElementById(e.detail.sectionId);
            if (section) {
                if (isDesktop) {
                    // Use a longer duration (1500ms) for a more cinematic feel
                    scrollTo(section.offsetLeft, false, 1500);
                } else {
                    section.scrollIntoView({ behavior: 'smooth', inline: 'start' });
                }
            }
        };

        window.addEventListener('navigate-section', handleNavigate as EventListener);

        return () => {
            cleanupScroller();
            window.removeEventListener('navigate-section', handleNavigate as EventListener);
        };
    }, [isDesktop, scrollerRef]);

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden">
            <div
                ref={scrollerRef}
                className={`flex h-full overflow-x-auto overflow-y-hidden scroll-smooth flex-row transition-opacity duration-1000 ease-in-out ${isMascotLanding ? 'opacity-0' : 'opacity-100'}`}
                style={isDesktop ? {
                    scrollBehavior: 'auto', // Let JS handle smoothing
                    willChange: 'transform, scroll-position',
                    transform: 'translateZ(0)' // GPU acceleration
                } : {
                    scrollBehavior: 'smooth', // Native smooth scroll for mobile
                    willChange: 'scroll-position'
                }}
            >
                {children}
            </div>

            <Mascot
                containerRef={scrollerRef}
                startLanding={startLanding && isMascotLanding}
                onLandingComplete={() => {
                    setIsMascotLanding(false);
                    onLandingComplete?.();
                }}
            />
        </div>
    );
};

export default HorizontalScrollContainer;
