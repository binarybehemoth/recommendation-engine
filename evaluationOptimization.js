const math = require('mathjs');

class EvaluationOptimizer {
  constructor(model, service, testData) {
    this.model = model;
    this.service = service;
    this.testData = testData;
  }

  async calculateMetrics() {
    const trueRatings = this.testData.map(r=>r[2]);
    const predictedRatings = await Promise.all(
      this.testData.map(async r => this.service.getRecommendations(r[0], 1))
    );
    console.log(trueRatings, predictedRatings);
    const ndcg = this.calculateNDCG(trueRatings, predictedRatings);
    const mapScore = this.calculateMAP(trueRatings, predictedRatings);

    return { ndcg, mapScore };
  }

  calculateNDCG(trueRatings, predictedRatings) {
    // Simplified NDCG calculation
    const dcg = math.sum(predictedRatings.map((p, i) => p / math.log2(i + 2)));
    const idcg = math.sum(trueRatings.sort((a, b) => b - a).map((p, i) => p / math.log2(i + 2)));
    return dcg / idcg;
  }

  calculateMAP(trueRatings, predictedRatings) {
    // Simplified MAP calculation
    const ap = predictedRatings.map((p, i) => 
      p > 0 ? math.sum(predictedRatings.slice(0, i + 1)) / (i + 1) : 0
    );
    return math.mean(ap);
  }

  async optimize() {   // not needed as optimization is performed by Recombee
    let bestMetrics = await this.calculateMetrics();
    let bestParams = this.model.getParams();

    for (const lr of [0.001, 0.01, 0.1]) {
      for (const reg of [0.1, 0.01, 0.001]) {
        await this.model.setParams({ lr, reg });
        await this.model.fit(this.testData);

        const currentMetrics = await this.calculateMetrics();

        if (currentMetrics.ndcg > bestMetrics.ndcg) {
          bestMetrics = currentMetrics;
          bestParams = { lr, reg };
        }
      }
    }

    await this.model.setParams(bestParams);
    return { bestParams, bestMetrics };
  }
}

// Usage
/*
const evaluator = new EvaluationOptimizer(model, testData);
evaluator.optimize()
  .then(({ bestParams, bestMetrics }) => {
    console.log('Best parameters:', bestParams);
    console.log('Best metrics:', bestMetrics);
  })
  .catch(console.error);
*/
module.exports = { EvaluationOptimizer };