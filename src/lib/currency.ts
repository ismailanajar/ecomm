export function formatPrice(price: number | string, currencyCode: string = 'USD'): string {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(value)) return '';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      // Some currencies have no fractional parts natively (like JPY), 
      // but if the user wants custom decimals, Intl automatically adjusts.
    }).format(value);
  } catch (e) {
    // Fallback if formatting fails or currency code is unknown
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}
