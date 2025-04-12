export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            Fashion Store ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, make a purchase,
            sign up for our newsletter, or contact us. This information may include:
          </p>
          <ul>
            <li>Personal information (name, email address, postal address, phone number)</li>
            <li>Payment information (credit card details, billing address)</li>
            <li>Order history and preferences</li>
            <li>Communications you send to us</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders, products, and services</li>
            <li>Improve our website and customer service</li>
            <li>Send you marketing communications (if you have opted in)</li>
            <li>Detect and prevent fraud</li>
          </ul>

          <h2>Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Payment processors to process your payments</li>
            <li>Shipping companies to deliver your orders</li>
            <li>Law enforcement or other parties when required by law</li>
          </ul>

          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as the
            right to access, correct, or delete your data.
          </p>

          <h2>Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet is 100% secure.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated
            "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@fashionstore.com.</p>
        </div>
      </div>
    </div>
  )
}
