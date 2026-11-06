const mongoose = require('mongoose');
const FoodDonation = require('../models/FoodDonation');
const memoryStore = require('../config/memoryStore');

const isConnected = () => mongoose.connection.readyState === 1;

const createDonation = async (req, res, next) => {
  try {
    const {
      title,
      foodType,
      quantity,
      cookedTime,
      expiryHours,
      pickupAddress,
      city,
      notes,
      imageUrl,
    } = req.body;

    if (!title || !foodType || !quantity || !cookedTime || !expiryHours || !pickupAddress || !city) {
      res.status(400);
      throw new Error('Please fill in all required fields to create a food donation');
    }

    if (isConnected()) {
      const donation = await FoodDonation.create({
        donor: req.user._id,
        title: title.trim(),
        foodType,
        quantity: quantity.trim(),
        cookedTime: new Date(cookedTime),
        expiryHours: Number(expiryHours),
        pickupAddress: pickupAddress.trim(),
        city: city.toLowerCase().trim(),
        notes: notes ? notes.trim() : '',
        imageUrl: imageUrl || memoryStore.getDefaultImage(foodType),
        status: 'Available',
      });

      const populatedDonation = await FoodDonation.findById(donation._id).populate(
        'donor',
        'name email phone organization address city'
      );

      return res.status(201).json({
        success: true,
        donation: populatedDonation,
      });
    } else {
      const donation = await memoryStore.createDonation(
        { title, foodType, quantity, cookedTime, expiryHours, pickupAddress, city, notes, imageUrl },
        req.user
      );
      return res.status(201).json({
        success: true,
        donation,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getDonations = async (req, res, next) => {
  try {
    const { status, city, foodType, search } = req.query;

    if (isConnected()) {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (city && city.trim() !== '') query.city = { $regex: new RegExp(city.trim(), 'i') };
      if (foodType && foodType !== 'All') query.foodType = foodType;
      if (search && search.trim() !== '') {
        query.$or = [
          { title: { $regex: new RegExp(search.trim(), 'i') } },
          { notes: { $regex: new RegExp(search.trim(), 'i') } },
        ];
      }

      const donations = await FoodDonation.find(query)
        .populate('donor', 'name email phone organization address city')
        .populate('claimedBy', 'name email phone organization city')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    } else {
      const donations = await memoryStore.findDonations({ status, city, foodType, search });
      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMyDonations = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donations = await FoodDonation.find({ donor: req.user._id })
        .populate('claimedBy', 'name email phone organization city')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    } else {
      const donations = await memoryStore.findDonationsByDonor(req.user._id);
      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMyClaims = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donations = await FoodDonation.find({ claimedBy: req.user._id })
        .populate('donor', 'name email phone organization address city')
        .sort({ claimedAt: -1, createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    } else {
      const donations = await memoryStore.findDonationsByClaimer(req.user._id);
      return res.status(200).json({
        success: true,
        count: donations.length,
        donations,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getDonationById = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donation = await FoodDonation.findById(req.params.id)
        .populate('donor', 'name email phone organization address city')
        .populate('claimedBy', 'name email phone organization city');

      if (!donation) {
        res.status(404);
        throw new Error('Food donation listing not found');
      }

      return res.status(200).json({ success: true, donation });
    } else {
      const donation = await memoryStore.findDonationById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Food donation listing not found');
      }
      return res.status(200).json({ success: true, donation });
    }
  } catch (error) {
    next(error);
  }
};

const updateDonation = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donation = await FoodDonation.findById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to edit this donation');
      }

      if (donation.status !== 'Available') {
        res.status(400);
        throw new Error(`Cannot update a listing that is already '${donation.status}'`);
      }

      const { title, foodType, quantity, cookedTime, expiryHours, pickupAddress, city, notes, imageUrl } = req.body;
      if (title) donation.title = title.trim();
      if (foodType) donation.foodType = foodType;
      if (quantity) donation.quantity = quantity.trim();
      if (cookedTime) donation.cookedTime = new Date(cookedTime);
      if (expiryHours) donation.expiryHours = Number(expiryHours);
      if (pickupAddress) donation.pickupAddress = pickupAddress.trim();
      if (city) donation.city = city.toLowerCase().trim();
      if (notes !== undefined) donation.notes = notes.trim();
      if (imageUrl) donation.imageUrl = imageUrl;

      const updated = await donation.save();
      const populated = await FoodDonation.findById(updated._id).populate('donor');
      return res.status(200).json({ success: true, donation: populated });
    } else {
      const donation = await memoryStore.findDonationById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      const donorId = (donation.donor._id || donation.donor).toString();
      if (donorId !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to edit this donation');
      }

      if (donation.status !== 'Available') {
        res.status(400);
        throw new Error(`Cannot update a listing that is already '${donation.status}'`);
      }

      const updated = await memoryStore.updateDonation(req.params.id, req.body);
      return res.status(200).json({ success: true, donation: updated });
    }
  } catch (error) {
    next(error);
  }
};

const deleteDonation = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donation = await FoodDonation.findById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to modify this donation');
      }

      if (donation.status === 'Completed' && req.user.role !== 'admin') {
        res.status(400);
        throw new Error('Cannot cancel a donation that has already been completed and delivered');
      }

      if (donation.status === 'Available') {
        await FoodDonation.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Donation listing removed successfully' });
      }

      donation.status = 'Cancelled';
      await donation.save();
      return res.status(200).json({ success: true, message: 'Donation status updated to Cancelled', donation });
    } else {
      const donation = await memoryStore.findDonationById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      const donorId = (donation.donor._id || donation.donor).toString();
      if (donorId !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to modify this donation');
      }

      if (donation.status === 'Completed' && req.user.role !== 'admin') {
        res.status(400);
        throw new Error('Cannot cancel a donation that has already been completed');
      }

      const result = await memoryStore.deleteDonation(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.removed ? 'Donation listing removed successfully' : 'Donation status updated to Cancelled',
      });
    }
  } catch (error) {
    next(error);
  }
};

const claimDonation = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donation = await FoodDonation.findOneAndUpdate(
        { _id: req.params.id, status: 'Available' },
        { status: 'Claimed', claimedBy: req.user._id, claimedAt: new Date() },
        { new: true }
      )
        .populate('donor', 'name email phone organization address city')
        .populate('claimedBy', 'name email phone organization city');

      if (!donation) {
        const existing = await FoodDonation.findById(req.params.id);
        if (!existing) {
          res.status(404);
          throw new Error('Donation listing not found');
        }
        res.status(400);
        throw new Error(`This donation is no longer available. Current status: '${existing.status}'`);
      }

      return res.status(200).json({
        success: true,
        message: 'Food donation claimed successfully! Please coordinate pickup with the donor.',
        donation,
      });
    } else {
      const result = await memoryStore.claimDonation(req.params.id, req.user);
      if (result.notFound) {
        res.status(404);
        throw new Error('Donation listing not found');
      }
      if (result.alreadyClaimed) {
        res.status(400);
        throw new Error(`This donation is no longer available. Current status: '${result.status}'`);
      }

      return res.status(200).json({
        success: true,
        message: 'Food donation claimed successfully! Please coordinate pickup with the donor.',
        donation: result.donation,
      });
    }
  } catch (error) {
    next(error);
  }
};

const completeDonation = async (req, res, next) => {
  try {
    if (isConnected()) {
      const donation = await FoodDonation.findById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      if (donation.status !== 'Claimed') {
        res.status(400);
        throw new Error(`Cannot complete a donation with status '${donation.status}'. Must be 'Claimed' first.`);
      }

      const isDonor = donation.donor.toString() === req.user._id.toString();
      const isClaimer = donation.claimedBy && donation.claimedBy.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isDonor && !isClaimer && !isAdmin) {
        res.status(403);
        throw new Error('Only the donor who listed this food or the claiming NGO can mark it completed');
      }

      donation.status = 'Completed';
      donation.completedAt = new Date();
      await donation.save();

      const populated = await FoodDonation.findById(donation._id)
        .populate('donor', 'name email phone organization address city')
        .populate('claimedBy', 'name email phone organization city');

      return res.status(200).json({
        success: true,
        message: 'Food rescue completed! Thank you for reducing food waste and feeding the community.',
        donation: populated,
      });
    } else {
      const donation = await memoryStore.findDonationById(req.params.id);
      if (!donation) {
        res.status(404);
        throw new Error('Donation listing not found');
      }

      if (donation.status !== 'Claimed') {
        res.status(400);
        throw new Error(`Cannot complete a donation with status '${donation.status}'. Must be 'Claimed' first.`);
      }

      const donorId = (donation.donor._id || donation.donor).toString();
      const claimerId = donation.claimedBy ? (donation.claimedBy._id || donation.claimedBy).toString() : '';
      const userId = req.user._id.toString();

      if (donorId !== userId && claimerId !== userId && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Only the donor who listed this food or the claiming NGO can mark it completed');
      }

      const completed = await memoryStore.completeDonation(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Food rescue completed! Thank you for reducing food waste and feeding the community.',
        donation: completed,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getDonations,
  getMyDonations,
  getMyClaims,
  getDonationById,
  updateDonation,
  deleteDonation,
  claimDonation,
  completeDonation,
};
