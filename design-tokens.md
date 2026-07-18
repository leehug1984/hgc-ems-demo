# ETEK Power Cloud EMS — Font & Màu nền

Nguồn: `css/tokens.css`. Hệ màu gốc dùng **OKLCH**; mã Hex bên dưới là giá trị quy đổi gần đúng để tiện dùng trong Figma/Photoshop/công cụ khác.

## Font chữ

| Vai trò | Font | Fallback |
|---|---|---|
| Tiêu đề / heading | **Geist** | Inter Tight, system-ui, sans-serif |
| Nội dung / body | **Geist** | Inter Tight, system-ui, sans-serif |
| Số liệu / mono (giá trị, đơn vị, timestamp) | **Geist Mono** | IBM Plex Mono, ui-monospace, monospace |

Load qua Google Fonts, khai báo trong `<head>` của mỗi trang:
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Màu nền (background)

| Layer | OKLCH | Hex | Dùng ở đâu |
|---|---|---|---|
| Nền ngoài cùng | `oklch(15% 0.016 250)` | `#060C12` | `<body>`, nền tổng thể |
| Sidebar / topbar | `oklch(18.5% 0.018 250)` | `#0D131A` | menu trái, thanh trên |
| Card / bảng | `oklch(21.5% 0.018 250)` | `#131A22` | khối `.card`, KPI tile |
| Input / hover surface | `oklch(25.5% 0.02 250)` | `#1C242C` | nền input, mini-stat, hover |

## Màu chữ (ink)

| | OKLCH | Hex |
|---|---|---|
| Chữ chính | `oklch(95% 0.01 250)` | `#EAEFF5` |
| Chữ phụ | `oklch(75% 0.014 250)` | `#A7AFB7` |
| Chữ mờ / label | `oklch(58% 0.016 250)` | `#737B84` |

## Màu nhấn (accent) & thương hiệu

| | OKLCH | Hex |
|---|---|---|
| Accent xanh dương chính | `oklch(66% 0.17 250)` | `#2896F5` |
| Accent xanh ngọc (thứ 2) | `oklch(74% 0.12 195)` | `#25C2C2` |
| ETEK wordmark — xanh lá | `oklch(46% 0.11 150)` | `#1D6835` |
| ETEK wordmark — đỏ | `oklch(54% 0.20 25)` | `#C9222B` |

## Màu trạng thái (status — cố định, không dùng cho biểu đồ)

| | Hex |
|---|---|
| Tốt / Online | `#0ca30c` |
| Cảnh báo | `#fab219` |
| Nghiêm trọng cao | `#ec835a` |
| Nghiêm trọng | `#d03b3b` |
