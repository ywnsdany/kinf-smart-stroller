# KNFكنف - Smart Baby Stroller System

<div align="center">
  <img src="public/favicon.png" alt="KNF Logo" width="120" height="120">
  
  <h3>نظام عربات الأطفال الذكي</h3>
  <p>Smart Baby Stroller Monitoring System</p>

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📱 عن المشروع | About

**KNFكنف** هو نظام ذكي متكامل لمراقبة عربات الأطفال، يوفر راحة البال والأمان لكل أم وأب من خلال:

- 🗺️ **تتبع الموقع** - GPS Tracking in real-time
- 🔋 **مراقبة البطارية** - Battery monitoring with alerts
- 📐 **قياس الانحدار** - Incline detection for safety
- 📱 **اتصال بلوتوث** - Seamless Bluetooth connection
- 🔔 **تنبيهات فورية** - Instant audio & visual alerts
- 👶 **دعم عربات متعددة** - Multi-stroller management

---

## ✨ المميزات | Features

### 🎨 واجهة مستخدم حديثة
- تصميم Mobile-first يشبه تطبيقات الجوال
- دعم كامل للغة العربية (RTL) والإنجليزية (LTR)
- ألوان ناعمة مريحة للعين
- أنيميشن سلسة وتفاعلية

### 📊 لوحة تحكم ذكية
- مراقبة مباشرة للبيانات
- تحديث تلقائي كل 3-5 ثواني
- حالة النظام (طبيعي/تحذير/خطر)
- سجل الأحداث

### 🔐 نظام تسجيل دخول
- تسجيل دخول وهمي للتجربة
- أنيميشن تحميل سلسة
- ترحيب بالمستخدم

### 🔔 نظام تنبيهات
- تنبيه انخفاض البطارية
- تنبيه الانحدار الخطر
- إشعارات صوتية وبصرية

---

## 🛠️ التقنيات | Technologies

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Cairo, Tajawal (Arabic)

---

## 🚀 التشغيل | Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Open http://localhost:3000
```

---

## 📂 هيكل المشروع | Project Structure

```
knf/
├── public/
│   └── favicon.png       # Logo
├── src/
│   ├── app/
│   │   ├── globals.css   # Global styles & animations
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main page (Landing + Login + App)
│   └── components/ui/    # shadcn/ui components
├── tailwind.config.ts
└── package.json
```

---

## 🎯 كيف يعمل | How It Works

1. **حمّل التطبيق** - Download the app
2. **سجل دخولك** - Sign in with any name/email
3. **اربط العربة** - Connect stroller via Bluetooth
4. **استمتع بالأمان** - Monitor and get alerts

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

<div align="center">
  Made with ❤️ for our children
  
  **KNFكنف** - حماية لأعز ما نملك
  
  © 2026
</div>
