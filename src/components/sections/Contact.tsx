import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface ContactProps {
    id?: string;
    className?: string;
}

const Contact = ({ id = "contact", className }: ContactProps) => {
    const [status, setStatus] = useState<'idle' | 'success'>('idle');
    const timeoutRef = useRef<number | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('success');

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            setStatus('idle');
        }, 4000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <section
            id={id}
            className={clsx(
                "h-[100dvh] w-screen flex items-center justify-center bg-background flex-shrink-0 relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-10",
                className
            )}
        >
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

            <div className="max-w-7xl w-full px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-16">
                    {/* Left: Title & Contact Info */}
                    <div className="md:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-accent text-xs uppercase tracking-[0.3em] font-mono mb-8 block">Get in Touch</span>
                            <h2 className="text-display-md font-display font-bold text-text mb-12 leading-tight">
                                Let's Create<br />
                                <span className="text-accent">Together</span>
                            </h2>

                            <div className="space-y-8">
                                {/* Contact info removed as per request */}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Minimal Form */}
                    <div className="md:col-span-7">
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="w-full bg-transparent border-b-2 border-border py-4 text-text placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full bg-transparent border-b-2 border-border py-4 text-text placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Project Type"
                                    className="w-full bg-transparent border-b-2 border-border py-4 text-text placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your project"
                                    className="w-full bg-transparent border-b-2 border-border py-4 text-text placeholder:text-muted focus:border-accent focus:outline-none transition-colors resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="group flex items-center gap-3 px-8 py-4 bg-accent text-background font-medium uppercase tracking-wider text-sm hover:bg-opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-[1.02]"
                            >
                                <span>Send Message</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>

                            {status === 'success' && (
                                <p className="text-accent text-sm uppercase tracking-[0.3em]">
                                    Message queued — we’ll reply within 24 hours.
                                </p>
                            )}
                        </motion.form>
                    </div>
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-20 text-center"
                >
                    <p className="text-muted text-sm">© 2024 Aarkit Cinematic Solutions. All rights reserved.</p>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
