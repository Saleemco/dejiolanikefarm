import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Droplets, Fish, Phone, Mail, MapPin, ChevronDown, Star, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Hero entrance animation
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .fromTo('.hero-bg', { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' })
      .fromTo('.hero-title span', { y: 26, opacity: 0, rotateX: 18 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.06, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-subtitle', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .fromTo('.hero-cta', { y: 18, scale: 0.98, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .fromTo('.scroll-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    // Scroll hint animation
    gsap.to('.scroll-hint', { y: 8, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Setup scroll animations for sections
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

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
  };

  const navLinks = [
    { label: 'Home', ref: heroRef },
    { label: 'About', ref: aboutRef },
    { label: 'Products', ref: productsRef },
    { label: 'Services', ref: whyRef },
    { label: 'Gallery', ref: galleryRef },
    { label: 'Contact', ref: contactRef },
  ];

  return (
    <div className="min-h-screen bg-[#F4FBF9]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#2EC4B6] flex items-center justify-center">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <span className={`font-heading font-bold text-lg lg:text-xl ${isScrolled ? 'text-[#0B3C3C]' : 'text-[#0B3C3C]'}`}>
                DejiOlanike Farm
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.ref)}
                  className={`font-medium text-sm hover:text-[#2EC4B6] transition-colors ${isScrolled ? 'text-[#3A5A5A]' : 'text-[#3A5A5A]'}`}
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection(contactRef)}
                className="bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-xl px-6"
              >
                Order Fingerlings
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#2EC4B6]/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-[#0B3C3C]" /> : <Menu className="w-6 h-6 text-[#0B3C3C]" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E6F6F2]">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.ref)}
                  className="block w-full text-left px-4 py-3 rounded-xl text-[#3A5A5A] hover:bg-[#E6F6F2] hover:text-[#0B3C3C] transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection(contactRef)}
                className="w-full bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-xl mt-4"
              >
                Order Fingerlings
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0">
          <img
            src="/images/hero_pond.jpg"
            alt="Fresh pond water"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F4FBF9]/40 via-[#F4FBF9]/60 to-[#F4FBF9]/90" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20">
          <h1 className="hero-title font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#0B3C3C] leading-tight mb-6">
            <span className="inline-block">Fresh</span>{' '}
            <span className="inline-block">&</span>{' '}
            <span className="inline-block">Healthy</span>{' '}
            <span className="inline-block text-[#2EC4B6]">Catfish</span>{' '}
            <span className="inline-block text-[#2EC4B6]">Fingerlings</span>{' '}
            <span className="inline-block">You</span>{' '}
            <span className="inline-block">Can</span>{' '}
            <span className="inline-block">Trust</span>
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl text-[#3A5A5A] max-w-2xl mx-auto mb-10">
            Reliable supply for farmers, businesses, and households—delivered with care.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection(contactRef)}
              size="lg"
              className="bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-[#2EC4B6]/25"
            >
              Order Fingerlings
            </Button>
            <Button
              onClick={() => scrollToSection(contactRef)}
              size="lg"
              variant="outline"
              className="border-2 border-[#0B3C3C] text-[#0B3C3C] hover:bg-[#0B3C3C] hover:text-white rounded-xl px-8 py-6 text-lg font-semibold"
            >
              Contact Us
            </Button>
          </div>
        </div>

        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#3A5A5A]">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="about-animate order-2 lg:order-1">
              <span className="font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">About Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4 mb-6">
                We raise strong fingerlings with care and clean water.
              </h2>
              <p className="text-[#3A5A5A] text-lg leading-relaxed mb-8">
                DejiOlanike Farm is a family-run aquaculture business focused on healthy stock, consistent supply, and practical guidance for every customer.
              </p>
              <ul className="space-y-4">
                {['Hatchery-bred for vigor', 'Fast-growing, disease-resistant stock', 'Support for first-time farmers'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2EC4B6] flex-shrink-0" />
                    <span className="text-[#0B3C3C] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-animate relative order-1 lg:order-2">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl">
                <img
                  src="/images/about_farm.jpg"
                  alt="Holding a fingerling"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:-left-12 w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-[#2EC4B6] flex flex-col items-center justify-center text-white shadow-lg animate-float">
                <span className="font-heading font-bold text-3xl lg:text-4xl">10K+</span>
                <span className="text-sm font-medium text-center px-2">Fingerlings supplied</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#E6F6F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="product-animate font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">Our Products</span>
            <h2 className="product-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4 mb-4">
              Everything you need to start or restock your farm.
            </h2>
            <button className="product-animate inline-flex items-center gap-2 text-[#2EC4B6] font-semibold hover:gap-3 transition-all">
              View full catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: '/images/product_fingerlings.jpg',
                title: 'Catfish Fingerlings',
                description: 'Strong, active juveniles ready for pond stocking.',
              },
              {
                image: '/images/product_tablesize.jpg',
                title: 'Table-Size Catfish',
                description: 'Fresh, mature fish for markets and kitchens.',
              },
              {
                image: '/images/product_supplies.jpg',
                title: 'Farming Supplies',
                description: 'Feeds, water tools, and practical guidance.',
              },
            ].map((product, i) => (
              <div
                key={i}
                className="product-animate group bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-[#0B3C3C] mb-2">{product.title}</h3>
                  <p className="text-[#3A5A5A] mb-4">{product.description}</p>
                  <Button
                    onClick={() => scrollToSection(contactRef)}
                    variant="outline"
                    className="w-full border-[#2EC4B6] text-[#2EC4B6] hover:bg-[#2EC4B6] hover:text-white rounded-xl"
                  >
                    Inquire Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={whyRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="why-animate relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl">
                <img
                  src="/images/why_pond.jpg"
                  alt="Farm pond"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-right-12 w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-[#0B3C3C] flex flex-col items-center justify-center text-white shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <span className="font-heading font-bold text-3xl lg:text-4xl">100%</span>
                <span className="text-sm font-medium text-center px-2">Healthy Stock Guarantee</span>
              </div>
            </div>
            <div className="why-animate">
              <span className="font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">Why Choose Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4 mb-6">
                Healthy stock. Honest service. Reliable delivery.
              </h2>
              <p className="text-[#3A5A5A] text-lg leading-relaxed mb-8">
                We combine hatchery expertise with on-the-ground support—so you grow with confidence.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Water-quality first approach',
                  'Batch tracking & transparency',
                  'Flexible order sizes',
                  'Guidance for new farmers',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#2EC4B6]" />
                    </div>
                    <span className="text-[#0B3C3C] font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Order Section */}
      <section ref={stepsRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#E6F6F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="step-animate font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">How to Order</span>
            <h2 className="step-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4">
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
                className="step-animate relative bg-white rounded-[28px] p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="absolute top-4 right-4 text-8xl font-heading font-bold text-[#2EC4B6]/10 leading-none">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#2EC4B6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#0B3C3C] mb-3">{item.title}</h3>
                  <p className="text-[#3A5A5A]">{item.description}</p>
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
              <span className="font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">Testimonials</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4 mb-8">
                Farmers trust us because the results speak.
              </h2>
              <div className="bg-white rounded-[28px] p-8 shadow-lg relative">
                <div className="text-[#2EC4B6] text-6xl font-serif leading-none mb-4">"</div>
                <p className="text-[#3A5A5A] text-lg leading-relaxed mb-6">
                  DejiOlanike delivered active, healthy fingerlings and walked me through stocking. Mortality was minimal, and growth has been excellent.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E6F6F2] flex items-center justify-center">
                    <span className="font-heading font-bold text-[#2EC4B6]">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B3C3C]">A satisfied customer</p>
                    <p className="text-sm text-[#3A5A5A]">Fish Farmer, Lagos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-animate relative">
              <div className="relative rounded-[28px] overflow-hidden shadow-xl">
                <img
                  src="/images/testimonial_fish.jpg"
                  alt="Healthy fingerlings"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:-left-12 w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-[#2EC4B6] flex flex-col items-center justify-center text-white shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
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
      <section ref={galleryRef} className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#E6F6F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="gallery-animate font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">Gallery</span>
            <h2 className="gallery-animate font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4">
              A look at life on the farm.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { image: '/images/gallery_01.jpg', caption: 'Morning pond check' },
              { image: '/images/gallery_02.jpg', caption: 'Clean water, healthy fish' },
              { image: '/images/gallery_03.jpg', caption: 'Careful handling' },
              { image: '/images/gallery_04.jpg', caption: 'Sorting for delivery' },
              { image: '/images/gallery_05.jpg', caption: 'Packaging for transport' },
              { image: '/images/gallery_06.jpg', caption: 'Ready for stocking' },
            ].map((item, i) => (
              <div
                key={i}
                className="gallery-animate group relative rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C3C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-medium p-4">{item.caption}</p>
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
              <div className="relative rounded-[28px] overflow-hidden shadow-xl">
                <img
                  src="/images/contact_pond.jpg"
                  alt="Serene farm pond"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-right-12 w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-[#2EC4B6] flex flex-col items-center justify-center text-white shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <MessageCircle className="w-8 h-8 mb-1" />
                <span className="font-heading font-bold text-lg">Let's Talk</span>
              </div>
            </div>
            <div className="contact-animate">
              <span className="font-label font-semibold text-sm tracking-wider text-[#2EC4B6] uppercase">Contact Us</span>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#0B3C3C] mt-4 mb-4">
                Let's talk fish.
              </h2>
              <p className="text-[#3A5A5A] text-lg leading-relaxed mb-8">
                Ask about availability, pricing, or farm support. We reply quickly.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    className="bg-white border-[#E6F6F2] rounded-xl h-12 focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-white border-[#E6F6F2] rounded-xl h-12 focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                    required
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white border-[#E6F6F2] rounded-xl h-12 focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                />
                <Textarea
                  placeholder="Your Message"
                  rows={4}
                  className="bg-white border-[#E6F6F2] rounded-xl resize-none focus:ring-[#2EC4B6] focus:border-[#2EC4B6]"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-xl h-14 text-lg font-semibold"
                >
                  Send Message
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-[#E6F6F2] space-y-3">
                <div className="flex items-center gap-3 text-[#3A5A5A]">
                  <MapPin className="w-5 h-5 text-[#2EC4B6]" />
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3 text-[#3A5A5A]">
                  <Mail className="w-5 h-5 text-[#2EC4B6]" />
                  <span>saleemahmad2504@email.com</span>
                </div>
                <div className="flex items-center gap-3 text-[#3A5A5A]">
                  <Phone className="w-5 h-5 text-[#2EC4B6]" />
                  <span>+234 XXX XXX XXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B3C3C]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2EC4B6] flex items-center justify-center">
                  <Fish className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-white">
                  DejiOlanike Farm
                </span>
              </div>
              <p className="text-[#E6F6F2]/80 leading-relaxed">
                Quality fingerlings. Practical support. Lasting growth.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Products</h4>
              <ul className="space-y-2">
                {['Fingerlings', 'Table-size Fish', 'Supplies'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(productsRef)}
                      className="text-[#E6F6F2]/80 hover:text-[#2EC4B6] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About', ref: aboutRef },
                  { label: 'Gallery', ref: galleryRef },
                  { label: 'Contact', ref: contactRef },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollToSection(item.ref)}
                      className="text-[#E6F6F2]/80 hover:text-[#2EC4B6] transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Get Started</h4>
              <p className="text-[#E6F6F2]/80 mb-4">Ready to order quality fingerlings?</p>
              <Button
                onClick={() => scrollToSection(contactRef)}
                className="bg-[#2EC4B6] hover:bg-[#25A99C] text-white rounded-xl"
              >
                Order Fingerlings
              </Button>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E6F6F2]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#E6F6F2]/60 text-sm">
              © 2026 DejiOlanike Farm. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['WhatsApp', 'Facebook', 'Instagram'].map((social) => (
                <button
                  key={social}
                  className="text-[#E6F6F2]/60 hover:text-[#2EC4B6] text-sm transition-colors"
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

export default App;
