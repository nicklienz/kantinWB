# Next.js Coding Guidelines (LLMS)

## General Rules
- Ikuti standar ESLint dan Prettier untuk seluruh kode.
- Gunakan TypeScript (`.tsx`/`.ts`) untuk semua file kecuali ada alasan kuat memakai JavaScript.
- Gunakan import absolute (misal: `@/components/...`) jika sudah diatur di `jsconfig.json`/`tsconfig.json`.
- Hindari penggunaan kode yang deprecated atau tidak direkomendasikan oleh Next.js.

## Routing & Navigation
- Untuk navigasi antar halaman, **jangan gunakan** tag `<a>`. Selalu gunakan komponen `Link` dari `next/link`:

  ```tsx
  import Link from "next/link";
  // ...
  <Link href="/about">Tentang Kami</Link>
  ```
- Jika ingin menambahkan atribut seperti `className`, tambahkan langsung ke komponen `Link` (Next.js 13+):

  ```tsx
  <Link href="/produk" className="btn btn-primary">Lihat Produk</Link>
  ```
- Untuk link eksternal, tetap gunakan `<a>` namun tambahkan `target="_blank"` dan `rel="noopener noreferrer"`.

## Gambar
- **Jangan gunakan** tag `<img>`. Selalu gunakan komponen `Image` dari `next/image`:

  ```tsx
  import Image from "next/image";
  // ...
  <Image src="/logo.png" alt="Logo" width={120} height={40} />
  ```
- Selalu isi atribut `alt`, `width`, dan `height` pada komponen `Image`.
- Untuk gambar dari URL eksternal, pastikan domain sudah diizinkan di `next.config.js`.

## Komponen & Struktur
- Gunakan komponen fungsional (function component) dan hooks, hindari class component.
- Pisahkan komponen ke file terpisah jika sudah lebih dari 30 baris atau digunakan di lebih dari satu tempat.
- Gunakan props bertipe eksplisit (interface/type) untuk setiap komponen.
- Gunakan default export untuk komponen utama dalam satu file.

## State & Data
- Gunakan React hooks (`useState`, `useEffect`, dll) untuk state management lokal.
- Untuk data fetching, gunakan Next.js data fetching (`getServerSideProps`, `getStaticProps`, atau `fetch` di server component) sesuai kebutuhan.
- Gunakan SWR atau React Query untuk client-side data fetching jika perlu revalidasi otomatis.

## Lain-lain
- Gunakan className dari daisyUI/Tailwind CSS untuk styling, hindari custom CSS kecuali sangat diperlukan.
- Selalu tambahkan `key` pada elemen list.
- Hindari penggunaan `any` di TypeScript, gunakan tipe yang lebih spesifik.
- Gunakan async/await untuk operasi asynchronous.
- Selalu handle error pada operasi async.

## Best Practice Lanjutan
- Simpan environment variable di file `.env.local` dan jangan commit file ini ke repository.
- Gunakan dynamic import (`next/dynamic`) untuk komponen berat atau yang hanya dibutuhkan di client:
  ```tsx
  import dynamic from "next/dynamic";
  const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });
  ```
- Pada app router, gunakan directive `"use client"` atau `"use server"` di paling atas file sesuai kebutuhan.
- Hindari penggunaan API yang deprecated seperti `getInitialProps`.
- Untuk meta tag di pages router, gunakan komponen `Head` dari `next/head`. Pada app router, gunakan export `metadata`:
  ```tsx
  // pages router
  import Head from "next/head";
  // ...
  <Head><title>Judul</title></Head>
  ```
  ```tsx
  // app router
  export const metadata = { title: "Judul" };
  ```
- Gunakan error boundary untuk menangani error pada komponen client.
- Pada app router, gunakan fungsi `notFound()` untuk halaman 404 dan `redirect()` untuk redirect.
- Gunakan file `middleware.ts` untuk kebutuhan auth/routing global.
- Untuk ISR (Incremental Static Regeneration), gunakan opsi `revalidate` pada data fetching:
  ```tsx
  export async function generateStaticParams() { /* ... */ }
  export const revalidate = 60; // revalidate setiap 60 detik
  ```
- Selalu cek [Next.js documentation](https://nextjs.org/docs) untuk update terbaru dan best practice.

---

**Contoh Penggunaan Link dan Image yang Benar:**

```tsx
import Link from "next/link";
import Image from "next/image";

export default function Example() {
  return (
    <div>
      <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
      <Image src="/logo.png" alt="Logo" width={120} height={40} />
    </div>
  );
}
```
