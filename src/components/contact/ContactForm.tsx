
"use client";

import { useState, type FormEvent } from "react";

import {
  ArrowRight,
  Mail,
  MessageSquareText,
  Send,
} from "lucide-react";

// ========================================
// Types
// ========================================

interface ContactFormProps {
  contactEmail: string;
}

// ========================================
// Form Styles
// ========================================

const inputClassName =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

// ========================================
// Contact Form
// ========================================

export default function ContactForm({
  contactEmail,
}: ContactFormProps) {
  const [draftPrepared, setDraftPrepared] =
    useState(false);

  // ======================================
  // Handle Contact Form
  // ======================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(
      formData.get("subject") || ""
    ).trim();
    const message = String(
      formData.get("message") || ""
    ).trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    // Prepare email subject
    const emailSubject = `[GearRento] ${subject}`;

    // Prepare email body
    const emailBody = [
      "Hello GearRento Team,",
      "",
      message,
      "",
      "------------------------------",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "------------------------------",
    ].join("\n");

    const mailtoUrl =
      `mailto:${contactEmail}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    setDraftPrepared(true);

    // Open the visitor's email application.
    // This does not send the message automatically.
    window.location.href = mailtoUrl;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ====================================
          Name and Email
      ==================================== */}

      <div className="grid gap-5 sm:grid-cols-2">

        {/* Full Name */}

        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="block text-sm font-semibold text-foreground"
          >
            Full Name <span className="text-destructive">*</span>
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            className={inputClassName}
            onChange={() => setDraftPrepared(false)}
          />
        </div>

        {/* Email */}

        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="block text-sm font-semibold text-foreground"
          >
            Email Address{" "}
            <span className="text-destructive">*</span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            maxLength={254}
            className={inputClassName}
            onChange={() => setDraftPrepared(false)}
          />
        </div>

      </div>

      {/* ====================================
          Subject
      ==================================== */}

      <div className="space-y-2">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-semibold text-foreground"
        >
          What can we help you with?{" "}
          <span className="text-destructive">*</span>
        </label>

        <select
          id="contact-subject"
          name="subject"
          defaultValue=""
          required
          className={inputClassName}
          onChange={() => setDraftPrepared(false)}
        >
          <option value="" disabled>
            Select a subject
          </option>

          <option value="Equipment Rental">
            Equipment Rental
          </option>

          <option value="Booking & Payment">
            Booking & Payment
          </option>

          <option value="Become an Equipment Owner">
            Become an Equipment Owner
          </option>

          <option value="Equipment Listing">
            Equipment Listing
          </option>

          <option value="Partnership & Business">
            Partnership & Business
          </option>

          <option value="Other Inquiry">
            Other Inquiry
          </option>
        </select>
      </div>

      {/* ====================================
          Message
      ==================================== */}

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-semibold text-foreground"
        >
          Your Message{" "}
          <span className="text-destructive">*</span>
        </label>

        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Tell us how we can help you..."
          required
          minLength={10}
          maxLength={2000}
          className={`${inputClassName} min-h-36 resize-y`}
          onChange={() => setDraftPrepared(false)}
        />

        <p className="text-xs text-muted-foreground">
          Please include any helpful details about your inquiry.
        </p>
      </div>

      {/* ====================================
          Submit
      ==================================== */}

      <button
        type="submit"
        className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Send className="size-4" />
        Open Email Draft

        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Feedback */}

      {draftPrepared && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-primary/20 bg-secondary p-4"
        >
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" />

          <p className="text-sm leading-6 text-secondary-foreground">
            Your email application should open with your
            message. Review the draft and press Send in
            your email application to submit it.
          </p>
        </div>
      )}

      {/* Privacy Note */}

      <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />

        <p>
          This form opens your email application. No message
          is stored or sent directly by the GearRento website.
        </p>
      </div>
    </form>
  );
}
