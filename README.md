# 🛒 E-commerce Website

## Introduction

A modern, responsive e-commerce website built with **React + TypeScript**.
The project provides core features of an online shopping system, including user authentication, product browsing & search, shopping cart, checkout, order management, and user profile management.

---

## Tech Stack

- **React 18 + TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (UI & responsive design)
- **Firebase** (Authentication, Firestore, Storage)
- **Zustand** (state management)
- **React Router DOM**
- **Framer Motion, React Icons, Swiper**

---

## Main Features

- User registration, login, and password reset
- Product listing and product detail pages
- Search, filter, and sort products
- Add / remove / update shopping cart items
- Checkout and order history
- User account management, addresses, and wishlist
- Fully responsive UI (mobile → desktop)

---

## Installation & Run

```bash
git clone https://github.com/DuyPhatpeo/ecommerce.git
cd ecommerce
npm install
# Create a .env file and configure Firebase credentials
npm run dev
```

👉 Open: `http://localhost:5173`

---

## Project Structure

```
ecommerce/
├── src/
│ ├── api/          # API & Firebase services
│ ├── assets/       # Images, icons
│ ├── components/   # Reusable components
│ ├── hooks/        # Custom hooks
│ ├── pages/        # Page components
│ ├── routes/       # App routes
│ ├── stores/       # Zustand stores
│ ├── styles/       # Global styles
│ ├── App.tsx
│ └── main.tsx
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint
- `npm run type-check` – Run TypeScript type checking

---

## Firebase Setup

1. Create a project in the Firebase Console
2. Enable **Authentication** (Email/Password, Google, etc.)
3. Create a **Firestore Database**
4. Add Firebase configuration to the `.env` file
5. Configure Firestore security rules as needed

---

## Deployment

- **Vercel**: `vercel`
- **Netlify**: Build and upload the `dist` folder
- **Firebase Hosting**: `firebase deploy`

---

## Author

**Duy Phat**
GitHub: [@DuyPhatpeo](https://github.com/DuyPhatpeo)

---

# 🇻🇳 Phiên bản Tiếng Việt

## Giới thiệu

Website thương mại điện tử hiện đại, responsive, được xây dựng bằng **React + TypeScript**.
Dự án cung cấp đầy đủ các chức năng cốt lõi của một hệ thống bán hàng trực tuyến như xác thực người dùng, duyệt & tìm kiếm sản phẩm, giỏ hàng, thanh toán, quản lý đơn hàng và tài khoản.

---

## Công nghệ sử dụng

- **React 18 + TypeScript**
- **Vite**
- **Tailwind CSS**
- **Firebase** (Authentication, Firestore, Storage)
- **Zustand**
- **React Router DOM**
- **Framer Motion, React Icons, Swiper**

---

## Tính năng chính

- Đăng ký, đăng nhập, quên mật khẩu
- Xem danh sách và chi tiết sản phẩm
- Tìm kiếm, lọc và sắp xếp sản phẩm
- Thêm / xóa / cập nhật giỏ hàng
- Thanh toán và xem lịch sử đơn hàng
- Quản lý tài khoản, địa chỉ và wishlist
- Giao diện responsive trên mọi thiết bị

---

## Cài đặt & chạy dự án

```bash
git clone https://github.com/DuyPhatpeo/ecommerce.git
cd ecommerce
npm install
# Tạo file .env và cấu hình Firebase
npm run dev
```

👉 Truy cập: `http://localhost:5173`

---

## Cấu trúc thư mục

```
ecommerce/
├── src/
│ ├── api/
│ ├── assets/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── routes/
│ ├── stores/
│ ├── styles/
│ ├── App.tsx
│ └── main.tsx
```

---

## Triển khai

- **Vercel**
- **Netlify**
- **Firebase Hosting**

---

Made with ❤️ and React ✨
