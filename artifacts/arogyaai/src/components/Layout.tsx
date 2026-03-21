import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LayoutDashboard, HeartPulse, FileText, Lightbulb, User, LogOut, Menu, X, Moon, Sun, Type, Globe } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { t, Language } from '@/lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, theme, setTheme, fontSize, setFontSize, logout, token } = useAppState();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/health-check', label: 'Health Check', icon: HeartPulse },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/tips', label: 'Tips Library', icon: Lightbulb },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  if (!token) {
    return <>{children}</>;
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleFontSize = () => {
    if (fontSize === '14px') setFontSize('16px');
    else if (fontSize === '16px') setFontSize('18px');
    else setFontSize('14px');
  };
  const toggleLanguage = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('gu');
    else setLanguage('en');
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 bg-card border-r border-border shadow-sm z-20 no-print">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">ArogyaAI</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                `}>
                  <item.icon className="w-5 h-5" />
                  {t(item.label, language)}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            {t('Logout', language)}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen print-full">
        {/* Top Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-display font-semibold text-xl capitalize hidden sm:block">
              {t(location.split('/')[1] || 'Dashboard', language).replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium">
              <Globe className="w-4 h-4" />
              <span className="uppercase text-sm">{language}</span>
            </button>
            
            <button onClick={toggleFontSize} className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors" aria-label="Toggle Font Size">
              <Type className="w-4 h-4" />
            </button>
            
            <button onClick={toggleTheme} className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto print-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full print-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  <h1 className="font-display font-bold text-xl">ArogyaAI</h1>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div className={`
                        flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 font-medium
                        ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary'}
                      `}>
                        <item.icon className="w-5 h-5" />
                        {t(item.label, language)}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
