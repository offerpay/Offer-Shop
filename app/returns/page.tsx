import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Returns & Exchanges | TechStyle",
  description: "Learn about our returns and exchanges policy at TechStyle.",
}

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>

        <div className="prose prose-neutral max-w-none">
          <p>
            At TechStyle, we want you to be completely satisfied with your purchase. If you're not entirely happy with
            your order, we're here to help.
          </p>

          <h2>Return Policy</h2>
          <p>
            You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the
            return shipping costs if the return is a result of our error (you received an incorrect or defective item,
            etc.).
          </p>

          <h2>Return Process</h2>
          <ol>
            <li>
              <strong>Contact Us:</strong> Email us at returns@techstyle.com or call our customer service at (800)
              555-1234 to request a return authorization.
            </li>
            <li>
              <strong>Package Your Item:</strong> Pack the item securely in its original packaging if possible.
            </li>
            <li>
              <strong>Include Your Information:</strong> Include your order number and return reason in the package.
            </li>
            <li>
              <strong>Ship Your Return:</strong> Ship your return to the address provided in your return authorization.
            </li>
          </ol>

          <h2>Exchanges</h2>
          <p>
            If you need to exchange an item for a different size or color, please follow the same process as returns. In
            your communication with our customer service team, specify that you want an exchange and provide details of
            the item you'd like instead.
          </p>

          <h2>Refunds</h2>
          <p>
            Once we receive your return, we'll inspect it and notify you that we've received it. We'll immediately
            notify you of the status of your refund after inspecting the item. If your return is approved, we'll
            initiate a refund to your original method of payment. You'll receive the credit within a certain amount of
            days, depending on your card issuer's policies.
          </p>

          <h2>Late or Missing Refunds</h2>
          <p>
            If you haven't received a refund yet, first check your bank account again. Then contact your credit card
            company, it may take some time before your refund is officially posted. Next contact your bank. There is
            often some processing time before a refund is posted. If you've done all of this and you still have not
            received your refund yet, please contact us at returns@techstyle.com.
          </p>

          <h2>Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately at support@techstyle.com. We'll
            work with you to resolve the issue promptly.
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4">Still have questions about returns or exchanges?</p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
