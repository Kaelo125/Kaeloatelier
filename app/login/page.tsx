"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Captcha, { CaptchaHandle } from "@/components/Captcha";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const captchaRef = useRef<CaptchaHandle>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!captchaRef.current?.verify()) {
      setError("Captcha answer is incorrect. Please try again.");
      captchaRef.current?.reset();
      return;
    }

    const result = login(email, password);
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
        Welcome back
      </h1>
      <p className="text-navy/50 text-sm mb-8">Login to track orders and check out faster.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-navy/70 mb-1 block">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
          />
        </label>

        <div>
          <span className="text-sm text-navy/70 mb-1 block">Verify you're human</span>
          <Captcha ref={captchaRef} onChange={setCaptchaValue} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-navy/60 text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-green font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
