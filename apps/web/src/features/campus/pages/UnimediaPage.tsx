import { motion } from "motion/react";
import { Newspaper, Sparkles, Megaphone, Users } from "lucide-react";

export function UnimediaPage() {
    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3"
                >
                    <span className="text-brand-navy">UNI</span>
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">MEDIA</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-base sm:text-lg max-w-xl"
                >
                    Campus news, events, and the latest buzz from your university.
                </motion.p>
            </div>

            {/* Coming Soon Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center py-16 sm:py-24"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="relative mb-6"
                >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500" />
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles className="w-6 h-6 text-rose-400" />
                    </motion.div>
                </motion.div>

                {/* Text */}
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">
                    Coming Soon!
                </h2>
                <p className="text-muted-foreground text-center max-w-md px-4 mb-8">
                    We're building something amazing. Stay tuned for campus news, events, and exclusive content.
                </p>

                {/* Features Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                        <Newspaper className="w-6 h-6 text-pink-500 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Campus News</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                        <Megaphone className="w-6 h-6 text-rose-500 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Events</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border border-border/50 col-span-2 sm:col-span-1"
                    >
                        <Users className="w-6 h-6 text-purple-500 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Community</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

