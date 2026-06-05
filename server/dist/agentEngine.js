"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCampaignSimulation = exports.generateAgentPlan = void 0;
const mockDatabase_1 = require("./mockDatabase");
// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();
// Parse natural language goal and extract planning details
const generateAgentPlan = (campaignGoal) => {
    const goalLower = campaignGoal.toLowerCase();
    const customers = mockDatabase_1.db.getCustomers();
    // 1. Determine Target Segment
    let targetCustomers = [];
    let targetSegmentName = '';
    if (goalLower.includes('dormant') || goalLower.includes('win back') || goalLower.includes('inactive')) {
        targetCustomers = customers.filter(c => c.lastPurchaseDaysAgo > 30 || c.churnRisk === 'High');
        targetSegmentName = 'Dormant Customers (Inactive > 30 days or Churn Risk High)';
    }
    else if (goalLower.includes('vip') || goalLower.includes('gold') || goalLower.includes('platinum')) {
        targetCustomers = customers.filter(c => c.tier === 'Gold' || c.tier === 'Platinum');
        targetSegmentName = 'VIP Loyalty Members (Gold & Platinum)';
    }
    else if (goalLower.includes('dining') || goalLower.includes('food') || goalLower.includes('eat')) {
        targetCustomers = customers.filter(c => c.predictedNextCategory === 'Dining');
        targetSegmentName = 'Food & Dining Preference Shoppers';
    }
    else if (goalLower.includes('apparel') || goalLower.includes('clothes') || goalLower.includes('fashion')) {
        targetCustomers = customers.filter(c => c.predictedNextCategory === 'Apparel');
        targetSegmentName = 'Fashion & Apparel Shoppers';
    }
    else {
        // Default to medium risk or general active audience
        targetCustomers = customers.filter(c => c.points > 100);
        targetSegmentName = 'Engaged Loyalty Members (> 100 Points)';
    }
    // 2. Optimize Channel
    // Group targeted customers by preferred channel to choose the best one
    const channelCounts = targetCustomers.reduce((acc, c) => {
        acc[c.preferredChannel] = (acc[c.preferredChannel] || 0) + 1;
        return acc;
    }, {});
    let bestChannel = 'WhatsApp';
    let maxCount = 0;
    Object.entries(channelCounts).forEach(([ch, count]) => {
        if (count > maxCount) {
            maxCount = count;
            bestChannel = ch;
        }
    });
    const channelSelectionRationale = `AI Agent selected ${bestChannel} as the primary channel because it is the preferred contact method for ${Math.round((maxCount / (targetCustomers.length || 1)) * 100)}% of the target cohort, ensuring maximum open and click-through rates.`;
    // 3. Discount and Points multiplier suggestions
    let discountPercentage = 10;
    let pointsMultiplier = 1;
    let discountRationale = '';
    if (goalLower.includes('dormant') || goalLower.includes('win back')) {
        discountPercentage = 20;
        pointsMultiplier = 2;
        discountRationale = 'Win-back campaigns for high-churn customers require a strong incentive. A 20% discount combined with a 2x loyalty points booster has historically boosted retention by 24%.';
    }
    else if (goalLower.includes('vip') || goalLower.includes('gold') || goalLower.includes('platinum')) {
        discountPercentage = 15;
        pointsMultiplier = 3; // Platinum tier benefits
        discountRationale = 'VIP members respond heavily to point accelerators. A 3x loyalty multiplier makes them feel valued, combined with a premium 15% VIP discount.';
    }
    else {
        discountPercentage = 10;
        pointsMultiplier = 1.5;
        discountRationale = 'Standard campaign discount configured at 10% alongside a 1.5x loyalty points multiplier to maintain profit margins while encouraging immediate action.';
    }
    // 4. Generate Personalized Copywriting
    let generatedTemplate = '';
    if (bestChannel === 'WhatsApp') {
        generatedTemplate = `*Hey [[name]]!* 🌟 

We noticed it's been a little while since your last visit. To welcome you back, the team has unlocked an exclusive *[[discount]]% OFF* coupon just for you! 

Use code: *XENO-WELCOMEBACK* at checkout.
Plus, you'll earn *[[multiplier]]x Loyalty Points* on your purchase!

👉 Shop now: xn.flow/shop/[[id]]
Your Points balance: [[points]] pts.`;
    }
    else if (bestChannel === 'SMS') {
        generatedTemplate = `Hey [[name]], we miss you! Get [[discount]]% OFF your next order with code XENOFIT. Plus [[multiplier]]x Points! Shop: xn.flow/s/[[id]]`;
    }
    else {
        // Email
        generatedTemplate = `Subject: [[name]], we've unlocked [[discount]]% OFF + [[multiplier]]x points! 🎁

Dear [[name]],

It's been too long since we last connected! At XenoEngage, we want to help you shop your favorite items in the [[predictedNextCategory]] catalog with a special bonus.

Here's what we've curated for you:
- 15% off coupon: XENOPREMIUM
- [[multiplier]]x Loyalty points multiplier on this order
- Your current loyalty tier is [[tier]], which qualifies for express delivery!

Click here to view your personalized offers: xn.flow/portal/[[id]]

Warm regards,
Xeno AI Engagement Agent`;
    }
    // 5. Generate Agent Planning Steps
    const timestamp = new Date().toISOString();
    const steps = [
        {
            id: 'step-1',
            name: 'Audience Segmentation & Cohort Discovery',
            status: 'Completed',
            timestamp,
            output: `Completed SQL database query on 'customers'. Identified segment '${targetSegmentName}' with ${targetCustomers.length} active customer profiles matching criteria.`
        },
        {
            id: 'step-2',
            name: 'Omnichannel Preference Evaluation',
            status: 'Completed',
            timestamp,
            output: `Analyzed customer preference distributions: WhatsApp: ${channelCounts['WhatsApp'] || 0}, SMS: ${channelCounts['SMS'] || 0}, Email: ${channelCounts['Email'] || 0}. Selected ${bestChannel} as primary campaign dispatch medium.`
        },
        {
            id: 'step-3',
            name: 'Personalized Copywriting & LLM Generation',
            status: 'Completed',
            timestamp,
            output: `Generated target layout. Injected dynamic personalization tags: [[name]], [[discount]], [[multiplier]], [[id]], and [[points]]. Validated spam compliance score: 9.8/10.`
        },
        {
            id: 'step-4',
            name: 'Loyalty Reward Rule Calibration',
            status: 'Completed',
            timestamp,
            output: `Paired campaign with loyalty points system. Scheduled point multiplier of [[multiplier]]x. Mapped transaction trigger to automatically credit reward points post-conversion.`
        },
        {
            id: 'step-5',
            name: 'Deployment Map & Launch Orchestration',
            status: 'Completed',
            timestamp,
            output: `Compiled execution package. Final payload contains: ${targetCustomers.length} recipients, dispatch time: Instant, channel: ${bestChannel}, discount: ${discountPercentage}%, pointsMultiplier: ${pointsMultiplier}x.`
        }
    ];
    return {
        id: `PLAN-${generateId()}`,
        campaignGoal,
        status: 'Ready',
        steps,
        generatedTemplate,
        channelSelectionRationale,
        discountRationale,
        targetCount: targetCustomers.length
    };
};
exports.generateAgentPlan = generateAgentPlan;
// Simulate campaign results
const runCampaignSimulation = (campaign, targetCustomers) => {
    const size = targetCustomers.length;
    if (size === 0) {
        return { sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0, activityLogs: [] };
    }
    // Adjust probabilities based on preferred channel vs campaign channel
    const sent = size;
    let opened = 0;
    let clicked = 0;
    let converted = 0;
    let revenue = 0;
    const logs = [];
    targetCustomers.forEach(customer => {
        // base rates
        let openProb = 0.5;
        let clickProb = 0.4;
        let convertProb = 0.3;
        // channel matching boosts open rate
        if (customer.preferredChannel === campaign.channel) {
            openProb += 0.25;
            clickProb += 0.15;
        }
        // High churn risk reduces response, VIP tier increases it
        if (customer.churnRisk === 'High') {
            openProb -= 0.15;
            convertProb -= 0.1;
        }
        else if (customer.tier === 'Platinum' || customer.tier === 'Gold') {
            openProb += 0.15;
            convertProb += 0.15;
        }
        // Roll dice
        const isOpened = Math.random() < openProb;
        if (isOpened) {
            opened++;
            logs.push({
                type: 'CampaignOpen',
                customerName: customer.name,
                description: `Opened ${campaign.channel} promotion message for campaign "${campaign.goal}"`,
                metricChange: `Read ${campaign.channel}`
            });
            const isClicked = Math.random() < clickProb;
            if (isClicked) {
                clicked++;
                logs.push({
                    type: 'CampaignClick',
                    customerName: customer.name,
                    description: `Clicked discount link in campaign: "${campaign.goal}"`,
                    metricChange: 'Link Clicked'
                });
                const isConverted = Math.random() < convertProb;
                if (isConverted) {
                    converted++;
                    // Purchase calculations
                    const baseTicket = customer.totalSpend / (customer.purchaseCount || 1);
                    // discount applied
                    const orderValue = Math.round(baseTicket * (1 - campaign.discountPercentage / 100) * (0.9 + Math.random() * 0.2));
                    revenue += orderValue;
                    // Points earned: Rs. 100 spent -> 5 points * multiplier
                    const pointsEarned = Math.round((orderValue / 100) * 5 * campaign.pointsMultiplier);
                    logs.push({
                        type: 'Purchase',
                        customerName: customer.name,
                        description: `Converted! Placed order worth Rs. ${orderValue} using code XENO`,
                        metricChange: `+Rs. ${orderValue}`
                    });
                    logs.push({
                        type: 'PointsEarned',
                        customerName: customer.name,
                        description: `Earned loyalty points for conversion in campaign "${campaign.goal}"`,
                        metricChange: `+${pointsEarned} Points`
                    });
                }
            }
        }
    });
    return {
        sent,
        opened,
        clicked,
        converted,
        revenue,
        activityLogs: logs
    };
};
exports.runCampaignSimulation = runCampaignSimulation;
