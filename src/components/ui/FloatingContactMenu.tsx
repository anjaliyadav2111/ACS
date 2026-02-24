import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type QuickLink = {
    label: string;
    href: string;
    openInNewTab: boolean;
};

const QUICK_LINKS: QuickLink[] = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/aakritcinematicsolutions?igsh=NjJlN3JjbjR3ZDho&utm_source=qr',
        openInNewTab: true,
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@aakritcinematicsolutions',
        openInNewTab: true,
    },
    {
        label: 'Behance',
        href: 'https://www.behance.net/aakritcinematics',
        openInNewTab: true,
    },
    {
        label: 'Email Studio',
        href: 'mailto:studio@aakritcinematic.in',
        openInNewTab: false,
    },
    {
        label: 'WhatsApp',
        href: 'https://wa.me/919819886633',
        openInNewTab: true,
    },
];

const RAISIN_BLACK = '#282828';
const SITE_BACKGROUND = '#F2DD5E';

const FloatingContactMenu = ({ isVisible = true }: { isVisible?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    if (typeof document === 'undefined' || !isVisible) {
        return null;
    }

    return createPortal(
        <div
            ref={rootRef}
            className="flex flex-col items-end gap-4"
            style={{
                position: 'fixed',
                right: '40px',
                bottom: '40px',
                zIndex: 2147483647,
            }}
        >
            <div
                className={[
                    'origin-bottom-right transition-all duration-300 ease-out',
                    isOpen ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-8 opacity-0 scale-95 pointer-events-none',
                ].join(' ')}
            >
                <div
                    className="rounded-[32px] backdrop-blur-2xl"
                    style={{
                        width: '300px',
                        padding: '40px 20px',
                        backgroundColor: 'rgba(20, 20, 20, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow:
                            '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <p className="w-full pb-12 pt-1 font-bold uppercase tracking-[0.2em] text-center select-none" style={{ fontFamily: 'var(--font-primary)', color: '#ffffff', fontSize: '20px' }}>
                        Quick Contact
                    </p>
                    <ul
                        className="list-none m-0 p-0 w-full"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}
                    >
                        {QUICK_LINKS.map((link) => (
                            <li key={link.label} className="w-full">
                                <a
                                    href={link.href}
                                    target={link.openInNewTab ? '_blank' : undefined}
                                    rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                                    onClick={() => setIsOpen(false)}
                                    className="
                                        relative
                                        flex items-center justify-center
                                        w-full
                                        rounded-full
                                        px-6
                                        text-[20px] font-semibold tracking-wide text-[#1a1a1a]
                                        transition-all duration-200 ease-out
                                        hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                                    "
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        fontFamily: 'var(--font-primary)',
                                        textDecoration: 'none',
                                        height: '45px',
                                    }}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                type="button"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close contact links menu' : 'Open contact links menu'}
                onClick={() => setIsOpen((previous) => !previous)}
                className={`
                    group
                    relative
                    rounded-full
                    inline-flex items-center justify-center
                    text-[18px] font-bold tracking-wider text-white
                    leading-none whitespace-nowrap
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:shadow-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                    ${isOpen ? 'w-20 h-20 p-0 rotate-0' : 'min-w-[140px] h-[60px] px-8'}
                `}
                style={{
                    backgroundColor: RAISIN_BLACK,
                    color: '#ffffff',
                    border: `1px solid ${SITE_BACKGROUND}40`,
                    boxShadow:
                        '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    fontFamily: 'var(--font-primary)',
                    width: isOpen ? '60px' : undefined,
                    height: isOpen ? '60px' : undefined,
                }}
            >
                {isOpen ? (
                    <X className="text-white/90 transition-transform duration-300 group-hover:rotate-90" style={{ width: '30px', height: '30px' }} />
                ) : (
                    <span className="translate-y-[1px]">Quick Links</span>
                )}
            </button>
        </div>,
        document.body
    );
};

export default FloatingContactMenu;
