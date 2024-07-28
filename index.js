const fs = require('fs');
const path = require('path');
const { loadAndPreprocessData } = require('./dataPreprocessing');
const { RecommendationModel } = require('./recommendationModel');
const { ScalableRecommendationService } = require('./scalableRecommendationService');
const { EvaluationOptimizer } = require('./evaluationOptimization');

const INPUT_FILE = 'amazon_reviews.csv';

async function main() {
  try {
    console.log('Starting recommendation system...');

    // 1. Data Preprocessing
    console.log('Preprocessing data...');
    const { train, test } = await loadAndPreprocessData(path.join(__dirname, INPUT_FILE));
    console.log('Data preprocessed successfully.');

    // 2. Model Development
    console.log('Initializing and training recommendation model...');
    const model = new RecommendationModel('web-coding-center-dev', 'RmHLrwGIgh4sVHxZyTM1Vzjkdg8pWipXqMSclqii8LhREsg7osrjxMzG7OJFzOVM');
    await model.clearDatabase();
    await model.fit(train);
    console.log('Model trained successfully.');

    // 3. Scalable Service
    console.log('Setting up scalable recommendation service...');
    const service = new ScalableRecommendationService(model);
    
    // Example: Get recommendations for a user
    const userId = 'A3SGXH7AUHU8GW'; // Replace with an actual user ID from your dataset
    const recommendations = await service.getRecommendations(userId, 5);
    console.log(`Recommendations for user ${userId}:`, recommendations);

    // 4. Evaluation and Optimization
    // (not really needed here as continual optimization is handled by Recombee)
    /*
    console.log('Starting evaluation and optimization...');
    const evaluator = new EvaluationOptimizer(model, service, test);
    const { bestParams, bestMetrics } = await evaluator.optimize();  
    console.log('Optimization complete.');
    console.log('Best parameters:', bestParams);
    console.log('Best metrics:', bestMetrics);
    */

    // 5. Save the optimized model (optional)
    // This step depends on how your RecommendationModel is implemented
    // model.save('optimized_model.json');
    console.log('Recommendation system setup complete!');

    // Here you would typically start your Express server
    // For demonstration, we'll just log a message
    console.log('Ready to serve recommendations. Start your Express server here.');

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();