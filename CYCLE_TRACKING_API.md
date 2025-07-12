# Cycle Tracking API Documentation

## Tổng quan
API Cycle Tracking cho phép người dùng bật/tắt chức năng theo dõi chu kỳ kinh nguyệt và quản lý dữ liệu chu kỳ.

## API Endpoints

### 1. Bật/Tắt Cycle Tracking
```http
PUT /api/CycleTracking/enable-tracking?isEnabled={boolean}
```

**Headers:**
```
Authorization: Bearer {accessToken}
accept: */*
Content-Type: application/json
```

**Parameters:**
- `isEnabled`: `true` để bật, `false` để tắt

**Response:**
- `200 OK`: Thành công
- `400 Bad Request`: Lỗi tham số
- `401 Unauthorized`: Token không hợp lệ

### 2. Lấy trạng thái Cycle Tracking (từ Profile)
```http
GET /api/Authentication/profile
```

**Headers:**
```
Authorization: Bearer {accessToken}
accept: */*
```

**Response:**
```json
{
  "data": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "string",
    "role": "string",
    "isCycleTrackingOn": true/false,
    "createdTime": "string",
    "hasConsultantProfile": boolean
  }
}
```

## Cách sử dụng trong Frontend

### 1. Sử dụng CycleTrackingService
```javascript
import { CycleTrackingService } from '../services/CycleTrackingService';

// Bật tracking
await CycleTrackingService.updateCycleTracking(true);

// Tắt tracking
await CycleTrackingService.updateCycleTracking(false);
```

### 2. Sử dụng AuthService để lấy trạng thái
```javascript
import { AuthService } from '../services/AuthService';

// Lấy trạng thái cycle tracking từ profile
const userProfile = await AuthService.getUserProfile();
const isCycleTrackingOn = userProfile.isCycleTrackingOn;
```

### 3. Trong UserSettingPage
- Toggle switch để bật/tắt cycle tracking
- Gọi API enable-tracking khi user thay đổi
- Đồng bộ trạng thái từ API profile khi load trang

### 4. Trong MenstrualPage
- Kiểm tra trạng thái cycle tracking từ API profile
- Disable nút "Lưu thông tin" khi cycle tracking tắt
- Hiển thị thông báo yêu cầu bật tính năng

## Luồng hoạt động

1. **Khởi tạo**: Lấy trạng thái từ API profile
2. **Bật tính năng**: User toggle switch → Gọi API enable-tracking → Server cập nhật isCycleTrackingOn
3. **Tắt tính năng**: User toggle switch → Gọi API enable-tracking → Server cập nhật isCycleTrackingOn
4. **Sử dụng**: MenstrualPage kiểm tra trạng thái từ API profile → Cho phép/không cho phép lưu dữ liệu

## Lưu ý quan trọng

- **Bảo mật**: Tất cả API đều yêu cầu Bearer token
- **Error Handling**: Xử lý 401 Unauthorized để redirect login
- **Server State**: Trạng thái được lưu trên server trong profile user
- **Validation**: Kiểm tra trạng thái trước khi cho phép lưu dữ liệu
- **Fallback**: Mặc định `true` trong MenstrualPage để tránh disable nhầm

## Testing

### Test API với curl
```bash
# Bật tracking
curl -X PUT 'https://localhost:7276/api/CycleTracking/enable-tracking?isEnabled=true' \
  -H 'Authorization: Bearer {token}'

# Tắt tracking
curl -X PUT 'https://localhost:7276/api/CycleTracking/enable-tracking?isEnabled=false' \
  -H 'Authorization: Bearer {token}'

# Lấy trạng thái từ profile
curl -X GET 'https://localhost:7276/api/Authentication/profile' \
  -H 'Authorization: Bearer {token}'
``` 