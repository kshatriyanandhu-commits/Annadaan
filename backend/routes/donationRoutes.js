const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getMyDonations,
  getMyClaims,
  getDonationById,
  updateDonation,
  deleteDonation,
  claimDonation,
  completeDonation,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDonations);
router.get('/my-donations', protect, authorize('donor', 'admin'), getMyDonations);
router.get('/my-claims', protect, authorize('ngo', 'admin'), getMyClaims);
router.post('/', protect, authorize('donor', 'admin'), createDonation);
router.get('/:id', getDonationById);
router.put('/:id', protect, authorize('donor', 'admin'), updateDonation);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteDonation);
router.patch('/:id/claim', protect, authorize('ngo', 'admin'), claimDonation);
router.patch('/:id/complete', protect, completeDonation);

module.exports = router;
