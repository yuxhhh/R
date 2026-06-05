import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  Radio, 
  Sparkles,
  Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AgentConsole from './components/AgentConsole';
import CustomerDirectory from './components/CustomerDirectory';
import CampaignMonitor from './components/CampaignMonitor';
import { Customer, Campaign, LoyaltyRule, ActivityLog, DashboardStats } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agent' | 'customers' | 'campaigns'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [rules, setRules] = useState<LoyaltyRule[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersRes, campaignsRes, rulesRes, logsRes, statsRes] = await Promise.all([
        fetch('/api/customers').then(res => res.json()),
        fetch('/api/campaigns').then(res => res.json()),
        fetch('/api/loyalty').then(res => res.json()),
        fetch('/api/logs').then(res => res.json()),
        fetch('/api/stats').then(res => res.json())
      ]);

      setCustomers(customersRes);
      setCampaigns(campaignsRes);
      setRules(rulesRes);
      setLogs(logsRes);
      setStats(statsRes);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set up polling for logs and stats every 3 seconds to show live simulation updates!
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [logsRes, statsRes, customersRes, campaignsRes] = await Promise.all([
          fetch('/api/logs').then(res => res.json()),
          fetch('/api/stats').then(res => res.json()),
          fetch('/api/customers').then(res => res.json()),
          fetch('/api/campaigns').then(res => res.json())
        ]);
        setLogs(logsRes);
        setStats(statsRes);
        setCustomers(customersRes);
        setCampaigns(campaignsRes);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRuleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/loyalty/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const updatedRule = await res.json();
      setRules(prev => prev.map(r => r.id === id ? updatedRule : r));
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo-glow">
            <Zap size={16} color="#4f46e5" fill="#4f46e5" />
          </div>
          <span className="brand-name">XenoEngage</span>
        </div>

        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent')}
          >
            <Bot size={18} />
            <span>AI Agent Planner</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} />
            <span>Customers & Tiers</span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <Radio size={18} />
            <span>Campaigns & Live</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div>XenoEngage Platform</div>
          <div style={{ fontSize: '9px', marginTop: '4px', opacity: 0.5 }}>v1.0.0</div>
        </div>
      </aside>

      {/* Main content pane */}
      <main className="main-content">
        {loading && customers.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '12px' }}>
            <Sparkles size={24} className="terminal-typing" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-muted)' }}>Loading AI Engine Core...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && stats && (
              <Dashboard 
                stats={stats} 
                rules={rules} 
                onToggleRule={handleRuleToggle} 
                logs={logs}
              />
            )}

            {activeTab === 'agent' && (
              <AgentConsole 
                onCampaignCreated={fetchData}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerDirectory 
                customers={customers} 
                onCustomerUpdated={fetchData}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignMonitor 
                campaigns={campaigns} 
                logs={logs}
                onCampaignExecuted={fetchData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
