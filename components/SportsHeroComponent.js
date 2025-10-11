// Make sure you have Framer Motion installed: npm install framer-motion
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa"; // npm install react-icons

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // This will make children animate one after another
    },
  },
};

// Animation variants for child elements
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const SportsHeroContent = () => {
  return (
    <motion.div
      className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Text Content */}
      <div className="space-y-4">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Unleash Your Athletic Spirit
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
          variants={itemVariants}
        >
          Join <strong>NIDASPORTZ 2025 - Season 6</strong> for an exciting season of competition, camaraderie, and celebration across multiple sports.
        </motion.p>
      </div>

      {/* Call to Action & Sport Icons */}
      <motion.div
        className="flex flex-col gap-6 items-center lg:items-start"
        variants={itemVariants}
      >
        <Link href="/sports">
          <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-blue-500/30">
            <span className="relative z-10">Explore Sports</span>
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition duration-500"></div>
          </button>
        </Link>

        {/* Quick Sport Icons */}
        <motion.div className="flex gap-4 items-center pt-2" variants={itemVariants}>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110 cursor-pointer">
            <Image src="/sports/badminton.png" alt="Badminton" width={28} height={28} />
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110 cursor-pointer">
            <Image src="/sports/cricket.png" alt="Cricket" width={28} height={28} />
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110 cursor-pointer">
            <Image src="/sports/pickleball.png" alt="Pickleball" width={28} height={28} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SportsHeroContent;