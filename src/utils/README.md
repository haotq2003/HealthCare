# Currency Formatter Utility

Utility functions để format tiền Việt Nam một cách nhất quán trong toàn bộ ứng dụng.

## Các function có sẵn

### 1. `formatVietnameseCurrency(amount, currency, locale)`
Format tiền với style currency chuẩn của Intl.NumberFormat.

```javascript
import { formatVietnameseCurrency } from '../utils/currencyFormatter';

// Sử dụng mặc định (VND, vi-VN)
formatVietnameseCurrency(1000000); // "1.000.000 ₫"

// Tùy chỉnh currency và locale
formatVietnameseCurrency(1000000, 'USD', 'en-US'); // "$1,000,000.00"
```

### 2. `formatVietnameseCurrencyWithUnit(amount, unit, locale)`
Format tiền với đơn vị tùy chỉnh.

```javascript
import { formatVietnameseCurrencyWithUnit } from '../utils/currencyFormatter';

// Sử dụng mặc định (₫, vi-VN)
formatVietnameseCurrencyWithUnit(1000000); // "1.000.000 ₫"

// Tùy chỉnh đơn vị
formatVietnameseCurrencyWithUnit(1000000, 'VNĐ'); // "1.000.000 VNĐ"
formatVietnameseCurrencyWithUnit(1000000, 'đ'); // "1.000.000 đ"
```

### 3. `formatVietnameseCurrencyVND(amount, locale)`
Format tiền với đơn vị VNĐ (tiện ích cho VND).

```javascript
import { formatVietnameseCurrencyVND } from '../utils/currencyFormatter';

formatVietnameseCurrencyVND(1000000); // "1.000.000 VNĐ"
```

### 4. `formatVietnameseCurrencyDong(amount, locale)`
Format tiền với đơn vị đ (tiện ích cho đ).

```javascript
import { formatVietnameseCurrencyDong } from '../utils/currencyFormatter';

formatVietnameseCurrencyDong(1000000); // "1.000.000 đ"
```

## Tham số

- `amount` (number): Số tiền cần format
- `currency` (string, optional): Loại tiền tệ (mặc định: 'VND')
- `unit` (string, optional): Đơn vị tiền tệ (mặc định: '₫')
- `locale` (string, optional): Locale (mặc định: 'vi-VN')

## Xử lý lỗi

Tất cả các function đều xử lý các trường hợp:
- `amount` là `null` hoặc `undefined`
- `amount` là `NaN`
- Trả về "0 ₫" hoặc "0 [unit]" cho các trường hợp lỗi

## Ví dụ sử dụng

```javascript
import { 
  formatVietnameseCurrency, 
  formatVietnameseCurrencyVND,
  formatVietnameseCurrencyDong 
} from '../utils/currencyFormatter';

// Trong component React
const ProductCard = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Giá: {formatVietnameseCurrencyVND(product.price)}</p>
    </div>
  );
};

// Trong bảng
const PriceTable = ({ items }) => {
  return (
    <table>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{formatVietnameseCurrencyDong(item.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Lưu ý

- Sử dụng `formatVietnameseCurrencyVND` cho hiển thị giá sản phẩm/dịch vụ
- Sử dụng `formatVietnameseCurrencyDong` cho bảng và danh sách
- Sử dụng `formatVietnameseCurrency` cho các trường hợp cần tùy chỉnh currency
- Tất cả function đều hỗ trợ locale 'vi-VN' mặc định để hiển thị số theo định dạng Việt Nam 