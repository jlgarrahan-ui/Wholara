"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitConsultation, type ConsultationPayload } from "./actions";

type FieldErrors = Partial<Record<keyof ConsultationPayload | "form", string>>;

const labelClass =
  "block text-xs font-medium uppercase tracking-[0.16em] text-wholara-sage";

const inputBase =
  "mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-wholara-green placeholder:text-wholara-green/40 transition-colors focus:outline-none";

const inputOk =
  "border-wholara-green/15 focus:border-wholara-terracotta focus:ring-2 focus:ring-wholara-terracotta/30";

const inputErr =
  "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/25";

export function ConsultationForm() {
  const [serviceInterest, setServiceInterest] = useState<
    "individual" | "corporate"
  >("individual");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<{ firstName: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(payload: ConsultationPayload) {
    const next: FieldErrors = {};
    if (!payload.firstName.trim()) next.firstName = "First name is required.";
    if (!payload.lastName.trim()) next.lastName = "Last name is required.";
    if (payload.serviceInterest === "corporate" && !payload.organization.trim()) {
      next.organization = "Organization name is required.";
    }
    if (!payload.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    const digits = payload.phone.replace(/\D/g, "");
    if (!digits) {
      next.phone = "Phone number is required.";
    } else if (digits.length < 7) {
      next.phone = "Please enter a valid phone number.";
    }
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload: ConsultationPayload = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      serviceInterest,
      organization: String(fd.get("organization") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const clientErrors = validate(payload);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstErrId = Object.keys(clientErrors)[0];
      requestAnimationFrame(() => {
        document.getElementById(firstErrId)?.focus();
      });
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await submitConsultation(payload);
      if (result.ok) {
        setSuccess({ firstName: payload.firstName.trim() });
        form.reset();
      } else {
        setErrors({ ...(result.fieldErrors ?? {}), form: result.error });
      }
    });
  }

  if (success) {
    return <ThankYou firstName={success.firstName} />;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-7"
      aria-label="Consultation inquiry form"
    >
      {/* First & Last name */}
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        <Field
          id="firstName"
          name="firstName"
          label="First Name"
          required
          autoComplete="given-name"
          error={errors.firstName}
          onInput={() => clearError("firstName")}
        />
        <Field
          id="lastName"
          name="lastName"
          label="Last Name"
          required
          autoComplete="family-name"
          error={errors.lastName}
          onInput={() => clearError("lastName")}
        />
      </div>

      {/* Service interest toggle */}
      <fieldset>
        <legend className={labelClass}>Service Interest *</legend>
        <div className="mt-2 inline-flex w-full overflow-hidden rounded-xl border border-wholara-green/15 bg-white p-1 sm:w-auto">
          {(
            [
              { value: "individual", label: "Individual Coaching" },
              { value: "corporate", label: "Corporate Wellness" },
            ] as const
          ).map((opt) => {
            const active = serviceInterest === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setServiceInterest(opt.value);
                  clearError("organization");
                }}
                aria-pressed={active}
                className={
                  "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none " +
                  (active
                    ? "bg-wholara-terracotta text-wholara-cream shadow-sm"
                    : "text-wholara-green/75 hover:text-wholara-green")
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Conditional organization field */}
      <div
        className={
          "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out " +
          (serviceInterest === "corporate"
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none -mt-7 grid-rows-[0fr] opacity-0")
        }
        aria-hidden={serviceInterest !== "corporate"}
      >
        <div className="overflow-hidden">
          <Field
            id="organization"
            name="organization"
            label="Organization Name"
            required={serviceInterest === "corporate"}
            autoComplete="organization"
            error={errors.organization}
            onInput={() => clearError("organization")}
            disabled={serviceInterest !== "corporate"}
          />
        </div>
      </div>

      <Field
        id="email"
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="email"
        error={errors.email}
        onInput={() => clearError("email")}
      />

      <PhoneField
        error={errors.phone}
        onInput={() => clearError("phone")}
      />

      <div>
        <label htmlFor="message" className={labelClass}>
          Tell us more about what you&rsquo;re looking for
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Share anything you'd like us to know — your goals, challenges, or questions. The more you share, the better we can prepare for our conversation."
          className={`${inputBase} ${inputOk} resize-y leading-relaxed`}
        />
      </div>

      {errors.form && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="cta-shadow inline-flex w-full items-center justify-center gap-2 rounded-full bg-wholara-terracotta px-7 py-4 text-base font-medium text-wholara-cream transition-colors hover:bg-wholara-terracotta-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending..." : "Send My Inquiry"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  onInput?: () => void;
  disabled?: boolean;
};

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  autoComplete,
  error,
  onInput,
  disabled,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onInput={onInput}
        className={`${inputBase} ${error ? inputErr : inputOk}`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function PhoneField({
  error,
  onInput,
}: {
  error?: string;
  onInput?: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor="phone" className={labelClass}>
        Phone Number *
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={value}
        onChange={(e) => {
          // Strip everything except digits
          const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
          setValue(digits);
          onInput?.();
        }}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? "phone-err" : undefined}
        className={`${inputBase} ${error ? inputErr : inputOk}`}
      />
      {error && (
        <p id="phone-err" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ThankYou({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-col items-center text-center py-6 sm:py-10">
      <WildflowerIcon className="h-16 w-16 text-wholara-terracotta" />
      <h2 className="font-display mt-6 text-3xl text-wholara-green sm:text-4xl">
        Thank you, {firstName}!
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-wholara-green/80">
        We&rsquo;ll be in touch within 24 hours.
      </p>
    </div>
  );
}

function WildflowerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* stem */}
      <path
        d="M32 56 V32"
        stroke="#7D9B76"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* leaf left */}
      <path
        d="M32 46 C26 44 22 40 22 36"
        stroke="#7D9B76"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* leaf right */}
      <path
        d="M32 50 C38 48 42 44 42 40"
        stroke="#7D9B76"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* petals */}
      <g fill="currentColor">
        <ellipse cx="32" cy="14" rx="4.5" ry="7.5" />
        <ellipse
          cx="32"
          cy="14"
          rx="4.5"
          ry="7.5"
          transform="rotate(60 32 22)"
        />
        <ellipse
          cx="32"
          cy="14"
          rx="4.5"
          ry="7.5"
          transform="rotate(120 32 22)"
        />
        <ellipse
          cx="32"
          cy="14"
          rx="4.5"
          ry="7.5"
          transform="rotate(180 32 22)"
        />
        <ellipse
          cx="32"
          cy="14"
          rx="4.5"
          ry="7.5"
          transform="rotate(240 32 22)"
        />
        <ellipse
          cx="32"
          cy="14"
          rx="4.5"
          ry="7.5"
          transform="rotate(300 32 22)"
        />
      </g>
      {/* center */}
      <circle cx="32" cy="22" r="3.5" fill="#F5F0E8" stroke="#2C4A35" strokeWidth="1.5" />
    </svg>
  );
}
