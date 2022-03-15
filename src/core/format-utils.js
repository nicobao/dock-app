import 'intl';
import BigNumber from 'bignumber.js';

export const DOCK_TOKEN_UNIT = 1000000;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

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
  return BigNumber(value).dividedBy(DOCK_TOKEN_UNIT).toNumber();
}

export function getPlainDockAmount(value) {
  return BigNumber(value).times(DOCK_TOKEN_UNIT);
}

export function formatDate(date) {
  const dateInstance = typeof date === 'string' ? new Date(date) : date;

  const fullYear = dateInstance.getFullYear();
  const month = dateInstance.getMonth();
  const day = dateInstance.getDate();

  return `${months[month]} ${day},${fullYear}`;

  // return dateFormat.format(typeof date === 'string' ? new Date(date) : date);
}
