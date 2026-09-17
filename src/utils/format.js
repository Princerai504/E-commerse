const inrFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export const formatINR = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return '₹0';
  return `₹${inrFormatter.format(Math.round(num))}`;
};

export const formatINRShort = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return '₹0';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${Math.round(num)}`;
};

export const FREE_SHIPPING_THRESHOLD = 4999;
export const SHIPPING_FEE = 499;