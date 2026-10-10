export interface TimelineMilestone {
  year: string;
  theme: string;
  discipline: "CREATIVE" | "MEDIA" | "ORGANIZATION" | "LEADERSHIP" | "TECH" | "AI";
  title: string;
  role: string;
  description: string;
  highlights: string[];
  imageFragment?: string;
  featuredSlug?: string;
}

export const journeyMilestones: TimelineMilestone[] = [
  {
    year: "2021",
    theme: "Kreatif / Video",
    discipline: "CREATIVE",
    title: "Fondasi Produksi & Penyuntingan Video",
    role: "Video Editor Intern · Gamelab",
    description:
      "Masuk langsung ke penceritaan visual. Menyusun storyboard, menjalankan pengambilan gambar multi-angle, dan menyelesaikan pascaproduksi dengan fokus pada color grading, sound design, serta sinkronisasi musik.",
    highlights: ["Penyusunan storyboard", "Color grading & sound design", "Komposisi kamera"],
    imageFragment: "/images/photography/photo-1.webp",
  },
  {
    year: "2022",
    theme: "Kreatif & Media / TEFA",
    discipline: "MEDIA",
    title: "Branding Komersial & Seni Visual",
    role: "Koordinator Creative & Branding · TEFA TKJ",
    description:
      "Mengarahkan strategi branding kreatif untuk pameran komersial dan visibilitas institusi. Memimpin alur kerja produksi media dan meraih pengakuan di ajang mural daerah.",
    highlights: ["Strategi & desain branding", "Arahan tim kreatif", "Juara Harapan 3 Mural Jepara"],
    imageFragment: "/images/archive/tefa-tkj/tefa-tkj-1.webp",
  },
  {
    year: "2023",
    theme: "Kuliah / Teknologi",
    discipline: "TECH",
    title: "Perguruan Tinggi & Peralihan ke Komputasi",
    role: "S1 PTIK · Universitas Sebelas Maret (UNS)",
    description:
      "Memulai studi Pendidikan Teknik Informatika dan Komputer (PTIK) di FKIP UNS, Solo. Membangun fondasi rekayasa perangkat lunak, pemodelan basis data, dan arsitektur web.",
    highlights: ["Pendidikan Teknik Informatika & Komputer", "Sistem web & struktur data", "Jembatan kreatif ke teknologi"],
  },
  {
    year: "2024",
    theme: "Organisasi / Media / PR",
    discipline: "ORGANIZATION",
    title: "Public Relations, Dampak Komunitas & Acara",
    role: "Koordinator PR · FKIP Siap Mengabdi | Staf Desa Mitra BEM",
    description:
      "Mengelola komunikasi eksternal, kemitraan strategis, dan program pemberdayaan desa. Mendokumentasikan acara kampus utama termasuk BytesFest dan BESTARI, serta bertugas sebagai Manggala PKKMB UNS.",
    highlights: ["PR strategis & negosiasi", "Inisiatif pengembangan desa", "Dokumentasi lintas acara"],
    imageFragment: "/images/archive/bestari/bestari-1.webp",
  },
  {
    year: "2025",
    theme: "Arahan Kreatif / Dokumentasi",
    discipline: "LEADERSHIP",
    title: "Arahan Kreatif & Dokumentasi Produksi (DOP)",
    role: "Director of Photography · PKKMB FKIP UNS",
    description:
      "Menjabat sebagai Director of Photography untuk PKKMB FKIP UNS 2025, memimpin divisi dokumentasi dan videografi sekaligus mengarahkan seluruh produksi video: teaser, jingle, flashmob, hingga motion graphics.",
    highlights: ["DOP: teaser, jingle, flashmob, VFX", "Kepemimpinan divisi dokumentasi", "Arahan kreatif produksi media"],
    imageFragment: "/images/archive/pkkmb/pkkmb-1.webp",
    featuredSlug: "pkkmb-fkip-uns-2025",
  },
  {
    year: "2026",
    theme: "Sistem / Otomasi / AI",
    discipline: "AI",
    title: "WebGIS Desa & Tooling Agen AI",
    role: "Full-Stack Developer & R&D Experimenter",
    description:
      "Membangun KINARYA (WebGIS desa dengan Laravel dan Leaflet) serta merancang tooling agen AI otonom di bawah KALANATA.",
    highlights: ["Orkestrasi agen AI KALANATA", "WebGIS Desa KINARYA", "Tooling developer & otomasi"],
    imageFragment: "/images/projects/kalanata/thumb.svg",
    featuredSlug: "kalanata",
  },
];
