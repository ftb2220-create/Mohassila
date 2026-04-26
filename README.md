# نظام محصّلة (Mohassila)

نظام **محصّلة** هو منصة متكاملة لإدارة الاشتراكات والأعضاء، مبني باستخدام تقنيات حديثة لتوفير تجربة مستخدم سلسة وآمنة، مع دعم كامل للغة العربية (RTL) والوضع الليلي (Dark Mode).

## ✨ المميزات الرئيسية

- **إدارة الأعضاء والاشتراكات**: واجهة متكاملة لإدارة بيانات الأعضاء ومتابعة حالة اشتراكاتهم.
- **دعم اللغة العربية**: تصميم متوافق بالكامل مع واجهات المستخدم العربية (RTL).
- **الوضع الداكن (Dark Mode)**: واجهة مستخدم مريحة للعين مع إمكانية التبديل بين الوضعين الفاتح والداكن.
- **تكامل مع Firebase**: استخدام Firebase لعمليات المصادقة (Authentication) وقاعدة بيانات تفاعلية في الوقت الفعلي (Firestore).
- **لوحة تحكم تفاعلية**: إحصائيات حية، مؤشرات تقدم، وتصميم عصري.
- **جاهز للنشر**: إعدادات محسّنة للنشر المباشر على منصة Netlify.

## 🛠️ التقنيات المستخدمة

- **الواجهة الأمامية (Frontend)**: React, TypeScript, Vite
- **تصميم الواجهة (Styling)**: CSS حديث (Custom Design System)
- **الواجهة الخلفية (Backend)**: Firebase (Auth & Firestore)
- **الاستضافة (Hosting)**: Netlify

## ⚙️ متطلبات التشغيل والتثبيت

1. **نسخ المشروع:**
   ```bash
   git clone <رابط-المستودع>
   cd Mohassila
   ```

2. **تثبيت الحزم والاعتماديات:**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة (Environment Variables):**
   قم بإنشاء ملف `.env` في المسار الرئيسي للمشروع وأضف إعدادات Firebase الخاصة بك:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **تشغيل خادم التطوير (Development Server):**
   ```bash
   npm run dev
   ```

5. **بناء المشروع للإنتاج (Production Build):**
   ```bash
   npm run build
   ```

## 🔒 الأمان وحماية البيانات

تم إعداد النظام مع مراعاة معايير الأمان باستخدام قواعد أمان Firebase (Firestore Security Rules) لضمان حماية بيانات الأعضاء وتحديد صلاحيات الوصول بدقة.

## 📞 الدعم الفني

في حال وجود أي استفسارات أو مشاكل تقنية، يرجى مراجعة فريق التطوير أو فتح تذكرة (Issue) في مستودع المشروع.
