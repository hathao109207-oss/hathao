# CineTicket VIP - React Front-End

Dự án đặt vé rạp chiếu phim CineTicket VIP đã được chuyển đổi hoàn toàn từ PHP sang ứng dụng Front-End hiện đại sử dụng **React (Vite) + JavaScript**.

---

## 🌟 Tính Năng Chính
- **Trang chủ VIP**: Hero banner slider, thanh tính năng VIP 5 sao, danh sách phim hot, ưu đãi và tin tức điện ảnh.
- **Lịch chiếu & Bộ lọc**: Lọc theo thể loại, tìm kiếm phim, sắp xếp theo giá vé, đánh giá IMDb và tên phim.
- **Chi tiết phim**: Thông tin diễn viên, đạo diễn, thời lượng, trailer popup, chọn nhanh suất chiếu và bình luận người xem.
- **Sơ đồ chọn ghế trực quan**: Ghế Thường, VIP, Sweetbox đôi, hiển thị trạng thái ghế trống/đã đặt/đang chọn.
- **Combo bắp nước**: Lựa chọn thực đơn ăn uống với nút tăng giảm số lượng tức thì.
- **Giỏ vé & Đặt vé**: Quản lý các vé trong giỏ, áp dụng mã voucher giảm giá (ví dụ: `VIP25`).
- **Thanh toán đa phương tiện**: Hỗ trợ quét mã VietQR tự động theo ngân hàng, MoMo, VNPAY.
- **Vé điện tử có mã QR**: Khởi tạo vé VIP sau thanh toán có mã QR check-in tại quầy rạp.
- **Lịch sử đơn hàng & Tài khoản**: Quản lý vé đã đặt, thông tin thành viên VIP, điểm tích lũy CinePoints.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt thư viện (nếu cần thiết lập lại)
```bash
npm install
```

### 2. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### 3. Đóng gói bản Production
```bash
npm run build
```
Thư mục sản phẩm sau khi build sẽ nằm trong `dist/`.

---

## 📁 Cấu Trúc Mã Nguồn

```text
├── public/                 # Chứa assets CSS, hình ảnh, font chữ
│   └── assets/
├── src/
│   ├── components/         # Header, Footer, Toast notifications
│   ├── context/            # AppContext (giỏ hàng, đặt vé, xác thực, thông báo)
│   ├── data/               # mockData.js (dữ liệu phim, suất chiếu, bắp nước)
│   ├── pages/              # Các trang giao diện React (Home, MovieList, SeatSelection,...)
│   ├── App.jsx             # React Router cấu hình toàn bộ URL
│   ├── index.css           # Tích hợp CSS toàn cục
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
