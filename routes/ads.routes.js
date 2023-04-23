const express = require('express');
const router = express.Router();
const ad = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware');
const imageUpload = require('../utils/imageUpload');

router.get('/ads', ad.getAllAds);
router.get('/ads/:id', ad.getAdById);
router.post('/ads', authMiddleware, imageUpload.single('photo'), ad.createNewAd);
router.put('/ads/:id', authMiddleware, imageUpload.single('photo'), ad.editAd);
router.delete('/ads/:id', authMiddleware, ad.removeAd);
router.get('/ads/search/:searchPhrase', ad.searchPhrase);

module.exports = router;