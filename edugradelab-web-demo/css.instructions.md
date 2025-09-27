---
applyTo: '**'
---
# Yapay Zeka Destekli Web UI Design Rules (for React/Next.js + Tailwind + ESLint)

## Genel Prensipler
- **Sadece UI/UX ve tasarım değişiklikleri yap**: Renk, arka plan, font, spacing, padding, border, layout, grid/flex, responsive breakpoints, görsel hiyerarşi, kart ve panel stilleri, animasyonlar, hover/focus efekti, buton görünümü, input/checkbox/radio styling, modals, shadows.
- **Hiçbir fonksiyonel işleyişi bozma veya silme**: Mevcut component logic, veri işleme, API çağrısı, state yönetimi (useState, useContext, Redux vs.), form submit, validasyon, authentication, routing vs. asla değiştirme, kaldırma veya üzerine yazma.
- **Mobil Uyumluluk (Responsive)**: Yaptığın her değişikliği önce mobile (sm) baz alarak başlat, sonra md/lg/xl için genişlet. `@media` değil, doğrudan Tailwind’in responsive prefixlerini kullan: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- **Tailwind CSS Syntax**: Tüm stillendirme Tailwind ile olacak. inline style, klasik CSS, CSS Modules, SCSS, emotion, styled-components vs. kullanma.
- **Component ve JSX Yapısını Bozma**: Mevcut elementlerin sırasını, hiyerarşisini, props yapısını değiştirme. Sadece className ve Tailwind utility ekle/çıkar, gerekirse boş bir `<div />` veya `<section />` ile düzenle ama mantığı bozma.
- **Accessibility (Erişilebilirlik)**: Yapacağın tasarımda `aria-` attribute’larını, buton/input semanticlerini koru ve bozma.
- **ESLint/Tailwind Plugin Kurallarına Uygun Kod Üret**: Kodun tümü otomatik olarak `eslint --fix` ve `@next/eslint-plugin-next`, `eslint-plugin-tailwindcss` ile kontrol edilecek. Linter hatası çıkaracak kod gönderme.
- **Kod Açıklamaları**: Yaptığın değişikliğin başına çok kısa (1 satır) açıklama bloğu ekle. (örn. `// updated: input background color`)

## Yasaklılar / Asla Yapılmayacaklar
- Component, fonksiyon, API, hook, reducer, context, event, router logic’i değiştirme veya kaldırma.
- Bir butonu “gizleme” dışında “devre dışı bırakma”, submit handler silme, yeni işlev ekleme, var olan logic’i değiştirme.
- Sayfa routing’ini, veri fetch’ini, SSR/SSG logic’ini, session management’ı, state yönetimini değiştirme.
- Harici kütüphane ekleme/kaldırma.
- Test dosyalarına müdahale.
- `.env`, konfigürasyon veya API anahtarı değişikliği.

## Özel Responsive Tasarım Kuralları
- Her ana component (`<main>`, `<section>`, `<Card>`, `<Form>`, `<Button>`, `<Table>`, `<Modal>`, `<Sidebar>`) mobile’da en az 8px padding içermeli.
- Başlıklar (`h1`, `h2`, `h3`) mobile’da font-bold, text-lg/2xl arası, desktop’ta ise text-3xl/4xl olmalı.
- Butonlar min-h-[44px] ve min-w-[44px] olmalı, tıklanabilirlik standartlarına uy.
- Modallar mobile’da full-width, desktop’ta ortalanmış ve max-w-lg olmalı.
- Kart ve kutularda soft shadow (`shadow-md` veya daha yumuşak), radius (`rounded-xl` veya `rounded-2xl`), boşluklar (`gap-x-4`, `gap-y-2`) kullanılmalı.
- Form elemanları (input, select, textarea) mobile’da block, full-width ve en az 40px yüksekliğinde olmalı.

## Yalnızca Şunlara İzin Ver
- className ekle/çıkar, Tailwind utility class ekle/çıkar
- Placeholder/resim ikon/renk değiştir (img/svg, gradient, bg, shadow)
- Flex/Grid düzenle, boşlukları güncelle (gap/padding/margin)
- Animasyon/hareket/hover efektleri ekle/kaldır (Tailwind animate utility ile)
- Görsel iyileştirme: Color palette güncelle (varsa tailwind.config.js’te tanımlı renklerle), font-family değiştir (Google Fonts entegrasyonu yapma, sadece mevcut)
- Sadece UI-preview amaçlı “dummy text/image” ekle (ör: Lorem Ipsum veya stock image placeholder)
- className değişikliklerini yorum satırıyla açıkla

## Sonuç / Output Formatı
- Sadece değişen kod bloklarını veya değiştirilmiş component dosyasını döndür.
- Her değişikliğin başına çok kısa açıklama (örn. `// updated: header bg-color for mobile`).
- Ekstra açıklama veya gereksiz kod üretme.

---
