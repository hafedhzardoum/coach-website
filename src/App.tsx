import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  MessageCircle
} from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { cn } from './lib/utils';

// --- Components ---

const OnboardingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', goal: '', experience: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'onboardingSubmissions'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting onboarding:", err);
      alert("Something went wrong. Please try again.");
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
                <h4 className="text-3xl font-black text-white mb-4">YOU'RE ON THE LIST!</h4>
                <p className="text-gray-400 mb-8">I'll review your details and reach out within 24 hours to schedule your strategy call.</p>
                <button 
                  onClick={onClose}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-white mb-2">START YOUR JOURNEY</h3>
                <p className="text-gray-400 mb-8">Tell me a bit about yourself so we can hit the ground running.</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Primary Goal</label>
                    <select 
                      required
                      value={formData.goal}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none appearance-none"
                    >
                      <option value="">Select a goal</option>
                      <option value="fat-loss">Fat Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="strength">Strength & Power</option>
                      <option value="lifestyle">General Health</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({...formData, experience: lvl})}
                          className={cn(
                            "py-3 rounded-xl text-xs font-bold border transition-all",
                            formData.experience === lvl ? "bg-yellow-400 border-yellow-400 text-black" : "bg-black border-white/10 text-gray-400 hover:border-white/20"
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    disabled={isSubmitting || !formData.experience || !formData.goal}
                    className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-lg mt-4 hover:bg-yellow-300 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "SUBMITTING..." : "GET MY PLAN"}
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

const Navbar = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Results', href: '#results' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="text-yellow-400 w-8 h-8" />
          HZ<span className="text-yellow-400">FIT</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onOpenOnboarding}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition-all transform hover:scale-105"
          >
            START NOW
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
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
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-yellow-400"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onOpenOnboarding(); }}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-center"
            >
              START COACHING
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Visual */}
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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            Accepting New Clients
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6 tracking-tighter">
            TRANSFORM <br />
            <span className="text-yellow-400">YOUR BODY.</span> <br />
            OWN YOUR LIFE.
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
            Elite online coaching and personal training designed for high-performers who demand real results. No fluff, just science-backed transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onOpenOnboarding}
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all transform hover:scale-105"
            >
              START COACHING <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#services" className="border border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
              VIEW PROGRAMS
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
              <p className="text-sm text-gray-400"><span className="text-white font-bold">500+</span> Lives Transformed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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

const About = () => {
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
            <img 
              src="/profile.jpg" 
              alt="Coach" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-yellow-400 p-8 rounded-3xl hidden md:block">
            <p className="text-black font-black text-4xl leading-none">6+</p>
            <p className="text-black/60 font-bold text-sm uppercase tracking-wider">Years Experience</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">The Coach</h2>
          <h3 className="text-5xl font-black text-white mb-8 leading-tight">
            I'M COACH HAFEDH. <br />
            I HELP YOU BREAK LIMITS.
          </h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            After a decade in the fitness industry, I've seen it all. The fad diets, the "magic" pills, and the over-complicated routines. My mission is simple: to provide you with the most efficient, science-based path to your dream physique.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "ISSA Certified" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Certified Personal Trainer" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Strength and Conditioning trainer" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Transformation Expert" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-white font-bold">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 italic border-l-4 border-yellow-400 pl-6 py-2 mb-10">
            "Fitness isn't just about how you look; it's about the discipline you build that carries over into every area of your life."
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 text-white font-black hover:text-yellow-400 transition-colors group">
            LEARN MORE ABOUT MY METHOD <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSecondary = () => {
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
            <img 
              src="/profile22.JPG" 
              alt="Coach" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-yellow-400 p-8 rounded-3xl hidden md:block">
            <p className="text-black font-black text-4xl leading-none">10+</p>
            <p className="text-black/60 font-bold text-sm uppercase tracking-wider">Years Experience</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">The Coach</h2>
          <h3 className="text-5xl font-black text-white mb-8 leading-tight">
            I'M COACH HAMZA. <br />
            I HELP YOU BREAK LIMITS.
          </h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            After a decade in the fitness industry, I've seen it all. The fad diets, the "magic" pills, and the over-complicated routines. My mission is simple: to provide you with the most efficient, science-based path to your dream physique.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "IFAT Certified" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Certified Personal Trainer" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Strength and Conditioning trainer" },
              { icon: <CheckCircle2 className="text-yellow-400" />, text: "Transformation Expert" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-white font-bold">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 italic border-l-4 border-yellow-400 pl-6 py-2 mb-10">
            "Fitness isn't just about how you look; it's about the discipline you build that carries over into every area of your life."
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 text-white font-black hover:text-yellow-400 transition-colors group">
            LEARN MORE ABOUT MY METHOD <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Services = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {

  const services = [
    {
      title: "Online Coaching",
      desc: "Full lifestyle transformation from anywhere in the world. Includes custom nutrition, training, and 24/7 support.",
      icon: <Users className="w-10 h-10" />,
      features: ["Custom Meal Plans", "Weekly Check-ins", "Form Analysis", "Video Tutorials"]
    },
    {
      title: "Personal Training",
      desc: "One-on-one sessions at our elite facility. Focused on technique, intensity, and immediate results.",
      icon: <Dumbbell className="w-10 h-10" />,
      features: ["1-on-1 Sessions", "In-person Guidance", "Equipment Access", "Accountability"]
    },
    {
      title: "Workout Plans",
      desc: "Professional training programs tailored to your specific goals and equipment availability.",
      icon: <Target className="w-10 h-10" />,
      features: ["Goal Specific", "Video Tutorials", "Progress Tracking", "PDF Guides"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">Our Services</h2>
          <h3 className="text-5xl font-black text-white">CHOOSE YOUR PATH</h3>
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
              <p className="text-gray-400 mb-8 leading-relaxed">
                {service.desc}
              </p>
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
                GET STARTED
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Results = () => {
  const transformations = [
    {
      name: "Mark R.",
      goal: "Fat Loss",
      time: "12 Weeks",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Sarah L.",
      goal: "Muscle Gain",
      time: "16 Weeks",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "James K.",
      goal: "Strength",
      time: "24 Weeks",
      img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop"
    }
  ];

  return (
    <section id="results" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">Transformations</h2>
            <h3 className="text-5xl font-black text-white">REAL PEOPLE. REAL RESULTS.</h3>
          </div>
          <p className="text-gray-400 max-w-md">
            The proof is in the results. Join hundreds of clients who have completely overhauled their bodies and mindsets.
          </p>
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
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">{item.goal} • {item.time}</p>
                <h4 className="text-2xl font-black text-white">{item.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-zinc-900 border border-white/5 p-12 rounded-[3rem] relative overflow-hidden">
          <Quote className="absolute top-10 right-10 w-32 h-32 text-white/5" />
          <div className="max-w-3xl relative z-10">
            <div className="flex text-yellow-400 gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
              "Working with Coach Hafedh was the best investment I've ever made. I lost 15kg in 4 months and gained a level of confidence I never thought possible. The system just works."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black text-xl">
                A
              </div>
              <div>
                <p className="text-white font-black">Aymen</p>
                <p className="text-gray-500 text-sm">Online Coaching Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onOpenOnboarding }: { onOpenOnboarding: () => void }) => {

  const plans = [
    {
      name: "6 Weeks",
      price: "160",
      desc: "Perfect for those who need a solid plan to follow independently.",
      features: ["Custom Workout Plan", "Nutrition Guide", "Video Tutorials", "Monthly Updates"],
      popular: false
    },
    {
      name: "12 Weeks",
      price: "320",
      desc: "Our most popular plan for serious transformation and support.",
      features: ["Everything in 6 Weeks", "Weekly Check-ins", "Form Analysis", "24/7 Chat Support", "Supplement Plan"],
      popular: true
    },
    {
      name: "20 Weeks",
      price: "600",
      desc: "Maximum accountability and 1-on-1 focus for elite results.",
      features: ["Everything in 12 Weeks", "Daily Check-ins", "Video Call Coaching", "Custom Competition Prep", "Priority Support"],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">Pricing</h2>
          <h3 className="text-5xl font-black text-white">INVEST IN YOURSELF</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative p-10 rounded-3xl flex flex-col border",
                plan.popular ? "bg-white text-black border-white scale-105 z-10" : "bg-zinc-900 text-white border-white/5"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h4 className="text-xl font-black uppercase tracking-widest mb-2">{plan.name}</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-6xl font-black">{plan.price}</span>
                <span className="text-2xl font-black">TND</span>
              </div>
              <p className={cn("mb-8 leading-relaxed font-medium", plan.popular ? "text-black/70" : "text-gray-400")}>
                {plan.desc}
              </p>
              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <CheckCircle2 className={cn("w-5 h-5", plan.popular ? "text-black" : "text-yellow-400")} />
                    <span className="font-bold text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={onOpenOnboarding}
                className={cn(
                  "block w-full text-center py-4 rounded-xl font-black text-sm transition-all",
                  plan.popular ? "bg-black text-white hover:bg-zinc-800" : "bg-yellow-400 text-black hover:bg-yellow-300"
                )}
              >
                CHOOSE PLAN
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-yellow-400 font-black text-sm uppercase tracking-[0.2em] mb-4">Contact</h2>
            <h3 className="text-5xl font-black text-white mb-8">LET'S START YOUR TRANSFORMATION</h3>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Ready to take the first step? Fill out the form or reach out directly. I'll get back to you within 24 hours to schedule your initial consultation.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Email Me</p>
                  <p className="text-white font-bold text-lg">coachhafedh@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Call Me</p>
                  <p className="text-white font-bold text-lg">+216 54838259</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-yellow-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Location</p>
                  <p className="text-white font-bold text-lg">Beni Khiar, Nabeul, Tunisia</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all">
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
                <h4 className="text-3xl font-black text-white mb-4">MESSAGE SENT!</h4>
                <p className="text-gray-400">Thank you for reaching out. I'll be in touch very soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-yellow-400 font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Your Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell me about your goals..."
                    className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-black py-5 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "SENDING..." : <>SEND MESSAGE <Send className="w-5 h-5" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <a href="#" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="text-yellow-400 w-8 h-8" />
          HZ<span className="text-yellow-400">FIT</span>
        </a>
        
        <div className="flex gap-8">
          <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Terms of Service</a>
        </div>

        <p className="text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} Hafedh Fitness. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/21654838259" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
    </a>
  );
};

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
        "fixed bottom-28 right-8 z-40 bg-zinc-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
    >
      <ChevronRight className="w-6 h-6 -rotate-90" />
    </button>
  );
};

// --- Main App ---

export default function App() {
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
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-6"
            >
              <Dumbbell className="w-20 h-20 text-yellow-400" />
            </motion.div>
            <h2 className="text-2xl font-black tracking-widest text-white">HZ<span className="text-yellow-400">FIT</span></h2>
            <div className="mt-8 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
    </div>
  );
}
