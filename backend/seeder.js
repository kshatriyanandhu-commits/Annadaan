const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await FoodDonation.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Cleared previous database records...');

    const users = await User.create([
      {
        name: 'Suresh Varma',
        email: 'donor@annadaan.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98480 12345',
        organization: 'Royal Grand Banquet & Caterers',
        address: '4-12 Main Road, Opposite Clock Tower',
        city: 'tenali',
      },
      {
        name: 'Anita Roy',
        email: 'spiceroute@gmail.com',
        password: 'password123',
        role: 'donor',
        phone: '+91 94401 56789',
        organization: 'Spice Route Express',
        address: 'Broadipet 4th Lane',
        city: 'guntur',
      },
      {
        name: 'Dr. K. Srinivas',
        email: 'ngo@shelter.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 86442 34567',
        organization: 'Hope Food Relief Foundation',
        address: 'Plot 18, Gouthami Nagar Community Center',
        city: 'tenali',
      },
      {
        name: 'Meera Deshmukh',
        email: 'annapurna@ngo.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 86624 78901',
        organization: 'Annapurna Seva Trust',
        address: 'Bunder Road, Near Benz Circle',
        city: 'vijayawada',
      },
      {
        name: 'Annadaan Platform Admin',
        email: 'admin@annadaan.org',
        password: 'password123',
        role: 'admin',
        phone: '+91 99999 88888',
        organization: 'Annadaan HQ',
        address: 'Tech Innovation Park',
        city: 'tenali',
      },
    ]);

    const [donor1, donor2, ngo1, ngo2] = users;
    const now = Date.now();

    await FoodDonation.create([
      {
        donor: donor1._id,
        title: 'Leftover Wedding Buffet Veg Biryani & Paneer Butter Masala',
        foodType: 'Veg',
        quantity: '50 Portions / 25 Kg',
        cookedTime: new Date(now - 2 * 60 * 60 * 1000),
        expiryHours: 8,
        pickupAddress: 'Kitchen Counter, Royal Grand Banquet, Main Road',
        city: 'tenali',
        notes: 'Packed hygienically in insulated stainless steel vessels. Mild spice. Ideal for immediate consumption.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      },
      {
        donor: donor1._id,
        title: 'Fresh Dinner Bread Loaves & Vegetable Rolls',
        foodType: 'Baked',
        quantity: '60 Assorted Pieces',
        cookedTime: new Date(now - 1.5 * 60 * 60 * 1000),
        expiryHours: 18,
        pickupAddress: 'Rear Loading Dock, Royal Grand Banquet',
        city: 'tenali',
        notes: 'Individually wrapped in food-grade bakery paper bags.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        donor: donor2._id,
        title: 'Uncooked Rice, Toor Dal & Lentil Bags',
        foodType: 'Raw/Grocery',
        quantity: '40 Kg Sealed',
        cookedTime: new Date(now - 5 * 60 * 60 * 1000),
        expiryHours: 72,
        pickupAddress: 'Pantry Store, Spice Route Express, Broadipet',
        city: 'guntur',
        notes: 'Sealed dry grocery surplus from corporate catering event cancelation.',
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      },
      {
        donor: donor2._id,
        title: 'Chicken Ghee Roast & Steamed Jeera Rice',
        foodType: 'Non-Veg',
        quantity: '35 Servings',
        cookedTime: new Date(now - 3 * 60 * 60 * 1000),
        expiryHours: 6,
        pickupAddress: 'Kitchen Entry, Spice Route Express',
        city: 'guntur',
        notes: 'Kept in thermal food warmer at 65°C. Must be collected before 10 PM.',
        status: 'Claimed',
        claimedBy: ngo1._id,
        claimedAt: new Date(now - 30 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      },
      {
        donor: donor1._id,
        title: 'Lunch Buffet Meals, Sambar Rice & Poriyal',
        foodType: 'Veg',
        quantity: '80 Portions',
        cookedTime: new Date(now - 10 * 60 * 60 * 1000),
        expiryHours: 12,
        pickupAddress: 'Royal Grand Banquet & Caterers',
        city: 'tenali',
        notes: 'Delivered to children shelter and community evening soup kitchen.',
        status: 'Completed',
        claimedBy: ngo1._id,
        claimedAt: new Date(now - 6 * 60 * 60 * 1000),
        completedAt: new Date(now - 4 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      },
      {
        donor: donor2._id,
        title: 'Buns, Patties & Banana Walnut Cakes',
        foodType: 'Baked',
        quantity: '45 Packets',
        cookedTime: new Date(now - 16 * 60 * 60 * 1000),
        expiryHours: 24,
        pickupAddress: 'Bunder Road Outpost',
        city: 'vijayawada',
        notes: 'Successfully distributed to night shelters.',
        status: 'Completed',
        claimedBy: ngo2._id,
        claimedAt: new Date(now - 12 * 60 * 60 * 1000),
        completedAt: new Date(now - 10 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
      },
    ]);

    console.log('[Seeder] Sample platform data successfully injected!');
    console.log('[Seeder] Test Accounts:');
    console.log('   Donor: donor@annadaan.org / password123');
    console.log('   NGO:   ngo@shelter.org / password123');
    console.log('   Admin: admin@annadaan.org / password123');

    process.exit();
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await FoodDonation.deleteMany();
    await User.deleteMany();
    console.log('[Seeder] All database collections cleared successfully.');
    process.exit();
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
