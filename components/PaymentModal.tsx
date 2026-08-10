"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Smartphone } from "lucide-react";
import { useState } from "react";
import { formatUGX } from "@/lib/utils";

export type PaymentMethod = "MTN Mobile Money" | "Airtel Money";

const PAYMENT_OPTIONS: {
  method: PaymentMethod;
  name: string;
  number: string;
  buttonLabel: string;
  bg: string;
  textColor: string;
}[] = [
  {
    method: "MTN Mobile Money",
    name: "Tayomba Miria",
    number: "256782628624",
    buttonLabel: "Pay with MTN MoMo - Tayomba Miria 256782628624",
    bg: "#FFCB05",
    textColor: "#000000",
  },
  {
    method: "Airtel Money",
    name: "Malirire Christine",
    number: "256743457759",
    buttonLabel: "Pay with Airtel Money - Malirire Christine 256743457759",
    bg: "#E40000",
    textColor: "#FFFFFF",
  },
];

interface Props {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
  submitting?: boolean;
}

export default function PaymentModal({ open, total, onClose, onConfirm, submitting }: Props) {
  const [selected, setSelected] = useState<PaymentMethod>("MTN Mobile Money");
  const [copied, setCopied] = useState(false);

  const option = PAYMENT_OPTIONS.find((o) => o.method === selected)!;

  function handleCopy() {
    navigator.clipboard?.writeText(option.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-md rounded-t-card sm:rounded-card p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Complete Payment
              </h2>
              <button onClick={onClose} aria-label="Close">
                <X size={22} className="text-navy/60" />
              </button>
            </div>

            <p className="text-sm text-navy/60 mb-4">
              Send payment via mobile money, then confirm below to place your order.
            </p>

            {/* Method selector — each button carries its own brand color and
                spells out exactly who the payment goes to */}
            <div className="flex flex-col gap-2.5 mb-4">
              {PAYMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.method}
                  onClick={() => setSelected(opt.method)}
                  style={{ backgroundColor: opt.bg, color: opt.textColor }}
                  className={`w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 text-center px-3 transition-transform ${
                    selected === opt.method ? "ring-2 ring-offset-2 ring-navy" : ""
                  }`}
                >
                  <Smartphone size={14} />
                  {opt.buttonLabel}
                </button>
              ))}
            </div>

            {/* Payment details card */}
            <div className="bg-cream rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-navy/50 mb-1">
                Send {formatUGX(total)} to
              </p>
              <p className="font-display text-xl font-semibold text-navy">
                {option.name}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-2xl font-bold text-navy tracking-wide">
                  {option.number}
                </p>
                <button
                  onClick={handleCopy}
                  aria-label="Copy number"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-navy/10"
                >
                  {copied ? (
                    <Check size={14} className="text-green" />
                  ) : (
                    <Copy size={14} className="text-navy/60" />
                  )}
                </button>
              </div>
              <p className="text-xs text-navy/50 mt-2">{option.method}</p>
            </div>

            <p className="text-xs text-navy/50 mt-4 text-center">
              Use your mobile money app or dial the USSD code for {option.method} to
              send the exact amount, then tap confirm.
            </p>

            <button
              onClick={() => onConfirm(selected)}
              disabled={submitting}
              className="w-full mt-5 bg-green text-white font-medium py-3.5 rounded-full hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "I've Sent Payment — Place Order"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
