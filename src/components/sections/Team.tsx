import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';
import UrviSvg from '../../assets/Team/URvi-01.svg';
import ChiragSvg from '../../assets/Team/CHIRAG-01.svg';
import ParasSvg from '../../assets/Team/PARAS-01.svg';
import RupeshSvg from '../../assets/Team/RUPESH-01.svg';
// Asset 2@4x.png path needs verification, assuming it's in assets root or similar
import WatermarkLogo from '../../assets/Aakrit_logo_02-01.svg';

const teamMembers = [
    {
        id: 1,
        name: 'URvi SHAH',
        role: 'Founder & Studio Head',
        description: 'Urvi leads the studio with a focus on cross-disciplinary innovation and creative strategy. She orchestrates complex projects from concept to delivery, ensuring every piece reflects Aakrit\'s core artistic values.',
        image: UrviSvg,
        borderColor: '#FEA800',
        gradient: 'linear-gradient(145deg, rgba(254, 168, 0, 0.95), rgba(0, 0, 0, 0.85))',
    },
    {
        id: 2,
        name: 'CHIRAG K. MALI',
        role: 'Creative Head',
        description: 'Chirag specializes in visual narrative and aesthetic direction. He works closely with our artists to refine the visual language of our productions, pushing the boundaries of cinematic storytelling through meticulous art direction.',
        image: ChiragSvg,
        borderColor: '#FEA800',
        gradient: 'linear-gradient(160deg, rgba(254, 168, 0, 0.95), rgba(0, 0, 0, 0.85))',
    },
    {
        id: 3,
        name: 'PARAS SHARMA',
        role: '3D Generalist',
        description: 'Paras bridges the gap between technical execution and artistic vision. He masters lighting, texturing, and character design to build immersive 3D environments that feel alive and emotionally resonant within the frame.',
        image: ParasSvg,
        borderColor: '#FEA800',
        gradient: 'linear-gradient(150deg, rgba(254, 168, 0, 0.95), rgba(0, 0, 0, 0.85))',
    },
    {
        id: 4,
        name: 'RUPESH GUPTA',
        role: 'Multimedia Artist',
        description: 'Rupesh explores the intersection of digital media and traditional art. He leverages cutting-edge technology to create dynamic multimedia experiences, focusing on interactivity and high-impact visual effects for our global audience.',
        image: RupeshSvg,
        borderColor: '#FEA800',
        gradient: 'linear-gradient(165deg, rgba(254, 168, 0, 0.95), rgba(0, 0, 0, 0.85))',
    },
];

const Team = ({ id = 'team' }: { id?: string }) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [cardPointer, setCardPointer] = useState<Record<number, { x: number; y: number }>>({});
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

    const toggleFlip = (index: number) => {
        if (!isDesktop) {
            setFlippedIndex((prev) => (prev === index ? null : index));
        }
    };

    const handleLeave = () => {
        setHoveredIndex(null);
        setFlippedIndex(null);
    };

    const trackedItems = useMemo(() => teamMembers.slice(0, 4), []);

    return (
        <section
            id={id}
            className="min-h-[100dvh] w-full flex-shrink-0 bg-background text-text flex flex-col items-center justify-center relative px-4 sm:px-8 md:px-12 py-10 overflow-x-hidden"
        >
            {/* Header Independent of Card Positioning */}
            <header className="relative text-center z-20 mb-[7vh] md:mb-[6vh]">
                <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-tight"
                >
                    Team
                </h1>
            </header>

            <div className="w-full max-w-[1350px] relative mx-auto z-30">
                {/* Chroma Grid Interaction Area */}
                <div
                    ref={containerRef}
                    className="relative w-full"
                    onMouseLeave={handleLeave}
                >
                    <div
                        className={`relative z-10 ${isDesktop ? 'grid' : 'flex items-center overflow-x-auto snap-x snap-mandatory py-36 px-[7%] scrollbar-hide'}`}
                        style={{
                            gridTemplateColumns: isDesktop ? 'repeat(4, minmax(0, 1fr))' : 'none',
                            gap: isDesktop ? '60px' : '16px',
                        }}
                    >
                        {trackedItems.map((member, index) => {
                            const isFlipped = flippedIndex === index;
                            const isHovered = hoveredIndex === index;
                            const hasHovered = hoveredIndex !== null;

                            return (
                                <div
                                    key={`${member.name}-${index}`}
                                    className={`relative ${isDesktop ? 'w-full aspect-[4/5]' : 'min-w-[42vw] md:min-w-[35vw] aspect-[4/5] snap-center'} mx-auto transition-all duration-300`}
                                    style={{
                                        perspective: isDesktop ? 'none' : '3000px',
                                        zIndex: isHovered || isFlipped ? 50 : 1
                                    }}
                                >
                                    {isDesktop ? (
                                        /* Desktop Slide-out Layout */
                                        <motion.div
                                            className="w-full h-full relative"
                                            animate={{
                                                x: isHovered ? (index === 3 ? '-100%' : '-20%') : '0%',
                                                filter: hasHovered && !isHovered ? 'blur(1.5px)' : 'blur(0px)',
                                                opacity: hasHovered && !isHovered ? 0.6 : 1,
                                                scale: hasHovered && !isHovered ? 0.96 : 1
                                            }}
                                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                        >
                                            {/* SVG Card */}
                                            <motion.div
                                                className="absolute inset-0 w-full h-full cursor-pointer z-20"
                                                onMouseMove={(event) => {
                                                    const rect = event.currentTarget.getBoundingClientRect();
                                                    setCardPointer((prev) => ({
                                                        ...prev,
                                                        [index]: {
                                                            x: event.clientX - rect.left,
                                                            y: event.clientY - rect.top,
                                                        },
                                                    }));
                                                }}
                                                onMouseEnter={() => setHoveredIndex(index)}
                                            >
                                                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[1.1rem]">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 transition-all duration-700"
                                                    />
                                                    {/* Spotlight Effect */}
                                                    <div
                                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                                        style={{
                                                            backgroundImage: `url(${member.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            maskImage: `radial-gradient(600px circle at ${cardPointer[index]?.x ?? 0}px ${cardPointer[index]?.y ?? 0}px, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.3) 60%, transparent 100%)`,
                                                            WebkitMaskImage: `radial-gradient(600px circle at ${cardPointer[index]?.x ?? 0}px ${cardPointer[index]?.y ?? 0}px, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.3) 60%, transparent 100%)`,
                                                            opacity: isHovered ? 1 : 0,
                                                            transition: 'opacity 0.6s ease-out'
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* Sliding Info Card */}
                                            <motion.div
                                                initial={{ x: '-10%', opacity: 0 }}
                                                animate={{
                                                    x: isHovered ? '70%' : '-10%',
                                                    opacity: isHovered ? 1 : 0
                                                }}
                                                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.05 }}
                                                className="absolute top-[10%] left-0 z-10 rounded-[1.2rem] bg-[#0f0f0f]/95 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl pointer-events-none"
                                                style={{
                                                    width: '150%',
                                                    height: '80%',
                                                    padding: '8% 10%'
                                                }}
                                            >
                                                <img
                                                    src={WatermarkLogo}
                                                    alt=""
                                                    className="absolute inset-0 w-[60%] h-[60%] m-auto object-contain opacity-[0.03] pointer-events-none"
                                                />
                                                <div className="relative z-10 w-full space-y-4">
                                                    <div className="space-y-1">
                                                        <h3 className="text-[#F8F7F2] tracking-tighter leading-none text-3xl font-sans">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-[#CEFE55] uppercase tracking-[0.25em] text-sm">
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                    <div className="w-16 h-[2px] bg-white/10 mx-auto rounded-full" />
                                                    <p className="text-[#F8F7F2]/80 font-sans leading-relaxed text-base text-justify px-2">
                                                        {member.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        /* Mobile Flip Layout */
                                        <motion.div
                                            className="w-full h-full relative cursor-pointer"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ duration: 0.8, type: 'spring', damping: 20, stiffness: 60 }}
                                            style={{ transformStyle: 'preserve-3d' }}
                                            onClick={() => toggleFlip(index)}
                                        >
                                            <div className="absolute inset-0 w-full h-full backface-hidden z-20">
                                                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[1.1rem]">
                                                    <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 w-full h-full rounded-[1.2rem] bg-[#0f0f0f] p-[5%] flex flex-col items-center justify-center backface-hidden shadow-2xl z-10 overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
                                                <img src={WatermarkLogo} alt="" className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain opacity-[0.02] pointer-events-none" />
                                                <div className="w-full max-h-full flex flex-col justify-center items-center relative z-10">
                                                    <div className="text-center mb-2">
                                                        <h3 className="text-[#F8F7F2] tracking-tighter leading-[0.9] font-sans" style={{ fontSize: 'clamp(0.8rem, 3.8vw, 1.1rem)' }}>
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-[#CEFE55] uppercase tracking-[0.1em] mt-1" style={{ fontSize: 'clamp(0.5rem, 1.8vw, 0.6rem)' }}>
                                                            {member.role}
                                                        </p>
                                                    </div>
                                                    <div className="w-8 h-px bg-white/20 mx-auto mb-3" />
                                                    <p
                                                        className="text-[#F8F7F2]/90 font-sans text-justify leading-tight w-full px-1 overflow-y-auto max-h-[140px]"
                                                        style={{
                                                            fontSize: 'clamp(0.5rem, 2.2vw, 0.65rem)',
                                                            hyphens: 'auto',
                                                            WebkitHyphens: 'auto',
                                                            wordBreak: 'break-word',
                                                            textAlignLast: 'center'
                                                        }}
                                                    >
                                                        {member.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Team;
