import type { ReactNode } from "react";

/**
 * Important: have qualified counsel review disclaimer copy for your jurisdiction
 * and product. This is general wellness/AI language, not legal advice.
 */
export function AskAiDisclaimer({ footer }: { footer?: ReactNode }) {
  return (
    <aside
      className="mb-4 rounded-2xl border border-wholara-terracotta/35 bg-wholara-terracotta/10 px-4 py-4 text-wholara-green sm:px-5 sm:py-5"
      aria-labelledby="ask-disclaimer-heading"
    >
      <h2
        id="ask-disclaimer-heading"
        className="font-display text-base font-medium text-wholara-terracotta-deep sm:text-lg"
      >
        Important notice before you use Ask Wholara
      </h2>
      <div className="mt-3 max-h-[min(50vh,22rem)] space-y-3 overflow-y-auto text-xs leading-relaxed text-wholara-green/90 sm:text-sm sm:leading-relaxed">
        <p>
          <strong>Artificial intelligence (AI).</strong> Replies here are
          produced by an automated AI system. They may be incorrect, incomplete,
          outdated, or not appropriate for your situation. AI can sound confident
          even when wrong. Do not rely on this tool as a source of truth.
        </p>
        <p>
          <strong>Not medical advice.</strong> Nothing on this page is medical
          advice, a medical diagnosis, or a treatment plan. It is not a
          substitute for care from a licensed physician or other qualified
          health professional. Wholara does not practice medicine and is not your
          healthcare provider.
        </p>
        <p>
          <strong>Talk to your doctor.</strong> For any health concern, symptom,
          medication, supplement, diet change, or before you start, stop, or
          change any treatment, you must consult a qualified clinician who knows
          you and can examine you. If you think you may have an emergency, call
          your local emergency number or seek immediate in-person care.
        </p>
        <p>
          <strong>No doctor–patient relationship.</strong> Using Ask Wholara
          does not create a confidential clinician–patient relationship with
          Wholara or anyone affiliated with it.
        </p>
        <p>
          <strong>Your responsibility.</strong> You choose whether to follow any
          suggestion. You are solely responsible for decisions you make and
          actions you take based on this content.
        </p>
        <p>
          <strong>“As is.”</strong> This feature and all AI-generated content are
          provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis, without warranties of any kind, whether express or implied,
          including fitness for a particular purpose or non-infringement, to
          the fullest extent permitted by law.
        </p>
        <p>
          <strong>Limitation of liability.</strong> To the fullest extent
          permitted by applicable law, Wholara and its owners, employees, and
          contractors are not liable for any loss or damage (including indirect,
          incidental, special, or consequential damages) arising from or related
          to your use of, or inability to use, Ask Wholara or any information it
          provides—including personal injury, health outcomes, or reliance on
          AI output—even if we have been advised of the possibility of such
          damages. If any limitation is not enforceable where you live, our
          liability is limited to the maximum amount allowed by law.
        </p>
        <p>
          <strong>Not for every user.</strong> Do not use this tool in place of
          professional judgment where that judgment is required (for example,
          pregnancy, eating disorders, serious chronic conditions, or mental
          health crises). Always prioritize in-person medical care when
          appropriate.
        </p>
      </div>
      {footer ? (
        <div className="mt-4 border-t border-wholara-terracotta/25 pt-4">
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
