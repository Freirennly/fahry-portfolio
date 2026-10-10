export interface DisciplineData {
  key: "BUILD" | "CREATE" | "ORGANIZE" | "EXPLORE";
  label: string;
  tagline: string;
  description: string;
  tools: string[];
  focusAreas: string[];
}

export const disciplinesData: DisciplineData[] = [
  {
    key: "BUILD",
    label: "BUILD",
    tagline: "Web · Sistem · GIS · Aplikasi",
    description:
      "Membangun arsitektur web yang kokoh dan sistem informasi geospasial. Menerjemahkan tantangan institusi dan komunitas menjadi basis data, API, dan antarmuka yang responsif.",
    tools: ["Next.js", "React", "TypeScript", "Laravel", "Leaflet GIS", "PostgreSQL / PostGIS", "Tailwind CSS"],
    focusAreas: ["WebGIS Desa", "Pemodelan Basis Data", "Pengembangan Full-Stack", "Pemetaan Data Spasial"],
  },
  {
    key: "CREATE",
    label: "CREATE",
    tagline: "Video · Fotografi · Produksi Visual",
    description:
      "Mengarahkan penceritaan visual dari storyboard praproduksi hingga pengoperasian kamera, penataan cahaya, color grading, sound design, dan motion graphics. Bertugas sebagai Director of Photography untuk produksi berskala besar.",
    tools: ["Adobe Premiere Pro", "Adobe After Effects", "Adobe Photoshop", "Adobe Illustrator", "Kamera Sony Alpha"],
    focusAreas: ["Director of Photography (DOP)", "Sinematografi & Penataan Cahaya", "Motion Graphics & Logo VFX", "Color Grading & Sinkronisasi Audio"],
  },
  {
    key: "ORGANIZE",
    label: "ORGANIZE",
    tagline: "Kepemimpinan · Media · Komunikasi · Koordinasi Proyek",
    description:
      "Menavigasi lingkungan organisasi yang kompleks. Mengelola tim lintas fungsi, mengarahkan liputan media, mengoordinasikan hubungan masyarakat, serta menjalankan strategi berbasis data di tata kelola kemahasiswaan.",
    tools: ["Manajemen Proyek", "Hubungan Masyarakat Strategis", "Negosiasi Pemangku Kepentingan", "Kepemimpinan Tim"],
    focusAreas: ["Kemitraan Strategis", "Media & Hubungan Masyarakat", "Manajemen Acara"],
  },
  {
    key: "EXPLORE",
    label: "EXPLORE",
    tagline: "Otomasi · AI · Eksperimen · Alat Baru",
    description:
      "Membuat prototipe di persimpangan alur kerja developer dan sistem cerdas. Membangun pipeline agen AI otonom, skrip otomasi, serta meneliti penerapan praktis LLM.",
    tools: ["Python", "API OpenAI / Anthropic", "Orkestrasi Agen", "CLI Tooling", "Otomasi pandas / CSV", "Docker"],
    focusAreas: ["Infrastruktur Agen KALANATA", "Pipeline Data Python", "Tooling Otonom", "Optimasi Alur Kerja"],
  },
];