import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.id === id);
    return activity ? { ...activity } : null;
  }

  async getByContactId(contactId) {
    await delay(250);
    return this.activities
      .filter(a => a.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getByDealId(dealId) {
    await delay(250);
    return this.activities
      .filter(a => a.dealId === dealId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      completed: activityData.completed || false
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities[index] = { ...this.activities[index], ...updateData };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities.splice(index, 1);
    return true;
  }

  async markCompleted(id) {
    await delay(200);
    return this.update(id, { completed: true });
  }
}

export default new ActivityService();