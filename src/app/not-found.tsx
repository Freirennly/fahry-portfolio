import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-blue-deep text-white flex items-center justify-center px-6">
      <Container size="content" className="text-center py-24">
        <span className="type-meta text-blue-bright font-mono text-sm uppercase tracking-wider block mb-4">
          404 · Halaman Tidak Ditemukan
        </span>
        <h1 className="type-display text-4xl sm:text-6xl font-bold tracking-tight mb-6">
          Halaman yang Anda tuju tidak tersedia.
        </h1>
        <p className="max-w-md mx-auto text-white/70 text-base leading-relaxed mb-10">
          Tautan mungkin telah berpindah, dihapus, atau alamat URL yang Anda masukkan salah.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-white text-blue-deep font-semibold text-sm transition-colors hover:bg-blue-light"
        >
          <span>Kembali ke Beranda</span>
          <span>→</span>
        </Link>
      </Container>
    </main>
  );
}
