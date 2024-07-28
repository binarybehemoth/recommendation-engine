# recommendation-engine
An AI-powered recommendation engine for an e-commerce site.

To install:  npm install

To test: npm run test

This Node.js approach demonstrates how to use AI to automate the process of building, deploying, and optimizing a recommendation engine in a JavaScript environment. It showcases data handling, model development, scalability considerations, and continuous improvement strategies.

Let's address each requirement:

**1. Data Collection and Preprocessing:** (dataPreprocessing.js)
To avoid exceeding the quota limit of the Recombee trial account, we'll use a mini mock-up of an open-source e-commerce dataset. The Amazon product review dataset is a good choice, as it's comprehensive and widely used in recommendation system research. We use csv-parser to handle and preprocess the data, addressing edge cases and missing data.

**2. Model Development:** (recommendationModel.js)
We leverage the recombee-api-node library for a robust recommendation engine, implementing a hybrid approach (collaborative and content-based filtering).

**3. Scalability and Performance:** (scalableRecommendationService.js)
The solution uses Express.js for the web server and Redis for caching, ensuring high performance and low-latency responses. Please ensure you have a redis server running locally to run it. (refer to https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/ for instructions on installation of a redis server)

**4. Evaluation and Optimization:** (evaluationService.js)
We implement NDCG and MAP metrics for evaluation, along with a simple grid search for hyperparameter optimization (not really needed here as already handled by Recombee).
