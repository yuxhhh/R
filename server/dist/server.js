"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mockDatabase_1 = require("./mockDatabase");
const agentEngine_1 = require("./agentEngine");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});
// Dashboard stats endpoint
app.get('/api/stats', (req, res) => {
    try {
        const stats = mockDatabase_1.db.getStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Customer endpoints
app.get('/api/customers', (req, res) => {
    try {
        const customers = mockDatabase_1.db.getCustomers();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/customers/:id', (req, res) => {
    try {
        const customer = mockDatabase_1.db.getCustomerById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/customers/:id', (req, res) => {
    try {
        const updated = mockDatabase_1.db.updateCustomer(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Campaign endpoints
app.get('/api/campaigns', (req, res) => {
    try {
        const campaigns = mockDatabase_1.db.getCampaigns();
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/campaigns', (req, res) => {
    try {
        const { goal, targetSegment, channel, discountPercentage, pointsMultiplier, agentPlan } = req.body;
        if (!goal || !targetSegment || !channel) {
            return res.status(400).json({ error: 'Goal, targetSegment, and channel are required' });
        }
        const campaign = mockDatabase_1.db.createCampaign({
            goal,
            status: 'Planning',
            targetSegment,
            channel,
            discountPercentage: discountPercentage || 0,
            pointsMultiplier: pointsMultiplier || 1,
            agentPlan
        });
        res.status(201).json(campaign);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// AI Agent Planning Endpoint
app.post('/api/agent/plan', (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ error: 'Campaign goal prompt is required' });
        }
        const agentPlan = (0, agentEngine_1.generateAgentPlan)(goal);
        res.json(agentPlan);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Campaign Execution & Simulation Trigger
app.post('/api/campaigns/:id/execute', (req, res) => {
    try {
        const campaignId = req.params.id;
        const campaign = mockDatabase_1.db.getCampaignById(campaignId);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        if (campaign.status === 'Completed') {
            return res.status(400).json({ error: 'Campaign is already executed and completed' });
        }
        // Determine target segment customers
        const goalLower = campaign.goal.toLowerCase();
        const allCustomers = mockDatabase_1.db.getCustomers();
        let targetCustomers = [];
        if (goalLower.includes('dormant') || goalLower.includes('win back') || goalLower.includes('inactive')) {
            targetCustomers = allCustomers.filter(c => c.lastPurchaseDaysAgo > 30 || c.churnRisk === 'High');
        }
        else if (goalLower.includes('vip') || goalLower.includes('gold') || goalLower.includes('platinum')) {
            targetCustomers = allCustomers.filter(c => c.tier === 'Gold' || c.tier === 'Platinum');
        }
        else if (goalLower.includes('dining') || goalLower.includes('food') || goalLower.includes('eat')) {
            targetCustomers = allCustomers.filter(c => c.predictedNextCategory === 'Dining');
        }
        else if (goalLower.includes('apparel') || goalLower.includes('clothes') || goalLower.includes('fashion')) {
            targetCustomers = allCustomers.filter(c => c.predictedNextCategory === 'Apparel');
        }
        else {
            targetCustomers = allCustomers.filter(c => c.points > 100);
        }
        // Run simulation
        const results = (0, agentEngine_1.runCampaignSimulation)(campaign, targetCustomers);
        // Update campaign status & metrics
        mockDatabase_1.db.updateCampaign(campaignId, {
            status: 'Completed',
            sentCount: results.sent,
            openCount: results.opened,
            clickCount: results.clicked,
            conversionCount: results.converted,
            revenueGenerated: results.revenue
        });
        // Apply outcomes to customers
        // We parse the generated activity logs to see who converted and update their data
        results.activityLogs.forEach((log) => {
            // Find the customer
            const customer = allCustomers.find(c => c.name === log.customerName);
            if (!customer)
                return;
            if (log.type === 'Purchase') {
                const orderVal = parseInt(log.metricChange.replace('+Rs. ', ''));
                // Increment purchases
                mockDatabase_1.db.updateCustomer(customer.id, {
                    purchaseCount: customer.purchaseCount + 1,
                    totalSpend: customer.totalSpend + orderVal,
                    lastPurchaseDaysAgo: 0,
                    churnRisk: 'Low' // Reset risk as they just converted
                });
            }
            if (log.type === 'PointsEarned') {
                const pointsEarned = parseInt(log.metricChange.replace('+', '').replace(' Points', ''));
                const oldTier = customer.tier;
                const newPoints = customer.points + pointsEarned;
                // Update customer points
                const updatedCust = mockDatabase_1.db.updateCustomer(customer.id, {
                    points: newPoints
                });
                // Log if they upgraded tiers
                if (updatedCust && updatedCust.tier !== oldTier) {
                    mockDatabase_1.db.logActivity({
                        type: 'TierUpgrade',
                        customerName: customer.name,
                        description: `Upgraded from ${oldTier} to ${updatedCust.tier} tier after milestone spend!`,
                        metricChange: `${updatedCust.tier} Badge`
                    });
                }
            }
            // Add original log to database activity logs
            mockDatabase_1.db.logActivity(log);
        });
        // Return the updated campaign
        const updatedCampaign = mockDatabase_1.db.getCampaignById(campaignId);
        res.json({ campaign: updatedCampaign, results });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Loyalty endpoints
app.get('/api/loyalty', (req, res) => {
    try {
        const rules = mockDatabase_1.db.getLoyaltyRules();
        res.json(rules);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/api/loyalty/:id', (req, res) => {
    try {
        const updated = mockDatabase_1.db.updateLoyaltyRule(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Loyalty rule not found' });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Activity logs
app.get('/api/logs', (req, res) => {
    try {
        const logs = mockDatabase_1.db.getActivityLogs();
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/logs/clear', (req, res) => {
    try {
        mockDatabase_1.db.clearActivityLogs();
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Reset database route
app.post('/api/database/reset', (req, res) => {
    try {
        mockDatabase_1.db.resetDatabase();
        res.json({ success: true, message: 'Database reset to initial seed values.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 XenoEngage API Server running on port ${PORT}`);
});
