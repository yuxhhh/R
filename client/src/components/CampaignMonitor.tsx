import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  Eye, 
  MousePointerClick, 
  ShoppingBag, 
  Activity, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { Campaign, ActivityLog } from '../types';

interface CampaignMonitorProps {
  campaigns: Campaign[];
  logs: ActivityLog[];
  onCampaignExecuted: () => void;
}

const CampaignMonitor: React.FC<CampaignMonitorProps> = ({ campaigns, logs, onCampaignExecuted }) => {
  const [executingCampId, setExecutingCampId] = useState<string | null>(null);

  const handleExecuteCampaign = async (id: string) => {
    try {
      setExecutingCampId(id);
      const res = await fetch(`/api/campaigns/${id}/execute`, {
        method: 'POST'
      });

      if (res.ok) {
        onCampaignExecuted();
      }
    } catch (error) {
      console.error('Error executing campaign simulation:', error);
    } finally {
      setExecutingCampId(null);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
      onCampaignExecuted();
    } catch (error) {
      console.error('Error clearing activity logs:', error);
    }
  };

  const calculateRate = (subset: number, total: number) => {
    if (!total) return '0%';
    return `${Math.round((subset / total) * 100)}%`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="campaigns-view">
      <header className="view-header">
        <h1 className="view-title">Campaign Center & Simulation</h1>
        <p className="view-subtitle">Execute pending campaigns to simulate real-time customer behaviors, conversions, and points upgrades.</p>
      </header>

      <div className="logs-layout">
        {/* Left: Campaigns List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="var(--accent-purple)" />
              <span>Orchestrated Campaigns</span>
            </div>

            <div className="campaign-card-grid" style={{ marginTop: '16px' }}>
              {campaigns.map((camp) => (
                <div className="campaign-row-item" key={camp.id}>
                  <div className="camp-main-info">
                    <div className="camp-goal">{camp.goal}</div>
                    <div className="camp-subinfo">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dark)' }}>{camp.id}</span>
                      <span className={`badge ${camp.status === 'Completed' ? 'risk-low' : 'risk-medium'}`}>{camp.status}</span>
                      <span>Target: {camp.targetSegment}</span>
                    </div>
                  </div>

                  {camp.status === 'Completed' ? (
                    <div className="camp-metrics">
                      <div className="camp-metric-item">
                        <span className="camp-metric-val">{camp.sentCount}</span>
                        <span className="camp-metric-lbl">Sent</span>
                      </div>
                      <div className="camp-metric-item">
                        <span className="camp-metric-val">{calculateRate(camp.openCount, camp.sentCount)}</span>
                        <span className="camp-metric-lbl">Opened</span>
                      </div>
                      <div className="camp-metric-item">
                        <span className="camp-metric-val">{calculateRate(camp.clickCount, camp.openCount)}</span>
                        <span className="camp-metric-lbl">Clicked</span>
                      </div>
                      <div className="camp-metric-item">
                        <span className="camp-metric-val">{calculateRate(camp.conversionCount, camp.clickCount)}</span>
                        <span className="camp-metric-lbl">Converted</span>
                      </div>
                      <div className="camp-metric-item">
                        <span className="camp-metric-val" style={{ color: 'var(--status-success)' }}>
                          {formatCurrency(camp.revenueGenerated)}
                        </span>
                        <span className="camp-metric-lbl">Revenue</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button 
                        className="glow-btn"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                        disabled={executingCampId !== null}
                        onClick={() => handleExecuteCampaign(camp.id)}
                      >
                        {executingCampId === camp.id ? (
                          <>
                            <Sparkles size={14} className="terminal-typing" />
                            <span>Simulating...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Execute Simulation</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {campaigns.length === 0 && (
                <div style={{ color: 'var(--text-dark)', padding: '24px', textAlign: 'center', fontSize: '13px' }}>
                  No campaigns registered. Go to the AI Agent Planner to formulate a new strategy.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live activity logs feed */}
        <div className="glass-card logs-card">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="var(--accent-cyan)" />
              <span>Real-Time Logs Ticker</span>
            </div>
            
            {logs.length > 0 && (
              <button 
                onClick={handleClearLogs}
                style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                title="Clear Logs"
              >
                <Trash2 size={14} hover-color="#fff" />
              </button>
            )}
          </div>

          <div className="logs-feed-container" style={{ marginTop: '16px' }}>
            {logs.map((log) => (
              <div className={`log-item log-${log.type}`} key={log.id}>
                <div className="log-icon-wrap">
                  {log.type === 'Purchase' && <ShoppingBag size={14} />}
                  {log.type === 'PointsEarned' && <Sparkles size={14} />}
                  {log.type === 'CampaignOpen' && <Eye size={14} />}
                  {log.type === 'CampaignClick' && <MousePointerClick size={14} />}
                  {(log.type === 'TierUpgrade' || log.type === 'RewardRedemption') && <Sparkles size={14} />}
                </div>

                <div className="log-info">
                  <div className="log-desc">
                    <strong style={{ color: '#ffffff' }}>{log.customerName}</strong> {log.description.replace(log.customerName, '').trim()}
                  </div>
                  <div className="log-meta">
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{log.id}</span>
                  </div>
                </div>

                {log.metricChange && (
                  <div className="log-change">{log.metricChange}</div>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px', color: 'var(--text-dark)', fontSize: '13px' }}>
                <Activity size={32} style={{ opacity: 0.1 }} />
                <span>Logs stream is currently empty.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignMonitor;
