export function formatCurrency(value, currency = 'USD') {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,

    minimumFractionDigits: 2,
    maximumFractionDigits: 10,
  });

  return formatter.format(value);
}

export function formatAddress(value, size = 19) {
  if (!value || size > value.length) {
    return value;
  }

  const offset = size / 2;
  return `${value.substring(0, offset)}...${value.substring(
    value.length - offset,
  )}`;
}
