'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MapPin, 
  Scale, 
  Battery, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Bluetooth,
  BluetoothOff,
  Globe,
  History,
  Trash2,
  Volume2,
  VolumeX,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Heart,
  Baby,
  Sparkles,
  Shield,
  Smartphone,
  Bell,
  User,
  Lock,
  LogIn,
  Loader2
} from 'lucide-react'

// Types
interface StrollerData {
  id: string
  name: string
  location: { lat: number; lng: number; address: string }
  weight: number
  battery: number
  incline: number
  status: 'normal' | 'warning' | 'error'
  bluetoothConnected: boolean
  malfunction: string | null // عطل في العربة
}

interface EventLog {
  id: string
  timestamp: Date
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  messageAr: string
  strollerName: string
}

interface UserData {
  name: string
  email: string
}

// Simulated addresses - All in Riyadh
const simulatedAddresses = [
  'شارع الملك فهد، حي العليا، الرياض',
  'شارع العليا، حي السليمانية، الرياض',
  'شارع التحلية، حي الروضة، الرياض',
  'حي الملز، الرياض',
  'شارع الملك عبدالله، حي الياسمين، الرياض',
  'حي النرجس، الرياض',
  'شارع الأمير تركي، حي الورود، الرياض',
  'حي الصحافة، الرياض',
  'حي النخيل، الرياض',
  'شارع الإمام سعود، حي الفيحاء، الرياض',
  'King Fahd Road, Olaya District, Riyadh',
  'King Abdullah Road, Al Yasmin, Riyadh',
]

// Malfunction types
const malfunctionTypes = [
  { id: 'wheels', ar: 'خلل بالعجلات', en: 'Wheel malfunction' },
  { id: 'brake', ar: 'خلل بالفرامل', en: 'Brake malfunction' },
  { id: 'handle', ar: 'خلل بالمقبض', en: 'Handle malfunction' },
  { id: 'sensor', ar: 'خلل بالحساسات', en: 'Sensor malfunction' },
  { id: 'weight', ar: 'الوزن غير طبيعي', en: 'Abnormal weight' },
  { id: 'connection', ar: 'انقطاع الاتصال', en: 'Connection lost' },
]

// Generate random data - ONLY battery and incline change
const generateRandomData = (currentData: StrollerData): StrollerData => {
  const batteryChange = -(Math.random() * 2)
  const inclineChange = (Math.random() - 0.5) * 6

  const newBattery = Math.max(0, Math.min(100, currentData.battery + batteryChange))
  const newIncline = Math.max(-30, Math.min(30, currentData.incline + inclineChange))

  let status: 'normal' | 'warning' | 'error' = 'normal'
  if (newBattery < 10 || Math.abs(newIncline) > 20) {
    status = 'error'
  } else if (newBattery < 20 || Math.abs(newIncline) > 15 || currentData.malfunction || currentData.weight === 0) {
    status = 'warning'
  }

  return {
    ...currentData,
    battery: Number(newBattery.toFixed(0)),
    incline: Number(newIncline.toFixed(1)),
    status,
  }
}

// Logo Component
function KNFLogo({ size = 60, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/favicon.png" 
        alt="KNF Logo" 
        className="rounded-2xl"
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider" style={{ color: '#E8DCC0' }}>
            KNF
          </span>
          <span className="text-sm" style={{ color: '#B8B0A0', fontFamily: "'Cairo', sans-serif" }}>
            كنف
          </span>
        </div>
      )}
    </div>
  )
}

// Fixed particles
const fixedParticles = [
  { size: 100, left: 10, top: 20, duration: 8, delay: 0 },
  { size: 80, left: 80, top: 10, duration: 10, delay: 1 },
  { size: 120, left: 50, top: 60, duration: 12, delay: 2 },
  { size: 60, left: 20, top: 80, duration: 9, delay: 0.5 },
  { size: 90, left: 70, top: 40, duration: 11, delay: 1.5 },
  { size: 70, left: 30, top: 50, duration: 7, delay: 3 },
]

// Animated Background Particles
function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {fixedParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            width: particle.size,
            height: particle.size,
            background: 'radial-gradient(circle, #E8DCC0 0%, transparent 70%)',
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
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
function FeatureCard({ icon: Icon, title, desc, delay }: {
  icon: React.ElementType
  title: string
  desc: string
  delay: number
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
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#B8B0A0' }}>
          {desc}
        </p>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>('landing')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loginForm, setLoginForm] = useState({ name: '', email: '' })
  const [strollers, setStrollers] = useState<StrollerData[]>([])
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStrollerName, setNewStrollerName] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [alertPopup, setAlertPopup] = useState<{ show: boolean; message: string; type: 'warning' | 'error' } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

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
    about: isRTL ? 'عن كنف' : 'About',
    
    // Hero
    heroTitle: isRTL ? 'نظام عربات الأطفال الذكي' : 'Smart Baby Stroller System',
    heroSubtitle: isRTL 
      ? 'احمِ طفلك بأحدث تقنيات المراقبة الذكية'
      : 'Protect your baby with the latest smart monitoring technology',
    getStarted: isRTL ? 'ابدأ الآن' : 'Get Started',
    learnMore: isRTL ? 'اعرف المزيد' : 'Learn More',
    
    // Login
    loginTitle: isRTL ? 'تسجيل الدخول' : 'Login',
    loginSubtitle: isRTL ? 'سجل دخولك للوصول إلى لوحة التحكم' : 'Sign in to access your dashboard',
    nameLabel: isRTL ? 'الاسم' : 'Name',
    namePlaceholder: isRTL ? 'أدخل اسمك' : 'Enter your name',
    emailLabel: isRTL ? 'البريد الإلكتروني' : 'Email',
    emailPlaceholder: isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    loginBtn: isRTL ? 'دخول' : 'Sign In',
    loggingIn: isRTL ? 'جاري الدخول...' : 'Signing in...',
    welcomeBack: isRTL ? 'مرحباً بك' : 'Welcome back',
    logout: isRTL ? 'تسجيل الخروج' : 'Logout',
    
    // Features
    featuresTitle: isRTL ? 'مميزات التطبيق' : 'App Features',
    featuresSubtitle: isRTL ? 'كل ما تحتاجه لراحة بالك وأمان طفلك' : 'Everything you need for peace of mind',
    
    // App
    dashboard: isRTL ? 'لوحة التحكم' : 'Dashboard',
    location: isRTL ? 'الموقع' : 'Location',
    weight: isRTL ? 'الوزن' : 'Weight',
    battery: isRTL ? 'البطارية' : 'Battery',
    incline: isRTL ? 'الانحدار' : 'Incline',
    status: isRTL ? 'الحالة' : 'Status',
    normal: isRTL ? 'طبيعي' : 'Normal',
    warning: isRTL ? 'تحذير' : 'Warning',
    error: isRTL ? 'خطر' : 'Error',
    addStroller: isRTL ? 'إضافة عربة' : 'Add Stroller',
    strollerName: isRTL ? 'اسم العربة' : 'Stroller Name',
    add: isRTL ? 'إضافة' : 'Add',
    cancel: isRTL ? 'إلغاء' : 'Cancel',
    connectBluetooth: isRTL ? 'اتصال بلوتوث' : 'Connect Bluetooth',
    disconnectBluetooth: isRTL ? 'قطع البلوتوث' : 'Disconnect Bluetooth',
    connected: isRTL ? 'متصل' : 'Connected',
    disconnected: isRTL ? 'غير متصل' : 'Disconnected',
    eventHistory: isRTL ? 'سجل الأحداث' : 'Event History',
    noEvents: isRTL ? 'لا توجد أحداث' : 'No events yet',
    noStrollers: isRTL ? 'لا توجد عربات. أضف عربة للبدء.' : 'No strollers. Add one to get started.',
    alerts: isRTL ? 'التنبيهات' : 'Alerts',
    lowBattery: isRTL ? 'البطارية منخفضة!' : 'Low battery!',
    dangerousIncline: isRTL ? 'انحدار خطر!' : 'Dangerous incline!',
    kg: isRTL ? 'كجم' : 'kg',
    delete: isRTL ? 'حذف' : 'Delete',
    simulating: isRTL ? 'محاكاة' : 'Simulating',
    realTime: isRTL ? 'مباشر' : 'Real-time',
    mute: isRTL ? 'كتم الصوت' : 'Mute',
    unmute: isRTL ? 'تشغيل الصوت' : 'Unmute',
    clearHistory: isRTL ? 'مسح السجل' : 'Clear History',
    back: isRTL ? 'العودة' : 'Back',
    
    // About
    aboutTitle: isRTL ? 'عن كنف' : 'About KNF',
    aboutDesc: isRTL 
      ? 'كنف هو نظام ذكي متكامل لمراقبة عربات الأطفال، صُمم خصيصاً لتوفير راحة البال والأمان لكل أم وأب.'
      : 'KNF is an integrated smart system for monitoring baby strollers, designed to provide peace of mind for every parent.',
    
    // Footer
    footerRights: isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved',
    footerMade: isRTL ? 'صُنع بـ ❤️ لأطفالنا' : 'Made with ❤️ for our children',
  }

  // Features
  const features = [
    { icon: MapPin, title: isRTL ? 'تتبع الموقع' : 'GPS Tracking', desc: isRTL ? 'تتبع موقع عربة طفلك في الوقت الفعلي' : 'Track your stroller in real-time', delay: 0 },
    { icon: Battery, title: isRTL ? 'مراقبة البطارية' : 'Battery Monitoring', desc: isRTL ? 'تنبيهات فورية عند انخفاض البطارية' : 'Instant low battery alerts', delay: 100 },
    { icon: TrendingUp, title: isRTL ? 'قياس الانحدار' : 'Incline Detection', desc: isRTL ? 'تنبيهات عند وجود انحدار خطر' : 'Dangerous incline alerts', delay: 200 },
    { icon: Bluetooth, title: isRTL ? 'اتصال بلوتوث' : 'Bluetooth Connection', desc: isRTL ? 'اتصال سلس مع العربة' : 'Seamless stroller connection', delay: 300 },
    { icon: Bell, title: isRTL ? 'تنبيهات فورية' : 'Instant Alerts', desc: isRTL ? 'إشعارات صوتية وبصرية' : 'Audio and visual notifications', delay: 400 },
    { icon: Baby, title: isRTL ? 'دعم عربات متعددة' : 'Multi-Stroller Support', desc: isRTL ? 'إدارة عدة عربات في وقت واحد' : 'Manage multiple strollers', delay: 500 },
  ]

  // Handle Login
  const handleLogin = async () => {
    if (!loginForm.name.trim() || !loginForm.email.trim()) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setUser({
      name: loginForm.name,
      email: loginForm.email
    })
    
    setIsLoading(false)
    setCurrentView('app')
  }

  // Handle Logout
  const handleLogout = () => {
    setUser(null)
    setLoginForm({ name: '', email: '' })
    setCurrentView('landing')
  }

  // Play alert sound
  const playAlertSound = useCallback((type: 'warning' | 'error') => {
    if (isMuted) return
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.value = type === 'error' ? 800 : 600
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3
      
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.2)
    } catch (e) {
      console.log('Audio not supported')
    }
  }, [isMuted])

  // Add event log
  const addEventLog = useCallback((type: EventLog['type'], message: string, messageAr: string, strollerName: string) => {
    const newLog: EventLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      messageAr,
      strollerName,
    }
    setEventLogs(prev => [newLog, ...prev].slice(0, 50))
  }, [])

  // Show alert popup
  const showAlert = useCallback((message: string, type: 'warning' | 'error') => {
    setAlertPopup({ show: true, message, type })
    playAlertSound(type)
    setTimeout(() => setAlertPopup(null), 3000)
  }, [playAlertSound])

  // Data simulation effect
  useEffect(() => {
    const currentIds = new Set(strollers.map(s => s.id))
    intervalsRef.current.forEach((interval, id) => {
      if (!currentIds.has(id)) {
        clearInterval(interval)
        intervalsRef.current.delete(id)
      }
    })

    strollers.forEach(stroller => {
      if (!intervalsRef.current.has(stroller.id)) {
        const randomInterval = 3000 + Math.random() * 2000
        
        const interval = setInterval(() => {
          setStrollers(prev => {
            const currentStroller = prev.find(s => s.id === stroller.id)
            if (!currentStroller) return prev
            
            const newData = generateRandomData(currentStroller)
            
            if (currentStroller.battery > 15 && newData.battery <= 15) {
              addEventLog('warning', 'Low battery!', t.lowBattery, stroller.name)
              showAlert(t.lowBattery, 'warning')
            } else if (Math.abs(currentStroller.incline) < 20 && Math.abs(newData.incline) >= 20) {
              addEventLog('error', 'Dangerous incline!', t.dangerousIncline, stroller.name)
              showAlert(t.dangerousIncline, 'error')
            }
            
            return prev.map(s => s.id === stroller.id ? newData : s)
          })
        }, randomInterval)
        
        intervalsRef.current.set(stroller.id, interval)
      }
    })

    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval))
    }
  }, [strollers.map(s => s.id).join(','), addEventLog, showAlert, t])

  // Add stroller
  const handleAddStroller = () => {
    if (!newStrollerName.trim()) return

    const addressIndex = Math.floor(Math.random() * simulatedAddresses.length)
    
    // تحديد إذا كانت العربة ستكون بحالة غير طبيعية (25% احتمال)
    const hasAbnormalCondition = Math.random() < 0.25
    const abnormalType = hasAbnormalCondition ? Math.floor(Math.random() * 4) : -1 // 0: low battery, 1: high incline, 2: malfunction, 3: zero weight
    
    // تحديد الخلل إن وجد
    const hasMalfunction = abnormalType === 2
    const malfunction = hasMalfunction ? malfunctionTypes[Math.floor(Math.random() * malfunctionTypes.length)] : null
    
    // تحديد القيم بناءً على نوع الحالة غير الطبيعية
    let battery = Number((70 + Math.random() * 30).toFixed(0))
    let incline = Number(((Math.random() - 0.5) * 10).toFixed(1))
    let weight = Number((3.5 + Math.random() * 5).toFixed(1))
    let status: 'normal' | 'warning' | 'error' = 'normal'
    
    if (abnormalType === 0) {
      // بطارية منخفضة جداً
      battery = Number((5 + Math.random() * 10).toFixed(0))
      status = 'error'
    } else if (abnormalType === 1) {
      // انحدار خطر
      incline = Number((18 + Math.random() * 10).toFixed(1))
      status = 'error'
    } else if (abnormalType === 2) {
      // خلل في العربة
      status = 'warning'
    } else if (abnormalType === 3) {
      // وزن صفر (الطفل ليس في العربة)
      weight = 0
      status = 'warning'
    }
    
    const newStroller: StrollerData = {
      id: Date.now().toString(),
      name: newStrollerName.trim(),
      location: {
        lat: 24.7136 + (Math.random() - 0.5) * 0.05,
        lng: 46.6753 + (Math.random() - 0.5) * 0.05,
        address: simulatedAddresses[addressIndex],
      },
      weight,
      battery,
      incline,
      status,
      bluetoothConnected: false,
      malfunction: malfunction?.id || null,
    }

    setStrollers(prev => [...prev, newStroller])
    addEventLog('success', `Stroller "${newStrollerName}" added`, `تمت إضافة العربة "${newStrollerName}"`, newStrollerName)
    
    // إضافة تنبيه الخلل إن وجد
    if (malfunction) {
      setTimeout(() => {
        addEventLog('error', `${newStrollerName}: ${malfunction.en}`, `${newStrollerName}: ${malfunction.ar}`, newStrollerName)
        showAlert(malfunction.ar, 'error')
      }, 500)
    } else if (abnormalType === 0) {
      setTimeout(() => {
        addEventLog('warning', `${newStrollerName}: Low battery!`, `${newStrollerName}: البطارية منخفضة!`, newStrollerName)
        showAlert('البطارية منخفضة!', 'warning')
      }, 500)
    } else if (abnormalType === 1) {
      setTimeout(() => {
        addEventLog('error', `${newStrollerName}: Dangerous incline!`, `${newStrollerName}: انحدار خطر!`, newStrollerName)
        showAlert('انحدار خطر!', 'error')
      }, 500)
    } else if (abnormalType === 3) {
      setTimeout(() => {
        addEventLog('warning', `${newStrollerName}: Weight disappeared - child not in stroller!`, `${newStrollerName}: الوزن اختفى - الطفل ليس في العربة!`, newStrollerName)
        showAlert('الطفل ليس في العربة!', 'warning')
      }, 500)
    }
    
    setNewStrollerName('')
    setIsAddDialogOpen(false)
  }

  // Delete stroller
  const handleDeleteStroller = (id: string) => {
    const stroller = strollers.find(s => s.id === id)
    if (stroller) {
      setStrollers(prev => prev.filter(s => s.id !== id))
      addEventLog('info', `Stroller "${stroller.name}" removed`, `تم حذف العربة "${stroller.name}"`, stroller.name)
    }
  }

  // Toggle Bluetooth
  const toggleBluetooth = (id: string) => {
    setStrollers(prev => prev.map(s => {
      if (s.id === id) {
        const newConnected = !s.bluetoothConnected
        addEventLog(
          newConnected ? 'success' : 'info',
          newConnected ? `Bluetooth connected to ${s.name}` : `Bluetooth disconnected from ${s.name}`,
          newConnected ? `تم الاتصال بالبلوتوث مع ${s.name}` : `تم قطع البلوتوث مع ${s.name}`,
          s.name
        )
        return { ...s, bluetoothConnected: newConnected }
      }
      return s
    }))
  }

  // Clear history
  const clearHistory = () => {
    setEventLogs([])
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Get status color
  const getStatusColor = (status: StrollerData['status']) => {
    switch (status) {
      case 'normal': return 'bg-[#7A9A7A]'
      case 'warning': return 'bg-[#B8A060]'
      case 'error': return 'bg-[#8B5A5A]'
    }
  }

  // ============== LANDING PAGE ==============
  if (currentView === 'landing') {
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
              <KNFLogo size={48} />
              
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
                  onClick={() => setCurrentView('login')}
                >
                  {t.getStarted}
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
                  onClick={() => { setCurrentView('login'); setIsMenuOpen(false); }}
                >
                  {t.getStarted}
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
                <img 
                  src="/favicon.png" 
                  alt="KNF Logo" 
                  className="rounded-2xl"
                  style={{ width: 120, height: 120, objectFit: 'contain' }}
                />
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
              كنف
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
                onClick={() => setCurrentView('login')}
              >
                {t.getStarted}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 h-14 text-lg border-2 hover-lift"
                style={{ borderColor: '#E8DCC0', color: '#E8DCC0' }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
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
                    title={feature.title}
                    desc={feature.desc}
                    delay={feature.delay}
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
                {isRTL ? 'كيف يعمل كنف؟' : 'How KNF Works?'}
              </h2>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '01', title: isRTL ? 'حمّل التطبيق' : 'Download the App', desc: isRTL ? 'حمل تطبيق كنف على هاتفك' : 'Download the KNF app', icon: Smartphone },
                { num: '02', title: isRTL ? 'اربط العربة' : 'Connect the Stroller', desc: isRTL ? 'اتصل بالعربة عبر البلوتوث' : 'Connect via Bluetooth', icon: Bluetooth },
                { num: '03', title: isRTL ? 'استمتع بالأمان' : 'Enjoy Peace of Mind', desc: isRTL ? 'راقب طفلك واحصل على تنبيهات' : 'Monitor and get alerts', icon: Shield },
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
                        <img 
                          src="/favicon.png" 
                          alt="KNF Logo" 
                          className="rounded-2xl"
                          style={{ width: 120, height: 120, objectFit: 'contain' }}
                        />
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
                <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse" style={{ color: '#E8DCC0' }} />
                <h2 
                  className="text-3xl sm:text-4xl font-bold mb-4"
                  style={{ color: '#E8DCC0' }}
                >
                  {isRTL ? 'جاهز لحماية طفلك؟' : 'Ready to Protect Your Baby?'}
                </h2>
                <p 
                  className="text-lg mb-8"
                  style={{ color: '#B8B0A0' }}
                >
                  {isRTL ? 'انضم إلى آلاف العائلات التي تثق بكنف' : 'Join thousands of families who trust KNF'}
                </p>
                <Button 
                  size="lg"
                  className="rounded-2xl px-10 h-14 text-lg font-semibold hover-lift"
                  style={{ background: '#E8DCC0', color: '#2D3A2B' }}
                  onClick={() => setCurrentView('login')}
                >
                  {t.getStarted}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 relative z-10 border-t" style={{ borderColor: 'rgba(232, 220, 192, 0.1)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <KNFLogo size={40} />
              <p className="text-sm text-center" style={{ color: '#B8B0A0' }}>
                © 2026 KNFكنف. {t.footerRights}
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

  // ============== LOGIN PAGE ==============
  if (currentView === 'login') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ 
          fontFamily: isRTL ? "'Cairo', sans-serif" : undefined,
          background: 'linear-gradient(135deg, #2D3A2B 0%, #1E2B1C 50%, #2D3A2B 100%)'
        }}
      >
        <ParticleBackground />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          className="fixed top-4 start-4 z-50 rounded-xl gap-2"
          style={{ color: '#B8B0A0' }}
          onClick={() => setCurrentView('landing')}
        >
          <ArrowRight className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
          {t.back}
        </Button>

        {/* Language Switcher */}
        <Button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          variant="ghost"
          size="sm"
          className="fixed top-4 end-4 z-50 gap-2 rounded-xl"
          style={{ color: '#E8DCC0' }}
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>

        {/* Login Card */}
        <div className="w-full max-w-md px-4 z-10">
          <Card 
            className="border-0 rounded-3xl overflow-hidden glass animate-fade-in-scale"
            style={{ background: 'rgba(45, 58, 43, 0.8)' }}
          >
            <CardContent className="p-8">
              {/* Logo */}
              <div className="text-center mb-8 animate-fade-in-up">
                <div className="inline-block p-3 rounded-2xl mb-4" style={{ background: 'rgba(232, 220, 192, 0.1)' }}>
                  <img 
                    src="/favicon.png" 
                    alt="KNF Logo" 
                    className="rounded-xl mx-auto"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#E8DCC0' }}>
                  {t.loginTitle}
                </h1>
                <p className="text-sm" style={{ color: '#B8B0A0' }}>
                  {t.loginSubtitle}
                </p>
              </div>

              {/* Login Form */}
              <div className="space-y-6 animate-fade-in-up delay-200">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2" style={{ color: '#E8DCC0' }}>
                    <User className="w-4 h-4" />
                    {t.nameLabel}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    placeholder={t.namePlaceholder}
                    className="h-12 rounded-xl bg-[#3A4A3A] border-[#5A6A5A] text-[#E8DCC0] placeholder-[#8A8070]"
                    disabled={isLoading}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2" style={{ color: '#E8DCC0' }}>
                    <Lock className="w-4 h-4" />
                    {t.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="h-12 rounded-xl bg-[#3A4A3A] border-[#5A6A5A] text-[#E8DCC0] placeholder-[#8A8070]"
                    disabled={isLoading}
                  />
                </div>

                {/* Login Button */}
                <Button
                  className="w-full h-12 rounded-xl text-lg font-semibold group"
                  style={{ background: '#E8DCC0', color: '#2D3A2B' }}
                  onClick={handleLogin}
                  disabled={isLoading || !loginForm.name.trim() || !loginForm.email.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t.loggingIn}
                    </>
                  ) : (
                    <>
                      <LogIn className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.loginBtn}
                    </>
                  )}
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ============== APP VIEW ==============
  return (
    <div 
      className="min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        fontFamily: isRTL ? "'Cairo', 'Tajawal', sans-serif" : undefined,
        background: 'linear-gradient(135deg, #2D3A2B 0%, #4F634F 50%, #2D3A2B 100%)'
      }}
    >
      {/* Alert Popup */}
      {alertPopup?.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
            alertPopup.type === 'error' 
              ? 'bg-[#8B5A5A] text-[#E8DCC0]' 
              : 'bg-[#B8A060] text-[#2D3A2B]'
          }`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-semibold">{alertPopup.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-[#5A6A5A]/30" style={{ background: 'rgba(45, 58, 43, 0.9)' }}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/favicon.png" 
                alt="KNF Logo" 
                className="rounded-xl"
                style={{ width: 48, height: 48, objectFit: 'contain' }}
              />
              <div>
                <h1 className="text-xl font-bold text-[#E8DCC0] tracking-wider">
                  KNF
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-[#B8B0A0]">
                  <span className={`w-2 h-2 rounded-full bg-[#7A9A7A] animate-pulse`}></span>
                  <span>{t.realTime}</span>
                  <span className="text-[#6A8A6A]">•</span>
                  <span>{t.simulating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mute Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-xl hover:bg-[#4F634F] text-[#E8DCC0]"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-[#B8B0A0]" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#E8DCC0]" />
                )}
              </Button>
              
              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="rounded-xl hover:bg-[#4F634F] text-[#E8DCC0]"
              >
                <Globe className="w-5 h-5" />
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl hover:bg-[#8B5A5A]/30 text-[#E8DCC0] text-xs gap-1"
              >
                <User className="w-4 h-4" />
                {t.logout}
              </Button>
            </div>
          </div>

          {/* User Welcome */}
          {user && (
            <div className="mt-2 text-xs text-center" style={{ color: '#7A9A7A' }}>
              {t.welcomeBack}, <span className="font-semibold">{user.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-3 text-center border border-[#5A6A5A]/30" style={{ background: 'rgba(68, 87, 68, 0.8)' }}>
            <div className="text-2xl font-bold text-[#E8DCC0]">{strollers.length}</div>
            <div className="text-xs text-[#B8B0A0]">
              {language === 'ar' ? 'العربات' : 'Strollers'}
            </div>
          </div>
          <div className="rounded-2xl p-3 text-center border border-[#5A6A5A]/30" style={{ background: 'rgba(68, 87, 68, 0.8)' }}>
            <div className="text-2xl font-bold text-[#7A9A7A]">
              {strollers.filter(s => s.status === 'normal').length}
            </div>
            <div className="text-xs text-[#B8B0A0]">{t.normal}</div>
          </div>
          <div className="rounded-2xl p-3 text-center border border-[#5A6A5A]/30" style={{ background: 'rgba(68, 87, 68, 0.8)' }}>
            <div className="text-2xl font-bold text-[#B8A060]">
              {strollers.filter(s => s.status !== 'normal').length}
            </div>
            <div className="text-xs text-[#B8B0A0]">{t.alerts}</div>
          </div>
        </div>

        {/* Strollers List */}
        {strollers.length === 0 ? (
          <Card className="border border-[#5A6A5A]/30 rounded-3xl overflow-hidden" style={{ background: 'rgba(68, 87, 68, 0.6)' }}>
            <CardContent className="py-12 text-center">
              <img 
                src="/favicon.png" 
                alt="KNF Logo" 
                className="mx-auto mb-4 opacity-50 rounded-xl"
                style={{ width: 64, height: 64, objectFit: 'contain' }}
              />
              <p className="text-[#B8B0A0]">{t.noStrollers}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {strollers.map((stroller, index) => (
              <Card 
                key={stroller.id} 
                className="border border-[#5A6A5A]/30 rounded-3xl overflow-hidden animate-fade-in"
                style={{ background: 'rgba(68, 87, 68, 0.6)', animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-[#E8DCC0] flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(stroller.status)} animate-pulse`} />
                      {stroller.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={stroller.bluetoothConnected ? "default" : "secondary"}
                        className={`rounded-xl cursor-pointer transition-all ${
                          stroller.bluetoothConnected 
                            ? 'bg-[#7A9A7A] hover:bg-[#6A8A6A] text-[#E8DCC0]' 
                            : 'bg-[#4F634F] text-[#B8B0A0]'
                        }`}
                        onClick={() => toggleBluetooth(stroller.id)}
                      >
                        {stroller.bluetoothConnected ? (
                          <Bluetooth className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <BluetoothOff className="w-3.5 h-3.5 mr-1" />
                        )}
                        {stroller.bluetoothConnected ? t.connected : t.disconnected}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStroller(stroller.id)}
                        className="rounded-xl hover:bg-[#8B5A5A]/30 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-[#8B5A5A]" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.location}</span>
                      </div>
                      <div className="text-xs text-[#E8DCC0] truncate">
                        {stroller.location.address}
                      </div>
                    </div>
                    
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <Scale className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.weight}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#E8DCC0]">
                          {stroller.weight.toFixed(1)}
                        </span>
                        <span className="text-xs text-[#B8B0A0]">{t.kg}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <Battery className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.battery}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${stroller.battery <= 15 ? 'text-[#8B5A5A]' : 'text-[#E8DCC0]'}`}>
                            {stroller.battery.toFixed(0)}
                          </span>
                          <span className="text-xs text-[#B8B0A0]">%</span>
                        </div>
                        <Progress 
                          value={stroller.battery} 
                          className={`h-1.5 ${stroller.battery <= 15 ? '[&>div]:bg-[#8B5A5A]' : '[&>div]:bg-[#7A9A7A]'}`}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.incline}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${Math.abs(stroller.incline) > 15 ? 'text-[#8B5A5A] animate-pulse' : 'text-[#E8DCC0]'}`}>
                          {stroller.incline > 0 ? '+' : ''}{stroller.incline.toFixed(1)}
                        </span>
                        <span className="text-xs text-[#B8B0A0]">°</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-2xl"
                    style={{ 
                      background: stroller.status === 'normal' 
                        ? 'rgba(122, 154, 122, 0.3)' 
                        : stroller.status === 'warning'
                        ? 'rgba(184, 160, 96, 0.3)'
                        : 'rgba(139, 90, 90, 0.3)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {stroller.status === 'normal' ? (
                        <CheckCircle className="w-5 h-5 text-[#7A9A7A]" />
                      ) : stroller.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-[#B8A060]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#8B5A5A]" />
                      )}
                      <span className={`font-medium ${
                        stroller.status === 'normal' 
                          ? 'text-[#7A9A7A]' 
                          : stroller.status === 'warning'
                          ? 'text-[#B8A060]'
                          : 'text-[#8B5A5A]'
                      }`}>
                        {t[stroller.status]}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`rounded-xl ${
                        stroller.status === 'normal' 
                          ? 'border-[#7A9A7A] text-[#7A9A7A]' 
                          : stroller.status === 'warning'
                          ? 'border-[#B8A060] text-[#B8A060]'
                          : 'border-[#8B5A5A] text-[#8B5A5A]'
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </div>
                  
                  {/* Malfunction Alert */}
                  {stroller.malfunction && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#8B5A5A]/20 border border-[#8B5A5A]/30">
                      <AlertTriangle className="w-5 h-5 text-[#8B5A5A] animate-pulse" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#8B5A5A]">
                          {language === 'ar' 
                            ? malfunctionTypes.find(m => m.id === stroller.malfunction)?.ar 
                            : malfunctionTypes.find(m => m.id === stroller.malfunction)?.en}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Weight Zero Alert (Child not in stroller) */}
                  {stroller.weight === 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#B8A060]/20 border border-[#B8A060]/30">
                      <AlertTriangle className="w-5 h-5 text-[#B8A060] animate-pulse" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#B8A060]">
                          {language === 'ar' ? 'الطفل ليس في العربة!' : 'Child not in stroller!'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => toggleBluetooth(stroller.id)}
                    className={`w-full rounded-2xl h-11 ${
                      stroller.bluetoothConnected
                        ? 'bg-[#7A9A7A] hover:bg-[#6A8A6A] text-[#E8DCC0]'
                        : 'bg-[#E8DCC0] hover:bg-[#D8D0C0] text-[#2D3A2B]'
                    }`}
                  >
                    {stroller.bluetoothConnected ? (
                      <>
                        <BluetoothOff className="w-4 h-4 mr-2" />
                        {t.disconnectBluetooth}
                      </>
                    ) : (
                      <>
                        <Bluetooth className="w-4 h-4 mr-2" />
                        {t.connectBluetooth}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Event History */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#E8DCC0] flex items-center gap-2">
              <History className="w-5 h-5 text-[#B8B0A0]" />
              {t.eventHistory}
            </h2>
            {eventLogs.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearHistory}
                className="text-xs text-[#B8B0A0] hover:text-[#E8DCC0] hover:bg-[#4F634F]"
              >
                {t.clearHistory}
              </Button>
            )}
          </div>
          
          <Card className="border border-[#5A6A5A]/30 rounded-3xl overflow-hidden" style={{ background: 'rgba(68, 87, 68, 0.6)' }}>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                {eventLogs.length === 0 ? (
                  <div className="py-8 text-center text-[#B8B0A0]">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t.noEvents}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#5A6A5A]/30">
                    {eventLogs.map((log) => (
                      <div key={log.id} className="px-4 py-3 hover:bg-[#4F634F]/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            log.type === 'error' ? 'bg-[#8B5A5A]' :
                            log.type === 'warning' ? 'bg-[#B8A060]' :
                            log.type === 'success' ? 'bg-[#7A9A7A]' :
                            'bg-[#B8B0A0]'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#E8DCC0]">
                              {language === 'ar' ? log.messageAr : log.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#B8B0A0]">
                              <span>{log.strollerName}</span>
                              <span>•</span>
                              <span>{formatTime(log.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Add Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl h-14 px-6 shadow-2xl gap-2 bg-[#E8DCC0] hover:bg-[#D8D0C0] text-[#2D3A2B] font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t.addStroller}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-sm bg-[#445744] border-[#5A6A5A]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[#E8DCC0]">{t.addStroller}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="strollerName" className="text-[#E8DCC0]">{t.strollerName}</Label>
              <Input
                id="strollerName"
                value={newStrollerName}
                onChange={(e) => setNewStrollerName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عربة أحمد' : 'e.g., Baby Stroller 1'}
                className="rounded-xl h-11 bg-[#4F634F] border-[#5A6A5A] text-[#E8DCC0] placeholder-[#B8B0A0]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStroller()}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 rounded-xl h-11 bg-[#4F634F] hover:bg-[#5A7A5A] text-[#E8DCC0]"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleAddStroller}
                disabled={!newStrollerName.trim()}
                className="flex-1 rounded-xl h-11 bg-[#E8DCC0] hover:bg-[#D8D0C0] text-[#2D3A2B]"
              >
                {t.add}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
