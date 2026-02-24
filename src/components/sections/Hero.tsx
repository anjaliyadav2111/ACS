import { motion } from 'framer-motion';

interface HeroProps {
    id?: string;
    isLandingComplete?: boolean;
}

const HERO_LINES = ['aakrit', 'cinematic', 'solutions'] as const;

const Hero = ({ id = "hero", isLandingComplete = true }: HeroProps) => {
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.22,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 36, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    };

    return (
        <section
            id={id}
            className="relative flex min-h-screen w-screen flex-shrink-0 items-center justify-center overflow-hidden bg-background pt-32"
        >
            <motion.div
                className="relative z-10 flex flex-col items-start text-left"
                variants={containerVariants}
                initial={isLandingComplete ? "visible" : "hidden"}
                animate={isLandingComplete ? "visible" : "hidden"}
            >
                <motion.h1
                    className="flex flex-col items-start justify-center font-display font-bold leading-[0.9] text-white"
                    style={{
                        fontSize: 'clamp(3rem, 15vw, 12rem)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    {HERO_LINES.map((line) => (
                        <motion.span key={line} variants={itemVariants} className="block">
                            {line}
                        </motion.span>
                    ))}
                </motion.h1>
            </motion.div>

        </section>
    );
};

export default Hero;
