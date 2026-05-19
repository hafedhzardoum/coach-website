import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import {
  Dumbbell,
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  X,
  ChevronRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { cn } from './lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider, useLang } from './LanguageContext';
import type { Lang } from './i18n';

// --- Language Switcher ---

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const options: { code: Lang; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-bold text-gray-300 hover:text-yellow-400 transition-colors"
      >
        <Globe className="w-4 h-4" />
        {lang.toUpperCase()}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 min-w-[80px]"
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => { setLang(opt.code); setOpen(false); }}
                className={cn(
                  'w-full px-4 py-2 text-sm font-bold text-left hover:bg-yellow-400 hover:text-black transition-colors',
                  lang === opt.code ? 'text-yellow-400' : 'text-gray-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Onboarding Modal ---

const OnboardingModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', goal: '', experience: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setError('');
      const q = query(collection(db, 'onboardingSubmissions'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError(t('modal_duplicate_email'));
        setIsSubmitting(false);
        return;
      }
      await addDoc(collection(db, 'onboardingSubmissions'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting onboarding:', err);
      setError(t('error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-zinc-900 border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-3xl font-black text-white mb-4">{t('modal_success_title')}</h4>
                <p className="text-gray-400 mb-8">{t('modal_success_desc')}</p>
                <button onClick={onClose} className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black">
                  {t('modal_close')}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-white mb-2">{t('modal_title')}</h3>
                <p className="text-gray-400 mb-8">{t('modal_subtitle')}</p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t('modal_name')}</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t('modal_email')}</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t('modal_goal')}</label>
                    <select
                      required
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none appearance-none"
                    >
                      <option value="">{t('modal_goal_placeholder')}</option>
                      <option value="fat-loss">{t('modal_goal_fat')}</option>
                      <option value="muscle-gain">{t('modal_goal_muscle')}</option>
                      <option value="strength">{t('modal_goal_strength')}</option>
                      <option value="lifestyle">{t('modal_goal_health')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{t('modal_experience')}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['modal_beginner', 'modal_intermediate', 'modal_advanced'] as const).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, experience: key })}
                          className={cn(
                            'py-3 rounded-xl text-xs font-bold border transition-all',
                            formData.experience === key
                              ? 'bg-yellow-400 border-yellow-400 text-black'
                              : 'bg-black border-white/10 text-gray-400 hover:border-white/20'
                          )}
                        >
                          {t(key)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    disabled={isSubmitting || !formData.experience || !formData.goal}
                    className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-lg mt-4 hover:bg-yellow-300 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? t('modal_submitting') : t('modal_submit')}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Navbar ---

const Navbar = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {
  const { t } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'nav_about', href: '#about' },
    { key: 'nav_services', href: '#services' },
    { key: 'nav_results', href: '#results' },
    { key: 'nav_pricing', href: '#pricing' },
    { key: 'nav_contact', href: '#contact' },
  ] as const;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="text-yellow-400 w-8 h-8" />
          HZ<span className="text-yellow-400">FIT</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.key} href={link.href} className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors">
              {t(link.key)}
            </a>
          ))}
          <LanguageSwitcher />
          <button
            onClick={onOpenOnboarding}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition-all transform hover:scale-105"
          >
            {t('nav_start_now')}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-yellow-400"
              >
                {t(link.key)}
              </a>
            ))}
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenOnboarding(); }}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-center"
            >
              {t('nav_start_coaching')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero ---

const Hero = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {
  const { t } = useLang();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          alt="Gym Background"
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            {t('hero_badge')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
            {t('hero_title_1')} <br />
            <span className="text-yellow-400">{t('hero_title_2')}</span> <br />
            {t('hero_title_3')}
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">{t('hero_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenOnboarding}
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all transform hover:scale-105"
            >
              {t('hero_cta_primary')} <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#services"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
            >
              {t('hero_cta_secondary')}
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-black overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Client" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex text-yellow-400 gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-bold">500+</span> {t('hero_social_proof')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-yellow-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

// --- About (Hafedh) ---

const About = () => {
  const { t } = useLang();

  return (
    <section id="about" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
            <img src="/profile.jpg" alt="Coach" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-yellow-400 p-8 rounded-3xl hidden md:block">
            <p className="text-black font-black text-4xl leading-none">6+</p>
            <p className="text-black/60 font-bold text-sm uppercase tracking-wider">{t('about_years')}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('about_label')}</h2>
          <h3 className="text-5xl font-black text-white mb-8 leading-tight whitespace-pre-line">{t('about_title')}</h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">{t('about_desc')}</p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {(['about_cert_1', 'about_cert_2', 'about_cert_3', 'about_cert_4'] as const).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-400" />
                <span className="text-white font-bold">{t(key)}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 italic border-l-4 border-yellow-400 pl-6 py-2 mb-10">{t('about_quote')}</p>
          <a href="#contact" className="inline-flex items-center gap-2 text-white font-black hover:text-yellow-400 transition-colors group">
            {t('about_learn_more')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- About Secondary (Hamza) ---

const AboutSecondary = () => {
  const { t } = useLang();

  return (
    <section id="about-secondary" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
            <img src="/profile22.JPG" alt="Coach" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-yellow-400 p-8 rounded-3xl hidden md:block">
            <p className="text-black font-black text-4xl leading-none">10+</p>
            <p className="text-black/60 font-bold text-sm uppercase tracking-wider">{t('about_years')}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('about_label')}</h2>
          <h3 className="text-5xl font-black text-white mb-8 leading-tight whitespace-pre-line">{t('about2_title')}</h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">{t('about_desc')}</p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {(['about2_cert_1', 'about_cert_2', 'about_cert_3', 'about_cert_4'] as const).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <CheckCircle2 className="text-yellow-400" />
                <span className="text-white font-bold">{t(key)}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 italic border-l-4 border-yellow-400 pl-6 py-2 mb-10">{t('about_quote')}</p>
          <a href="#contact" className="inline-flex items-center gap-2 text-white font-black hover:text-yellow-400 transition-colors group">
            {t('about_learn_more')} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- Services ---

const Services = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {
  const { t } = useLang();

  const services = [
    {
      title: t('service1_title'),
      desc: t('service1_desc'),
      icon: <Users className="w-10 h-10" />,
      features: [t('service1_f1'), t('service1_f2'), t('service1_f3'), t('service1_f4')],
    },
    {
      title: t('service2_title'),
      desc: t('service2_desc'),
      icon: <Dumbbell className="w-10 h-10" />,
      features: [t('service2_f1'), t('service2_f2'), t('service2_f3'), t('service2_f4')],
    },
    {
      title: t('service3_title'),
      desc: t('service3_desc'),
      icon: <Target className="w-10 h-10" />,
      features: [t('service3_f1'), t('service3_f2'), t('service3_f3'), t('service3_f4')],
    },
  ];

  return (
    <section id="services" className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('services_label')}</h2>
          <h3 className="text-5xl font-black text-white">{t('services_title')}</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 border border-white/5 p-10 rounded-3xl hover:border-yellow-400/30 transition-all group"
            >
              <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>
              <h4 className="text-2xl font-black text-white mb-4">{service.title}</h4>
              <p className="text-gray-400 mb-8 leading-relaxed">{service.desc}</p>
              <ul className="space-y-3 mb-10">
                {service.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onOpenOnboarding}
                className="block w-full text-center py-4 rounded-xl border border-white/10 text-white font-bold group-hover:bg-yellow-400 group-hover:text-black group-hover:border-yellow-400 transition-all"
              >
                {t('service_get_started')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Results ---

const Results = () => {
  const { t } = useLang();

  const transformations = [
    {
      name: 'Mark R.',
      goal: t('results_goal1'),
      time: '12 Weeks',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'Sarah L.',
      goal: t('results_goal2'),
      time: '16 Weeks',
      img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'James K.',
      goal: t('results_goal3'),
      time: '24 Weeks',
      img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop',
    },
  ];

  return (
    <section id="results" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('results_label')}</h2>
            <h3 className="text-5xl font-black text-white">{t('results_title')}</h3>
          </div>
          <p className="text-gray-400 max-w-md">{t('results_desc')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {transformations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-3xl"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                  {item.goal} • {item.time}
                </p>
                <h4 className="text-2xl font-black text-white">{item.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-zinc-900 border border-white/5 p-12 rounded-[3rem] relative overflow-hidden">
          <Quote className="absolute top-10 right-10 w-32 h-32 text-white/5" />
          <div className="max-w-3xl relative z-10">
            <div className="flex text-yellow-400 gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">{t('results_testimonial')}</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-xl">
                A
              </div>
              <div>
                <p className="text-white font-black">Aymen</p>
                <p className="text-gray-500 text-sm">{t('results_client_role')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Pricing ---

const Pricing = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {
  const { t } = useLang();

  const plans = [
    {
      name: t('plan1_name'),
      price: '160',
      desc: t('plan1_desc'),
      features: [t('plan1_f1'), t('plan1_f2'), t('plan1_f3'), t('plan1_f4')],
      popular: false,
    },
    {
      name: t('plan2_name'),
      price: '320',
      desc: t('plan2_desc'),
      features: [t('plan2_f1'), t('plan2_f2'), t('plan2_f3'), t('plan2_f4'), t('plan2_f5')],
      popular: true,
    },
    {
      name: t('plan3_name'),
      price: '600',
      desc: t('plan3_desc'),
      features: [t('plan3_f1'), t('plan3_f2'), t('plan3_f3'), t('plan3_f4'), t('plan3_f5')],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('pricing_label')}</h2>
          <h3 className="text-5xl font-black text-white">{t('pricing_title')}</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                'relative p-10 rounded-3xl flex flex-col border',
                plan.popular ? 'bg-white text-black border-white scale-105 z-10' : 'bg-zinc-900 text-white border-white/5'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {t('pricing_popular')}
                </div>
              )}
              <h4 className="text-xl font-black uppercase tracking-widest mb-2">{plan.name}</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-6xl font-black">{plan.price}</span>
                <span className="text-2xl font-black">TND</span>
              </div>
              <p className={cn('mb-8 leading-relaxed font-medium', plan.popular ? 'text-black/70' : 'text-gray-400')}>
                {plan.desc}
              </p>
              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <CheckCircle2 className={cn('w-5 h-5', plan.popular ? 'text-black' : 'text-yellow-400')} />
                    <span className="font-bold text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onOpenOnboarding}
                className={cn(
                  'block w-full text-center py-4 rounded-xl font-black text-sm transition-all',
                  plan.popular ? 'bg-black text-white hover:bg-zinc-800' : 'bg-yellow-400 text-black hover:bg-yellow-300'
                )}
              >
                {t('pricing_choose')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact ---

const Contact = () => {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(t('error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">{t('contact_label')}</h2>
            <h3 className="text-5xl font-black text-white mb-8">{t('contact_title')}</h3>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">{t('contact_desc')}</p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{t('contact_email_label')}</p>
                  <p className="text-white font-bold text-lg">coachhafedh@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{t('contact_phone_label')}</p>
                  <p className="text-white font-bold text-lg">+216 54838259</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{t('contact_location_label')}</p>
                  <p className="text-white font-bold text-lg">{t('contact_location_value')}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-10 rounded-[3rem] border border-white/5">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-3xl font-black text-white mb-4">{t('contact_success_title')}</h4>
                <p className="text-gray-400">{t('contact_success_desc')}</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-yellow-400 font-bold hover:underline">
                  {t('contact_send_another')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{t('contact_name')}</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('placeholder_name')}
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{t('contact_email')}</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('placeholder_email')}
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{t('contact_message')}</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact_message_placeholder')}
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-black py-5 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? t('contact_sending') : <>{t('contact_send')} <Send className="w-5 h-5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="bg-black py-12 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <a href="#" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="text-yellow-400 w-8 h-8" />
          HZ<span className="text-yellow-400">FIT</span>
        </a>
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">{t('footer_privacy')}</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">{t('footer_terms')}</a>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} Hafedh Fitness. {t('footer_rights')}
        </p>
      </div>
    </footer>
  );
};

// --- WhatsApp & Scroll ---

const WhatsAppButton = () => (
  <a
    href="https://wa.me/21654838259"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
  >
    <MessageCircle className="w-8 h-8 fill-current" />
  </a>
);

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-28 right-8 z-40 bg-zinc-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
    >
      <ChevronRight className="w-6 h-6 -rotate-90" />
    </button>
  );
};

// --- Main App ---

function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-white font-sans selection:bg-yellow-400 selection:text-black">
      <AnimatePresence>
        {loading && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-6"
            >
              <Dumbbell className="w-20 h-20 text-yellow-400" />
            </motion.div>
            <h2 className="text-2xl font-black tracking-widest text-white">
              HZ<span className="text-yellow-400">FIT</span>
            </h2>
            <div className="mt-8 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-full h-full bg-yellow-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar onOpenOnboarding={() => setIsOnboardingOpen(true)} />
      <main>
        <Hero onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        <About />
        <AboutSecondary />
        <Services onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        <Results />
        <Pricing onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        <Contact />
      </main>
      <Footer />

      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <WhatsAppButton />
      <ScrollToTop />
      <SpeedInsights />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
