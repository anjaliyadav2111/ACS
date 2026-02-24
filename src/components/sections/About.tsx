import { motion } from 'framer-motion';
import clsx from 'clsx';
import useMediaQuery from '../../hooks/useMediaQuery';

interface AboutProps {
    id?: string;
    className?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const About = ({ id = 'about', className }: AboutProps) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    return (
        <section
            id={id}
            className={clsx(
                "min-h-screen w-screen flex-shrink-0 flex items-center justify-center bg-transparent relative overflow-visible py-12 md:py-20 px-4 md:px-8",
                className
            )}
        >
            <div className="w-full max-w-[1240px] mx-auto relative z-10 flex justify-center items-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.01 }}
                    variants={containerVariants}
                    className="flex flex-col items-center w-full"
                >
                    {/* Strictly Narrow (850px) Glass Container with Professional Airy Layout */}
                    <motion.div
                        variants={itemVariants}
                        className="w-full glass-card !bg-white running-border rounded-[4rem] md:rounded-[6rem] relative pt-24 pb-32 md:pt-32 md:pb-48"
                        style={{ maxWidth: isDesktop ? '850px' : 'calc(100% - 2rem)', backgroundColor: 'white' }}
                    >
                        <div className="flex flex-col items-center relative z-10 px-[10%] md:px-[15%] lg:px-[20%]">
                            {/* Heading - Center Aligned */}
                            <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight uppercase">
                                    About Us
                                </h2>
                                <div className="accent-bar" style={{ width: '100px', height: '4px', opacity: 0.4 }} />
                            </motion.div>

                            {/* Body Text - Airy spacing & Justified alignment */}
                            <div className="flex flex-col space-y-10 md:space-y-14 text-sm md:text-lg lg:text-xl leading-relaxed text-black/95 font-normal text-justify mx-auto w-full">

                                <motion.p variants={itemVariants}>
                                    Aakrit Cinematic Solutions was born from a simple yet powerful thought — to contribute to India’s animation and film industry and show the world its true creative strength. What began as a spark has now evolved into a mission: to build a full-spectrum production house that excels in movies, animation, VFX, 3D visualization, editing, and every craft that brings imagination to life.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    The name Aakrit, rooted in Sanskrit, means “to create”. It represents our cultural foundation and the belief that creation is the most transformative act. Staying grounded in our Sanskriti keeps us humble; our ambition pushes us to innovate, experiment, and deliver on global standards.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    We are architects of imagination, designers of emotion, and creators of immersive experiences. Our vision is bold: To place Indian animation and production on the global map, proving that our industry is not just evolving — it is roaring with potential and brilliance.
                                </motion.p>

                                <motion.p variants={itemVariants}>
                                    At Aakrit Cinematic Solutions, every frame is creation, every project is passion, and every story is a new possibility. From the smallest detail to the final output — excellence is non-negotiable.
                                </motion.p>

                                {/* Taglines - Center Aligned Conclusion */}
                                <motion.div variants={itemVariants} className="mt-8 md:mt-12 text-center w-full">
                                    <div className="flex flex-col gap-y-3 md:gap-y-5 text-xl md:text-2xl lg:text-3xl text-tagline font-bold italic items-center">
                                        <p>This is Aakrit.</p>
                                        <p>Bringing ideas to life.</p>
                                        <p>Pure Cinematic Creation.</p>
                                    </div>
                                    <div className="h-[2px] w-full max-w-[300px] mx-auto bg-[#FEA800]/20 mt-10" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
