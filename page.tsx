"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Captcha, { CaptchaHandle } from "@/components/Captcha";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const captchaRef = useRef<CaptchaHandle>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!captchaRef.current?.verify()) {
      setError("Captcha answer is incorrect. Please try again.");
      captchaRef.current?.reset();
      return;
    }
    if (Object.values(form).some((v) => !v)) {
      setError("Please fill in every field.");
      return;
    }

    const result = register(form);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      captchaRef.current?.reset();
      return;
    }

    router.push("/account");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-navy mb-1">
        Create your account
      </h1>
      <p className="text-navy/50 text-sm mb-8">Join Kaelō Atelier for faster checkout.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Full Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Phone Number</span>
          <input
            type="tel"
            required
            placeholder="0782 628 624"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <div>
          <span className="text-sm text-navy/70 mb-1 block">Verify you're human</span>
          <Captcha ref={captchaRef} onChange={() => {}} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors"
        >
          Create Account
        </button>
      </form>

      <p className="text-sm text-navy/60 text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-green font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
