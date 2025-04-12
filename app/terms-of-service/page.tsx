export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-neutral max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            Welcome to Fashion Store. These Terms of Service govern your use of our website and the purchase of products
            from our store.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use our website or make purchases from our store.
          </p>

          <h2>Products and Pricing</h2>
          <p>
            We strive to display our products and their prices accurately. However, we reserve the right to correct any
            errors in pricing and product descriptions. We also reserve the right to limit the quantity of any products
            that are offered on our website.
          </p>

          <h2>Orders and Payment</h2>
          <p>
            When you place an order, you are making an offer to purchase the products in your cart. We reserve the right
            to accept or decline your order for any reason. Payment must be made at the time of placing your order.
          </p>

          <h2>Shipping and Delivery</h2>
          <p>
            We will make every effort to ship your products within the timeframe specified in our Shipping Policy.
            However, we are not responsible for delays that are beyond our control.
          </p>

          <h2>Returns and Refunds</h2>
          <p>Please refer to our Return Policy for information on returns and refunds.</p>

          <h2>Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, images, and software, is the property of
            Fashion Store and is protected by copyright and other intellectual property laws.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Fashion Store shall not be liable for any direct, indirect, incidental, special, or consequential damages
            resulting from the use or inability to use our products or website.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at any time without prior notice. Your
            continued use of our website following any changes indicates your acceptance of the new terms.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please contact us at legal@fashionstore.com.</p>
        </div>
      </div>
    </div>
  )
}
