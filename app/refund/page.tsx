import Link from "next/link";

export const metadata = {
  title: "Refund & Returns Policy — Kaelō Atelier",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-green font-medium">
        &larr; Back to shop
      </Link>

      <h1 className="font-display text-3xl font-semibold text-navy mt-4 mb-2">
        Refund &amp; Returns Policy
      </h1>
      <p className="text-navy/50 text-sm mb-8">Last updated: August 2026</p>

      <div className="prose-sm max-w-none text-navy/80 space-y-6 leading-relaxed text-sm">
        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            1. Overview
          </h2>
          <p>
            At Kaelō Atelier, we want you to be fully satisfied with your
            purchase. This policy explains how returns, exchanges, and
            refunds work for orders placed through our website, in line with
            the Consumer Protection Act, 2022 of Uganda, which grants
            consumers the right to fair and reasonable after-sales terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            2. Return Window
          </h2>
          <p>
            You may request a return or exchange within{" "}
            <strong>7 days</strong> of receiving your order. Requests made
            after this 7-day window will not be eligible for a refund or
            exchange, except where the product is defective or was not as
            described.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            3. Condition of Returned Items
          </h2>
          <p>To be eligible for a return, an item must be:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Unused</strong> and in the same condition you received it.</li>
            <li>In its original packaging, with tags, labels, and accessories intact.</li>
            <li>Accompanied by proof of purchase (order number or receipt).</li>
            <li>Free of any signs of wear, alteration, washing, or damage caused after delivery.</li>
          </ul>
          <p className="mt-2">
            For hygiene and safety reasons, certain items — including
            earrings and other pierced jewelry, and any item marked as
            "final sale" — cannot be returned once the packaging has been
            opened, unless the item is defective.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            4. How to Start a Return
          </h2>
          <p>To initiate a return or exchange:</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>
              Contact us via WhatsApp at +256 743 457 759 or email at
              Kaeloatelier@gmail.com within 7 days of delivery, quoting your
              order number.
            </li>
            <li>Describe the reason for the return and attach a photo of the item, if applicable.</li>
            <li>
              We will confirm eligibility and arrange for the item to be
              returned to us. Depending on the reason for return, you may be
              responsible for return shipping costs.
            </li>
            <li>Once we receive and inspect the item, we will notify you of the outcome.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            5. Refunds
          </h2>
          <p>
            Approved refunds will be issued to the original mobile money
            account used for payment (MTN Mobile Money or Airtel Money)
            within 5–10 business days of us receiving and inspecting the
            returned item. Original delivery fees are non-refundable unless
            the return is due to our error (wrong item sent, defective
            product, etc.).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            6. Exchanges
          </h2>
          <p>
            If you would prefer a different size, color, or product instead
            of a refund, let us know when you contact us — we will do our
            best to arrange an exchange, subject to stock availability.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            7. Damaged, Defective, or Incorrect Items
          </h2>
          <p>
            If you receive a damaged, defective, or incorrect item, please
            contact us within 48 hours of delivery with photos of the issue.
            We will arrange a free replacement or full refund, including any
            delivery costs, at no charge to you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            8. Non-Returnable Items
          </h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Items marked "final sale" at the time of purchase.</li>
            <li>Pierced jewelry and other items with hygiene considerations, once opened.</li>
            <li>Items returned after the 7-day window, except for defects.</li>
            <li>Items showing signs of use, damage, or alteration by the customer.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-navy mb-2">
            9. Contact Us
          </h2>
          <p>
            For any questions about returns, exchanges, or refunds, reach
            out to us:
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
