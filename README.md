# Vishal Mart - E-Commerce App
VIDEO:
https://drive.google.com/file/d/1eJDerTGTm9_BiIrYa655RWW7JZhBHWc1/view

A modern, feature-rich e-commerce mobile application built with React Native and Node.js, providing seamless shopping experience with secure online payments.

## Project Overview

Vishal Mart is a comprehensive e-commerce solution that enables users to browse products, manage shopping cart, and make secure online payments. Built with cutting-edge technologies, it offers a smooth and intuitive shopping experience for mobile users.

## Features

### User Authentication
- **Secure Sign Up & Login**: Email and password-based authentication.
- **Session Management**: JWT-based secure session handling.
- **Password Security**: Industry-standard password hashing.

### Product Browsing
- **Home Screen**: Interactive product feed with infinite scroll simulation.
- **Category Filtering**: Filter products by categories (Shoes, Electronics, Watches, Bags, Clothing, Accessories).
- **Smart Search**: Real-time search functionality by product name or description.
- **Product Details**: Rich product views with images, descriptions, pricing, and stock availability.

### Shopping Cart
- **Cart Management**: Seamlessly add items, adjust quantities, and remove products.
- **Real-time Calculations**: Instant subtotal and grand total updates.
- **Persistent State**: Cart contents are managed via global application state.

### Checkout & Orders
- **Address Management**: Full CRUD (Create, Read, Update, Delete) support for shipping addresses.
- **Streamlined Checkout**: Easy-to-use checkout flow with "Cash on Delivery" support.
- **Order History**: Comprehensive list of past orders with status tracking and dates.

### User Profile
- **Profile Management**: Update personal details including Name, Phone, and Address.
- **Settings Dashboard**: Quick access to order history, saved addresses, and app settings.

### UI/UX Experience
- **Theme Support**: Fully functional **Dark Mode** and **Light Mode** with dynamic switching.
- **Responsive Design**: Optimized layouts for various screen sizes.
- **Offline Capability**: Robust dummy data generation ensures the app is testable even without a backend connection for products.
- **Review System**: Interactive star rating and review submission system.

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

```
MAD_PRJOECT_SEM3/
├── Backend/                 # Node.js/Express Backend
│   ├── prisma/              # Database Schema & Seeds
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route logic
│   │   ├── middleware/      # Auth & Error middleware
│   │   └── routes/          # API Routes
│   ├── index.js             # Entry point
│   └── package.json
│
├── VISHAL_MART/             # React Native Frontend
│   ├── src/
│   │   ├── assets/          # Images & Fonts
│   │   ├── components/      # Reusable Components
│   │   ├── constants/       # App Constants & Dummy Data
│   │   ├── screens/         # App Screens (Home, Cart, etc.)
│   │   ├── state/           # Context API (Auth, Cart, Order)
│   │   ├── theme/           # Theme Configuration
│   │   └── utils/           # Helper Functions
│   ├── App.js               # Main App Component
│   ├── app.json             # Expo Config
│   └── package.json
│
└── README.md                # Project Documentation
```
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
   cd MAD_PRJOECT_SEM3
   ```

2. **Setup the Backend Server**:
   ```bash
   cd Backend
   npm install

   # Setup environment variables
   cp .env.example .env
   # Edit .env with your MySQL database credentials

   # Setup database
   npx prisma generate
   npx prisma db push

   # Start backend server
   npm run dev
   ```

3. **Setup the Mobile App**:
   ```bash
   # Open a new terminal or cd back to root
   cd ../VISHAL_MART
   npm install

   # Start Expo development server
   npm start
   ```

4. **Run on Device/Simulator**:
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Development Timeline

- **Week 1-2**: Project setup, database design, and backend API development
- **Week 3-4**: User authentication, product management, and basic frontend screens
- **Week 5-6**: Shopping cart functionality, state management, and UI components
- **Week 7-8**: Payment integration, order management, and advanced features
- **Week 9-10**: Testing, bug fixing, and deployment preparation

## API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/me` - Get current user profile

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product details

### Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/item/:itemId` - Update cart item quantity
- `DELETE /cart/item/:itemId` - Remove item from cart
- `POST /cart/checkout` - Process checkout

### Orders
- `POST /orders` - Create new order
- `GET /orders/history` - Get logged-in user's order history
- `GET /orders/:id` - Get specific order details

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
