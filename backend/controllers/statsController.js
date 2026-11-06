const mongoose = require('mongoose');
const FoodDonation = require('../models/FoodDonation');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');

const isConnected = () => mongoose.connection.readyState === 1;

const getSummaryStats = async (req, res, next) => {
  try {
    if (isConnected()) {
      const statusCountsPipeline = [
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ];

      const foodTypePipeline = [
        { $group: { _id: '$foodType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ];

      const cityPipeline = [
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ];

      const [statusResults, foodTypeResults, cityResults, totalUsers, donorCount, ngoCount] =
        await Promise.all([
          FoodDonation.aggregate(statusCountsPipeline),
          FoodDonation.aggregate(foodTypePipeline),
          FoodDonation.aggregate(cityPipeline),
          User.countDocuments(),
          User.countDocuments({ role: 'donor' }),
          User.countDocuments({ role: 'ngo' }),
        ]);

      const statusMap = { Available: 0, Claimed: 0, Completed: 0, Cancelled: 0 };
      let totalDonations = 0;
      statusResults.forEach((item) => {
        if (item._id && statusMap.hasOwnProperty(item._id)) {
          statusMap[item._id] = item.count;
        }
        totalDonations += item.count;
      });

      const foodTypes = ['Veg', 'Non-Veg', 'Raw/Grocery', 'Baked'];
      const foodTypeBreakdown = foodTypes.map((type) => {
        const match = foodTypeResults.find((r) => r._id === type);
        return { type, count: match ? match.count : 0 };
      });

      const completedDonations = statusMap.Completed || 0;
      const activeAvailable = statusMap.Available || 0;
      const claimedCount = statusMap.Claimed || 0;

      const estimatedMealsRescued = completedDonations * 25 + claimedCount * 15;
      const estimatedKgRescued = Math.round(estimatedMealsRescued * 0.5);
      const co2SavedKg = Math.round(estimatedKgRescued * 2.5);
      const waterSavedLiters = Math.round(estimatedKgRescued * 1000);

      return res.status(200).json({
        success: true,
        stats: {
          totalDonations,
          completedDonations,
          activeAvailable,
          claimedDonations: claimedCount,
          cancelledDonations: statusMap.Cancelled || 0,
          registeredDonors: donorCount,
          registeredNGOs: ngoCount,
          totalUsers,
          estimatedMealsRescued,
          estimatedKgRescued,
          co2SavedKg,
          waterSavedLiters,
          foodTypeBreakdown,
          cityBreakdown: cityResults.map((c) => ({
            city: c._id ? c._id.charAt(0).toUpperCase() + c._id.slice(1) : 'Unknown',
            count: c.count,
          })),
        },
      });
    } else {
      const stats = await memoryStore.getSummaryStats();
      return res.status(200).json({
        success: true,
        stats,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummaryStats,
};
