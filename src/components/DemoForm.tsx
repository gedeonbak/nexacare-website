"use client";

import { useState } from "react";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  clinicName: string;
  role: string;
  email: string;
  phone: string;
  state: string;
  patientVolume: string;
  referralSource: string;
}

interface Errors {
  [key: string]: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  clinicName: "",
  role: "",
  email: "",
  phone: "",
  state: "",
  patientVolume: "",
  referralSource: "",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.15)",
  outline: "none",
  fontFamily: "var(--font-plus-jakarta-sans)",
  color: "#171717",
  backgroundColor: "#ffffff",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  marginBottom: "6px",
  color: "#374151",
  fontFamily: "var(--font-plus-jakarta-sans)",
};

const errorStyle = {
  fontSize: "12px",
  color: "#dc2626",
  marginTop: "4px",
  fontFamily: "var(--font-plus-jakarta-sans)",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label} <span style={{ color: "#dc2626" }}>*</span></label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function DemoForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.clinicName.trim()) newErrors.clinicName = "Clinic name is required";
    if (!formData.role) newErrors.role = "Please select your role";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.state) newErrors.state = "Please select your state";
    if (!formData.patientVolume) newErrors.patientVolume = "Please select patient volume";
    if (!formData.referralSource) newErrors.referralSource = "Please tell us how you heard about us";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (confirmed) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-16 px-6"
        style={{ minHeight: "400px" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(39,170,225,0.1)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#27AAE1" strokeWidth="1.5" />
            <path
              d="M7.5 12l3 3 6-6"
              stroke="#27AAE1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2
          className="text-3xl font-bold mb-3"
          style={{
            fontFamily: "var(--font-playfair-display)",
            color: "#262262",
          }}
        >
          You&apos;re booked.
        </h2>
        <p className="text-base mb-8" style={{ color: "#555", maxWidth: "420px", lineHeight: 1.7 }}>
          We&apos;ll send a confirmation to{" "}
          <strong style={{ color: "#262262" }}>{formData.email}</strong>. Talk soon.
        </p>
        <Link
          href="/"
          className="text-[13px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#27AAE1" }}
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all"
              style={{
                backgroundColor: step >= s ? "#262262" : "#e8e7e4",
                color: step >= s ? "#ffffff" : "#9ca3af",
              }}
            >
              {step > s ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                s
              )}
            </div>
            <span
              className="text-[12px] font-medium hidden sm:block"
              style={{ color: step >= s ? "#262262" : "#9ca3af" }}
            >
              {s === 1 ? "Clinic Information" : "Schedule"}
            </span>
            {s < 2 && (
              <div
                className="w-8 h-px mx-1"
                style={{ backgroundColor: step > s ? "#262262" : "#e8e7e4" }}
              />
            )}
          </div>
        ))}
        <span className="ml-auto text-[12px]" style={{ color: "#9ca3af" }}>
          Step {step} of 2
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="First name" error={errors.firstName}>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Jane"
                style={{
                  ...inputStyle,
                  borderColor: errors.firstName ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.firstName ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
              />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Smith"
                style={{
                  ...inputStyle,
                  borderColor: errors.lastName ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.lastName ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
              />
            </Field>
          </div>

          <Field label="Clinic name" error={errors.clinicName}>
            <input
              type="text"
              value={formData.clinicName}
              onChange={(e) => update("clinicName", e.target.value)}
              placeholder="Alpharetta Weight & Wellness"
              style={{
                ...inputStyle,
                borderColor: errors.clinicName ? "#dc2626" : "rgba(0,0,0,0.15)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.clinicName ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
            />
          </Field>

          <Field label="Your role" error={errors.role}>
            <select
              value={formData.role}
              onChange={(e) => update("role", e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.role ? "#dc2626" : "rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.role ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
            >
              <option value="">Select your role</option>
              <option value="owner">Owner / Founder</option>
              <option value="medical-director">Medical Director</option>
              <option value="practice-manager">Practice Manager</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@yourclinic.com"
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(404) 555-0100"
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? "#dc2626" : "rgba(0,0,0,0.15)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.phone ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
              />
            </Field>
          </div>

          <Field label="State" error={errors.state}>
            <select
              value={formData.state}
              onChange={(e) => update("state", e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.state ? "#dc2626" : "rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.state ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
            >
              <option value="">Select your state</option>
              <option value="GA">Georgia</option>
              <option value="FL">Florida</option>
              <option value="TX">Texas</option>
              <option value="AZ">Arizona</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Estimated active GLP-1 patients or target" error={errors.patientVolume}>
            <select
              value={formData.patientVolume}
              onChange={(e) => update("patientVolume", e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.patientVolume ? "#dc2626" : "rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.patientVolume ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
            >
              <option value="">Select patient volume</option>
              <option value="starting">Just starting</option>
              <option value="1-50">1–50</option>
              <option value="51-150">51–150</option>
              <option value="150-500">150–500</option>
              <option value="500+">500+</option>
            </select>
          </Field>

          <Field label="How did you hear about NexaCare?" error={errors.referralSource}>
            <select
              value={formData.referralSource}
              onChange={(e) => update("referralSource", e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.referralSource ? "#dc2626" : "rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#262262"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.referralSource ? "#dc2626" : "rgba(0,0,0,0.15)"; }}
            >
              <option value="">Select one</option>
              <option value="google">Google search</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Referral</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <button
            onClick={handleContinue}
            className="w-full py-3 text-[15px] font-semibold text-white rounded-lg transition-opacity hover:opacity-90 mt-2"
            style={{
              backgroundColor: "#262262",
              fontFamily: "var(--font-plus-jakarta-sans)",
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: "#262262", fontFamily: "var(--font-plus-jakarta-sans)" }}
          >
            One last step — pick a time that works for you.
          </h3>
          <p className="text-[14px] mb-6" style={{ color: "#555", lineHeight: 1.7 }}>
            15-minute intro call with the NexaCare team. We&apos;ll walk through the platform,
            answer your questions, and discuss your clinic&apos;s specific situation.
          </p>

          {/* Calendly placeholder */}
          <div
            className="rounded-xl flex flex-col items-center justify-center text-center p-10"
            style={{
              border: "1.5px solid #262262",
              minHeight: "400px",
              backgroundColor: "#f8f7f5",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(38,34,98,0.08)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="#262262" strokeWidth="1.5" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#262262" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[14px] font-medium mb-2" style={{ color: "#262262" }}>
              Calendly widget loads here
            </p>
            <p className="text-[12px] mb-4" style={{ color: "#777", maxWidth: "320px" }}>
              {/* TODO: Replace YOUR_CALENDLY_URL with actual Calendly link */}
              Replace with:{" "}
              <code style={{ fontSize: "11px", backgroundColor: "#e8e7e4", padding: "2px 6px", borderRadius: "4px" }}>
                &lt;div class=&apos;calendly-inline-widget&apos; data-url=&apos;YOUR_CALENDLY_URL&apos; style=&apos;min-width:320px;height:630px;&apos;&gt;&lt;/div&gt;
              </code>
            </p>
            {/* Simulate booking for demo purposes */}
            <button
              onClick={() => setConfirmed(true)}
              className="text-[13px] font-semibold px-6 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#262262", color: "#ffffff" }}
            >
              Simulate Booking (Demo)
            </button>
          </div>

          <p className="mt-4 text-center text-[12px]" style={{ color: "#9ca3af" }}>
            Prefer email? Reach us at{" "}
            <a
              href="mailto:hello@nexacaremanagement.com"
              className="underline transition-colors hover:text-sky"
              style={{ color: "#27AAE1" }}
            >
              hello@nexacaremanagement.com
            </a>
          </p>

          <button
            onClick={() => setStep(1)}
            className="mt-4 text-[13px] font-medium transition-colors hover:text-navy"
            style={{ color: "#777" }}
          >
            ← Back to clinic info
          </button>
        </div>
      )}
    </div>
  );
}
