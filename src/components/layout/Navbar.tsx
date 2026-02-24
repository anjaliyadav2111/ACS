import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';
import logo from '../../assets/Aakrit_logo_02-01.svg';

type SectionLink = {
    id: string;
    label: string;
};

interface NavbarProps {
    isVisible?: boolean;
}

const SECTION_LINKS: SectionLink[] = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Portfolio' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'clients', label: 'Client Feedback' },
    { id: 'about', label: 'About Us' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact Us' },
];

const Navbar = ({ isVisible = true }: NavbarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSectionClick = useCallback(
        (sectionId: string) => {
            setIsMobileMenuOpen(false);

            if (location.pathname !== '/') {
                navigate('/', { state: { scrollTo: sectionId } });
                return;
            }

            window.dispatchEvent(
                new CustomEvent('navigate-section', {
                    detail: { sectionId },
                })
            );
        },
        [location.pathname, navigate]
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    aria-label="Primary"
                    className="
                    fixed top-0 left-0 right-0
                    w-screen
                    z-[10000]
                    h-16
                "
                    style={{
                        isolation: 'isolate',
                        fontFamily: 'var(--font-primary)',
                        background:
                            'linear-gradient(135deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0))',
                        backdropFilter: 'saturate(100%) blur(6px)',
                        WebkitBackdropFilter: 'saturate(100%) blur(6px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                        boxShadow:
                            '0 4px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0) 100%)',
                        }}
                    />
                    <div
                        className="relative z-[1] flex h-full w-full items-center justify-between"
                        style={{
                            paddingInline: isDesktop ? '2.5rem' : '0',
                        }}
                    >
                        <Link to="/" className="z-[101] flex shrink-0 items-center">
                            <img
                                src={logo}
                                alt="Aarkit Cinematic Solutions"
                                className="h-10 w-auto max-w-[200px] object-contain"
                                loading="eager"
                                style={{ display: 'block', width: '350px', height: '64px' }}
                            />
                        </Link>

                        {isDesktop ? (
                            <div className="flex items-center whitespace-nowrap">
                                {SECTION_LINKS.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => handleSectionClick(section.id)}
                                        className="
                                        min-w-[78px]
                                        text-center
                                        transition-opacity
                                        focus:outline-none
                                    "
                                        style={{
                                            padding: '9px 10px',
                                            background: 'transparent',
                                            border: 'none',
                                            appearance: 'none',
                                            color: '#1a1a1a',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            fontFamily: 'var(--font-primary)',
                                        }}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="relative z-[101]">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen((open) => !open)}
                                    className="focus:outline-none"
                                    style={{
                                        padding: '8px',
                                        background: 'transparent',
                                        border: 'none',
                                        appearance: 'none',
                                        color: '#1a1a1a',
                                    }}
                                    aria-label="Toggle menu"
                                    aria-expanded={isMobileMenuOpen}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isMobileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                            className="absolute top-full mt-4 rounded-[32px] backdrop-blur-2xl origin-top-right"
                                            style={{
                                                right: '8px',
                                                width: '300px',
                                                maxWidth: 'calc(100vw - 20px)',
                                                padding: '40px 20px',
                                                backgroundColor: 'rgba(20, 20, 20, 0.85)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow:
                                                    '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <div className="flex flex-col gap-[15px]">
                                                {SECTION_LINKS.map((section) => (
                                                    <button
                                                        key={section.id}
                                                        type="button"
                                                        onClick={() => handleSectionClick(section.id)}
                                                        className="
                                                            relative
                                                            flex items-center justify-center
                                                            w-full
                                                            rounded-full
                                                            px-6
                                                            text-[20px] font-bold tracking-wide text-[#1a1a1a]
                                                            transition-all duration-200 ease-out
                                                            hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]
                                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                                                        "
                                                        style={{
                                                            backgroundColor: '#ffffff',
                                                            border: 'none',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                            fontFamily: 'var(--font-primary)',
                                                            height: '45px',
                                                            textTransform: 'none', // Reset since original was uppercase via class, but quicklinks uses label directly
                                                        }}
                                                    >
                                                        {section.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};

export default Navbar;
