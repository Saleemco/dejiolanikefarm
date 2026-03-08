import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Menu, X, Droplets, Fish, Phone, Mail, MapPin, ChevronDown, Star, CheckCircle, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from './components/ThemeToggle';
import { useProducts } from './hooks/useProducts';
import { urlFor } from './sanity';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = '+2348023699850'; 

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  
  const { products, loading, error } = useProducts(3);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Preload critical images
  useEffect(() => {
    const criticalImages = [
      '/images/hero_pond.jpg',
      '/images/about_farm.jpg',
    ];
    
    let loaded = 0;
    criticalImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === criticalImages.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === criticalImages.length) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  // When images are loaded and products are loaded, show content
  useEffect(() => {
    if (imagesLoaded && !loading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setContentReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, loading]);

  // When content is ready, tell App.tsx to hide the loader
  useEffect(() => {
    if (contentReady) {
      // Small delay to ensure everything is rendered
      setTimeout(() => {
        window.dispatchEvent(new Event('homepageReady'));
      }, 100);
    }
  }, [contentReady]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animations - only run when content is ready
  useEffect(() => {
    if (!contentReady) return;

    // Hero animation
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .fromTo('.hero-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' })
      .fromTo('.hero-title span', { y: 26, opacity: 0, rotateX: 18 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.06, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-subtitle', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo('.hero-cta', { y: 18, scale: 0.98, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .fromTo('.scroll-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    gsap.to('.scroll-hint', { y: 8, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Section animations
    const sections = [
      { ref: aboutRef, class: '.about-animate' },
      { ref: productsRef, class: '.product-animate' },
      { ref: whyRef, class: '.why-animate' },
      { ref: stepsRef, class: '.step-animate' },
      { ref: testimonialsRef, class: '.testimonial-animate' },
      { ref: galleryRef, class: '.gallery-animate' },
      { ref: contactRef, class: '.contact-animate' },
    ];

    sections.forEach(({ ref, class: className }) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current.querySelectorAll(className),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [contentReady]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Please enter a valid Nigerian phone number (e.g., 08012345678)');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    try {
      const message = `*New Inquiry from DejiOlanike Farm Website*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email || 'Not provided'}%0A*Message:* ${formData.message}`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Redirecting to WhatsApp...');
      
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickInquiry = (productName: string) => {
    const message = `I'm interested in your *${productName}*. Please provide more information.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/600x400/2EC4B6/white?text=DejiOlanike+Farm`;
  };

  const navLinks = [
    { label: 'Home', ref: heroRef },
    { label: 'About', ref: aboutRef },
    { label: 'Products', path: '/products' },
    { label: 'Services', ref: whyRef },
    { label: 'Gallery', ref: galleryRef },
    { label: 'Contact', ref: contactRef },
  ];

  // Don't show anything while loading - let App.tsx loader handle it
  if (!contentReady) {
    return null; // Return nothing, App.tsx loader will show
  }

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-card/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Fish className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg lg:text-xl text-foreground">
                DejiOlanike Farm
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                'ref' in link ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.ref)}
                    className="font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              <ThemeToggle />
              
              <button
                onClick={() => scrollToSection(contactRef)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Order Fingerlings
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-16 bg-card border-t border-border shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  'ref' in link ? (
                    <button
                      key={link.label}
                      onClick={() => {
                        scrollToSection(link.ref);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
                
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
                
                <button
                  onClick={() => {
                    scrollToSection(contactRef);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg font-medium transition-colors mt-2"
                >
                  Order Fingerlings
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="hero-bg absolute inset-0">
          <img
            src="/images/hero_pond.jpg"
            alt="Fresh pond water"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="hero-title font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight mb-6">
            <span className="inline-block">Fresh</span>{' '}
            <span className="inline-block">&</span>{' '}
            <span className="inline-block">Healthy</span>{' '}
            <span className="inline-block text-primary">Catfish</span>{' '}
            <span className="inline-block text-primary">Fingerlings</span>{' '}
            <span className="inline-block">You</span>{' '}
            <span className="inline-block">Can</span>{' '}
            <span className="inline-block">Trust</span>
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Reliable supply for farmers, businesses, and households—delivered with care.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection(contactRef)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 transition-colors"
            >
              Order Fingerlings
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="about-animate order-2 lg:order-1">
              <span className="font-label font-semibold text-sm tracking-wider text-primary uppercase">About Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
                We raise strong fingerlings with care and clean water.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                DejiOlanike Farm is a family-run aquaculture business focused on healthy stock, consistent supply, and practical guidance for every customer.
              </p>
              <ul className="space-y-4">
                {['Hatchery-bred for vigor', 'Fast-growing, disease-resistant stock', 'Support for first-time farmers'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-animate relative order-1 lg:order-2">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
                <img
                  src="/images/about_farm.jpg"
                  alt="Holding a fingerling"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:-left-12 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-lg animate-float">
                <span className="font-heading font-bold text-3xl lg:text-4xl">10K+</span>
                <span className="text-sm font-medium text-center px-2">Fingerlings supplied</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="product-animate font-label font-semibold text-sm tracking-wider text-primary uppercase">Our Products</span>
            <h2 className="product-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4 mb-4">
              Everything you need to start or restock your farm.
            </h2>
            <Link 
              to="/products"
              className="product-animate inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View full catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading products...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Error loading products. Please refresh.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="product-animate group bg-card rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-56 overflow-hidden">
                    {(() => {
                      try {
                        if (product.mainImage) {
                          return (
                            <img
                              src={urlFor(product.mainImage).width(400).height(300).url()}
                              alt={product.mainImage.alt || product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={handleImageError}
                            />
                          );
                        } else {
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                              <Fish className="w-16 h-16 text-primary-foreground opacity-50" />
                            </div>
                          );
                        }
                      } catch (e) {
                        return (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                            <Fish className="w-16 h-16 text-primary-foreground opacity-50" />
                          </div>
                        );
                      }
                    })()}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">{product.title}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>
                    {product.price && (
                      <p className="text-primary font-bold text-xl mb-4">
                        ₦{product.price.toLocaleString()} 
                        <span className="text-sm font-normal text-muted-foreground ml-1">/{product.unit || 'unit'}</span>
                      </p>
                    )}
                    <button
                      onClick={() => handleQuickInquiry(product.title)}
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Inquire on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={whyRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="why-animate relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
                <img
                  src="/images/why_pond.jpg"
                  alt="Farm pond"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-right-12 w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-foreground flex flex-col items-center justify-center text-background shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <span className="font-heading font-bold text-3xl lg:text-4xl">100%</span>
                <span className="text-sm font-medium text-center px-2">Healthy Stock Guarantee</span>
              </div>
            </div>
            <div className="why-animate">
              <span className="font-label font-semibold text-sm tracking-wider text-primary uppercase">Why Choose Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
                Healthy stock. Honest service. Reliable delivery.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                We combine hatchery expertise with on-the-ground support—so you grow with confidence.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Water-quality first approach',
                  'Batch tracking & transparency',
                  'Flexible order sizes',
                  'Guidance for new farmers',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order Section */}
      <section ref={stepsRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="step-animate font-label font-semibold text-sm tracking-wider text-primary uppercase">How to Order</span>
            <h2 className="step-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4">
              Get quality fingerlings in three simple steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose your size',
                description: 'Pick fingerlings or juveniles based on your plan.',
                icon: Fish,
              },
              {
                step: '02',
                title: 'Place your order',
                description: 'Call, chat, or fill the form—we confirm fast.',
                icon: Phone,
              },
              {
                step: '03',
                title: 'Receive & stock',
                description: 'We deliver healthy stock with simple stocking tips.',
                icon: Droplets,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="step-animate relative bg-card rounded-[28px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="absolute top-4 right-4 text-8xl font-heading font-bold text-primary/10 leading-none">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="testimonial-animate">
              <span className="font-label font-semibold text-sm tracking-wider text-primary uppercase">Testimonials</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4 mb-8">
                Farmers trust us because the results speak.
              </h2>
              <div className="bg-card rounded-[28px] p-8 shadow-lg relative">
                <div className="text-primary text-6xl font-serif leading-none mb-4">"</div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  DejiOlanike delivered active, healthy fingerlings and walked me through stocking. Mortality was minimal, and growth has been excellent.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <span className="font-heading font-bold text-primary">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">A satisfied customer</p>
                    <p className="text-sm text-muted-foreground">Fish Farmer, Lagos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-animate relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
                <img
                  src="/images/testimonial_fish.jpg"
                  alt="Healthy fingerlings"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:-left-12 w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-heading font-bold text-2xl lg:text-3xl">4.9</span>
                </div>
                <span className="text-sm font-medium">Average rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="gallery-animate font-label font-semibold text-sm tracking-wider text-primary uppercase">Gallery</span>
            <h2 className="gallery-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4">
              A look at life on the farm.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '/images/gallery_01.jpg',
              '/images/gallery_02.jpg',
              '/images/gallery_03.jpg',
              '/images/gallery_04.jpg',
              '/images/gallery_05.jpg',
              '/images/gallery_06.jpg',
            ].map((image, i) => (
              <div
                key={i}
                className="gallery-animate group relative rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-64"
              >
                <img
                  src={image}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-background font-medium p-4">Farm Life</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="contact-animate relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl h-[400px] lg:h-[500px]">
                <img
                  src="/images/contact_pond.jpg"
                  alt="Serene farm pond"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-right-12 w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <MessageCircle className="w-8 h-8 mb-1" />
                <span className="font-heading font-bold text-lg">Quick Response</span>
              </div>
            </div>
            <div className="contact-animate">
              <span className="font-label font-semibold text-sm tracking-wider text-primary uppercase">Contact Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mt-4 mb-4">
                Let's talk fish.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Ask about availability, pricing, or farm support. We reply quickly on WhatsApp.
              </p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name *"
                    className="w-full bg-card border border-input rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="Phone Number *"
                    className="w-full bg-card border border-input rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  placeholder="Email Address (optional)"
                  className="w-full bg-card border border-input rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message *"
                  rows={4}
                  className="w-full bg-card border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-14 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send via WhatsApp
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6">
                <button
                  onClick={() => handleQuickInquiry('general inquiry')}
                  className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl h-12 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat directly on WhatsApp
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>dejiolanikefarm@email.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+234 8023699850</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Fish className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl text-background">
                  DejiOlanike Farm
                </span>
              </div>
              <p className="text-background/80 leading-relaxed">
                Quality fingerlings. Practical support. Lasting growth.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-background mb-4">Products</h4>
              <ul className="space-y-2">
                {['Fingerlings', 'Table-size Fish', 'Supplies'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleQuickInquiry(item)}
                      className="text-background/80 hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-background mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Gallery', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === 'About') scrollToSection(aboutRef);
                        if (item === 'Gallery') scrollToSection(galleryRef);
                        if (item === 'Contact') scrollToSection(contactRef);
                      }}
                      className="text-background/80 hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-background mb-4">Get Started</h4>
              <p className="text-background/80 mb-4">Ready to order quality fingerlings?</p>
              <button
                onClick={() => handleQuickInquiry('fingerlings order')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Order on WhatsApp
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2026 DejiOlanike Farm. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['WhatsApp', 'Facebook', 'Instagram'].map((social) => (
                <button
                  key={social}
                  onClick={() => social === 'WhatsApp' && handleQuickInquiry('connect on social media')}
                  className="text-background/60 hover:text-primary text-sm transition-colors"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;