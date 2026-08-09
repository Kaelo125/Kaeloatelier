import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        {/* Column 1 — Brand */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="font-display text-2xl font-semibold">Kaelō</h3>
          <p className="text-white/60 text-xs mt-1 tracking-wide">
            KAELŌ ATELIER
          </p>
          <p className="text-white/60 mt-3">
            Premium lifestyle products in Uganda.
          </p>
        </div>

        {/* Column 2 — Shop */}
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link href="/" className="text-white/60 hover:text-white transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Customer Support */}
        <div>
          <h4 className="font-semibold mb-3">Customer Support</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://wa.me/256743457759"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
              >
                <MessageCircle size={14} /> +256 743 457 759
              </a>
            </li>
            <li>
              <a
                href="mailto:Kaeloatelier@gmail.com"
                className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
              >
                <Mail size={14} /> Kaeloatelier@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Legal */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="text-white/60 hover:text-white transition-colors">
                Refund &amp; Returns
              </Link>
            </li>
            <li>
              <Link href="/account" className="text-white/60 hover:text-white transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="text-white/40 text-xs text-center py-5">
          &copy; {new Date().getFullYear()} Kaelō Atelier · Kampala, Uganda
        </p>
      </div>
    </footer>
  );
}
