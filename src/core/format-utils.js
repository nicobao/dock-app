export function formatCurrency(value, currency = 'USD') {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,

    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
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

export function formatDockAmount(value) {
  return parseInt(value) / 1000000;
}

const dateFormat = new Intl.DateTimeFormat(['en-US'], {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDate(date) {
  return dateFormat.format(typeof date === 'string' ? new Date(date) : date);
}
