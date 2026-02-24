import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeamlessBackground from '../components/ui/SeamlessBackground';
import HorizontalScrollContainer from '../components/layout/HorizontalScrollContainer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Gallery from '../components/sections/Gallery';
import Projects from '../components/sections/Projects';
import Clients from '../components/sections/Clients';
import Team from '../components/sections/Team';
import Contact from '../components/sections/Contact';
import CanvasCursor from '../components/ui/CanvasCursor';
import useMediaQuery from '../hooks/useMediaQuery';

interface HomeExperienceProps {
    onLandingComplete?: () => void;
}

const HomeExperience = ({ onLandingComplete }: HomeExperienceProps) => {
    const [showBackground, setShowBackground] = useState(false);
    const [isLandingComplete, setIsLandingComplete] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const location = useLocation();
    const navigate = useNavigate();

    const handleLandingComplete = useCallback(() => {

        setShowBackground(true);
        setIsLandingComplete(true);
        onLandingComplete?.();
    }, [onLandingComplete]);

    useEffect(() => {
        const state = location.state as { scrollTo?: string } | null;
        const targetId = state?.scrollTo || (location.hash ? location.hash.replace('#', '') : '');

        if (!targetId) return;

        const timeoutId = window.setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('navigate-section', {
                    detail: { sectionId: targetId },
                })
            );
        }, 180);

        if (state?.scrollTo) {
            navigate(location.pathname, { replace: true, state: null });
        }

        return () => window.clearTimeout(timeoutId);
    }, [location, navigate]);

    return (
        <div className="bg-background text-text antialiased lg:overflow-hidden min-h-screen relative">
            <CanvasCursor />

            <SeamlessBackground scrollerRef={scrollerRef} isVisible={showBackground} />
            <HorizontalScrollContainer
                scrollerRef={scrollerRef}
                isDesktop={isDesktop}
                startLanding={true}
                onLandingComplete={handleLandingComplete}
            >
                <Hero id="hero" isLandingComplete={isLandingComplete} />
                <Services id="services" />
                <Projects id="projects" />
                <Gallery id="gallery" />
                <Clients id="clients" />
                <About id="about" />
                <Team id="team" />
                <Contact id="contact" />
            </HorizontalScrollContainer>
        </div>
    );
};

export default HomeExperience;



