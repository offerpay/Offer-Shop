export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>

        <div className="prose prose-neutral max-w-none">
          <h2>Shipping Methods and Timeframes</h2>
          <p>We offer the following shipping options:</p>
          <ul>
            <li>
              <strong>Standard Shipping:</strong> 5-7 business days
            </li>
            <li>
              <strong>Express Shipping:</strong> 2-3 business days
            </li>
            <li>
              <strong>Next Day Shipping:</strong> Next business day (order must be placed before 12pm)
            </li>
          </ul>

          <h2>Shipping Costs</h2>
          <p>
            Shipping costs are calculated based on the weight of your order and your delivery location. The exact
            shipping cost will be calculated at checkout.
          </p>
          <ul>
            <li>Orders over $100 qualify for free standard shipping within the continental United States.</li>
            <li>International shipping rates vary by country.</li>
          </ul>

          <h2>Order Processing</h2>
          <p>
            Orders are processed within 1-2 business days. Once your order has been processed, you will receive a
            shipping confirmation email with tracking information.
          </p>

          <h2>International Shipping</h2>
          <p>
            We ship to most countries worldwide. Please note that international orders may be subject to import duties
            and taxes, which are the responsibility of the customer.
          </p>

          <h2>Tracking Your Order</h2>
          <p>
            Once your order has been shipped, you will receive a shipping confirmation email with tracking information.
            You can use this tracking number to monitor the status of your delivery.
          </p>

          <h2>Delivery Issues</h2>
          <p>
            If you experience any issues with your delivery, please contact our customer service team at
            support@fashionstore.com.
          </p>
        </div>
      </div>
    </div>
  )
}
