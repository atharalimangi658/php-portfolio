
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUpRight, Award, Bot, BriefcaseBusiness, Code2, Cpu, Database,
  Download, ExternalLink, Github, GraduationCap, Linkedin, Mail, MapPin, Menu,
  FileBadge, LockKeyhole, LogOut, MailOpen, MonitorSmartphone, Pencil, Plus, Send, ShoppingBag, Trash2, Wrench, X
} from 'lucide-react';
import translations from './translations.js';

const CONTACT = {
  email: 'atharalimangi658@gmail.com',
  linkedin: 'https://www.linkedin.com/in/athar-ali-300b91325',
  upwork: 'https://www.upwork.com/freelancers/~01042f536cb1f56a60?mp_source=share',
};
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem('athar-admin-token');
  const response = await fetch(`${API_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.status === 204 ? null : response.json();
}

const navItems = ['about', 'skills', 'projects', 'education', 'certificates', 'experience', 'contact'];

const initialProjects = [
  {
    number: '01',
    title: 'MR FOLLOW',
    subtitle: 'Human-Following Robot',
    image: '/images/mr-follow.png',
    description:
      'A human-following robotic system designed to detect and follow a person using ultrasonic sensors and infrared sensors. The robot supports automatic following and manual control through Bluetooth.',
    tags: ['Arduino Uno', 'Ultrasonic Sensor', 'IR Sensors', 'L293D', 'HC-06 Bluetooth', 'MIT App Inventor'],
  },
  {
    number: '02',
    title: 'UV INDEX METER',
    subtitle: 'UV Index Monitoring System',
    image: '/images/uv-index.png',
    description:
      'An Arduino-based UV monitoring project designed to detect ultraviolet radiation levels using a UV sensor and display the readings through a computer-based interface.',
    tags: ['Arduino Uno', 'UV Sensor', 'Display', 'Electronics', 'Processing IDE'],
  },
  {
    number: '03',
    title: 'SWAD FOODS PK',
    subtitle: 'E-commerce Business',
    image: '/images/swad-foods.jpg',
    description:
      'An e-commerce business focused on traditional Shikarpuri pickles and food products. The business uses Shopify to showcase products and support online sales while maintaining a physical business presence.',
    tags: ['Shopify', 'E-commerce', 'Store Management', 'Digital Marketing'],
  },
];

const initialCertificates = [
  {
    id: '5d1c50f1-b343-4e7a-8124-5d3d5a7fc001',
    title: 'Certificate of Appreciation',
    issuer: 'System X 1.0',
    role: 'Organizer',
    image: '/images/certificate-systemx.png',
    description:
      'Recognition for dedication, teamwork, and valuable contribution to the successful organization of Hackathon 1.0.',
  },
  {
    id: '5d1c50f1-b343-4e7a-8124-5d3d5a7fc002',
    title: 'Certificate of Participation',
    issuer: 'IEEE',
    role: 'Participant',
    event: 'Build with AI: From Concept to Functional App',
    image: '/images/certificate-ieee.jpg',
    description:
      'Participation certificate for the IEEE event “Build with AI: From Concept to Functional App”.',
  },
];

const skillGroups = [
  { icon: Code2, items: ['C', 'C++', 'JavaScript'] },
  { icon: MonitorSmartphone, items: ['HTML5', 'CSS3', 'Responsive Design', 'React'] },
  { icon: Database, items: ['MySQL'] },
  { icon: Cpu, items: ['Arduino', 'ESP32', 'Sensors', 'Embedded Systems'] },
  { icon: Wrench, items: ['GitHub', 'Arduino IDE', 'Canva'] },
];

function localizedProject(project, language) {
  const copy = language === 'ur' ? translations.ur.content.projects[project.number] : null;
  const original = initialProjects.find((item) => item.number === project.number);
  if (!copy || !original) return project;
  const originalDescriptions = [original.description];
  if (project.number === '03') originalDescriptions.push('An e-commerce business focused on traditional Shikarpuri pickles and food products.');
  return {
    ...project,
    subtitle: project.subtitle === original.subtitle ? copy.subtitle : project.subtitle,
    description: originalDescriptions.includes(project.description) ? copy.description : project.description,
    tags: JSON.stringify(project.tags) === JSON.stringify(original.tags) ? copy.tags : project.tags,
  };
}

function localizedCertificate(certificate, language) {
  const original = initialCertificates.find((item) => item.id === certificate.id || (item.title === certificate.title && item.issuer === certificate.issuer));
  const translationId = original?.issuer === 'System X 1.0' ? 'systemx' : original?.issuer === 'IEEE' ? 'ieee' : null;
  const copy = language === 'ur' && translationId ? translations.ur.content.certificates[translationId] : null;
  if (!copy || !original) return certificate;
  return {
    ...certificate,
    title: certificate.title === original.title ? copy.title : certificate.title,
    role: certificate.role === original.role ? copy.role : certificate.role,
    description: certificate.description === original.description ? copy.description : certificate.description,
  };
}

function SectionHead({ eyebrow, title, accent, desc }) {
  return (
    <div className="section-head reveal">
      <span>{eyebrow}</span>
      <h2>{title} <em>{accent}</em></h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

function RobotCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frameId = 0;
    let scrollTimer;
    let pointerX = -100;
    let pointerY = -100;
    const moveCursor = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        cursor.style.setProperty('--cursor-x', `${pointerX}px`);
        cursor.style.setProperty('--cursor-y', `${pointerY}px`);
        cursor.classList.add('visible');
        frameId = 0;
      });
    };
    const animateScroll = () => {
      cursor.classList.add('scrolling');
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => cursor.classList.remove('scrolling'), 180);
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    window.addEventListener('scroll', animateScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('scroll', animateScroll);
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <div className="robot-cursor" ref={cursorRef} aria-hidden="true">
      <Bot size={19} strokeWidth={1.8} />
      <span />
    </div>
  );
}

export default function App() {
  const aboutPhotoTurnRef = useRef(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('athar-language') === 'ur' ? 'ur' : 'en');
  const t = translations[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [roleIndex, setRoleIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState('');
  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem('athar-projects')) || initialProjects; }
    catch { return initialProjects; }
  });
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('athar-messages')) || []; }
    catch { return []; }
  });
  const [certificates, setCertificates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('athar-certificates')) || initialCertificates; }
    catch { return initialCertificates; }
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', subtitle: '', image: '', description: '', tags: '' });
  const [certificateForm, setCertificateForm] = useState({ title: '', issuer: '', role: '', event: '', image: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => Boolean(sessionStorage.getItem('athar-admin-token')));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const roles = useMemo(() => t.hero.roles, [t]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.pageDescription);
    localStorage.setItem('athar-language', language);
  }, [language, t]);
  useEffect(() => { localStorage.setItem('athar-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('athar-messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('athar-certificates', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => {
    let activeRequest = true;
    Promise.all([apiRequest('projects'), apiRequest('certificates')])
      .then(([projectData, certificateData]) => {
        if (!activeRequest) return;
        setProjects(projectData);
        setCertificates(certificateData);
      })
      .catch(() => { /* The portfolio remains usable with browser-local data when the API is offline. */ });
    if (sessionStorage.getItem('athar-admin-token')) {
      apiRequest('messages').then((messageData) => activeRequest && setMessages(messageData)).catch(() => {
        sessionStorage.removeItem('athar-admin-token');
        activeRequest && setAdminAuthenticated(false);
      });
    }
    return () => { activeRequest = false; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setRoleIndex((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(timer);
  }, [roles]);

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 });
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const photo = aboutPhotoTurnRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!photo || reduceMotion.matches) return undefined;

    let frame = 0;
    const updateTurn = () => {
      frame = 0;
      const { top } = photo.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Start the turn just before About Me enters the viewport and finish it near its heading.
      const progress = Math.min(1, Math.max(0, (viewportHeight * 0.98 - top) / (viewportHeight * 0.68)));
      // A small overshoot makes the profile feel like it lands in place rather than stopping abruptly.
      const landingProgress = 1 + 1.7 * (progress - 1) ** 3 + 0.7 * (progress - 1) ** 2;
      const travelX = Math.min(window.innerWidth * 1.05, 720);
      photo.style.setProperty('--about-turn', `${-86 + progress * 86}deg`);
      photo.style.setProperty('--about-enter-x', `${travelX * (1 - landingProgress)}px`);
      photo.style.setProperty('--about-enter-y', `${-240 * (1 - landingProgress)}px`);
      photo.style.setProperty('--about-opacity', `${0.25 + progress * 0.75}`);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateTurn);
    };

    updateTurn();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, [language]);

  const goto = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const downloadResume = () => window.print();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus('');
    try {
      const savedMessage = await apiRequest('messages', { method: 'POST', body: JSON.stringify(form) });
      setMessages((items) => [savedMessage, ...items.filter((item) => item.id !== savedMessage.id)]);
      setForm({ name: '', email: '', subject: '', message: '' });
      setContactStatus('success');
    } catch {
      setContactStatus('error');
    } finally {
      setContactSubmitting(false);
    }
  };

  const saveProject = (e) => {
    e.preventDefault();
    const project = {
      id: editingProject?.id || crypto.randomUUID(),
      number: editingProject?.number || String(projects.length + 1).padStart(2, '0'),
      title: projectForm.title.toUpperCase(),
      subtitle: projectForm.subtitle,
      image: projectForm.image || '/images/athar-profile.jpg',
      description: projectForm.description,
      tags: projectForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    setProjects((items) => editingProject ? items.map((item) => item.number === editingProject.number ? project : item) : [...items, project]);
    void apiRequest(editingProject ? `projects/${editingProject.id || editingProject.number}` : 'projects', { method: editingProject ? 'PUT' : 'POST', body: JSON.stringify(project) })
      .then((savedProject) => setProjects((items) => editingProject ? items.map((item) => item.number === editingProject.number ? savedProject : item) : items.map((item) => item.id === project.id ? savedProject : item)))
      .catch(() => {});
    setProjectForm({ title: '', subtitle: '', image: '', description: '', tags: '' });
    setEditingProject(null);
  };

  const removeProject = (number) => {
    const project = projects.find((item) => item.number === number);
    setProjects((items) => items.filter((item) => item.number !== number).map((item, index) => ({ ...item, number: String(index + 1).padStart(2, '0') })));
    if (project) void apiRequest(`projects/${project.id || project.number}`, { method: 'DELETE' }).catch(() => {});
  };

  const startProjectEdit = (project) => {
    setEditingProject(project);
    setProjectForm({ ...project, tags: project.tags.join(', ') });
  };

  const saveCertificate = (e) => {
    e.preventDefault();
    const certificate = { id: editingCertificate?.id || crypto.randomUUID(), ...certificateForm };
    setCertificates((items) => editingCertificate ? items.map((item) => item.id === editingCertificate.id ? certificate : item) : [...items, certificate]);
    void apiRequest(editingCertificate ? `certificates/${editingCertificate.id}` : 'certificates', { method: editingCertificate ? 'PUT' : 'POST', body: JSON.stringify(certificate) })
      .then((savedCertificate) => setCertificates((items) => editingCertificate ? items.map((item) => item.id === editingCertificate.id ? savedCertificate : item) : items.map((item) => item.id === certificate.id ? savedCertificate : item)))
      .catch(() => {});
    setCertificateForm({ title: '', issuer: '', role: '', event: '', image: '', description: '' });
    setEditingCertificate(null);
  };

  const startCertificateEdit = (certificate) => {
    setEditingCertificate(certificate);
    setCertificateForm({ ...certificate });
  };

  const removeCertificate = (id) => {
    setCertificates((items) => items.filter((item) => item.id !== id));
    void apiRequest(`certificates/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const { token } = await apiRequest('auth/login', { method: 'POST', body: JSON.stringify(loginForm) });
      sessionStorage.setItem('athar-admin-token', token);
      setAdminAuthenticated(true);
      setLoginForm({ username: '', password: '' });
      setMessages(await apiRequest('messages'));
    } catch (error) {
      setLoginError(error.message.includes('401') ? 'invalid' : 'server');
    }
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('athar-admin-token');
    setAdminAuthenticated(false);
    setMessages([]);
  };

  return (
    <>
      <RobotCursor />
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <header className="header">
        <button className="brand" onClick={() => goto('home')}>
          <span className="brand-mark">AA</span>
          <span className="brand-name">Athar Ali</span>
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map((id) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => goto(id)}>
              {t.nav[id]}
            </button>
          ))}
        </nav>

        <div className="language-switch" role="group" aria-label={t.languageSelector}>
          <button type="button" className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>English</button>
          <span aria-hidden="true">/</span>
          <button type="button" className={language === 'ur' ? 'selected' : ''} onClick={() => setLanguage('ur')} aria-pressed={language === 'ur'}>اردو</button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label={t.menu}>
          {menuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </header>

      <main>
        <section id="home" className="hero wrap">
          <div className="hero-copy reveal">
            <div className="availability"><span className="dot" /> {t.hero.availability}</div>
            <p className="hero-top">{t.hero.greeting}</p>
            <h1>Athar <span>Ali</span>.</h1>
            <div className="role-line"><span>{t.hero.rolePrefix}</span><strong key={roleIndex}>{roles[roleIndex]}</strong></div>
            <p className="hero-text">{t.hero.intro}</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => goto('projects')}>{t.hero.explore} <ArrowUpRight size={16} /></button>
              <button className="ghost-btn" onClick={downloadResume}><Download size={16}/> {t.hero.downloadResume}</button>
            </div>
            <div className="socials">
              <span>{t.hero.findMe}</span>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label={t.hero.linkedin}><Linkedin size={18}/></a>
              <a href={CONTACT.upwork} target="_blank" rel="noopener noreferrer" aria-label={t.hero.upwork}><ExternalLink size={18}/></a>
              <a href={`mailto:${CONTACT.email}`} aria-label={t.hero.email}><Mail size={18}/></a>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="portrait-glow" />
            <div className="portrait-wrap"><img src="/images/athar-profile.jpg" alt={t.hero.portrait} /></div>
            <div className="float-card card-1"><GraduationCap size={17}/><div><b>{t.hero.semester}</b><small>{t.hero.degreeShort}</small></div></div>
            <div className="float-card card-2"><Cpu size={17}/><div><b>{t.hero.webRobotics}</b><small>{t.hero.frontendArduino}</small></div></div>
          </div>
          <button className="scroll-indicator" onClick={() => goto('about')}>{t.hero.scroll} <ArrowDown size={15}/></button>
        </section>

        <section id="about" className="wrap section">
          <SectionHead eyebrow={t.about.eyebrow} title={t.about.title} accent={t.about.accent} desc={t.about.desc} />
          <div className="about-grid">
            <div className="about-photo reveal">
              <div className="about-photo-turn" ref={aboutPhotoTurnRef}>
                <div className="about-photo-card">
                  <img src="/images/athar-profile.jpg" alt={t.hero.portrait} />
                  <div className="location-badge"><MapPin size={14}/> {t.about.location}</div>
                </div>
              </div>
            </div>
            <div className="about-copy reveal">
              <h3>{t.about.heading}<br/><span>{t.about.headingAccent}</span></h3>
              {t.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="mini-highlights">
                <span><Code2 size={15}/> {t.about.highlights[0]}</span>
                <span><Cpu size={15}/> {t.about.highlights[1]}</span>
                <span><ShoppingBag size={15}/> {t.about.highlights[2]}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="wrap section">
          <SectionHead eyebrow={t.skills.eyebrow} title={t.skills.title} accent={t.skills.accent} desc={t.skills.desc} />
          <div className="skills-grid">
            {skillGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <article className="skill-card reveal" key={idx}>
                  <div className="skill-card-top"><span className="skill-icon"><Icon size={18}/></span><span className="skill-index">{String(idx + 1).padStart(2, '0')}</span></div>
                  <h3>{t.skills.groups[idx]}</h3>
                  <div className="chip-wrap">{t.skills.items[idx].map((item) => <span key={item}>{item}</span>)}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="projects" className="wrap section">
          <SectionHead eyebrow={t.projects.eyebrow} title={t.projects.title} accent={t.projects.accent} desc={t.projects.desc} />
          <div className="projects-grid">
            {projects.map((project) => {
              const content = localizedProject(project, language);
              return (
              <article className="project-card reveal" key={project.number}>
                <div className="project-image"><img src={project.image} alt={content.title} /><span className="project-number">{project.number}</span></div>
                <div className="project-body">
                  <span className="project-subtitle">{content.subtitle}</span>
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                  <div className="chip-wrap">{content.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <button className="inline-link" onClick={() => setSelectedProject(project)}>{t.projects.viewDetails} <ArrowUpRight size={15}/></button>
                </div>
              </article>
            );})}
          </div>
        </section>

        <section id="education" className="wrap section">
          <SectionHead eyebrow={t.education.eyebrow} title={t.education.title} accent={t.education.accent} desc={t.education.desc} />
          <div className="edu-card reveal">
            <div className="edu-icon"><GraduationCap size={28}/></div>
            <div className="edu-main">
              <span className="tiny-label">{t.education.current}</span>
              <h3>{t.education.university}</h3>
              <p>{t.education.degree}</p>
              <div className="edu-meta"><span>{t.education.semester}</span><span>{t.education.studying}</span></div>
            </div>
            <div className="edu-side">MUET <small>{t.education.country}</small></div>
          </div>
        </section>

        <section id="certificates" className="wrap section">
          <SectionHead eyebrow={t.certificates.eyebrow} title={t.certificates.title} accent={t.certificates.accent} desc={t.certificates.desc} />
          <div className="certificate-grid">
            {certificates.map((cert) => {
              const content = localizedCertificate(cert, language);
              return (
              <article className="certificate-card reveal" key={cert.id}>
                <div className="certificate-image"><img src={cert.image} alt={content.title} /></div>
                <div className="certificate-body">
                  <span className="tiny-label">{cert.issuer}</span>
                  <h3>{content.title}</h3>
                  <p className="cert-role">{content.role}{cert.event ? ` · ${cert.event}` : ''}</p>
                  <p>{content.description}</p>
                  <button className="inline-link" onClick={() => setSelectedCertificate(cert)}>{t.certificates.view} <ExternalLink size={15}/></button>
                </div>
              </article>
            );})}
          </div>
        </section>

        <section id="experience" className="wrap section">
          <SectionHead eyebrow={t.experience.eyebrow} title={t.experience.title} accent={t.experience.accent} desc={t.experience.desc} />
          <div className="experience-grid">
            <article className="experience-card reveal">
              <div className="exp-top"><ShoppingBag size={18}/><span>{t.experience.ecommerce}</span></div>
              <h3>Swad Foods PK</h3>
              <p className="exp-role">{t.experience.ecommerceRole}</p>
              <p>{t.experience.ecommerceDesc}</p>
              <div className="chip-wrap"><span>Shopify</span>{t.experience.ecommerceTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
            <article className="experience-card reveal">
              <div className="exp-top"><BriefcaseBusiness size={18}/><span>{t.experience.freelancing}</span></div>
              <h3>Upwork</h3>
              <p className="exp-role">{t.experience.freelanceRole}</p>
              <p>{t.experience.freelanceDesc}</p>
              <div className="chip-wrap">{t.experience.freelanceTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          </div>
        </section>

        <section id="contact" className="wrap section contact-section">
          <div className="contact-box reveal">
            <div className="contact-copy">
              <span className="tiny-label">{t.contact.eyebrow}</span>
              <h2>{t.contact.title}<br/><em>{t.contact.accent}</em></h2>
              <p>{t.contact.desc}</p>
              <div className="contact-lines">
                <a href={`mailto:${CONTACT.email}`}><Mail size={16}/> {CONTACT.email}</a>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> {t.contact.linkedin} <ExternalLink size={13}/></a>
                <a href={CONTACT.upwork} target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> {t.contact.upwork} <ExternalLink size={13}/></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>{t.contact.heading}</h3>
              <div className="form-grid">
                <label>{t.contact.name}<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.namePlaceholder} /></label>
                <label>{t.contact.email}<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
              </div>
              <label>{t.contact.subject}<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder={t.contact.subjectPlaceholder} /></label>
              <label>{t.contact.message}<textarea required rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.messagePlaceholder} /></label>
              <button className="primary-btn submit-btn" type="submit" disabled={contactSubmitting}>
                {contactSubmitting ? t.contact.sending : t.contact.submit} <Send size={15}/>
              </button>
              <small className="form-disclaimer" role="status" aria-live="polite">
                {contactStatus === 'success' ? t.contact.success : contactStatus === 'error' ? t.contact.error : t.contact.saved}
              </small>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <button className="brand footer-brand" onClick={() => goto('home')}>
          <span className="brand-mark">AA</span>
          <span className="brand-name">Athar Ali</span>
        </button>
        <p>{t.footer.description}</p>
        <div className="footer-row">
          <span>© 2026 Athar Ali. {t.footer.rights}</span>
          <button onClick={() => goto('home')}>{t.footer.top} <ArrowUpRight size={14}/></button>
          <button onClick={() => setAdminOpen(true)}>{t.footer.admin} <LockKeyhole size={14}/></button>
        </div>
      </footer>

      {adminOpen && (
        <div className="modal-bg admin-bg" onClick={() => setAdminOpen(false)}>
          <section className="modal-card admin-panel" onClick={(e) => e.stopPropagation()} aria-label={t.admin.aria}>
            <button className="modal-close" onClick={() => setAdminOpen(false)} aria-label={t.admin.close}><X size={18}/></button>
            <div className="admin-heading">
              <span className="tiny-label">{t.footer.admin}</span>
              <h2>{t.admin.title}</h2>
              <p>{adminAuthenticated ? t.admin.signedIn : t.admin.signedOut}</p>
              {adminAuthenticated && <button className="admin-logout" type="button" onClick={logoutAdmin}><LogOut size={15}/> {t.admin.logout}</button>}
            </div>
            {adminAuthenticated ? (
            <div className="admin-grid">
              <div className="admin-section">
                <div className="admin-section-title"><MailOpen size={18}/><h3>{t.admin.messages} <span>{messages.length}</span></h3></div>
                <div className="message-list">
                  {messages.length ? messages.map((message) => (
                    <article className="message-card" key={message.id}>
                      <div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div>
                      <span>{new Date(message.receivedAt).toLocaleString(language === 'ur' ? 'ur-PK' : 'en-US')}</span>
                      <b>{message.subject || t.admin.portfolioMessage}</b>
                      <p>{message.message}</p>
                    </article>
                  )) : <p className="admin-empty">{t.admin.noMessages}</p>}
                </div>
              </div>
              <div className="admin-section">
                <div className="admin-section-title"><Plus size={18}/><h3>{editingProject ? t.admin.editProject : t.admin.addProject}</h3></div>
                <form className="admin-form" onSubmit={saveProject}>
                  <label>{t.admin.projectTitle}<input required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder={t.admin.projectTitlePlaceholder} /></label>
                  <label>{t.admin.subtitle}<input required value={projectForm.subtitle} onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })} placeholder={t.admin.subtitlePlaceholder} /></label>
                  <label>{t.admin.image}<input value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} placeholder={t.admin.imagePlaceholder} /></label>
                  <label>{t.admin.description}<textarea required rows="4" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder={t.admin.projectDescriptionPlaceholder} /></label>
                  <label>{t.admin.tags} <small>{t.admin.separateTags}</small><input value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} placeholder={t.admin.tagsPlaceholder} /></label>
                  <div className="admin-actions"><button className="primary-btn" type="submit">{editingProject ? t.admin.saveProject : t.admin.addProject} <Plus size={15}/></button>{editingProject && <button className="admin-cancel" type="button" onClick={() => { setEditingProject(null); setProjectForm({ title: '', subtitle: '', image: '', description: '', tags: '' }); }}>{t.admin.cancel}</button>}</div>
                </form>
                <div className="project-manager">
                  {projects.map((project) => {
                    const content = localizedProject(project, language);
                    return <div key={project.number}><span>{project.number} · {content.title}</span><aside><button className="edit-item" type="button" onClick={() => startProjectEdit(project)}><Pencil size={14}/> {t.admin.edit}</button><button type="button" onClick={() => removeProject(project.number)} aria-label={t.admin.removeProject(content.title)}><Trash2 size={15}/> {t.admin.remove}</button></aside></div>;
                  })}
                </div>
              </div>
              <div className="admin-section admin-certificates">
                <div className="admin-section-title"><FileBadge size={18}/><h3>{editingCertificate ? t.admin.editCertificate : t.admin.addCertificate}</h3></div>
                <form className="admin-form" onSubmit={saveCertificate}>
                  <label>{t.admin.certificateTitle}<input required value={certificateForm.title} onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })} placeholder={t.admin.certificateTitlePlaceholder} /></label>
                  <label>{t.admin.issuer}<input required value={certificateForm.issuer} onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })} placeholder="IEEE" /></label>
                  <label>{t.admin.role}<input required value={certificateForm.role} onChange={(e) => setCertificateForm({ ...certificateForm, role: e.target.value })} placeholder={t.admin.rolePlaceholder} /></label>
                  <label>{t.admin.event} <small>{t.admin.optional}</small><input value={certificateForm.event} onChange={(e) => setCertificateForm({ ...certificateForm, event: e.target.value })} placeholder={t.admin.eventPlaceholder} /></label>
                  <label>{t.admin.image}<input value={certificateForm.image} onChange={(e) => setCertificateForm({ ...certificateForm, image: e.target.value })} placeholder={t.admin.certificateImagePlaceholder} /></label>
                  <label>{t.admin.description}<textarea required rows="4" value={certificateForm.description} onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })} placeholder={t.admin.certificateDescriptionPlaceholder} /></label>
                  <div className="admin-actions"><button className="primary-btn" type="submit">{editingCertificate ? t.admin.saveCertificate : t.admin.addCertificate} <Plus size={15}/></button>{editingCertificate && <button className="admin-cancel" type="button" onClick={() => { setEditingCertificate(null); setCertificateForm({ title: '', issuer: '', role: '', event: '', image: '', description: '' }); }}>{t.admin.cancel}</button>}</div>
                </form>
                <div className="project-manager">
                  {certificates.map((certificate) => {
                    const content = localizedCertificate(certificate, language);
                    return <div key={certificate.id}><span>{certificate.issuer} · {content.title}</span><aside><button className="edit-item" type="button" onClick={() => startCertificateEdit(certificate)}><Pencil size={14}/> {t.admin.edit}</button><button type="button" onClick={() => removeCertificate(certificate.id)} aria-label={t.admin.removeProject(content.title)}><Trash2 size={15}/> {t.admin.remove}</button></aside></div>;
                  })}
                </div>
              </div>
            </div>
            ) : (
              <form className="admin-login" onSubmit={handleAdminLogin}>
                <LockKeyhole size={24}/>
                <h3>{t.admin.loginTitle}</h3>
                <p>{t.admin.credentials} <code>server/.env</code>.</p>
                <label>{t.admin.username}<input required autoComplete="username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} /></label>
                <label>{t.admin.password}<input required type="password" autoComplete="current-password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></label>
                {loginError && <p className="login-error" role="alert">{loginError === 'invalid' ? t.admin.invalidLogin : t.admin.serverError}</p>}
                <button className="primary-btn" type="submit">{t.admin.signIn} <LockKeyhole size={15}/></button>
              </form>
            )}
          </section>
        </div>
      )}

      {selectedProject && (
        <div className="modal-bg" onClick={() => setSelectedProject(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label={t.admin.closeProject}><X size={18}/></button>
            <img className="modal-image" src={selectedProject.image} alt={localizedProject(selectedProject, language).title} />
            <span className="tiny-label">{t.projects.modalLabel} {selectedProject.number}</span>
            <h3>{localizedProject(selectedProject, language).title}</h3>
            <p className="modal-sub">{localizedProject(selectedProject, language).subtitle}</p>
            <p>{localizedProject(selectedProject, language).description}</p>
            <div className="chip-wrap">{localizedProject(selectedProject, language).tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      )}

      {selectedCertificate && (
        <div className="modal-bg" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-card certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCertificate(null)} aria-label={t.admin.closeCertificate}><X size={18}/></button>
            <img className="modal-image modal-certificate" src={selectedCertificate.image} alt={localizedCertificate(selectedCertificate, language).title} />
            <span className="tiny-label">{selectedCertificate.issuer}</span>
            <h3>{localizedCertificate(selectedCertificate, language).title}</h3>
            <p className="modal-sub">{localizedCertificate(selectedCertificate, language).role}{selectedCertificate.event ? ` · ${selectedCertificate.event}` : ''}</p>
            <p>{localizedCertificate(selectedCertificate, language).description}</p>
          </div>
        </div>
      )}

      <section className="print-resume">
        <div className="resume-top">
          <div className="resume-id">
            <img src="/images/athar-profile.jpg" alt="Athar Ali" />
            <div>
              <h1>Athar Ali</h1>
              <h2>{t.resume.role}</h2>
              <p>{t.resume.country} · {CONTACT.email}</p>
              <p><a href={CONTACT.linkedin}>LinkedIn</a> · <a href={CONTACT.upwork}>Upwork</a></p>
            </div>
          </div>
          <div className="resume-side-note">
            <p><strong>{t.resume.university}</strong> Mehran University of Engineering and Technology</p>
            <p><strong>{t.resume.degree}</strong> BECS — Computer Systems</p>
            <p><strong>{t.resume.status}</strong> {t.resume.semester}</p>
          </div>
        </div>
        <hr />
        <h3>{t.resume.summary}</h3>
        <p>{t.resume.summaryText}</p>
        <h3>{t.resume.skills}</h3>
        <ul>
          <li><strong>{t.resume.programming}:</strong> C, C++, JavaScript</li>
          <li><strong>{t.resume.frontend}:</strong> HTML5, CSS3, Responsive Design, React</li>
          <li><strong>{t.resume.database}:</strong> MySQL</li>
          <li><strong>{t.resume.robotics}:</strong> Arduino, ESP32, Sensors, Embedded Systems</li>
          <li><strong>{t.resume.tools}:</strong> GitHub, Arduino IDE, Canva</li>
        </ul>
        <h3>{t.resume.featuredProjects}</h3>
        <ul>{t.resume.projects.map((project) => <li key={project}>{project}</li>)}</ul>
        <h3>{t.resume.experience}</h3>
        <ul>{t.resume.experienceItems.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>{t.resume.certificates}</h3>
        <ul>{t.resume.certificateItems.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </>
  );
}
