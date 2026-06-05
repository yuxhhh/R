import React from 'react';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { DashboardStats, LoyaltyRule, ActivityLog } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  rules: LoyaltyRule[];
  onToggleRule: (id: string, currentStatus: boolean) => void;
  logs: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, rules, onToggleRule, logs }) => {
  // Find max count to scale custom charts
  const tierValues = [
    stats.tierCounts.Bronze || 0,
    stats.tierCounts.Silver || 0,
    stats.tierCounts.Gold || 0,
    stats.tierCounts.Platinum || 0
  ];
  const maxTierVal = Math.max(...tierValues, 1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="dashboard-view">
      <header className="view-header">
        <h1 className="view-title">Executive Dashboard</h1>
        <p className="view-subtitle">Real-time AI customer insights, loyalty distributions, and campaign metrics.</p>
      </header>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Total Customers</div>
              <div className="card-value">{stats.totalCustomers}</div>
            </div>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-cyan)', padding: '10px', borderRadius: '10px' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="card-trend">
            <span className="trend-up">↑ 12%</span>
            <span style={{ color: 'var(--text-dark)' }}>vs last month</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Total Loyalty Points</div>
              <div className="card-value">{stats.totalPoints.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(124, 77, 255, 0.1)', color: 'var(--accent-purple)', padding: '10px', borderRadius: '10px' }}>
              <Coins size={20} />
            </div>
          </div>
          <div className="card-trend">
            <span style={{ color: 'var(--accent-cyan)' }}>Avg {(stats.totalPoints / (stats.totalCustomers || 1)).toFixed(0)} pts / user</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Average Customer LTV</div>
              <div className="card-value">{formatCurrency(stats.averageSpend)}</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', padding: '10px', borderRadius: '10px' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="card-trend">
            <span className="trend-up">↑ 8.4%</span>
            <span style={{ color: 'var(--text-dark)' }}>net increase</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Campaign Revenue</div>
              <div className="card-value">{formatCurrency(stats.campaignRevenue)}</div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-warning)', padding: '10px', borderRadius: '10px' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="card-trend">
            <span style={{ color: 'var(--text-muted)' }}>{stats.activeCampaigns} active campaigns</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Manager Dashboard Section */}
      <div className="dashboard-layout">
        {/* Tier Distribution Chart */}
        <div className="glass-card chart-card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="var(--accent-cyan)" />
            <span>Loyalty Tier Distribution</span>
          </div>
          
          <div className="bar-chart-container">
            <div className="bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${((stats.tierCounts.Bronze || 0) / maxTierVal) * 150}px`,
                  background: 'linear-gradient(to top, rgba(205, 127, 50, 0.4), var(--tier-bronze))' 
                }} 
              />
              <span className="bar-label">Bronze ({stats.tierCounts.Bronze || 0})</span>
            </div>

            <div className="bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${((stats.tierCounts.Silver || 0) / maxTierVal) * 150}px`,
                  background: 'linear-gradient(to top, rgba(192, 192, 192, 0.4), var(--tier-silver))' 
                }} 
              />
              <span className="bar-label">Silver ({stats.tierCounts.Silver || 0})</span>
            </div>

            <div className="bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${((stats.tierCounts.Gold || 0) / maxTierVal) * 150}px`,
                  background: 'linear-gradient(to top, rgba(255, 217, 0, 0.4), var(--tier-gold))' 
                }} 
              />
              <span className="bar-label">Gold ({stats.tierCounts.Gold || 0})</span>
            </div>

            <div className="bar-wrapper">
              <div 
                className="chart-bar" 
                style={{ 
                  height: `${((stats.tierCounts.Platinum || 0) / maxTierVal) * 150}px`,
                  background: 'linear-gradient(to top, rgba(229, 228, 226, 0.4), var(--tier-platinum))' 
                }} 
              />
              <span className="bar-label">Platinum ({stats.tierCounts.Platinum || 0})</span>
            </div>
          </div>
        </div>

        {/* Loyalty Rules Configuration */}
        <div className="glass-card rules-card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={16} color="var(--accent-purple)" />
              <span>Loyalty Rules Engine</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
            {rules.map((rule) => (
              <div className="rule-row" key={rule.id}>
                <div className="rule-info">
                  <span className="rule-name">{rule.name}</span>
                  <span className="rule-trigger">{rule.trigger}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    +{rule.pointsGiven} pts
                  </span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={rule.isActive} 
                      onChange={() => onToggleRule(rule.id, rule.isActive)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Churn Risk and Live Activity Split */}
      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
        {/* Churn Risk Gauge */}
        <div className="glass-card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="var(--status-danger)" />
            <span>AI Churn Risk Breakdown</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Low Risk (Stable)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>
                  {stats.churnCounts.Low || 0} ({Math.round(((stats.churnCounts.Low || 0) / stats.totalCustomers) * 100)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${((stats.churnCounts.Low || 0) / stats.totalCustomers) * 100}%`, 
                    height: '100%', 
                    background: 'var(--status-success)', 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px var(--status-success-glow)'
                  }} 
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Medium Risk (At-Risk)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-warning)' }}>
                  {stats.churnCounts.Medium || 0} ({Math.round(((stats.churnCounts.Medium || 0) / stats.totalCustomers) * 100)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${((stats.churnCounts.Medium || 0) / stats.totalCustomers) * 100}%`, 
                    height: '100%', 
                    background: 'var(--status-warning)', 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px var(--status-warning-glow)'
                  }} 
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>High Risk (Dormant)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-danger)' }}>
                  {stats.churnCounts.High || 0} ({Math.round(((stats.churnCounts.High || 0) / stats.totalCustomers) * 100)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div 
                  style={{ 
                    width: `${((stats.churnCounts.High || 0) / stats.totalCustomers) * 100}%`, 
                    height: '100%', 
                    background: 'var(--status-danger)', 
                    borderRadius: '4px',
                    boxShadow: '0 0 8px var(--status-danger-glow)'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Logs Preview */}
        <div className="glass-card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--accent-cyan)" />
            <span>Live Outbox Activity Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', maxHeight: '180px', overflowY: 'hidden' }}>
            {logs.slice(0, 3).map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{log.customerName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{log.description}</div>
                </div>
                {log.metricChange && (
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 600,
                    color: log.type === 'Purchase' ? 'var(--status-success)' : log.type === 'PointsEarned' ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                  }}>
                    {log.metricChange}
                  </span>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ color: 'var(--text-dark)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No campaigns dispatched yet. Go to the AI Agent Planner to deploy a new campaign.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
