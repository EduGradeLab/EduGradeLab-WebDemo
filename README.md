# EduGradeLab Web Demo

AI destekli sınav analizi platformu demo uygulaması.

## Özellikler

- ✅ **Next.js 14+** App Router ile modern React uygulaması
- ✅ **Tailwind CSS** Responsive ve modern tasarım
- ✅ **TypeScript** Tip güvenliği
- ✅ **Prisma ORM** MySQL veritabanı entegrasyonu
- ✅ **Demo Oturum Yönetimi** IP tabanlı kullanıcı kimliği
- ✅ **reCAPTCHA v3** Bot koruması
- ✅ **Dosya Yükleme** Drag & drop ile çoklu format desteği
- ✅ **Gerçek Zamanlı İlerleme** SSE/Polling ile canlı takip
- ✅ **Webhook Entegrasyonu** n8n ile dış servis bağlantısı
- ✅ **Responsive Tasarım** Mobil uyumlu arayüz
- ✅ **Güvenlik Başlıkları** CSP ve güvenlik önlemleri

## Kurulum

### Gereksinimler

- Node.js 18+ 
- MySQL veritabanı
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
   ```bash
   git clone <repository-url>
   cd edugradelab-web-demo
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre değişkenlerini yapılandırın:**
   ```bash
   cp .env.local.example .env.local
   ```
   `.env.local` dosyasını düzenleyin:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/exam_ai_demo"
   WEBHOOK_SCANNER_URL="https://your-scanner-service.com/webhook"
   WEBHOOK_AI_URL="https://your-ai-service.com/webhook"
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
   RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Veritabanını kurun:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

6. **Uygulamayı açın:**
   Tarayıcınızda `http://localhost:3000` adresini açın.

## Kullanım

### Demo Akışı

1. **Ana Sayfa** (`/`) - Platform tanıtımı
2. **Demo Giriş** (`/demologin`) - reCAPTCHA ile güvenli giriş
3. **Ana Panel** (`/demohome`) - Dosya yükleme ve sonuçlar
4. **Belgeler** (`/document`) - Tüm analiz sonuçları
5. **Özellikler** (`/features`) - Mevcut ve gelecek özellikler

### API Endpoints

- `POST /api/upload` - Dosya yükleme
- `GET /api/documents` - Belgeleri listeleme
- `POST /api/webhook` - Webhook için OCR sonuçları
- `GET /api/progress/[jobId]` - İşlem ilerlemesi
- `POST /api/verify-recaptcha` - reCAPTCHA doğrulama

## Veritabanı Şeması

Projede aşağıdaki tablolar bulunur:

- `users` - Demo kullanıcıları
- `exam_images` - Yüklenen sınav görüntüleri
- `ocr_jobs` - OCR işleri ve kuyruk
- `ocr_results` - OCR sonuçları ve AI analizi
- `job_logs` - İşlem logları
- `demo_emails` - Demo e-posta kayıtları

## Webhook Entegrasyonu

Uygulama, n8n workflow'ları ile entegre çalışır:

1. **Scanner Webhook** - Görüntüleri OCR servisine gönderir
2. **AI Webhook** - OCR sonuçlarını AI analizi için işler
3. **Result Webhook** - Analiz sonuçlarını alır ve veritabanına kaydeder

## Güvenlik

- reCAPTCHA v3 bot koruması
- CSP (Content Security Policy) başlıkları
- IP tabanlı oturum yönetimi
- Dosya boyutu ve tip validasyonu
- SQL injection koruması (Prisma ORM)

## Performans Optimizasyonları

- Next.js App Router ile sunucu tarafı render
- Image optimization ve lazy loading
- Bundle splitting ve code splitting
- Caching başlıkları
- Responsive image loading

## Deployment

### Vercel (Tavsiye edilen)

```bash
npm run build
npm run start
```

### Environment Variables

Production için gerekli değişkenler:

```env
DATABASE_URL="mysql://user:pass@host:3306/db"
WEBHOOK_SCANNER_URL="https://production-scanner.com/webhook"
WEBHOOK_AI_URL="https://production-ai.com/webhook"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="production-site-key"
RECAPTCHA_SECRET_KEY="production-secret-key"
NEXTAUTH_SECRET="production-secret"
```

## Lisans

Bu proje demo amaçlıdır. EduGradeLab tarafından geliştirilmiştir.

## Destek

Sorunlar veya öneriler için lütfen GitHub issues bölümünü kullanın.