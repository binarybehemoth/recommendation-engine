const express = require('express');
const Redis = require('ioredis');
const { RecommendationModel } = require('./recommendationModel');

const app = express();
const redis = new Redis();
const model = new RecommendationModel();

class ScalableRecommendationService {
  async getRecommendations(userId, n = 5) {
    const cacheKey = `recommendations:${userId}`;
    const cachedRecommendations = await redis.get(cacheKey);

    if (cachedRecommendations) {
      return JSON.parse(cachedRecommendations);
    }

    const recommendations = await model.getRecommendations(userId, n);

    await redis.set(cacheKey, JSON.stringify(recommendations), 'EX', 3600); // expire after 1 hour

    return recommendations;
  }
}

const service = new ScalableRecommendationService();

app.get('/recommend/:userId', async (req, res) => {
  try {
    const recommendations = await service.getRecommendations(req.params.userId);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { ScalableRecommendationService };