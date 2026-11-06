const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donation must belong to a donor'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a food donation title'],
      trim: true,
    },
    foodType: {
      type: String,
      required: [true, 'Please specify the food type'],
      enum: {
        values: ['Veg', 'Non-Veg', 'Raw/Grocery', 'Baked'],
        message: '{VALUE} is not a supported food type',
      },
    },
    quantity: {
      type: String,
      required: [true, 'Please specify the food quantity'],
      trim: true,
    },
    cookedTime: {
      type: Date,
      required: [true, 'Please provide the time the food was prepared/cooked'],
    },
    expiryHours: {
      type: Number,
      required: [true, 'Please specify the safe consumption window in hours'],
      min: [1, 'Expiry window must be at least 1 hour'],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Please provide the pickup address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      lowercase: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Claimed', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating exact expiry timestamp
foodDonationSchema.virtual('expiresAt').get(function () {
  if (this.cookedTime && this.expiryHours) {
    return new Date(new Date(this.cookedTime).getTime() + this.expiryHours * 60 * 60 * 1000);
  }
  return null;
});

// Virtual to determine if the listing is past expiry
foodDonationSchema.virtual('isExpired').get(function () {
  if (this.cookedTime && this.expiryHours) {
    const expiresAt = new Date(this.cookedTime).getTime() + this.expiryHours * 60 * 60 * 1000;
    return Date.now() > expiresAt;
  }
  return false;
});

foodDonationSchema.index({ city: 1, status: 1, foodType: 1 });
foodDonationSchema.index({ donor: 1 });
foodDonationSchema.index({ claimedBy: 1 });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

module.exports = FoodDonation;
