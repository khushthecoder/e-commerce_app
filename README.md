# Vishal Mart - E-Commerce App

A modern, feature-rich e-commerce mobile application built with React Native and Node.js, providing seamless shopping experience with secure online payments.

## Project Overview

Vishal Mart is a comprehensive e-commerce solution that enables users to browse products, manage shopping cart, and make secure online payments. Built with cutting-edge technologies, it offers a smooth and intuitive shopping experience for mobile users.

## Features

- **User Authentication**: Secure login and registration system
- **Product Catalog**: Browse through various product categories with detailed views
- **Shopping Cart**: Add, remove, and manage items in cart
- **Online Payments**: Secure payment integration with multiple payment options
- **Order Management**: Track orders and view order history
- **User Profile**: Manage personal information and preferences
- **Product Search & Filter**: Find products quickly with search and filter options
- **Wishlist**: Save favorite products for later
- **Push Notifications**: Get updates on orders and promotions

## Technology Stack

### Frontend (Mobile App)
- **React Native** with Expo for cross-platform development
- **React Navigation** for app routing and navigation
- **State Management** with Context API/Redux
- **Expo Vector Icons** for UI icons

### Backend (Server)
- **Node.js** with Express.js framework
- **Prisma** as ORM for database management
- **MySQL** as primary database
- **JWT** for secure authentication
- **Payment Gateway Integration** (Razorpay/Stripe)

### Additional Technologies
- **Push Notifications** for order updates
- **Cloudinary/Firebase Storage** for media management
- **Environment Variables** for secure configuration

## Project Structure
VISHAL_MART/
├── Backend/                 # Node.js backend server
│   ├── node_modules/
│   ├── prisma/              # Database schema and migrations
│   ├── src/                 # Server source code
│   ├── .env                 # Environment variables
│   ├── package.json         # Server dependencies
│   └── package-lock.json
├── VISHAL_MART/             # React Native mobile app
│   ├── .expo/
│   ├── node_modules/
│   ├── src/
│   │   ├── assets/          # Images, fonts, and static files
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Common components
│   │   │   ├── layout/      # Layout components
│   │   │   └── product/     # Product-related components
│   │   ├── config/          # App configuration
│   │   ├── constants/       # App constants
│   │   ├── hooks/           # Custom React hooks
│   │   ├── Navigation/      # Navigation setup
│   │   ├── screens/         # App screens
│   │   │   ├── auth/        # Authentication screens
│   │   │   ├── cart/        # Shopping cart screens
│   │   │   ├── checkout/    # Checkout process screens
│   │   │   ├── home/        # Home and product listing
│   │   │   └── profile/     # User profile screens
│   │   ├── Services/        # API services
│   │   └── state/           # State management
│   ├── App.js               # Main app component
│   ├── app.json             # Expo configuration
│   ├── index.js             # App entry point
│   └── package.json         # Mobile app dependencies
└── README.md                # Project documentation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- MySQL Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd VISHAL_MART
   cd Backend
#Setup the backend server:
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MySQL database credentials

# Setup database
npx prisma generate
npx prisma db push

# Start backend server
npm run dev
#Setup the mobile app:
cd VISHAL_MART
npm install

# Start Expo development server
npm start

#Run on device/simulator:
# iOS
npm run ios

# Android
npm run android

# Web
npm run web


## Development Timeline

- **Week 1-2**: Project setup, database design, and backend API development
- **Week 3-4**: User authentication, product management, and basic frontend screens
- **Week 5-6**: Shopping cart functionality, state management, and UI components
- **Week 7-8**: Payment integration, order management, and advanced features
- **Week 9-10**: Testing, bug fixing, and deployment preparation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## Future Enhancements

- **AI Recommendations**: Personalized product suggestions
- **AR Product Preview**: Augmented reality product viewing
- **Voice Search**: Voice-enabled product search
- **Multi-language Support**: Internationalization
- **Loyalty Program**: Rewards and points system
- **Social Features**: Product sharing and reviews
- **Advanced Analytics**: Sales and user behavior insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Your Name** - 2024-B-06112005
