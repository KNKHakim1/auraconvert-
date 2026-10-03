"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { useTranslations } from "@/i18n/use-translations";

export default function ContactPage() {
  const { locale } = useTranslations();
  const isTr = locale === "tr";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "cooldown">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam / Cooldown Check (1 minute)
    const lastSubmitTime = localStorage.getItem("last_contact_submit");
    if (lastSubmitTime) {
      const timeDiff = Date.now() - parseInt(lastSubmitTime, 10);
      if (timeDiff < 60000) {
        setStatus("cooldown");
        setErrorMessage(isTr ? "Lütfen tekrar göndermeden önce 1 dakika bekleyin." : "Please wait 1 minute before sending another message.");
        return;
      }
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Create FormData to send to Web3Forms
      const submissionData = new FormData();
      submissionData.append("access_key", "43ff8cb6-2404-4003-977a-f70b256db2d6");
      submissionData.append("name", `${formData.firstName} ${formData.lastName}`);
      submissionData.append("email", formData.email);
      submissionData.append("message", formData.message);
      submissionData.append("subject", "AuraConvert - Yeni İletişim Formu Mesajı");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        localStorage.setItem("last_contact_submit", Date.now().toString());
      } else {
        setStatus("error");
        setErrorMessage(data.message || (isTr ? "Bir hata oluştu. Lütfen tekrar deneyin." : "An error occurred. Please try again."));
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(isTr ? "Bağlantı hatası oluştu. Lütfen internetinizi kontrol edin." : "Connection error. Please check your internet.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 animate-fade-in pb-24">
      {/* Hero Section */}
      <div className="mb-12 space-y-4 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-xl shadow-primary-500/20 mb-4">
          <Icon name="search" className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {isTr ? "İletişim" : "Contact"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isTr ? "Bizimle iletişime geçmek çok kolay." : "Getting in touch with us is easy."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Info & Mailto */}
        <div className="md:col-span-5 flex flex-col space-y-8">
          <div className="rounded-3xl border border-border glass bg-card/50 p-8 shadow-sm flex flex-col items-start space-y-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary-500">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                <polyline points="2 9 12 15 22 9" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isTr ? "Bize Ulaşın" : "Reach Out"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {isTr
                  ? "Geri bildirimleriniz bizim için çok değerli. Yeni bir araç isteği, hata bildirimi veya sadece fikirlerinizi paylaşmak için yandaki formu kullanabilir veya doğrudan e-posta gönderebilirsiniz."
                  : "Your feedback is highly valuable to us. For new tool requests, bug reports, or just to share your thoughts, you can use the form or send us an email directly."}
              </p>
            </div>

            <div className="pt-2 w-full">
              <a
                href="mailto:merhaba@auraconvert.com"
                className="group flex items-center gap-3 w-full p-4 rounded-2xl border border-border bg-background hover:border-primary-500/50 hover:bg-primary-500/5 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">{isTr ? "E-posta Gönder" : "Send Email"}</span>
                  <span className="text-base font-semibold text-foreground">merhaba@auraconvert.com</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-border glass bg-card/80 p-8 shadow-xl shadow-black/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground ml-1">
                    {isTr ? "İsim" : "First Name"}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                    placeholder={isTr ? "Adınız" : "John"}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground ml-1">
                    {isTr ? "Soyisim" : "Last Name"}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                    placeholder={isTr ? "Soyadınız" : "Doe"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                  {isTr ? "E-posta Adresi" : "Email Address"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                  placeholder="ornek@mail.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground ml-1">
                  {isTr ? "Mesajınız" : "Your Message"}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none resize-none"
                  placeholder={isTr ? "Nasıl yardımcı olabiliriz?" : "How can we help you?"}
                />
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center gap-3 animate-fade-in">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-sm font-medium">
                    {isTr ? "Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağız." : "Your message has been sent successfully! We will get back to you soon."}
                  </p>
                </div>
              )}

              {(status === "error" || status === "cooldown") && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 animate-fade-in">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className={`w-full py-4 rounded-xl font-medium text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${status === "submitting" || status === "success" 
                    ? "bg-primary-500/50 cursor-not-allowed" 
                    : "bg-primary-500 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-primary-500/25 active:translate-y-0"
                  }`}
              >
                {status === "submitting" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isTr ? "Gönderiliyor..." : "Sending..."}
                  </>
                ) : status === "success" ? (
                  isTr ? "Gönderildi" : "Sent"
                ) : (
                  <>
                    {isTr ? "Mesajı Gönder" : "Send Message"}
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 ml-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
