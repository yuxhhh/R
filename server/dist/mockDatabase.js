"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.calculateTier = void 0;
// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();
// Helper to determine loyalty tier
const calculateTier = (points) => {
    if (points >= 1000)
        return 'Platinum';
    if (points >= 500)
        return 'Gold';
    if (points >= 200)
        return 'Silver';
    return 'Bronze';
};
exports.calculateTier = calculateTier;
// Initial Seed Constants
const INITIAL_CUSTOMERS = [
    {
        id: 'CUST-101',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        phone: '+91 98765 43210',
        points: 750,
        tier: 'Gold',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 12,
        purchaseCount: 18,
        totalSpend: 14200,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Apparel',
        joinedDate: '2025-01-15'
    },
    {
        id: 'CUST-102',
        name: 'Priya Patel',
        email: 'priya.patel@yahoo.com',
        phone: '+91 98123 45678',
        points: 150,
        tier: 'Bronze',
        churnRisk: 'High',
        lastPurchaseDaysAgo: 78,
        purchaseCount: 2,
        totalSpend: 1800,
        preferredChannel: 'SMS',
        predictedNextCategory: 'Footwear',
        joinedDate: '2025-09-10'
    },
    {
        id: 'CUST-103',
        name: 'Rohan Verma',
        email: 'rohan.v@outlook.com',
        phone: '+91 95551 23456',
        points: 1250,
        tier: 'Platinum',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 3,
        purchaseCount: 45,
        totalSpend: 48900,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Electronics',
        joinedDate: '2024-03-20'
    },
    {
        id: 'CUST-104',
        name: 'Ananya Iyer',
        email: 'ananya.iyer@gmail.com',
        phone: '+91 88888 77777',
        points: 380,
        tier: 'Silver',
        churnRisk: 'Medium',
        lastPurchaseDaysAgo: 42,
        purchaseCount: 7,
        totalSpend: 6700,
        preferredChannel: 'Email',
        predictedNextCategory: 'Home Decor',
        joinedDate: '2025-04-05'
    },
    {
        id: 'CUST-105',
        name: 'Kabir Mehta',
        email: 'kabir.mehta@gmail.com',
        phone: '+91 99999 88888',
        points: 90,
        tier: 'Bronze',
        churnRisk: 'High',
        lastPurchaseDaysAgo: 95,
        purchaseCount: 1,
        totalSpend: 950,
        preferredChannel: 'Email',
        predictedNextCategory: 'Apparel',
        joinedDate: '2025-11-01'
    },
    {
        id: 'CUST-106',
        name: 'Ishaan Malhotra',
        email: 'ishaan.m@outlook.com',
        phone: '+91 91234 56789',
        points: 620,
        tier: 'Gold',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 14,
        purchaseCount: 11,
        totalSpend: 9800,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Dining',
        joinedDate: '2025-02-22'
    },
    {
        id: 'CUST-107',
        name: 'Diya Sen',
        email: 'diya.sen@gmail.com',
        phone: '+91 97777 66666',
        points: 1100,
        tier: 'Platinum',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 5,
        purchaseCount: 32,
        totalSpend: 31500,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Cosmetics',
        joinedDate: '2024-07-12'
    },
    {
        id: 'CUST-108',
        name: 'Vikram Singh',
        email: 'vikram.singh@rediffmail.com',
        phone: '+91 93333 44444',
        points: 210,
        tier: 'Silver',
        churnRisk: 'Medium',
        lastPurchaseDaysAgo: 35,
        purchaseCount: 4,
        totalSpend: 3900,
        preferredChannel: 'SMS',
        predictedNextCategory: 'Apparel',
        joinedDate: '2025-07-30'
    },
    {
        id: 'CUST-109',
        name: 'Meera Rao',
        email: 'meera.rao@gmail.com',
        phone: '+91 96666 55555',
        points: 40,
        tier: 'Bronze',
        churnRisk: 'High',
        lastPurchaseDaysAgo: 120,
        purchaseCount: 2,
        totalSpend: 1300,
        preferredChannel: 'Email',
        predictedNextCategory: 'Groceries',
        joinedDate: '2025-01-08'
    },
    {
        id: 'CUST-110',
        name: 'Arjun Gupta',
        email: 'arjun.g@gmail.com',
        phone: '+91 94444 33333',
        points: 540,
        tier: 'Gold',
        churnRisk: 'Medium',
        lastPurchaseDaysAgo: 22,
        purchaseCount: 14,
        totalSpend: 11400,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Footwear',
        joinedDate: '2025-05-18'
    },
    {
        id: 'CUST-111',
        name: 'Saira Banu',
        email: 'saira.b@gmail.com',
        phone: '+91 92222 11111',
        points: 890,
        tier: 'Gold',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 8,
        purchaseCount: 22,
        totalSpend: 19500,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Apparel',
        joinedDate: '2024-11-04'
    },
    {
        id: 'CUST-112',
        name: 'Dev Mukherjee',
        email: 'dev.m@gmail.com',
        phone: '+91 90000 12345',
        points: 1500,
        tier: 'Platinum',
        churnRisk: 'Low',
        lastPurchaseDaysAgo: 1,
        purchaseCount: 50,
        totalSpend: 54000,
        preferredChannel: 'WhatsApp',
        predictedNextCategory: 'Dining',
        joinedDate: '2024-01-10'
    },
    {
        id: 'CUST-113',
        name: 'Karan Johar',
        email: 'karan.j@gmail.com',
        phone: '+91 98887 66654',
        points: 180,
        tier: 'Bronze',
        churnRisk: 'High',
        lastPurchaseDaysAgo: 65,
        purchaseCount: 3,
        totalSpend: 2400,
        preferredChannel: 'SMS',
        predictedNextCategory: 'Groceries',
        joinedDate: '2025-08-14'
    },
    {
        id: 'CUST-114',
        name: 'Riya Sen',
        email: 'riya.sen@yahoo.com',
        phone: '+91 97776 55543',
        points: 420,
        tier: 'Silver',
        churnRisk: 'Medium',
        lastPurchaseDaysAgo: 28,
        purchaseCount: 8,
        totalSpend: 8100,
        preferredChannel: 'Email',
        predictedNextCategory: 'Cosmetics',
        joinedDate: '2025-03-01'
    },
    {
        id: 'CUST-115',
        name: 'Nikhil Kapoor',
        email: 'nikhil.k@gmail.com',
        phone: '+91 96665 44432',
        points: 120,
        tier: 'Bronze',
        churnRisk: 'High',
        lastPurchaseDaysAgo: 85,
        purchaseCount: 2,
        totalSpend: 1550,
        preferredChannel: 'SMS',
        predictedNextCategory: 'Electronics',
        joinedDate: '2025-10-15'
    }
];
const INITIAL_CAMPAIGNS = [
    {
        id: 'CAMP-701',
        goal: 'Win back dormant high-tier shoppers',
        status: 'Completed',
        targetSegment: 'Gold & Platinum Customers, last active > 30 days ago',
        channel: 'WhatsApp',
        discountPercentage: 15,
        pointsMultiplier: 2,
        createdDate: '2026-05-01',
        sentCount: 150,
        openCount: 138,
        clickCount: 94,
        conversionCount: 38,
        revenueGenerated: 85400
    },
    {
        id: 'CAMP-702',
        goal: 'Promote weekend apparel catalog discount',
        status: 'Completed',
        targetSegment: 'Preferred Apparel customers with low Churn Risk',
        channel: 'Email',
        discountPercentage: 10,
        pointsMultiplier: 1.5,
        createdDate: '2026-05-18',
        sentCount: 500,
        openCount: 220,
        clickCount: 110,
        conversionCount: 22,
        revenueGenerated: 44000
    }
];
const INITIAL_LOYALTY_RULES = [
    {
        id: 'RULE-01',
        name: 'Base Purchase Reward',
        trigger: 'Per Rs. 100 spent',
        pointsGiven: 5,
        isActive: true
    },
    {
        id: 'RULE-02',
        name: 'Gold Tier Signup Bonus',
        trigger: 'Upgrading to Gold tier',
        pointsGiven: 100,
        isActive: true
    },
    {
        id: 'RULE-03',
        name: 'Referral Bonus Reward',
        trigger: 'Referring a new customer',
        pointsGiven: 150,
        isActive: true
    },
    {
        id: 'RULE-04',
        name: 'Dormant Win-Back Boost',
        trigger: 'Re-activation purchase',
        pointsGiven: 50,
        isActive: false
    }
];
const INITIAL_ACTIVITY_LOGS = [
    {
        id: 'ACT-001',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        type: 'PointsEarned',
        customerName: 'Aarav Sharma',
        description: 'Earned points for shopping dining catalog',
        metricChange: '+75 Points'
    },
    {
        id: 'ACT-002',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        type: 'TierUpgrade',
        customerName: 'Rohan Verma',
        description: 'Upgraded to Platinum tier after milestone spend',
        metricChange: 'Platinum Badge'
    },
    {
        id: 'ACT-003',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'CampaignOpen',
        customerName: 'Dev Mukherjee',
        description: 'Opened Win-back Campaign message',
        metricChange: 'Read WhatsApp'
    }
];
// Runtime Mutated States
let customers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let campaigns = JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS));
let loyaltyRules = JSON.parse(JSON.stringify(INITIAL_LOYALTY_RULES));
let activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
// Database operations
exports.db = {
    // Database Reset
    resetDatabase: () => {
        customers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
        campaigns = JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS));
        loyaltyRules = JSON.parse(JSON.stringify(INITIAL_LOYALTY_RULES));
        activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
    },
    // Customers
    getCustomers: () => customers,
    getCustomerById: (id) => customers.find(c => c.id === id),
    addCustomer: (cust) => {
        const newCust = {
            ...cust,
            id: `CUST-${generateId()}`,
            joinedDate: new Date().toISOString().split('T')[0]
        };
        customers.push(newCust);
        return newCust;
    },
    updateCustomer: (id, updates) => {
        let customerIndex = customers.findIndex(c => c.id === id);
        if (customerIndex === -1)
            return null;
        // Check if points are updated, dynamically calculate tier
        const updatedPoints = updates.points !== undefined ? updates.points : customers[customerIndex].points;
        const calculatedTier = (0, exports.calculateTier)(updatedPoints);
        customers[customerIndex] = {
            ...customers[customerIndex],
            ...updates,
            points: updatedPoints,
            tier: calculatedTier
        };
        return customers[customerIndex];
    },
    deleteCustomer: (id) => {
        const initialLen = customers.length;
        customers = customers.filter(c => c.id !== id);
        return customers.length < initialLen;
    },
    // Campaigns
    getCampaigns: () => campaigns,
    getCampaignById: (id) => campaigns.find(c => c.id === id),
    createCampaign: (campaign) => {
        const newCamp = {
            ...campaign,
            id: `CAMP-${generateId()}`,
            createdDate: new Date().toISOString().split('T')[0],
            sentCount: 0,
            openCount: 0,
            clickCount: 0,
            conversionCount: 0,
            revenueGenerated: 0
        };
        campaigns.unshift(newCamp); // Newest first
        return newCamp;
    },
    updateCampaign: (id, updates) => {
        let index = campaigns.findIndex(c => c.id === id);
        if (index === -1)
            return null;
        campaigns[index] = { ...campaigns[index], ...updates };
        return campaigns[index];
    },
    // Loyalty Rules
    getLoyaltyRules: () => loyaltyRules,
    updateLoyaltyRule: (id, updates) => {
        let index = loyaltyRules.findIndex(r => r.id === id);
        if (index === -1)
            return null;
        loyaltyRules[index] = { ...loyaltyRules[index], ...updates };
        return loyaltyRules[index];
    },
    // Activity Logs
    getActivityLogs: () => activityLogs,
    logActivity: (log) => {
        const newLog = {
            ...log,
            id: `ACT-${generateId()}`,
            timestamp: new Date().toISOString()
        };
        activityLogs.unshift(newLog);
        // Limit to last 50 activities
        if (activityLogs.length > 50) {
            activityLogs.pop();
        }
        return newLog;
    },
    clearActivityLogs: () => {
        activityLogs = [];
    },
    // Aggregation/Dashboard Statistics
    getStats: () => {
        const totalCustomers = customers.length;
        const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
        const averageSpend = totalCustomers ? Math.round(customers.reduce((sum, c) => sum + c.totalSpend, 0) / totalCustomers) : 0;
        // Tier breakdowns
        const tierCounts = customers.reduce((acc, c) => {
            acc[c.tier] = (acc[c.tier] || 0) + 1;
            return acc;
        }, {});
        // Churn Risk breakdowns
        const churnCounts = customers.reduce((acc, c) => {
            acc[c.churnRisk] = (acc[c.churnRisk] || 0) + 1;
            return acc;
        }, {});
        // Active campaigns count
        const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
        // Total campaign revenue
        const campaignRevenue = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
        return {
            totalCustomers,
            totalPoints,
            averageSpend,
            tierCounts,
            churnCounts,
            activeCampaigns,
            campaignRevenue
        };
    }
};
