"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  className?: string;
}

// Animation variants for consistent animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden ${className || ""}`}>
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
          }
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, -100, 0],
                  y: [0, 50, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 25,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
          }
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                }
          }
          transition={
            shouldReduceMotion
              ? {}
              : {
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
          }
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>Modern Full-Stack Starter</span>
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              style={{ animationDelay: "1s" }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight"
        >
          Codeguide Starter
          <br />
          <motion.span
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-6xl bg-gradient-to-r from-cyan-600 via-teal-600 to-green-600 bg-clip-text text-transparent"
          >
            Fullstack
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          A modern full-stack TypeScript starter with authentication, database, and UI components.
          Build beautiful, scalable applications with the best developer experience.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.div
            whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
            whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                Get Started
                <motion.div
                  variants={floatingVariants}
                  initial="initial"
                  animate="animate"
                  style={{ display: "inline-block" }}
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={!shouldReduceMotion ? { scale: 1.05 } : undefined}
            whileTap={!shouldReduceMotion ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
          >
            <Link href="/sign-in">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 px-8 py-6 text-lg font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={!shouldReduceMotion ? {
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            } : undefined}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
              </div>
              <p className="text-muted-foreground">
                Built with Next.js 15 and Turbopack for ultimate performance
              </p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={!shouldReduceMotion ? {
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            } : undefined}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: "0.5s" }}
                  className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-semibold text-lg">Secure Auth</h3>
              </div>
              <p className="text-muted-foreground">
                Modern authentication with Better Auth and type-safe sessions
              </p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={!shouldReduceMotion ? {
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            } : undefined}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: "1s" }}
                  className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-semibold text-lg">Beautiful UI</h3>
              </div>
              <p className="text-muted-foreground">
                Stunning components with shadcn/ui and Tailwind CSS
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;