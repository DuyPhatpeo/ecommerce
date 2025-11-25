# 🛒 E-commerce Web Application

Modern, responsive e-commerce web application built with React, Tailwind CSS, and Firebase.

## ✨ Features

- 🔐 User authentication (Login/Register)
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart functionality
- 💳 Checkout process
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast and optimized with Vite
- 🔥 Real-time data with Firebase

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: React Context API / Redux (if applicable)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/DuyPhatpeo/ecommerce.git
cd ecommerce
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
ecommerce/
├── src/
│   ├── assets/          # Images, icons, and static files
│   ├── components/      # Reusable React components
│   ├── pages/           # Page components
│   ├── context/         # Context API providers
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and Firebase services
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── public/              # Public assets
├── .env.example         # Environment variables example
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Tailwind CSS Configuration

This project uses Tailwind CSS for styling. The configuration includes:
- Custom color schemes
- Responsive breakpoints
- Custom utility classes
- Dark mode support (if enabled)

## 🔥 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google, etc.)
3. Create a Firestore database
4. Add your Firebase configuration to `.env` file
5. Set up Firestore security rules as needed

## 🌟 Key Features Implementation

### Authentication
- User registration with email/password
- User login
- Password reset functionality
- Protected routes

### Product Management
- Display product catalog
- Product details page
- Search functionality
- Category filtering
- Sort by price, name, etc.

### Shopping Cart
- Add/remove items
- Update quantities
- Calculate total price
- Persist cart data

### Checkout
- Order summary
- User information form
- Payment integration (if applicable)
- Order confirmation

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Write clean, maintainable code
- Add comments for complex logic

### ESLint Configuration
This project uses TypeScript ESLint with recommended rules. For production applications, consider enabling type-aware lint rules:

```javascript
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)
- Large screens (1280px and up)

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Duy Phat**
- GitHub: [@DuyPhatpeo](https://github.com/DuyPhatpeo)

## 🙏 Acknowledgments

- React documentation
- Tailwind CSS team
- Firebase team
- Vite team
- All contributors

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Made with ❤️ by Duy Phat
