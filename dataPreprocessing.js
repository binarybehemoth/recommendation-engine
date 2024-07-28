const fs = require('fs');
const csv = require('csv-parser');

// Function to load and preprocess data
function loadAndPreprocessData(inputFile) {
  let results = [];
  const uniqueInteractions = new Set();

  return new Promise(resolve=>{
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (data) => {
        // Create a unique key for each interaction
        const interactionKey = `${data.user_id}_${data.product_id}_${data.rating}_${data.timestamp}`;
        
        // Check if the interaction is unique
        if (!uniqueInteractions.has(interactionKey) && data.user_id && data.product_id && data.rating) {
          uniqueInteractions.add(interactionKey);
          data.rating = parseFloat(data.rating)/2.5+-1;  // recombee expects ratings between -1 and 1
          results.push(data);
        }
      })
      .on('end', () => {
        results = results.map(e=>Object.values(e));
        results.pop();  // Remove the last empty row
        const splitIndex = Math.floor(results.length * 0.8);  // 80% train, 20% test
        resolve({train:results.slice(0, splitIndex), test:results.slice(splitIndex)});
      });
  })
}

module.exports = { loadAndPreprocessData };