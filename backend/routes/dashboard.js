/**
 * Dashboard Routes
 * All analytics endpoints for the UK PACK dashboard
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const DashboardService = require('../services/DashboardService');

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(authenticateToken);

/**
 * Endpoint Group 1: Overall Engagement
 */

// GET /api/v1/dashboard/engagement/summary
router.get('/engagement/summary', asyncHandler(async (req, res) => {
  const summary = await DashboardService.getEngagementSummary();
  
  res.status(200).json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
}));

/**
 * Endpoint Group 2: Neutral & Disagree Deep Dive
 */

// GET /api/v1/dashboard/deepdive/reasoning
router.get('/deepdive/reasoning', asyncHandler(async (req, res) => {
  const reasoning = await DashboardService.getReasoningBreakdown();
  
  res.status(200).json({
    success: true,
    data: reasoning,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/deepdive/minigame1_2
router.get('/deepdive/minigame1_2', asyncHandler(async (req, res) => {
  const minigameData = await DashboardService.getMinigame1And2Data();
  
  res.status(200).json({
    success: true,
    data: minigameData,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/deepdive/minigame3
router.get('/deepdive/minigame3', asyncHandler(async (req, res) => {
  const minigame3Data = await DashboardService.getMinigame3Data();
  
  res.status(200).json({
    success: true,
    data: minigame3Data,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/deepdive/satisfaction
router.get('/deepdive/satisfaction', asyncHandler(async (req, res) => {
  const satisfaction = await DashboardService.getSatisfactionData();
  
  res.status(200).json({
    success: true,
    data: satisfaction,
    timestamp: new Date().toISOString()
  });
}));

/**
 * Endpoint Group 3: End-Game Behavior
 */

// GET /api/v1/dashboard/endgame/fakenews
router.get('/endgame/fakenews', asyncHandler(async (req, res) => {
  const fakeNewsData = await DashboardService.getFakeNewsData();
  
  res.status(200).json({
    success: true,
    data: fakeNewsData,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/endgame/rewardfunnel
router.get('/endgame/rewardfunnel', asyncHandler(async (req, res) => {
  const rewardFunnel = await DashboardService.getRewardFunnelData();
  
  res.status(200).json({
    success: true,
    data: rewardFunnel,
    timestamp: new Date().toISOString()
  });
}));

/**
 * Endpoint Group 4: Qualitative Feedback
 */

// GET /api/v1/dashboard/feedback/custom_reasons
router.get('/feedback/custom_reasons', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const customReasons = await DashboardService.getCustomReasons(page, limit);
  
  res.status(200).json({
    success: true,
    data: customReasons.data,
    pagination: {
      currentPage: page,
      totalPages: customReasons.totalPages,
      totalItems: customReasons.totalItems,
      limit: limit
    },
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/feedback/suggestions
router.get('/feedback/suggestions', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const suggestions = await DashboardService.getSuggestions(page, limit);
  
  res.status(200).json({
    success: true,
    data: suggestions.data,
    pagination: {
      currentPage: page,
      totalPages: suggestions.totalPages,
      totalItems: suggestions.totalItems,
      limit: limit
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * Additional Analytics Endpoints
 */

// GET /api/v1/dashboard/analytics/trends
router.get('/analytics/trends', asyncHandler(async (req, res) => {
  const timeframe = req.query.timeframe || '7d'; // 7d, 30d, 90d
  const trends = await DashboardService.getTrends(timeframe);
  
  res.status(200).json({
    success: true,
    data: trends,
    timeframe: timeframe,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/analytics/heatmap
router.get('/analytics/heatmap', asyncHandler(async (req, res) => {
  const heatmapData = await DashboardService.getActivityHeatmap();
  
  res.status(200).json({
    success: true,
    data: heatmapData,
    timestamp: new Date().toISOString()
  });
}));

// GET /api/v1/dashboard/export/raw
router.get('/export/raw', asyncHandler(async (req, res) => {
  const format = req.query.format || 'json'; // json, csv
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;
  
  const exportData = await DashboardService.exportRawData(format, startDate, endDate);
  
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="uk-pack-data.csv"');
    res.send(exportData);
  } else {
    res.status(200).json({
      success: true,
      data: exportData,
      format: format,
      timestamp: new Date().toISOString()
    });
  }
}));

// GET /api/v1/dashboard/stats/summary
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const summary = await DashboardService.getOverallStats();
  
  res.status(200).json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router;
