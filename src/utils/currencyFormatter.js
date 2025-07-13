/**
 * Format tiền Việt Nam
 * @param {number} amount - Số tiền cần format
 * @param {string} currency - Loại tiền tệ (mặc định: 'VND')
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} Chuỗi tiền đã được format
 */
export const formatVietnameseCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format tiền Việt Nam với đơn vị tùy chỉnh
 * @param {number} amount - Số tiền cần format
 * @param {string} unit - Đơn vị tiền tệ (mặc định: '₫')
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} Chuỗi tiền đã được format
 */
export const formatVietnameseCurrencyWithUnit = (amount, unit = '₫', locale = 'vi-VN') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${unit}`;
  }

  return `${new Intl.NumberFormat(locale).format(amount)} ${unit}`;
};

/**
 * Format tiền Việt Nam với đơn vị VNĐ
 * @param {number} amount - Số tiền cần format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} Chuỗi tiền đã được format
 */
export const formatVietnameseCurrencyVND = (amount, locale = 'vi-VN') => {
  return formatVietnameseCurrencyWithUnit(amount, 'VNĐ', locale);
};

/**
 * Format tiền Việt Nam với đơn vị đ
 * @param {number} amount - Số tiền cần format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} Chuỗi tiền đã được format
 */
export const formatVietnameseCurrencyDong = (amount, locale = 'vi-VN') => {
  return formatVietnameseCurrencyWithUnit(amount, 'đ', locale);
}; 