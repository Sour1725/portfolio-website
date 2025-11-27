import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Code, 
  Terminal, 
  Cpu, 
  Zap, 
  Globe, 
  ChevronDown, 
  ExternalLink, 
  Sparkles,
  Link as LinkIcon,
  FileText
} from 'lucide-react';

const App = () => {
  const [magicMode, setMagicMode] = useState(false);

  // --- GLOBAL STYLES & FONTS ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
      
      body {
        background-color: #050505;
        overflow-x: hidden;
        @media (min-width: 768px) {
          cursor: none;
        }
      }

      /* Custom Scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #0a0a0f; }
      ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }

      /* Animations */
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes glitch-anim {
        0% { clip: rect(32px, 9999px, 12px, 0); }
        20% { clip: rect(68px, 9999px, 86px, 0); }
        40% { clip: rect(12px, 9999px, 45px, 0); }
        60% { clip: rect(89px, 9999px, 5px, 0); }
        80% { clip: rect(55px, 9999px, 2px, 0); }
        100% { clip: rect(12px, 9999px, 86px, 0); }
      }
      @keyframes glitch-anim2 {
        0% { clip: rect(12px, 9999px, 78px, 0); }
        20% { clip: rect(84px, 9999px, 12px, 0); }
        40% { clip: rect(45px, 9999px, 32px, 0); }
        60% { clip: rect(2px, 9999px, 68px, 0); }
        80% { clip: rect(98px, 9999px, 44px, 0); }
        100% { clip: rect(34px, 9999px, 11px, 0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className={`min-h-screen font-['Rajdhani'] transition-colors duration-1000 ${magicMode ? 'selection:bg-[#bc13fe] selection:text-white' : 'selection:bg-[#00f3ff] selection:text-white'}`}>
      <CustomCursor magicMode={magicMode} />
      <Background magicMode={magicMode} />
      <Navbar magicMode={magicMode} setMagicMode={setMagicMode} />
      
      <main className="relative z-10">
        <Hero magicMode={magicMode} />
        <About magicMode={magicMode} />
        <Projects magicMode={magicMode} />
        <Skills magicMode={magicMode} />
      </main>

      <Footer magicMode={magicMode} />
    </div>
  );
};

export default App;

// --- HOOKS ---

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = ev => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

const useOnScreen = (ref, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [ref, rootMargin]);
  return isIntersecting;
};

// --- COMPONENTS ---

const CustomCursor = ({ magicMode }) => {
  const { x, y } = useMousePosition();
  const cursorRef = useRef(null);

  useEffect(() => {
    if(cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    }
  }, [x, y]);

  return (
    <div 
      ref={cursorRef}
      className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-screen transition-colors duration-300
      ${magicMode ? 'bg-[#bc13fe] shadow-[0_0_30px_#bc13fe]' : 'bg-[#00f3ff] shadow-[0_0_20px_#00f3ff]'}
      opacity-70 blur-sm hidden md:block`}
    />
  );
};

const Background = ({ magicMode }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      <div 
        className={`absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] 
        bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]
        transition-all duration-1000 ${magicMode ? 'opacity-40 bg-[size:3rem_3rem]' : 'opacity-20'}`}
      />
      <div className={`absolute top-0 left-1/4 w-96 h-96 bg-[#00f3ff]/20 rounded-full blur-[128px] animate-pulse`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-[#bc13fe]/10 rounded-full blur-[128px] animate-pulse`} />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none"></div>
    </div>
  );
};

const MagneticButton = ({ children, className, onClick, magicMode, href }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={buttonRef}
      onClick={onClick}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`relative px-8 py-3 font-['Orbitron'] font-bold uppercase tracking-wider text-sm transition-all duration-200 inline-flex items-center justify-center
      border ${magicMode ? 'border-[#bc13fe] text-[#bc13fe] hover:bg-[#bc13fe]/10 shadow-[0_0_20px_rgba(188,19,254,0.4)]' : 'border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff]/10 shadow-[0_0_20px_rgba(0,243,255,0.4)]'}
      backdrop-blur-md group rounded-sm overflow-hidden cursor-pointer ${className || ''}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out 
        ${magicMode ? 'bg-gradient-to-t from-[#bc13fe]/20 to-transparent' : 'bg-gradient-to-t from-[#00f3ff]/20 to-transparent'}`} 
      />
    </Component>
  );
};

const TiltCard = ({ children, magicMode }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out' 
      }}
      className={`relative p-6 rounded-xl border backdrop-blur-md overflow-hidden group h-full
      ${magicMode ? 'border-[#bc13fe]/30 bg-[#12121a]/80 hover:border-[#bc13fe]' : 'border-[#00f3ff]/30 bg-[#12121a]/80 hover:border-[#00f3ff]'}
      transition-colors duration-300`}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

const Navbar = ({ magicMode, setMagicMode }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="font-['Orbitron'] font-bold text-2xl tracking-widest flex items-center gap-2">
          <span className={magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'}>SOURAV</span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${magicMode ? 'bg-[#bc13fe]' : 'bg-[#00f3ff]'}`} />
        </div>

        <div className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide text-gray-300">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Resume</a>
          <button 
            onClick={() => setMagicMode(!magicMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500
            ${magicMode ? 'border-[#bc13fe] text-[#bc13fe] shadow-[0_0_15px_#bc13fe]' : 'border-white/20 hover:border-[#00f3ff] hover:text-[#00f3ff]'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">{magicMode ? 'MAGIC ON' : 'ENABLE MAGIC'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ magicMode }) => {
  const glitchStyle = { position: 'relative' };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <div className={`inline-block px-3 py-1 text-xs font-bold tracking-[0.2em] border rounded-full mb-4
            ${magicMode ? 'border-[#bc13fe] text-[#bc13fe]' : 'border-[#00f3ff] text-[#00f3ff]'}`}>
            SYSTEM_ONLINE // V.2.0.24
          </div>
          
          <h1 className="font-['Orbitron'] text-5xl md:text-7xl font-bold leading-tight">
            <span className="block text-white mb-2">HELLO, I AM</span>
            <span 
              className={`block ${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'}`}
              style={glitchStyle}
            >
              <span className="glitch-text" data-text="SOURAV SHARMA">SOURAV SHARMA</span>
            </span>
          </h1>
          
          <p className="font-sans text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
            Passionate Frontend Developer skilled in building responsive, scalable, and modern web applications. 
            Strong in UI/UX, API integration, and writing clean, maintainable code.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <MagneticButton magicMode={magicMode} href="#projects">
              View Work <Code className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton magicMode={magicMode} href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume <FileText className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton magicMode={magicMode} className="!bg-transparent" href="mailto:souravdev172004@gmail.com">
              Contact Me <Mail className="w-4 h-4" />
            </MagneticButton>
          </div>

          <div className="flex gap-6 pt-8 text-gray-500">
            <a href="https://github.com/sourav-sharma" className={`hover:${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'} transition-colors`}><Github /></a>
            <a href="https://linkedin.com/in/sourav-sharma" className={`hover:${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'} transition-colors`}><Linkedin /></a>
          </div>
        </div>

        <div className="relative hidden lg:block h-[500px]">
              <div className={`absolute inset-0 bg-gradient-to-tr ${magicMode ? 'from-[#bc13fe]/20' : 'from-[#00f3ff]/20'} to-transparent rounded-full blur-[100px] animate-pulse`} />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 perspective-1000">
                <div className="relative w-full h-full animate-[spin_10s_linear_infinite] preserve-3d">
                    <div className={`absolute inset-0 border-2 ${magicMode ? 'border-[#bc13fe] shadow-[0_0_30px_#bc13fe]' : 'border-[#00f3ff] shadow-[0_0_30px_#00f3ff]'} opacity-50 rounded-lg transform translate-z-[50px]`} />
                    <div className={`absolute inset-0 border-2 ${magicMode ? 'border-[#bc13fe]' : 'border-[#00f3ff]'} opacity-30 rounded-lg transform rotate-x-90 translate-z-[50px]`} />
                    <div className={`absolute inset-0 border-2 ${magicMode ? 'border-[#bc13fe]' : 'border-[#00f3ff]'} opacity-30 rounded-lg transform rotate-y-90 translate-z-[50px]`} />
                </div>
              </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
        <ChevronDown />
      </div>
    </section>
  );
};

const About = ({ magicMode }) => {
  const ref = useRef();
  const onScreen = useOnScreen(ref);

  const stats = [
    { label: "Years Exp", value: "02+" },
    { label: "Projects", value: "10+" },
    { label: "Clients", value: "04+" },
    { label: "Certificates", value: "02" },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${onScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <h2 className="font-['Orbitron'] text-3xl font-bold mb-8 text-white">Mission Log</h2>
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:h-full before:w-px before:bg-white/10">
              {[
                { year: "2024-25", title: "Java Full Stack Dev", company: "DUCAT" },
                { year: "2023-Present", title: "Web Developer", company: "Self Projects" },
                { year: "2023-26", title: "BCA", company: "IGNOU" }
              ].map((item, i) => (
                <div key={i} className="relative pl-10 group">
                  <div className={`absolute left-[9px] top-2 w-1.5 h-1.5 rounded-full ${magicMode ? 'bg-[#bc13fe]' : 'bg-[#00f3ff]'} shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`} />
                  <span className={`text-sm font-mono ${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'}`}>{item.year}</span>
                  <h4 className="text-xl font-bold text-white mt-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.company}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-['Orbitron'] text-4xl font-bold mb-6">
              Obsessed with <span className={magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'}>Performance</span> & Design
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Based in Delhi, I construct digital portals. My background blends traditional computer science with modern design principles. 
              I specialize in React, Node.js, and creating seamless user experiences.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className={`p-4 rounded-lg border bg-[#0a0a0f]/50 hover:bg-white/5 transition-colors
                  ${magicMode ? 'border-[#bc13fe]/20' : 'border-[#00f3ff]/20'}`}>
                  <div className={`text-3xl font-['Orbitron'] font-bold ${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Projects = ({ magicMode }) => {
  const projects = [
    { 
      title: "Country Details Website", 
      cat: "Info Platform", 
      desc: "Fully responsive platform displaying global country details. Implemented search, region filter & dynamic routing using React Router.", 
      tech: ["React.js", "API Fetching", "CSS3"],
      link: "#" // Add your link here
    },
    { 
      title: "Drive Storage System", 
      cat: "Cloud Storage", 
      desc: "Cloud-based storage system for photos/videos with secure authentication. Features login/registration and secure file handling.", 
      tech: ["Node.js", "Express", "MongoDB", "Firebase"],
      link: "#" // Add your link here
    }
  ];

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-['Orbitron'] text-4xl md:text-5xl font-bold text-white mb-2">PROJECTS</h2>
            <div className={`h-1 w-20 ${magicMode ? 'bg-[#bc13fe]' : 'bg-[#00f3ff]'} rounded-full`} />
          </div>
          <button className={`hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${magicMode ? 'text-[#bc13fe]' : 'text-[#00f3ff]'} hover:text-white transition-colors`}>
            View All Work <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 h-auto">
          {projects.map((p, i) => (
            <div key={i} className="h-[400px]">
              <TiltCard magicMode={magicMode}>
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 text-xs font-bold border rounded-full
                      ${magicMode ? 'border-[#bc13fe] text-[#bc13fe]' : 'border-[#00f3ff] text-[#00f3ff]'}`}>
                      {p.cat}
                    </div>
                    <div className="flex gap-2">
                        {p.link && (
                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors cursor-pointer" title="View Live">
                                <LinkIcon size={18} />
                            </a>
                        )}
                        <Github className="text-gray-500 hover:text-white transition-colors cursor-pointer" title="View Code" />
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className={`w-full h-full rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite] ${magicMode ? 'border-[#bc13fe]' : 'border-[#00f3ff]'}`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">{p.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.map((t, idx) => (
                        <span key={idx} className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* Link Button inside the card content for better visibility */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <a href={p.link} className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${magicMode ? 'text-[#bc13fe] hover:text-[#bc13fe]/80' : 'text-[#00f3ff] hover:text-[#00f3ff]/80'}`}>
                            Live Demo <ExternalLink size={12} />
                        </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Skills = ({ magicMode }) => {
  const skills = [
    "HTML/CSS", "JavaScript", "React.js", "Tailwind CSS", "Bootstrap", "Node.js", 
    "Express.js", "MongoDB", "SQL", "Firebase", "Java", "OOPs", "Git/GitHub"
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className={`absolute right-0 top-1/4 w-1/2 h-1/2 bg-gradient-to-l from-[${magicMode ? '#bc13fe' : '#00f3ff'}]/5 to-transparent blur-3xl`} />

      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-['Orbitron'] text-3xl font-bold mb-12">TECHNOLOGIES</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <div 
              key={i}
              className={`px-6 py-3 rounded-sm border bg-[#0a0a0f]/80 backdrop-blur hover:scale-110 transition-all duration-300 cursor-default
              ${magicMode ? 'border-[#bc13fe]/20 hover:border-[#bc13fe] hover:shadow-[0_0_15px_#bc13fe]' : 'border-[#00f3ff]/20 hover:border-[#00f3ff] hover:shadow-[0_0_15px_#00f3ff]'}`}
            >
              <span className="font-mono text-sm tracking-wider text-gray-300 group-hover:text-white">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ magicMode }) => {
  const [form, setForm] = useState({ email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setForm({ email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#0a0a0f] pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-['Orbitron'] text-4xl font-bold text-white mb-6">INITIALIZE_CONNECTION</h2>
        <p className="text-gray-400 mb-10">Ready to build something impossible? Send a transmission.</p>
        
        <form className="max-w-md mx-auto space-y-4 mb-16" onSubmit={handleSubmit}>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="YOUR_EMAIL_ADDRESS" 
              required
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className={`w-full bg-[#12121a]/50 border border-white/10 p-4 outline-none text-white font-mono focus:border-opacity-100 transition-colors
              ${magicMode ? 'focus:border-[#bc13fe]' : 'focus:border-[#00f3ff]'}`}
            />
            <div className={`absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r ${magicMode ? 'from-[#bc13fe] to-purple-600' : 'from-[#00f3ff] to-purple-600'} transition-all duration-300 group-hover:w-full`} />
          </div>

          <div className="relative group">
            <textarea 
              placeholder="TRANSMISSION_DATA (MESSAGE)" 
              required
              rows="4"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              className={`w-full bg-[#12121a]/50 border border-white/10 p-4 outline-none text-white font-mono focus:border-opacity-100 transition-colors resize-none
              ${magicMode ? 'focus:border-[#bc13fe]' : 'focus:border-[#00f3ff]'}`}
            />
            <div className={`absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r ${magicMode ? 'from-[#bc13fe] to-purple-600' : 'from-[#00f3ff] to-purple-600'} transition-all duration-300 group-hover:w-full`} />
          </div>

          <MagneticButton magicMode={magicMode} className="w-full justify-center">
            {status === 'loading' ? 'SENDING...' : status === 'success' ? 'TRANSMISSION SENT' : status === 'error' ? 'ERROR - RETRY' : 'SEND TRANSMISSION'}
          </MagneticButton>
        </form>

        <div className="flex justify-center items-center gap-8 text-sm text-gray-600 font-mono">
          <span>© 2024 SOURAV SHARMA</span>
          <span>DESIGNED IN DELHI</span>
        </div>
      </div>
    </footer>
  );
};