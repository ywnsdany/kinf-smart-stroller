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
  VolumeX
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
}

interface EventLog {
  id: string
  timestamp: Date
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  messageAr: string
  strollerName: string
}

interface Translations {
  appName: string
  appNameAr: string
  dashboard: string
  location: string
  weight: string
  battery: string
  incline: string
  status: string
  normal: string
  warning: string
  error: string
  addStroller: string
  strollerName: string
  add: string
  cancel: string
  connectBluetooth: string
  disconnectBluetooth: string
  connected: string
  disconnected: string
  eventHistory: string
  noEvents: string
  noStrollers: string
  alerts: string
  childRemoved: string
  lowBattery: string
  dangerousIncline: string
  batteryPercent: string
  inclinePercent: string
  kg: string
  delete: string
  simulating: string
  realTime: string
  language: string
  mute: string
  unmute: string
  clearHistory: string
}

// Translations
const translations: { ar: Translations; en: Translations } = {
  ar: {
    appName: 'KINF',
    appNameAr: 'كِنف',
    dashboard: 'لوحة التحكم',
    location: 'الموقع',
    weight: 'الوزن',
    battery: 'البطارية',
    incline: 'الانحدار',
    status: 'الحالة',
    normal: 'طبيعي',
    warning: 'تحذير',
    error: 'خطر',
    addStroller: 'إضافة عربة',
    strollerName: 'اسم العربة',
    add: 'إضافة',
    cancel: 'إلغاء',
    connectBluetooth: 'اتصال بلوتوث',
    disconnectBluetooth: 'قطع البلوتوث',
    connected: 'متصل',
    disconnected: 'غير متصل',
    eventHistory: 'سجل الأحداث',
    noEvents: 'لا توجد أحداث',
    noStrollers: 'لا توجد عربات. أضف عربة للبدء.',
    alerts: 'التنبيهات',
    childRemoved: 'تم إزالة الطفل من العربة!',
    lowBattery: 'البطارية منخفضة!',
    dangerousIncline: 'انحدار خطر!',
    batteryPercent: '% بطارية',
    inclinePercent: '% انحدار',
    kg: 'كجم',
    delete: 'حذف',
    simulating: 'محاكاة',
    realTime: 'مباشر',
    language: 'اللغة',
    mute: 'كتم الصوت',
    unmute: 'تشغيل الصوت',
    clearHistory: 'مسح السجل',
  },
  en: {
    appName: 'KINF',
    appNameAr: 'كِنف',
    dashboard: 'Dashboard',
    location: 'Location',
    weight: 'Weight',
    battery: 'Battery',
    incline: 'Incline',
    status: 'Status',
    normal: 'Normal',
    warning: 'Warning',
    error: 'Error',
    addStroller: 'Add Stroller',
    strollerName: 'Stroller Name',
    add: 'Add',
    cancel: 'Cancel',
    connectBluetooth: 'Connect Bluetooth',
    disconnectBluetooth: 'Disconnect Bluetooth',
    connected: 'Connected',
    disconnected: 'Disconnected',
    eventHistory: 'Event History',
    noEvents: 'No events yet',
    noStrollers: 'No strollers. Add one to get started.',
    alerts: 'Alerts',
    childRemoved: 'Child removed from stroller!',
    lowBattery: 'Low battery!',
    dangerousIncline: 'Dangerous incline!',
    batteryPercent: '% Battery',
    inclinePercent: '% Incline',
    kg: 'kg',
    delete: 'Delete',
    simulating: 'Simulating',
    realTime: 'Real-time',
    language: 'Language',
    mute: 'Mute',
    unmute: 'Unmute',
    clearHistory: 'Clear History',
  }
}

// Simulated addresses
const simulatedAddresses = [
  'شارع الملك فهد، الرياض',
  'حي العليا، الرياض',
  'شارع التحلية، جدة',
  'حي الروضة، جدة',
  'شارع الأمير سلطان، الدمام',
  'King Fahd Road, Riyadh',
  'Olaya District, Riyadh',
  'Tahlia Street, Jeddah',
  'Rawdah District, Jeddah',
  'Prince Sultan Street, Dammam',
]

// Generate random data - ONLY battery and incline change
const generateRandomData = (currentData: StrollerData): StrollerData => {
  // Battery decreases slowly (0-2% per update)
  const batteryChange = -(Math.random() * 2)
  // Incline changes randomly (simulating terrain)
  const inclineChange = (Math.random() - 0.5) * 6

  const newBattery = Math.max(0, Math.min(100, currentData.battery + batteryChange))
  const newIncline = Math.max(-30, Math.min(30, currentData.incline + inclineChange))

  // Determine status based on battery and incline only
  let status: 'normal' | 'warning' | 'error' = 'normal'
  if (newBattery < 10 || Math.abs(newIncline) > 20) {
    status = 'error'
  } else if (newBattery < 20 || Math.abs(newIncline) > 15) {
    status = 'warning'
  }

  return {
    ...currentData,
    // Weight and Location stay the same (fixed per stroller)
    battery: Number(newBattery.toFixed(0)),
    incline: Number(newIncline.toFixed(1)),
    status,
  }
}

// Logo Component - KINF Monogram with Stroller Icon
function KINFLogo({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        {/* Background circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="#E8E0D0"
        />
        
        {/* K Letter */}
        <path 
          d="M25 25 L25 75 L32 75 L32 55 L45 75 L55 75 L38 52 L55 25 L45 25 L32 48 L32 25 Z" 
          fill="#3A4A3A"
        />
        
        {/* I Letter (stylized) */}
        <path 
          d="M58 25 L65 25 L65 75 L58 75 Z M55 25 L68 25 L68 30 L55 30 Z M55 70 L68 70 L68 75 L55 75 Z" 
          fill="#3A4A3A"
        />
        
        {/* N Letter */}
        <path 
          d="M72 25 L72 75 L79 75 L79 40 L92 75 L100 75 L100 25 L93 25 L93 60 L80 25 Z" 
          fill="#3A4A3A"
        />
        
        {/* Small stroller icon */}
        <g transform="translate(40, 78) scale(0.3)">
          {/* Stroller body */}
          <rect x="5" y="5" width="30" height="15" rx="3" fill="#4F634F" />
          {/* Canopy */}
          <path d="M5 10 Q5 0 20 0 Q35 0 35 10 L35 15 L5 15 Z" fill="#5A7A5A" />
          {/* Wheels */}
          <circle cx="12" cy="28" r="5" fill="none" stroke="#4F634F" strokeWidth="2" />
          <circle cx="32" cy="28" r="5" fill="none" stroke="#4F634F" strokeWidth="2" />
          {/* Handle */}
          <path d="M35 8 L45 2" stroke="#4F634F" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </div>
  )
}

export default function Home() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [strollers, setStrollers] = useState<StrollerData[]>([])
  const [eventLogs, setEventLogs] = useState<EventLog[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStrollerName, setNewStrollerName] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [alertPopup, setAlertPopup] = useState<{ show: boolean; message: string; type: 'warning' | 'error' } | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const t = translations[language]
  const isRTL = language === 'ar'

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
      
      if (type === 'error') {
        setTimeout(() => {
          const osc2 = ctx.createOscillator()
          const gain2 = ctx.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx.destination)
          osc2.frequency.value = 1000
          osc2.type = 'sine'
          gain2.gain.value = 0.3
          osc2.start()
          osc2.stop(ctx.currentTime + 0.3)
        }, 250)
      }
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

  // Store intervals for each stroller (independent updates)
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Data simulation effect - EACH stroller has its own independent interval
  useEffect(() => {
    // Clear intervals for removed strollers
    const currentIds = new Set(strollers.map(s => s.id))
    intervalsRef.current.forEach((interval, id) => {
      if (!currentIds.has(id)) {
        clearInterval(interval)
        intervalsRef.current.delete(id)
      }
    })

    // Create intervals for new strollers
    strollers.forEach(stroller => {
      if (!intervalsRef.current.has(stroller.id)) {
        // Each stroller gets a unique random interval (3-5 seconds)
        const randomInterval = 3000 + Math.random() * 2000
        
        const interval = setInterval(() => {
          setStrollers(prev => {
            const currentStroller = prev.find(s => s.id === stroller.id)
            if (!currentStroller) return prev
            
            const newData = generateRandomData(currentStroller)
            
            // Check for alerts (battery and incline only now)
            if (currentStroller.battery > 15 && newData.battery <= 15) {
              const msgAr = t.lowBattery
              const msgEn = 'Low battery!'
              addEventLog('warning', msgEn, msgAr, stroller.name)
              showAlert(msgAr, 'warning')
            } else if (Math.abs(currentStroller.incline) < 20 && Math.abs(newData.incline) >= 20) {
              const msgAr = t.dangerousIncline
              const msgEn = 'Dangerous incline!'
              addEventLog('error', msgEn, msgAr, stroller.name)
              showAlert(msgAr, 'error')
            }
            
            return prev.map(s => s.id === stroller.id ? newData : s)
          })
        }, randomInterval)
        
        intervalsRef.current.set(stroller.id, interval)
      }
    })

    // Cleanup on unmount
    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval))
    }
  }, [strollers.map(s => s.id).join(','), addEventLog, showAlert, t])

  // Add stroller
  const handleAddStroller = () => {
    if (!newStrollerName.trim()) return

    // Each stroller gets unique initial values
    const addressIndex = Math.floor(Math.random() * simulatedAddresses.length)
    
    const newStroller: StrollerData = {
      id: Date.now().toString(),
      name: newStrollerName.trim(),
      location: {
        lat: 24.7136 + (Math.random() - 0.5) * 0.05,
        lng: 46.6753 + (Math.random() - 0.5) * 0.05,
        address: simulatedAddresses[addressIndex],
      },
      weight: Number((3.5 + Math.random() * 5).toFixed(1)), // Fixed weight for this stroller
      battery: Number((70 + Math.random() * 30).toFixed(0)), // Random starting battery
      incline: Number(((Math.random() - 0.5) * 10).toFixed(1)), // Random starting incline
      status: 'normal',
      bluetoothConnected: false,
    }

    setStrollers(prev => [...prev, newStroller])
    addEventLog('success', `Stroller "${newStrollerName}" added`, `تمت إضافة العربة "${newStrollerName}"`, newStrollerName)
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

  // Get battery color
  const getBatteryColor = (battery: number) => {
    if (battery <= 10) return 'bg-[#8B5A5A]'
    if (battery <= 20) return 'bg-[#B8A060]'
    return 'bg-[#7A9A7A]'
  }

  return (
    <div 
      className="min-h-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        fontFamily: isRTL ? "'Cairo', 'Tajawal', sans-serif" : undefined,
        background: 'linear-gradient(135deg, #3A4A3A 0%, #4F634F 50%, #3A4A3A 100%)'
      }}
    >
      {/* Alert Popup */}
      {alertPopup?.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
            alertPopup.type === 'error' 
              ? 'bg-[#8B5A5A] text-[#E8E0D0]' 
              : 'bg-[#B8A060] text-[#3A4A3A]'
          }`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-semibold">{alertPopup.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-[#5A6A5A]/30" style={{ background: 'rgba(58, 74, 58, 0.9)' }}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KINFLogo size={48} />
              <div>
                <h1 className="text-xl font-bold text-[#E8E0D0] tracking-wider">
                  {t.appName}
                </h1>
                <span className="text-lg text-[#B8B0A0]" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {t.appNameAr}
                </span>
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
                className="rounded-xl hover:bg-[#4F634F] text-[#E8E0D0]"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-[#B8B0A0]" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#E8E0D0]" />
                )}
              </Button>
              
              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="rounded-xl hover:bg-[#4F634F] text-[#E8E0D0]"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-3 text-center border border-[#5A6A5A]/30" style={{ background: 'rgba(68, 87, 68, 0.8)' }}>
            <div className="text-2xl font-bold text-[#E8E0D0]">{strollers.length}</div>
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
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <KINFLogo size={64} />
              </div>
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
                    <CardTitle className="text-lg font-bold text-[#E8E0D0] flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(stroller.status)} animate-pulse`} />
                      {stroller.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Bluetooth Status */}
                      <Badge 
                        variant={stroller.bluetoothConnected ? "default" : "secondary"}
                        className={`rounded-xl cursor-pointer transition-all ${
                          stroller.bluetoothConnected 
                            ? 'bg-[#7A9A7A] hover:bg-[#6A8A6A] text-[#E8E0D0]' 
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
                      
                      {/* Delete Button */}
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
                  {/* Data Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Location */}
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.location}</span>
                      </div>
                      <div className="text-xs text-[#E8E0D0] truncate">
                        {stroller.location.address}
                      </div>
                    </div>
                    
                    {/* Weight */}
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <Scale className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.weight}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${stroller.weight === 0 ? 'text-[#8B5A5A] animate-pulse' : 'text-[#E8E0D0]'}`}>
                          {stroller.weight.toFixed(1)}
                        </span>
                        <span className="text-xs text-[#B8B0A0]">{t.kg}</span>
                      </div>
                    </div>
                    
                    {/* Battery */}
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <Battery className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.battery}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${stroller.battery <= 15 ? 'text-[#8B5A5A]' : 'text-[#E8E0D0]'}`}>
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
                    
                    {/* Incline */}
                    <div className="rounded-2xl p-3" style={{ background: 'rgba(90, 122, 90, 0.3)' }}>
                      <div className="flex items-center gap-2 text-[#B8B0A0] mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.incline}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${Math.abs(stroller.incline) > 15 ? 'text-[#8B5A5A] animate-pulse' : 'text-[#E8E0D0]'}`}>
                          {stroller.incline > 0 ? '+' : ''}{stroller.incline.toFixed(1)}
                        </span>
                        <span className="text-xs text-[#B8B0A0]">°</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
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
                  
                  {/* Bluetooth Button */}
                  <Button
                    onClick={() => toggleBluetooth(stroller.id)}
                    className={`w-full rounded-2xl h-11 ${
                      stroller.bluetoothConnected
                        ? 'bg-[#7A9A7A] hover:bg-[#6A8A6A] text-[#E8E0D0]'
                        : 'bg-[#E8E0D0] hover:bg-[#D8D0C0] text-[#3A4A3A]'
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
            <h2 className="text-lg font-bold text-[#E8E0D0] flex items-center gap-2">
              <History className="w-5 h-5 text-[#B8B0A0]" />
              {t.eventHistory}
            </h2>
            {eventLogs.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearHistory}
                className="text-xs text-[#B8B0A0] hover:text-[#E8E0D0] hover:bg-[#4F634F]"
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
                            <p className="text-sm font-medium text-[#E8E0D0]">
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl h-14 px-6 shadow-2xl gap-2 bg-[#E8E0D0] hover:bg-[#D8D0C0] text-[#3A4A3A] font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t.addStroller}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-sm bg-[#445744] border-[#5A6A5A]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[#E8E0D0]">{t.addStroller}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="strollerName" className="text-[#E8E0D0]">{t.strollerName}</Label>
              <Input
                id="strollerName"
                value={newStrollerName}
                onChange={(e) => setNewStrollerName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عربة أحمد' : 'e.g., Baby Stroller 1'}
                className="rounded-xl h-11 bg-[#4F634F] border-[#5A6A5A] text-[#E8E0D0] placeholder-[#B8B0A0]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStroller()}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 rounded-xl h-11 bg-[#4F634F] hover:bg-[#5A7A5A] text-[#E8E0D0]"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleAddStroller}
                disabled={!newStrollerName.trim()}
                className="flex-1 rounded-xl h-11 bg-[#E8E0D0] hover:bg-[#D8D0C0] text-[#3A4A3A]"
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
