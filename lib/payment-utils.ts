/**
 * Generates a payment URL for Wert.io with the specified amount
 * @param amount The payment amount in USD
 * @returns The complete payment URL
 */
export function generatePaymentUrl(amount: number): string {
  // Base URL with all fixed parameters
  const baseUrl = "https://widget.wert.io/01HCKZD4AEX5VG0ETTAXRB31H3/widget/login"

  // Fixed parameters
  const params = new URLSearchParams({
    commodity: "USDCc",
    network: "polygon",
    commodities: '[{"commodity":"USDCc","network":"polygon"}]',
    currency: "USD",
    address: "0xdf1d206b5027947610c7d92058d79df07c7218fd",
    commodity_id: "usdcc.erc-20.polygon",
    // Add a return URL parameter to redirect back to our confirmation page after payment
    redirect_url: window.location.origin + "/order-confirmation",
  })

  // Add the dynamic amount parameter
  params.set("currency_amount", amount.toFixed(2))

  // Return the complete URL
  return `${baseUrl}?${params.toString()}`
}
