import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground tracking-tight">ArogyaAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <span className="text-foreground font-medium hover:text-primary transition-colors cursor-pointer">Login</span>
          </Link>
          <Link href="/signup">
            <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center z-10 relative py-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-primary font-medium w-fit mx-auto lg:mx-0">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Health Analysis</span>
            </div>
            
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight text-foreground">
              Your Personal <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Wellness Assistant
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ArogyaAI uses advanced AI to analyze your symptoms, provide actionable wellness suggestions, and track your health journey in your preferred language.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Generated Image rendering */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-card aspect-video lg:aspect-square flex items-center justify-center">
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-health.png`} 
                alt="ArogyaAI Wellness Background" 
                className="w-full h-full object-cover"
              />
              {/* Glassmorphism card overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ArogyaScore: 92</h3>
                    <p className="text-white/80 text-sm">Excellent health trajectory</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <section className="bg-card py-24 relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "AI Symptom Analysis", desc: "Get instant AI-driven insights on your symptoms and tailored wellness advice." },
            { icon: Globe, title: "Multilingual Support", desc: "Available natively in English, Hindi, and Gujarati for accessible care." },
            { icon: Activity, title: "Health Streaks", desc: "Build healthy habits by checking in daily and monitoring your ArogyaScore." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-background border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
