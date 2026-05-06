'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Battery, 
  TrendingUp, 
  Bell, 
  Bluetooth, 
  Shield, 
  Smartphone, 
  Globe,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Heart,
  Baby,
  Sparkles
} from 'lucide-react'

// KINF Logo Component - Exact match to uploaded image
function KINFLogo({ size = 60, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        style={{ 
          width: size, 
          height: size,
          background: '#2D3A2B'
        }}
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full p-2"
        >
          {/* K Letter */}
          <text 
            x="10" 
            y="75" 
            fontSize="55" 
            fontWeight="bold" 
            fontFamily="sans-serif" 
            fill="#E8DCC0"
          >
            K
          </text>
          
          {/* I Letter */}
          <text 
            x="45" 
            y="75" 
            fontSize="55" 
            fontWeight="bold" 
            fontFamily="sans-serif" 
            fill="#E8DCC0"
          >
            I
          </text>
          
          {/* N Letter */}
          <text 
            x="60" 
            y="75" 
            fontSize="55" 
            fontWeight="bold" 
            fontFamily="sans-serif" 
            fill="#E8DCC0"
          >
            N
          </text>
          
          {/* F Letter */}
          <text 
            x="95" 
            y="75" 
            fontSize="55" 
            fontWeight="bold" 
            fontFamily="sans-serif" 
            fill="#E8DCC0"
          >
            F
          </text>
          
          {/* Baby Stroller Icon */}
          <g transform="translate(35, 85) scale(0.5)">
            {/* Stroller body */}
            <rect x="5" y="5" width="40" height="18" rx="4" fill="#E8DCC0" opacity="0.8" />
            {/* Canopy */}
            <path d="M5 12 Q5 0 25 0 Q45 0 45 12 L45 18 L5 18 Z" fill="#E8DCC0" />
            {/* Wheels */}
            <circle cx="15" cy="32" r="6" fill="none" stroke="#E8DCC0" strokeWidth="2.5" />
            <circle cx="35" cy="32" r="6" fill="none" stroke="#E8DCC0" strokeWidth="2.5" />
            {/* Handle */}
            <line x1="45" y1="10" x2="55" y2="3" stroke="#E8DCC0" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider" style={{ color: '#E8DCC0' }}>
            KINF
          </span>
          <span className="text-sm" style={{ color: '#B8B0A0', fontFamily: "'Cairo', sans-serif" }}>
            كِنف
          </span>
        </div>
      )}
    </div>
  )
}

// Animated Background Particles
function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating circles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            background: 'radial-gradient(circle, #E8DCC0 0%, transparent 70%)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Gradient orbs */}
      <div 
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #7A9A7A 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #B8B0A0 0%, transparent 70%)' }}
      />
    </div>
  )
}

// Section wrapper with scroll animation
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, titleAr, titleEn, descAr, descEn, delay, language }: {
  icon: React.ElementType
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  delay: number
  language: 'ar' | 'en'
}) {
  return (
    <Card 
      className="group border-0 rounded-3xl overflow-hidden hover-lift glass"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(232, 220, 192, 0.2), rgba(122, 154, 122, 0.2))' }}
        >
          <Icon className="w-7 h-7" style={{ color: '#E8DCC0' }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: '#E8DCC0' }}>
          {language === 'ar' ? titleAr : titleEn}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#B8B0A0' }}>
          {language === 'ar' ? descAr : descEn}
        </p>
      </CardContent>
    </Card>
  )
}

// Stats Counter Component
function StatCounter({ value, suffix, labelAr, labelEn, language }: {
  value: number
  suffix?: string
  labelAr: string
  labelEn: string
  language: 'ar' | 'en'
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#E8DCC0' }}>
        {count}{suffix}
      </div>
      <div className="text-sm" style={{ color: '#B8B0A0' }}>
        {language === 'ar' ? labelAr : labelEn}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isRTL = language === 'ar'

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Translations
  const t = {
    // Navigation
    home: isRTL ? 'الرئيسية' : 'Home',
    features: isRTL ? 'المميزات' : 'Features',
    about: isRTL ? 'عن كِنف' : 'About',
    download: isRTL ? 'تحميل' : 'Download',
    
    // Hero
    heroTitle: isRTL 
      ? 'نظام عربات الأطفال الذكي' 
      : 'Smart Baby Stroller System',
    heroSubtitle: isRTL 
      ? 'احمِ طفلك بأحدث تقنيات المراقبة الذكية - تتبع الموقع، مراقبة البطارية، تنبيهات فورية، وأكثر'
      : 'Protect your baby with the latest smart monitoring technology - GPS tracking, battery monitoring, instant alerts, and more',
    getStarted: isRTL ? 'ابدأ الآن' : 'Get Started',
    learnMore: isRTL ? 'اعرف المزيد' : 'Learn More',
    
    // Features
    featuresTitle: isRTL ? 'مميزات التطبيق' : 'App Features',
    featuresSubtitle: isRTL 
      ? 'كل ما تحتاجه لراحة بالك وأمان طفلك'
      : 'Everything you need for peace of mind and your baby\'s safety',
    
    // Feature items
    gpsTitle: isRTL ? 'تتبع الموقع' : 'GPS Tracking',
    gpsDesc: isRTL ? 'تتبع موقع عربة طفلك في الوقت الفعلي مع دقة عالية' : 'Track your baby stroller\'s location in real-time with high accuracy',
    
    batteryTitle: isRTL ? 'مراقبة البطارية' : 'Battery Monitoring',
    batteryDesc: isRTL ? 'تنبيهات فورية عند انخفاض البطارية لضمان عدم انقطاع المراقبة' : 'Instant alerts when battery is low to ensure uninterrupted monitoring',
    
    inclineTitle: isRTL ? 'قياس الانحدار' : 'Incline Detection',
    inclineDesc: isRTL ? 'تنبيهات عند وجود انحدار خطر للحفاظ على سلامة طفلك' : 'Alerts for dangerous inclines to keep your baby safe',
    
    bluetoothTitle: isRTL ? 'اتصال بلوتوث' : 'Bluetooth Connection',
    bluetoothDesc: isRTL ? 'اتصال سلس مع العربة عبر تقنية البلوتوث' : 'Seamless connection with the stroller via Bluetooth technology',
    
    alertsTitle: isRTL ? 'تنبيهات فورية' : 'Instant Alerts',
    alertsDesc: isRTL ? 'إشعارات صوتية وبصرية لكل الأحداث المهمة' : 'Audio and visual notifications for all important events',
    
    multiTitle: isRTL ? 'دعم عربات متعددة' : 'Multi-Stroller Support',
    multiDesc: isRTL ? 'إدارة ومتابعة عدة عربات في وقت واحد' : 'Manage and monitor multiple strollers simultaneously',
    
    // Stats
    statsUsers: isRTL ? 'مستخدم نشط' : 'Active Users',
    statsStrollers: isRTL ? 'عربة متصلة' : 'Connected Strollers',
    statsAlerts: isRTL ? 'تنبيه يومي' : 'Daily Alerts',
    statsRating: isRTL ? 'تقييم المستخدمين' : 'User Rating',
    
    // How it works
    howTitle: isRTL ? 'كيف يعمل كِنف؟' : 'How KINF Works?',
    step1Title: isRTL ? 'حمّل التطبيق' : 'Download the App',
    step1Desc: isRTL ? 'حمل تطبيق كِنف على هاتفك الذكي' : 'Download the KINF app on your smartphone',
    step2Title: isRTL ? 'اربط العربة' : 'Connect the Stroller',
    step2Desc: isRTL ? 'اتصل بالعربة عبر البلوتوث بضغطة واحدة' : 'Connect to the stroller via Bluetooth with one tap',
    step3Title: isRTL ? 'استمتع بالأمان' : 'Enjoy Peace of Mind',
    step3Desc: isRTL ? 'راقب طفلك واحصل على تنبيهات فورية' : 'Monitor your baby and get instant alerts',
    
    // About
    aboutTitle: isRTL ? 'عن كِنف' : 'About KINF',
    aboutDesc: isRTL 
      ? 'كِنف هو نظام ذكي متكامل لمراقبة عربات الأطفال، صُمم خصيصاً لتوفير راحة البال والأمان لكل أم وأب. يجمع بين أحدث تقنيات الإنترنت والأجهزة الذكية لحماية أعز ما نملك - أطفالنا.'
      : 'KINF is an integrated smart system for monitoring baby strollers, designed specifically to provide peace of mind and safety for every parent. It combines the latest internet and smart device technologies to protect what we cherish most - our children.',
    
    // CTA
    ctaTitle: isRTL ? 'جاهز لحماية طفلك؟' : 'Ready to Protect Your Baby?',
    ctaDesc: isRTL 
      ? 'انضم إلى آلاف العائلات التي تثق بكِنف'
      : 'Join thousands of families who trust KINF',
    
    // Footer
    footerRights: isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved',
    footerMade: isRTL ? 'صُنع بـ ❤️ لأطفالنا' : 'Made with ❤️ for our children',
  }

  const features = [
    { icon: MapPin, titleAr: t.gpsTitle, titleEn: t.gpsTitle, descAr: t.gpsDesc, descEn: t.gpsDesc, delay: 0 },
    { icon: Battery, titleAr: t.batteryTitle, titleEn: t.batteryTitle, descAr: t.batteryDesc, descEn: t.batteryDesc, delay: 100 },
    { icon: TrendingUp, titleAr: t.inclineTitle, titleEn: t.inclineTitle, descAr: t.inclineDesc, descEn: t.inclineDesc, delay: 200 },
    { icon: Bluetooth, titleAr: t.bluetoothTitle, titleEn: t.bluetoothTitle, descAr: t.bluetoothDesc, descEn: t.bluetoothDesc, delay: 300 },
    { icon: Bell, titleAr: t.alertsTitle, titleEn: t.alertsTitle, descAr: t.alertsDesc, descEn: t.alertsDesc, delay: 400 },
    { icon: Baby, titleAr: t.multiTitle, titleEn: t.multiTitle, descAr: t.multiDesc, descEn: t.multiDesc, delay: 500 },
  ]

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        fontFamily: isRTL ? "'Cairo', sans-serif" : undefined,
        background: 'linear-gradient(135deg, #2D3A2B 0%, #1E2B1C 50%, #2D3A2B 100%)'
      }}
    >
      <ParticleBackground />
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-2xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <KINFLogo size={48} />
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#B8B0A0' }}>
                {t.features}
              </a>
              <a href="#about" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#B8B0A0' }}>
                {t.about}
              </a>
              <Button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                variant="ghost"
                size="sm"
                className="gap-2 rounded-xl"
                style={{ color: '#E8DCC0' }}
              >
                <Globe className="w-4 h-4" />
                {language === 'ar' ? 'EN' : 'عربي'}
              </Button>
              <Button 
                className="rounded-xl px-6"
                style={{ background: '#E8DCC0', color: '#2D3A2B' }}
              >
                {t.download}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                variant="ghost"
                size="icon"
                className="rounded-xl"
                style={{ color: '#E8DCC0' }}
              >
                <Globe className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="icon"
                className="rounded-xl"
                style={{ color: '#E8DCC0' }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t" style={{ borderColor: 'rgba(232, 220, 192, 0.1)' }}>
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-sm" style={{ color: '#B8B0A0' }}>
                {t.features}
              </a>
              <a href="#about" className="block py-2 text-sm" style={{ color: '#B8B0A0' }}>
                {t.about}
              </a>
              <Button 
                className="w-full rounded-xl"
                style={{ background: '#E8DCC0', color: '#2D3A2B' }}
              >
                {t.download}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center z-10">
          {/* Animated Logo */}
          <div className="animate-fade-in-scale mb-8">
            <div className="inline-block p-4 rounded-3xl animate-pulse-glow" style={{ background: 'rgba(45, 58, 43, 0.5)' }}>
              <KINFLogo size={100} showText={false} />
            </div>
          </div>
          
          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up text-shadow"
            style={{ color: '#E8DCC0' }}
          >
            {t.heroTitle}
          </h1>
          
          {/* Arabic Name */}
          <div 
            className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in-up delay-100"
            style={{ color: '#7A9A7A', fontFamily: "'Cairo', sans-serif" }}
          >
            كِنف
          </div>
          
          {/* Subtitle */}
          <p 
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200"
            style={{ color: '#B8B0A0' }}
          >
            {t.heroSubtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Button 
              size="lg"
              className="rounded-2xl px-8 h-14 text-lg font-semibold group hover-lift"
              style={{ background: '#E8DCC0', color: '#2D3A2B' }}
            >
              {t.getStarted}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 h-14 text-lg border-2 hover-lift"
              style={{ borderColor: '#E8DCC0', color: '#E8DCC0' }}
            >
              {t.learnMore}
            </Button>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
            <ChevronDown className="w-8 h-8" style={{ color: '#B8B0A0' }} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-3xl glass"
          >
            <StatCounter value={5000} suffix="+" labelAr={t.statsUsers} labelEn={t.statsUsers} language={language} />
            <StatCounter value={8000} suffix="+" labelAr={t.statsStrollers} labelEn={t.statsStrollers} language={language} />
            <StatCounter value={50000} suffix="+" labelAr={t.statsAlerts} labelEn={t.statsAlerts} language={language} />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-bold mb-2" style={{ color: '#E8DCC0' }}>
                <Star className="w-8 h-8 fill-current" style={{ color: '#FFD700' }} />
                4.9
              </div>
              <div className="text-sm" style={{ color: '#B8B0A0' }}>
                {t.statsRating}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Badge 
              className="mb-4 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(232, 220, 192, 0.1)', color: '#E8DCC0' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t.featuresTitle}
            </Badge>
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: '#E8DCC0' }}
            >
              {t.featuresSubtitle}
            </h2>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <FeatureCard 
                  icon={feature.icon}
                  titleAr={feature.titleAr}
                  titleEn={feature.titleEn}
                  descAr={feature.descAr}
                  descEn={feature.descEn}
                  delay={feature.delay}
                  language={language}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: '#E8DCC0' }}
            >
              {t.howTitle}
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: t.step1Title, desc: t.step1Desc, icon: Smartphone },
              { num: '02', title: t.step2Title, desc: t.step2Desc, icon: Bluetooth },
              { num: '03', title: t.step3Title, desc: t.step3Desc, icon: Shield },
            ].map((step, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <div className="relative text-center p-8 rounded-3xl glass hover-lift">
                  <div 
                    className="text-6xl font-bold mb-4 opacity-20"
                    style={{ color: '#E8DCC0' }}
                  >
                    {step.num}
                  </div>
                  <div 
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(232, 220, 192, 0.2), rgba(122, 154, 122, 0.2))' }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: '#E8DCC0' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#E8DCC0' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#B8B0A0' }}>
                    {step.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <Card className="border-0 rounded-3xl overflow-hidden glass">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="animate-float">
                      <KINFLogo size={120} showText={false} />
                    </div>
                  </div>
                  <div className="text-center md:text-start">
                    <h2 
                      className="text-3xl sm:text-4xl font-bold mb-4"
                      style={{ color: '#E8DCC0' }}
                    >
                      {t.aboutTitle}
                    </h2>
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ color: '#B8B0A0' }}
                    >
                      {t.aboutDesc}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                      {[
                        isRTL ? 'تتبع ذكي' : 'Smart Tracking',
                        isRTL ? 'أمان 24/7' : '24/7 Safety',
                        isRTL ? 'تنبيهات فورية' : 'Instant Alerts',
                      ].map((tag, i) => (
                        <Badge 
                          key={i}
                          className="px-4 py-2 rounded-xl"
                          style={{ background: 'rgba(122, 154, 122, 0.3)', color: '#E8DCC0' }}
                        >
                          <Check className="w-3 h-3 mr-2" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div 
              className="p-12 rounded-3xl relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(122, 154, 122, 0.3), rgba(232, 220, 192, 0.1))',
              }}
            >
              {/* Background decoration */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23E8DCC0\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                }}
              />
              
              <div className="relative z-10">
                <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse" style={{ color: '#E8DCC0' }} />
                <h2 
                  className="text-3xl sm:text-4xl font-bold mb-4"
                  style={{ color: '#E8DCC0' }}
                >
                  {t.ctaTitle}
                </h2>
                <p 
                  className="text-lg mb-8"
                  style={{ color: '#B8B0A0' }}
                >
                  {t.ctaDesc}
                </p>
                <Button 
                  size="lg"
                  className="rounded-2xl px-10 h-14 text-lg font-semibold hover-lift"
                  style={{ background: '#E8DCC0', color: '#2D3A2B' }}
                >
                  {t.getStarted}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 relative z-10 border-t" style={{ borderColor: 'rgba(232, 220, 192, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <KINFLogo size={40} />
            
            <p className="text-sm text-center" style={{ color: '#B8B0A0' }}>
              © 2024 KINFكِنف. {t.footerRights}
            </p>
            
            <div className="flex items-center gap-2 text-sm" style={{ color: '#B8B0A0' }}>
              <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              {t.footerMade}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
