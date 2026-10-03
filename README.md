# AuraConvert

Premium, tarayıcı tabanlı çevrimiçi araçlar platformunun ilk temeli.

- Varsayılan dil: Türkçe (`tr`)
- İkinci dil: English (`en`)
- İlk araç: Karakter Sayacı (`/tools/character-counter`)

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## Yeni araç ekleme

1. `src/tools/<slug>/` altında tanım ve bileşen oluşturun.
2. `src/tools/registry.ts` içine tanımı ekleyin.
3. `src/i18n/locales/tr.json` ve `en.json` içine `tools.<id>.name` / `description` yazın.
4. SEO metinlerini araç tanımındaki `seo` alanına koyun.

## Dil

Çeviriler `src/i18n/locales/` altındadır. Bileşenlerde metin sabitlenmez; `t("...")` kullanılır. Dil seçimi `auraconvert-locale` çerezinde saklanır.
