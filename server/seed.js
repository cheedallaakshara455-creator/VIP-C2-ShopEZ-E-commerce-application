require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const PRODUCTS = [
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever. Features the A17 Pro chip, a 48MP main camera, titanium design, and USB-C connectivity. Experience console-quality gaming and pro-level photography.',
    price: 134900, originalPrice: 159900, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=500&fit=crop'],
    stock: 45, brand: 'Apple', discount: 15, featured: true,
    rating: 4.8, numReviews: 320,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Unleash the power of Galaxy AI. The S24 Ultra features a 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 processor for ultimate productivity and creativity.',
    price: 124999, originalPrice: 139999, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=500&fit=crop'],
    stock: 32, brand: 'Samsung', discount: 10, featured: true,
    rating: 4.7, numReviews: 218,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 8 microphones. Up to 30 hours battery, quick charge (3 min = 3 hours), and ultra-comfortable premium design for all-day listening.',
    price: 24990, originalPrice: 34990, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=500&fit=crop'],
    stock: 78, brand: 'Sony', discount: 28, featured: true,
    rating: 4.9, numReviews: 512,
  },
  {
    name: 'MacBook Air M3',
    description: 'Supercharged by M3 chip. MacBook Air is impossibly thin with an 18-hour battery, 13.6-inch Liquid Retina display, and the performance to match your ambition.',
    price: 114900, originalPrice: 124900, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=500&fit=crop'],
    stock: 20, brand: 'Apple', discount: 8, featured: true,
    rating: 4.9, numReviews: 189,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by two icons of big Air, the Nike Air Max 270 delivers a super-soft ride with a large Air unit at the heel. Breathable mesh upper for all-day comfort.',
    price: 8995, originalPrice: 12995, category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=500&fit=crop'],
    stock: 120, brand: 'Nike', discount: 30, featured: true,
    rating: 4.6, numReviews: 445,
  },
  {
    name: "Levi's 511 Slim Jeans",
    description: "Classic Levi's 511 slim fit jeans in premium stretch denim. Sits below the waist and close through the thigh and leg opening. Perfect for casual everyday wear.",
    price: 2999, originalPrice: 4999, category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=500&fit=crop'],
    stock: 200, brand: "Levi's", discount: 40, featured: false,
    rating: 4.4, numReviews: 178,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Replace 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker & food warmer. Cook meals up to 70% faster.',
    price: 7499, originalPrice: 10999, category: 'Home',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=500&fit=crop'],
    stock: 60, brand: 'Instant Pot', discount: 32, featured: true,
    rating: 4.7, numReviews: 623,
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals microscopic dust. Piezo sensor counts and sizes particles. LCD screen shows proof of a deep clean in real time. 60-minute fade-free runtime.',
    price: 52900, originalPrice: 62900, category: 'Home',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=500&fit=crop'],
    stock: 15, brand: 'Dyson', discount: 16, featured: false,
    rating: 4.8, numReviews: 97,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Experience incredible energy return with BOOST midsole technology. Primeknit upper adapts to your foot shape for a supportive, sock-like fit. Perfect for running.',
    price: 12999, originalPrice: 17999, category: 'Sports',
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=500&fit=crop'],
    stock: 85, brand: 'Adidas', discount: 27, featured: true,
    rating: 4.5, numReviews: 267,
  },
  {
    name: 'Yoga Mat Premium Non-Slip',
    description: 'Professional-grade yoga mat with superior grip and cushioning. 6mm thick, eco-friendly TPE material. Includes carry strap. Suitable for yoga, pilates, and gym workouts.',
    price: 1299, originalPrice: 2499, category: 'Sports',
    images: ['https://images.unsplash.com/photo-1601925228042-cbb0c6bfef8b?w=600&h=500&fit=crop'],
    stock: 150, brand: 'ProFit', discount: 48, featured: false,
    rating: 4.3, numReviews: 342,
  },
  {
    name: 'Atomic Habits by James Clear',
    description: "The #1 New York Times bestseller. Tiny changes, remarkable results. An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 20 million copies sold worldwide.",
    price: 349, originalPrice: 599, category: 'Books',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=500&fit=crop'],
    stock: 500, brand: 'Penguin', discount: 41, featured: false,
    rating: 4.9, numReviews: 1240,
  },
  {
    name: "L'Oréal Revitalift Serum",
    description: 'Pure vitamin C + Hyaluronic Acid face serum. Visibly reduces wrinkles, brightens and firms skin. Dermatologist tested. Suitable for all skin types including sensitive skin.',
    price: 849, originalPrice: 1299, category: 'Beauty',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=500&fit=crop'],
    stock: 220, brand: "L'Oréal", discount: 34, featured: true,
    rating: 4.4, numReviews: 389,
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience. M2 chip, Liquid Retina XDR display with ProMotion, 12MP camera, and up to 2TB storage. Compatible with Apple Pencil 2 and Magic Keyboard.',
    price: 92900, originalPrice: 104900, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=500&fit=crop'],
    stock: 28, brand: 'Apple', discount: 11, featured: false,
    rating: 4.8, numReviews: 156,
  },
  {
    name: 'IKEA KALLAX Shelf Unit',
    description: 'Versatile shelving unit that works as a room divider or storage solution. Can be placed horizontally or vertically. Holds books, boxes, and decorative items beautifully.',
    price: 5999, originalPrice: 7999, category: 'Home',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=500&fit=crop'],
    stock: 40, brand: 'IKEA', discount: 25, featured: false,
    rating: 4.5, numReviews: 201,
  },
  {
    name: 'Nikon Z50 Mirrorless Camera',
    description: 'Compact DX-format mirrorless camera with 20.9MP sensor, 4K video recording, flip-down touchscreen, and 209 focus points. Perfect for travel and content creation.',
    price: 74990, originalPrice: 89990, category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=500&fit=crop'],
    stock: 18, brand: 'Nikon', discount: 16, featured: false,
    rating: 4.6, numReviews: 88,
  },
  {
    name: 'Protein Whey Isolate 2kg',
    description: 'Premium whey protein isolate with 27g protein per serving, only 110 calories. Fast absorption, zero added sugar. Available in chocolate, vanilla, and strawberry flavors.',
    price: 3499, originalPrice: 4999, category: 'Sports',
    images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=500&fit=crop'],
    stock: 180, brand: 'MuscleBlaze', discount: 30, featured: false,
    rating: 4.6, numReviews: 567,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👑 Admin created: ${adminUser.email} / admin123`);

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo Shopper',
      email: 'user@shopez.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`🛍️  Demo user created: ${demoUser.email} / user123`);

    // Insert products
    await Product.insertMany(PRODUCTS);
    console.log(`📦 ${PRODUCTS.length} products seeded successfully`);

    console.log('\n✨ Database seeded! You can now run the app.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();
