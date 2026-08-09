import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Kaelō Atelier",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-green font-medium">
        &larr; Back to shop
      </Link>

      <h1 className="font-display text-3xl font-semibold text-navy mt-4 mb-2">
        Privacy Policy
      </h1>
      <p className="text-navy/50 text-sm mb-8">Last updated: August 2026</p>

      <div className="prose-sm max-w-none text-navy/80 space-y-6 leading-relaxed text-sm">
        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            1. Introduction
          </h2>
          <p>
            Kaelō Atelier ("we", "us", "our") operates an e-commerce website
            serving customers in Kampala and across Uganda. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website or make a purchase, in
            accordance with the Data Protection and Privacy Act, 2019 of
            Uganda and its accompanying regulations. By using our website,
            you consent to the practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            2. Information We Collect
          </h2>
          <p>We may collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>Identity and contact data:</strong> full name, email
              address, phone number, and delivery address.
            </li>
            <li>
              <strong>Order data:</strong> products purchased, order value,
              order history, and delivery status.
            </li>
            <li>
              <strong>Payment data:</strong> mobile money transaction
              references for MTN Mobile Money and Airtel Money. We do not
              collect or store your mobile money PIN or full account
              credentials.
            </li>
            <li>
              <strong>Technical data:</strong> device type, browser type, and
              general usage data collected automatically when you browse our
              site.
            </li>
            <li>
              <strong>Communications:</strong> messages you send us via
              WhatsApp, email, or through account registration, including any
              product reviews you submit.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            3. How We Use Your Information
          </h2>
          <p>We use the personal data we collect to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Process and fulfil your orders, including delivery coordination.</li>
            <li>Communicate with you about your order status via WhatsApp, phone, or email.</li>
            <li>Verify mobile money payments made to our MTN Mobile Money or Airtel Money accounts.</li>
            <li>Maintain your account, order history, and saved preferences.</li>
            <li>Respond to customer support enquiries and complaints.</li>
            <li>Improve our website, products, and services.</li>
            <li>Comply with legal obligations under Ugandan law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            4. Legal Basis for Processing
          </h2>
          <p>
            We process your personal data on the basis of your consent (for
            example, when you create an account or submit a review), the
            necessity of processing to perform our contract with you (to
            fulfil an order you placed), and our legitimate business
            interests in operating and improving our store, always balanced
            against your rights as a data subject under Ugandan law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            5. Sharing of Information
          </h2>
          <p>
            We do not sell your personal data. We may share limited
            information with:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Delivery and logistics partners, solely to fulfil your order.</li>
            <li>Mobile money providers (MTN Uganda, Airtel Uganda), to confirm payment.</li>
            <li>Government or regulatory authorities, where required by Ugandan law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            6. Data Storage and Security
          </h2>
          <p>
            We take reasonable technical and organisational measures to
            protect your personal data against unauthorised access, loss, or
            misuse. However, no method of electronic storage or transmission
            over the internet is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            7. Data Retention
          </h2>
          <p>
            We retain your personal data only for as long as necessary to
            fulfil the purposes described in this policy, including any
            legal, accounting, or reporting requirements under Ugandan law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            8. Your Rights
          </h2>
          <p>
            Under the Data Protection and Privacy Act, 2019, you have the
            right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Request deletion of your personal data, subject to legal exceptions.</li>
            <li>Object to or restrict certain processing of your data.</li>
            <li>Withdraw consent at any time, where processing is based on consent.</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us using the details
            below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            9. Cookies
          </h2>
          <p>
            Our website may use cookies and similar technologies to keep you
            logged in, remember items in your cart, and understand how
            visitors use our site. You can control cookies through your
            browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            10. Children&apos;s Privacy
          </h2>
          <p>
            Our services are not directed at children under 18. We do not
            knowingly collect personal data from children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            11. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            12. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or how we
            handle your personal data, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>WhatsApp: +256 743 457 759</li>
            <li>Email: Kaeloatelier@gmail.com</li>
            <li>Location: Kampala, Uganda</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
