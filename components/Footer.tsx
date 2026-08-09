import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h3 className="font-display text-2xl font-semibold">Kaelō</h3>
        <p className="text-white/60 text-sm mt-1">Quiet luxury, loud presence.</p>

        <div className="flex justify-center gap-6 mt-6 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="/account" className="hover:text-white transition-colors">
            My Account
          </Link>
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
        </div>

        <p className="text-white/40 text-xs mt-8">
          &copy; {new Date().getFullYear()} Kaelō Atelier · Kampala, Uganda
        </p>
      </div>
    </footer>
  );
}
