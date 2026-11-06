const bcrypt = require('bcryptjs');

// In-Memory Storage for Zero-Dependency Resilience when MongoDB is offline
class MemoryStore {
  constructor() {
    this.users = [];
    this.donations = [];
    this.initialized = false;
    this.seed();
  }

  seed() {
    if (this.initialized) return;

    const hashSync = (pw) => bcrypt.hashSync(pw, 10);
    const now = Date.now();

    // 1. Pre-seed users
    const donor1 = {
      _id: 'user_donor_001',
      name: 'Suresh Varma',
      email: 'donor@annadaan.org',
      password: hashSync('password123'),
      role: 'donor',
      phone: '+91 98480 12345',
      organization: 'Royal Grand Banquet & Caterers',
      address: '4-12 Main Road, Opposite Clock Tower',
      city: 'tenali',
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
    };

    const donor2 = {
      _id: 'user_donor_002',
      name: 'Anita Roy',
      email: 'spiceroute@gmail.com',
      password: hashSync('password123'),
      role: 'donor',
      phone: '+91 94401 56789',
      organization: 'Spice Route Express',
      address: 'Broadipet 4th Lane',
      city: 'guntur',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
    };

    const ngo1 = {
      _id: 'user_ngo_001',
      name: 'Dr. K. Srinivas',
      email: 'ngo@shelter.org',
      password: hashSync('password123'),
      role: 'ngo',
      phone: '+91 86442 34567',
      organization: 'Hope Food Relief Foundation',
      address: 'Plot 18, Gouthami Nagar Community Center',
      city: 'tenali',
      createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000),
    };

    const ngo2 = {
      _id: 'user_ngo_002',
      name: 'Meera Deshmukh',
      email: 'annapurna@ngo.org',
      password: hashSync('password123'),
      role: 'ngo',
      phone: '+91 86624 78901',
      organization: 'Annapurna Seva Trust',
      address: 'Bunder Road, Near Benz Circle',
      city: 'vijayawada',
      createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000),
    };

    const admin = {
      _id: 'user_admin_001',
      name: 'Annadaan Platform Admin',
      email: 'admin@annadaan.org',
      password: hashSync('password123'),
      role: 'admin',
      phone: '+91 99999 88888',
      organization: 'Annadaan Headquarters',
      address: 'Tech Innovation Park',
      city: 'tenali',
      createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000),
    };

    this.users.push(donor1, donor2, ngo1, ngo2, admin);

    // 2. Pre-seed food donations
    this.donations.push(
      {
        _id: 'don_001',
        donor: donor1,
        title: 'Leftover Wedding Buffet Veg Biryani & Paneer Butter Masala',
        foodType: 'Veg',
        quantity: '50 Portions / 25 Kg',
        cookedTime: new Date(now - 2 * 60 * 60 * 1000),
        expiryHours: 8,
        pickupAddress: 'Kitchen Counter, Royal Grand Banquet, Main Road',
        city: 'tenali',
        notes: 'Packed hygienically in insulated stainless steel vessels. Mild spice. Ideal for immediate consumption.',
        status: 'Available',
        claimedBy: null,
        claimedAt: null,
        completedAt: null,
        createdAt: new Date(now - 2 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: 'don_002',
        donor: donor1,
        title: 'Fresh Dinner Bread Loaves, Rolls & Baguettes',
        foodType: 'Baked',
        quantity: '60 Assorted Pieces',
        cookedTime: new Date(now - 1.5 * 60 * 60 * 1000),
        expiryHours: 18,
        pickupAddress: 'Rear Loading Dock, Royal Grand Banquet',
        city: 'tenali',
        notes: 'Individually wrapped in food-grade bakery paper bags.',
        status: 'Available',
        claimedBy: null,
        claimedAt: null,
        completedAt: null,
        createdAt: new Date(now - 1.5 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: 'don_003',
        donor: donor2,
        title: 'Uncooked Rice, Toor Dal & Lentil Bags',
        foodType: 'Raw/Grocery',
        quantity: '40 Kg Sealed',
        cookedTime: new Date(now - 4 * 60 * 60 * 1000),
        expiryHours: 72,
        pickupAddress: 'Pantry Store, Spice Route Express, Broadipet',
        city: 'guntur',
        notes: 'Sealed dry grocery surplus from corporate catering event cancelation.',
        status: 'Available',
        claimedBy: null,
        claimedAt: null,
        completedAt: null,
        createdAt: new Date(now - 4 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: 'don_004',
        donor: donor2,
        title: 'Chicken Ghee Roast & Steamed Jeera Rice',
        foodType: 'Non-Veg',
        quantity: '35 Servings',
        cookedTime: new Date(now - 3 * 60 * 60 * 1000),
        expiryHours: 6,
        pickupAddress: 'Kitchen Entry, Spice Route Express',
        city: 'guntur',
        notes: 'Kept in thermal food warmer at 65°C. Must be collected before 10 PM.',
        status: 'Claimed',
        claimedBy: ngo1,
        claimedAt: new Date(now - 45 * 60 * 1000),
        completedAt: null,
        createdAt: new Date(now - 3 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: 'don_005',
        donor: donor1,
        title: 'Lunch Buffet Meals, Sambar Rice & Poriyal',
        foodType: 'Veg',
        quantity: '80 Portions',
        cookedTime: new Date(now - 10 * 60 * 60 * 1000),
        expiryHours: 12,
        pickupAddress: 'Royal Grand Banquet & Caterers',
        city: 'tenali',
        notes: 'Delivered to children shelter and community evening soup kitchen.',
        status: 'Completed',
        claimedBy: ngo1,
        claimedAt: new Date(now - 6 * 60 * 60 * 1000),
        completedAt: new Date(now - 4 * 60 * 60 * 1000),
        createdAt: new Date(now - 10 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      },
      {
        _id: 'don_006',
        donor: donor2,
        title: 'Artisanal Buns, Patties & Banana Walnut Cakes',
        foodType: 'Baked',
        quantity: '45 Packets',
        cookedTime: new Date(now - 16 * 60 * 60 * 1000),
        expiryHours: 24,
        pickupAddress: 'Bunder Road Outpost',
        city: 'vijayawada',
        notes: 'Successfully distributed to night shelters.',
        status: 'Completed',
        claimedBy: ngo2,
        claimedAt: new Date(now - 12 * 60 * 60 * 1000),
        completedAt: new Date(now - 10 * 60 * 60 * 1000),
        createdAt: new Date(now - 16 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
      }
    );

    this.initialized = true;
    console.log('[MemoryStore] Seeded in-memory store with demo users & donations.');
  }

  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    return this.users.find((u) => u.email === normalized) || null;
  }

  async findUserById(id) {
    const user = this.users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const copy = { ...user };
    delete copy.password;
    return copy;
  }

  async createUser(userData) {
    const newUser = {
      _id: 'user_' + Date.now() + Math.random().toString(36).substring(2, 7),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: bcrypt.hashSync(userData.password, 10),
      role: userData.role ? userData.role.toLowerCase() : 'donor',
      phone: userData.phone.trim(),
      organization: userData.organization ? userData.organization.trim() : '',
      address: userData.address.trim(),
      city: userData.city.toLowerCase().trim(),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async verifyPassword(user, enteredPassword) {
    return bcrypt.compareSync(enteredPassword, user.password);
  }

  async findDonations({ status, city, foodType, search }) {
    return this.donations.filter((d) => {
      if (status && status !== 'All' && d.status !== status) return false;
      if (foodType && foodType !== 'All' && d.foodType !== foodType) return false;
      if (city && city.trim()) {
        const cityRegex = new RegExp(city.trim(), 'i');
        if (!cityRegex.test(d.city)) return false;
      }
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        const matchTitle = searchRegex.test(d.title);
        const matchNotes = searchRegex.test(d.notes || '');
        if (!matchTitle && !matchNotes) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findDonationsByDonor(donorId) {
    return this.donations
      .filter((d) => (d.donor._id || d.donor).toString() === donorId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findDonationsByClaimer(claimerId) {
    return this.donations
      .filter((d) => d.claimedBy && (d.claimedBy._id || d.claimedBy).toString() === claimerId.toString())
      .sort((a, b) => new Date(b.claimedAt || b.createdAt) - new Date(a.claimedAt || a.createdAt));
  }

  async findDonationById(id) {
    return this.donations.find((d) => d._id.toString() === id.toString()) || null;
  }

  async createDonation(data, donorUser) {
    const newDonation = {
      _id: 'don_' + Date.now() + Math.random().toString(36).substring(2, 6),
      donor: {
        _id: donorUser._id,
        name: donorUser.name,
        email: donorUser.email,
        phone: donorUser.phone,
        organization: donorUser.organization,
        address: donorUser.address,
        city: donorUser.city,
      },
      title: data.title.trim(),
      foodType: data.foodType,
      quantity: data.quantity.trim(),
      cookedTime: new Date(data.cookedTime),
      expiryHours: Number(data.expiryHours),
      pickupAddress: data.pickupAddress.trim(),
      city: data.city.toLowerCase().trim(),
      notes: data.notes ? data.notes.trim() : '',
      imageUrl: data.imageUrl || this.getDefaultImage(data.foodType),
      status: 'Available',
      claimedBy: null,
      claimedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };
    this.donations.unshift(newDonation);
    return newDonation;
  }

  getDefaultImage(foodType) {
    const images = {
      Veg: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      'Non-Veg': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      'Raw/Grocery': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      Baked: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    };
    return images[foodType] || images.Veg;
  }

  async updateDonation(id, updates) {
    const donation = await this.findDonationById(id);
    if (!donation) return null;
    if (updates.title) donation.title = updates.title.trim();
    if (updates.foodType) donation.foodType = updates.foodType;
    if (updates.quantity) donation.quantity = updates.quantity.trim();
    if (updates.cookedTime) donation.cookedTime = new Date(updates.cookedTime);
    if (updates.expiryHours) donation.expiryHours = Number(updates.expiryHours);
    if (updates.pickupAddress) donation.pickupAddress = updates.pickupAddress.trim();
    if (updates.city) donation.city = updates.city.toLowerCase().trim();
    if (updates.notes !== undefined) donation.notes = updates.notes.trim();
    if (updates.imageUrl) donation.imageUrl = updates.imageUrl;
    return donation;
  }

  async deleteDonation(id) {
    const idx = this.donations.findIndex((d) => d._id.toString() === id.toString());
    if (idx === -1) return false;
    const donation = this.donations[idx];
    if (donation.status === 'Available') {
      this.donations.splice(idx, 1);
      return { removed: true };
    }
    donation.status = 'Cancelled';
    return { cancelled: true, donation };
  }

  async claimDonation(id, ngoUser) {
    const donation = await this.findDonationById(id);
    if (!donation) return { notFound: true };
    if (donation.status !== 'Available') return { alreadyClaimed: true, status: donation.status };

    donation.status = 'Claimed';
    donation.claimedBy = {
      _id: ngoUser._id,
      name: ngoUser.name,
      email: ngoUser.email,
      phone: ngoUser.phone,
      organization: ngoUser.organization,
      city: ngoUser.city,
    };
    donation.claimedAt = new Date();
    return { success: true, donation };
  }

  async completeDonation(id) {
    const donation = await this.findDonationById(id);
    if (!donation) return null;
    donation.status = 'Completed';
    donation.completedAt = new Date();
    return donation;
  }

  async getSummaryStats() {
    const totalDonations = this.donations.length;
    let completed = 0;
    let available = 0;
    let claimed = 0;
    let cancelled = 0;

    const foodTypeMap = { Veg: 0, 'Non-Veg': 0, 'Raw/Grocery': 0, Baked: 0 };
    const cityMap = {};

    this.donations.forEach((d) => {
      if (d.status === 'Completed') completed++;
      else if (d.status === 'Available') available++;
      else if (d.status === 'Claimed') claimed++;
      else if (d.status === 'Cancelled') cancelled++;

      if (foodTypeMap.hasOwnProperty(d.foodType)) {
        foodTypeMap[d.foodType]++;
      }

      const c = (d.city || 'other').toLowerCase();
      cityMap[c] = (cityMap[c] || 0) + 1;
    });

    const donorCount = this.users.filter((u) => u.role === 'donor').length;
    const ngoCount = this.users.filter((u) => u.role === 'ngo').length;

    const estimatedMealsRescued = completed * 25 + claimed * 15;
    const estimatedKgRescued = Math.round(estimatedMealsRescued * 0.5);
    const co2SavedKg = Math.round(estimatedKgRescued * 2.5);
    const waterSavedLiters = Math.round(estimatedKgRescued * 1000);

    const cityBreakdown = Object.keys(cityMap).map((city) => ({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      count: cityMap[city],
    })).sort((a, b) => b.count - a.count);

    return {
      totalDonations,
      completedDonations: completed,
      activeAvailable: available,
      claimedDonations: claimed,
      cancelledDonations: cancelled,
      registeredDonors: donorCount,
      registeredNGOs: ngoCount,
      totalUsers: this.users.length,
      estimatedMealsRescued,
      estimatedKgRescued,
      co2SavedKg,
      waterSavedLiters,
      foodTypeBreakdown: Object.keys(foodTypeMap).map((type) => ({
        type,
        count: foodTypeMap[type],
      })),
      cityBreakdown,
    };
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
