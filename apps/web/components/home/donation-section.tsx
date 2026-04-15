"use client";

import * as React from "react";
import { Heart, Coffee, CurrencyInr, CheckCircle, Copy } from "@phosphor-icons/react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { motion, AnimatePresence } from "framer-motion";

const UPI_ID = "kraaft@ptaxis";

const AMOUNT_OPTIONS = [
  { value: 49, label: "₹49", emoji: "☕" },
  { value: 99, label: "₹99", emoji: "🍕", popular: true },
  { value: 199, label: "₹199", emoji: "🎉" },
  { value: 499, label: "₹499", emoji: "🚀" },
  { value: 999, label: "₹999", emoji: "💎" },
];

const DEFAULT_AMOUNT_INDEX = 1; // ₹99 (popular)

function generateUPIUrl(amount: number) {
  const pa = UPI_ID;
  const pn = "AllInOneTools";
  const tn = `Donation to AllInOneTools`;
  const am = amount.toFixed(2);
  const cu = "INR";

  // URLSearchParams uses + for spaces which breaks many UPI apps. We use encodeURIComponent manually.
  return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&tn=${encodeURIComponent(tn)}&am=${am}&cu=${cu}`;
}

export function DonationSection() {
  const [selectedAmount, setSelectedAmount] = React.useState(
    AMOUNT_OPTIONS[DEFAULT_AMOUNT_INDEX]!.value
  );
  const [customAmount, setCustomAmount] = React.useState("");
  const [isCustom, setIsCustom] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showThankYou, setShowThankYou] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);

  const activeAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const handlePresetClick = (value: number) => {
    setSelectedAmount(value);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    setIsCustom(true);
  };

  const handleDonateMobile = () => {
    if (activeAmount < 1) return;
    const upiUrl = generateUPIUrl(activeAmount);

    // Instead of window.open which gets blocked, we assign to location href for deep linking.
    window.location.href = upiUrl;

    // Assume payment completed or user backed out - show thank you.
    setTimeout(() => setShowThankYou(true), 4000);
  };

  const handleShowQR = () => {
    if (activeAmount < 1) return;
    setShowQR(true);
  };

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = UPI_ID;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="donate" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Section header */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-sm"
          >
            <Heart weight="fill" className="size-8 text-rose-500" />
          </motion.div>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            Support This Project
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
            AllInOneTools is free and always will be. If it's saved you time, consider
            buying us a coffee to keep the servers running ☕
          </p>
        </div>

        {/* Main card */}
        <div className="mx-auto max-w-lg">
          <Card className="relative overflow-hidden border-border/60 bg-gradient-to-b from-background to-muted/30 p-6 shadow-xl shadow-primary/5 sm:p-8">
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-gradient-to-br from-rose-500/10 to-pink-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-48 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />

            <div className="relative">
              {/* Amount selector */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Choose an amount
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AMOUNT_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePresetClick(option.value)}
                      className={`relative flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center transition-all duration-200 ${!isCustom && selectedAmount === option.value
                        ? "border-rose-500 bg-rose-500/10 shadow-md shadow-rose-500/10"
                        : "border-border/60 bg-background/80 hover:border-border hover:bg-muted/50"
                        }`}
                    >
                      {option.popular && (
                        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 px-1.5 py-0 text-[9px] text-white border-0 shadow-sm">
                          Popular
                        </Badge>
                      )}
                      <span className="text-lg">{option.emoji}</span>
                      <span className={`text-sm font-semibold ${!isCustom && selectedAmount === option.value
                        ? "text-rose-500"
                        : "text-foreground"
                        }`}>
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <CurrencyInr className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" weight="bold" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    value={customAmount}
                    onFocus={handleCustomFocus}
                    onChange={handleCustomChange}
                    className={`pl-9 transition-all ${isCustom && customAmount
                      ? "border-rose-500 ring-1 ring-rose-500/20"
                      : ""
                      }`}
                  />
                </div>
              </div>

              {/* Active amount display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAmount}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 rounded-xl bg-muted/60 p-4 text-center backdrop-blur-sm"
                >
                  <p className="text-xs text-muted-foreground">You're donating</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                    ₹{activeAmount > 0 ? activeAmount.toLocaleString("en-IN") : "0"}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleDonateMobile}
                    disabled={activeAmount < 1}
                    className="w-full cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-6 text-base font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/30 disabled:opacity-50"
                  >
                    <Coffee weight="fill" className="size-5" />
                    Pay via UPI App
                  </Button>
                </motion.div>

                <Button
                  onClick={handleShowQR}
                  disabled={activeAmount < 1}
                  variant="outline"
                  className="w-full cursor-pointer rounded-xl py-6 hover:bg-muted"
                >
                  Or Show QR Code 📱
                </Button>
              </div>

              {/* UPI ID display */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">UPI ID:</span>
                <button
                  onClick={handleCopyUPI}
                  className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-muted/60 px-2.5 py-1 text-xs font-mono font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {UPI_ID}
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle weight="fill" className="size-3.5 text-green-500" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Supporters note */}
              <p className="mt-5 text-center text-[11px] text-muted-foreground/70">
                Securely encrypted. Works with GPay, PhonePe, Paytm & all UPI apps.
              </p>
            </div>

            {/* QR Code overlay */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/95 p-6 backdrop-blur-md"
                >
                  <h3 className="text-lg font-bold">Scan to Pay</h3>
                  <div className="overflow-hidden rounded-xl bg-white p-4 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/donationQR.png"
                      alt="UPI Payment QR Code"
                      className="size-48 object-contain mx-auto"
                    />
                  </div>
                  <p className="text-center text-sm font-medium">
                    Paying ₹{activeAmount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    Scan using any UPI App (GPay, PhonePe, Paytm, etc.)
                  </p>
                  <div className="mt-2 flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      onClick={() => setShowQR(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 cursor-pointer bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        setShowQR(false);
                        setShowThankYou(true);
                      }}
                    >
                      I've Paid
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thank you overlay */}
            <AnimatePresence>
              {showThankYou && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/95 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  >
                    <Heart weight="fill" className="size-16 text-rose-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Thank you! 🎉</h3>
                  <p className="max-w-xs text-center text-sm text-muted-foreground">
                    Your support means the world to us. We'll keep building amazing free tools for everyone!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 cursor-pointer"
                    onClick={() => setShowThankYou(false)}
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}
