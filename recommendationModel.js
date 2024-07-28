const recombee = require('recombee-api-client');
const rqs = recombee.requests;

const client = new recombee.ApiClient('web-coding-center-dev', 'RmHLrwGIgh4sVHxZyTM1Vzjkdg8pWipXqMSclqii8LhREsg7osrjxMzG7OJFzOVM',{region:'ap-se'});

class RecommendationModel {
  async addInteraction(userId, itemId, rating, timestamp) {
    try {
      console.log(`Adding interaction for user ${userId} and item ${itemId}`);
      await client.send(new rqs.AddRating(userId, itemId, rating, {timestamp}));
    } catch (error) {
      console.error(`An error occurred while adding interaction for user ${userId} and item ${itemId}:`, error);
    }
  }

  async fit(trainData) {
    const all_items = await client.send(new rqs.ListItems({}));
    const all_users = await client.send(new rqs.ListUsers({}));
    for (let row of trainData){
        const uid = row[0];
        if (!all_users.includes(uid)) {
            if (!uid) continue;
            await client.send(new rqs.AddUser(uid));
            all_users.push(uid);
        }
        const pid = row[1];
        if (!all_items.includes(pid)) {
            if (!pid) continue;
            await client.send(new rqs.AddItem(pid));
            all_items.push(pid);
        }
    }
    const promises = trainData.filter(row=>(row[0] && row[1]))
                              .map(async row => await this.addInteraction(row[0], row[1], parseFloat(row[2]), parseInt(row[3])));
    await Promise.all(promises);
  }

  async getRecommendations(userId, count = 5) {
    const recommended = await client.send(new rqs.RecommendItemsToUser(userId, count));
    return recommended.recomms.map(rec => rec.id);
  }
  
  async clearDatabase() {
    console.log('Clearing database first, please wait 30 seconds...');
    await client.send(new rqs.ResetDatabase());
    await new Promise (resolve => setTimeout(resolve, 30000));
  }
}

module.exports = { RecommendationModel};

