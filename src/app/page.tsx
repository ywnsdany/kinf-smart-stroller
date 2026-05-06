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
import { Separator } from '@/components/ui/separator'
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
  Baby,
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
    appName: 'كِنف',
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

// Generate random data
const generateRandomData = (currentData: StrollerData): StrollerData => {
  const weightChange = (Math.random() - 0.5) * 2
  const batteryChange = Math.random() > 0.7 ? -1 : 0
  const inclineChange = (Math.random() - 0.5) * 4

  const newWeight = Math.max(0, Math.min(15, currentData.weight + weightChange))
  const newBattery = Math.max(0, Math.min(100, currentData.battery + batteryChange))
  const newIncline = Math.max(-30, Math.min(30, currentData.incline + inclineChange))

  let status: 'normal' | 'warning' | 'error' = 'normal'
  if (newWeight === 0 || newBattery < 10 || Math.abs(newIncline) > 20) {
    status = 'error'
  } else if (newBattery < 20 || Math.abs(newIncline) > 15) {
    status = 'warning'
  }

  const addressIndex = Math.floor(Math.random() * simulatedAddresses.length)

  return {
    ...currentData,
    weight: Number(newWeight.toFixed(1)),
    battery: Number(newBattery.toFixed(0)),
    incline: Number(newIncline.toFixed(1)),
    status,
    location: {
      lat: 24.7136 + (Math.random() - 0.5) * 0.01,
      lng: 46.6753 + (Math.random() - 0.5) * 0.01,
      address: simulatedAddresses[addressIndex],
    },
  }
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
      
      // Play second beep for error
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

  // Data simulation effect
  useEffect(() => {
    if (strollers.length === 0) return

    const interval = setInterval(() => {
      setStrollers(prev => {
        const updated = prev.map(stroller => {
          const newData = generateRandomData(stroller)
          
          // Check for alerts
          if (stroller.weight > 0 && newData.weight === 0) {
            const msgAr = t.childRemoved
            const msgEn = 'Child removed from stroller!'
            addEventLog('error', msgEn, msgAr, stroller.name)
            showAlert(msgAr, 'error')
          } else if (stroller.battery > 15 && newData.battery <= 15) {
            const msgAr = t.lowBattery
            const msgEn = 'Low battery!'
            addEventLog('warning', msgEn, msgAr, stroller.name)
            showAlert(msgAr, 'warning')
          } else if (Math.abs(stroller.incline) < 20 && Math.abs(newData.incline) >= 20) {
            const msgAr = t.dangerousIncline
            const msgEn = 'Dangerous incline!'
            addEventLog('error', msgEn, msgAr, stroller.name)
            showAlert(msgAr, 'error')
          }
          
          return newData
        })
        return updated
      })
    }, 3000 + Math.random() * 2000) // 3-5 seconds

    return () => clearInterval(interval)
  }, [strollers.length, addEventLog, showAlert, t])

  // Add stroller
  const handleAddStroller = () => {
    if (!newStrollerName.trim()) return

    const newStroller: StrollerData = {
      id: Date.now().toString(),
      name: newStrollerName.trim(),
      location: {
        lat: 24.7136,
        lng: 46.6753,
        address: simulatedAddresses[0],
      },
      weight: 3.5 + Math.random() * 5,
      battery: 80 + Math.random() * 20,
      incline: (Math.random() - 0.5) * 10,
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
      case 'normal': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
    }
  }

  // Get battery color
  const getBatteryColor = (battery: number) => {
    if (battery <= 10) return 'bg-red-500'
    if (battery <= 20) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRTL ? "'Cairo', 'Tajawal', sans-serif" : undefined }}
    >
      {/* Alert Popup */}
      {alertPopup?.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
            alertPopup.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <span className="font-semibold">{alertPopup.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-pink-100 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></span>
                  <span>{t.realTime}</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
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
                className="rounded-xl hover:bg-pink-100 dark:hover:bg-gray-700"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-pink-500" />
                )}
              </Button>
              
              {/* Language Switcher */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="rounded-xl hover:bg-pink-100 dark:hover:bg-gray-700"
              >
                <Globe className="w-5 h-5 text-pink-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-pink-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-pink-500">{strollers.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'العربات' : 'Strollers'}
            </div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-pink-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-500">
              {strollers.filter(s => s.status === 'normal').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.normal}</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-pink-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-500">
              {strollers.filter(s => s.status !== 'normal').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.alerts}</div>
          </div>
        </div>

        {/* Strollers List */}
        {strollers.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="py-12 text-center">
              <Baby className="w-16 h-16 mx-auto text-pink-300 dark:text-pink-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">{t.noStrollers}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {strollers.map((stroller, index) => (
              <Card 
                key={stroller.id} 
                className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(stroller.status)} animate-pulse`} />
                      {stroller.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Bluetooth Status */}
                      <Badge 
                        variant={stroller.bluetoothConnected ? "default" : "secondary"}
                        className={`rounded-xl cursor-pointer transition-all ${
                          stroller.bluetoothConnected 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-gray-200 dark:bg-gray-700'
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
                        className="rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Data Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Location */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-3">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.location}</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {stroller.location.address}
                      </div>
                    </div>
                    
                    {/* Weight */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-3">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                        <Scale className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.weight}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${stroller.weight === 0 ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-200'}`}>
                          {stroller.weight.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">{t.kg}</span>
                      </div>
                    </div>
                    
                    {/* Battery */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-3">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                        <Battery className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.battery}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${stroller.battery <= 15 ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                            {stroller.battery.toFixed(0)}
                          </span>
                          <span className="text-xs text-gray-500">%</span>
                        </div>
                        <Progress 
                          value={stroller.battery} 
                          className={`h-1.5 ${stroller.battery <= 15 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                        />
                      </div>
                    </div>
                    
                    {/* Incline */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-3">
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">{t.incline}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${Math.abs(stroller.incline) > 15 ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-200'}`}>
                          {stroller.incline > 0 ? '+' : ''}{stroller.incline.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">°</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className={`flex items-center justify-between p-3 rounded-2xl ${
                    stroller.status === 'normal' 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : stroller.status === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {stroller.status === 'normal' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : stroller.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`font-medium ${
                        stroller.status === 'normal' 
                          ? 'text-green-700 dark:text-green-400' 
                          : stroller.status === 'warning'
                          ? 'text-yellow-700 dark:text-yellow-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {t[stroller.status]}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`rounded-xl ${
                        stroller.status === 'normal' 
                          ? 'border-green-300 text-green-600' 
                          : stroller.status === 'warning'
                          ? 'border-yellow-300 text-yellow-600'
                          : 'border-red-300 text-red-600'
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
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                    }`}
                    variant={stroller.bluetoothConnected ? 'default' : 'secondary'}
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
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-pink-500" />
              {t.eventHistory}
            </h2>
            {eventLogs.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {t.clearHistory}
              </Button>
            )}
          </div>
          
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                {eventLogs.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t.noEvents}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {eventLogs.map((log) => (
                      <div key={log.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            log.type === 'error' ? 'bg-red-500' :
                            log.type === 'warning' ? 'bg-yellow-500' :
                            log.type === 'success' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              {language === 'ar' ? log.messageAr : log.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl h-14 px-6 shadow-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white gap-2"
          >
            <Plus className="w-5 h-5" />
            {t.addStroller}
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{t.addStroller}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="strollerName">{t.strollerName}</Label>
              <Input
                id="strollerName"
                value={newStrollerName}
                onChange={(e) => setNewStrollerName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عربة أحمد' : 'e.g., Baby Stroller 1'}
                className="rounded-xl h-11"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStroller()}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 rounded-xl h-11"
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handleAddStroller}
                disabled={!newStrollerName.trim()}
                className="flex-1 rounded-xl h-11 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
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
