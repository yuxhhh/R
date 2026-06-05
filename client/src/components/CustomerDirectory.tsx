import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Coins, 
  MessageSquare
} from 'lucide-react';
import { Customer, ChurnRisk } from '../types';

interface CustomerDirectoryProps {
  customers: Customer[];
  onCustomerUpdated: () => void;
}

const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({ customers, onCustomerUpdated }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [pointsChange, setPointsChange] = useState<string>('');
  const [selectedRiskOption, setSelectedRiskOption] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filters
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
    const matchesRisk = selectedRisk === 'All' || c.churnRisk === selectedRisk;
    return matchesSearch && matchesTier && matchesRisk;
  });

  const handleOpenInspector = (cust: Customer) => {
    setActiveCustomer(cust);
    setSelectedRiskOption(cust.churnRisk);
    setPointsChange('');
  };

  const handleUpdateCustomer = async () => {
    if (!activeCustomer) return;

    try {
      setIsUpdating(true);
      const updates: Partial<Customer> = {
        churnRisk: selectedRiskOption as ChurnRisk
      };

      if (pointsChange.trim()) {
        const addedPoints = parseInt(pointsChange);
        if (!isNaN(addedPoints)) {
          updates.points = Math.max(0, activeCustomer.points + addedPoints);
        }
      }

      const res = await fetch(`/api/customers/${activeCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        const updatedCust = await res.json();
        setActiveCustomer(updatedCust);
        setPointsChange('');
        onCustomerUpdated();
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="customers-view">
      <header className="view-header">
        <h1 className="view-title">Customer Loyalty CRM</h1>
        <p className="view-subtitle">Monitor profiles, adjust points, and review AI-predicted customer lifecycles.</p>
      </header>

      {/* Filter Toolbar */}
      <div className="search-bar-row">
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search size={18} color="var(--text-dark)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by name, email, or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>

        {/* Tier Filter */}
        <select 
          className="search-input" 
          style={{ flexGrow: 0, width: '160px' }}
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
        >
          <option value="All">All Tiers</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>

        {/* Churn Risk Filter */}
        <select 
          className="search-input" 
          style={{ flexGrow: 0, width: '160px' }}
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
        >
          <option value="All">All Risks</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="customer-table-container glass-card" style={{ padding: 0 }}>
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Loyalty Tier</th>
              <th>Points</th>
              <th>Preferred Channel</th>
              <th>Spend (LTV)</th>
              <th>AI Churn Risk</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr 
                key={cust.id} 
                className="customer-row"
                onClick={() => handleOpenInspector(cust)}
              >
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dark)' }}>{cust.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{cust.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{cust.email}</div>
                </td>
                <td>
                  <span className={`badge badge-${cust.tier.toLowerCase()}`}>{cust.tier}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{cust.points.toLocaleString()}</td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <MessageSquare size={13} color="var(--accent-cyan)" />
                    {cust.preferredChannel}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{formatCurrency(cust.totalSpend)}</td>
                <td>
                  <span className={`badge risk-${cust.churnRisk.toLowerCase()}`}>{cust.churnRisk}</span>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dark)' }}>
                  No customer records matched your current query criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Inspector Drawer/Modal */}
      {activeCustomer && (
        <div className="modal-overlay" onClick={() => setActiveCustomer(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveCustomer(null)}>
              <X size={20} />
            </button>

            <div className="cust-detail-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className={`badge badge-${activeCustomer.tier.toLowerCase()}`}>{activeCustomer.tier} Tier</span>
                <span className={`badge risk-${activeCustomer.churnRisk.toLowerCase()}`}>{activeCustomer.churnRisk} Churn Risk</span>
              </div>
              <h2 className="cust-detail-title">{activeCustomer.name}</h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-dark)' }}>ID: {activeCustomer.id}</p>
            </div>

            <div className="cust-detail-grid">
              <div className="cust-detail-item">
                <div className="cust-detail-label">Email Address</div>
                <div className="cust-detail-value" style={{ fontSize: '13px' }}>{activeCustomer.email}</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Phone Number</div>
                <div className="cust-detail-value" style={{ fontSize: '13px' }}>{activeCustomer.phone}</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Loyalty Points</div>
                <div className="cust-detail-value" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {activeCustomer.points.toLocaleString()} pts
                </div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Total Spend (LTV)</div>
                <div className="cust-detail-value" style={{ fontWeight: 600 }}>{formatCurrency(activeCustomer.totalSpend)}</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Purchase Count</div>
                <div className="cust-detail-value">{activeCustomer.purchaseCount} orders</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Last Active</div>
                <div className="cust-detail-value">{activeCustomer.lastPurchaseDaysAgo} days ago</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Preferred Medium</div>
                <div className="cust-detail-value">{activeCustomer.preferredChannel}</div>
              </div>
              <div className="cust-detail-item">
                <div className="cust-detail-label">Predicted Interest</div>
                <div className="cust-detail-value" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
                  {activeCustomer.predictedNextCategory}
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="points-editor">
              <div className="card-title" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coins size={14} color="var(--accent-purple)" />
                <span>Adjust Customer Metadata</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="points-input-row">
                  <input 
                    type="number" 
                    className="points-input"
                    placeholder="Enter points offset (e.g. 150 or -50)"
                    value={pointsChange}
                    onChange={(e) => setPointsChange(e.target.value)}
                  />
                  
                  <select
                    className="points-input"
                    style={{ flexGrow: 0, width: '150px' }}
                    value={selectedRiskOption}
                    onChange={(e) => setSelectedRiskOption(e.target.value)}
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>

                <button 
                  className="points-btn"
                  onClick={handleUpdateCustomer}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving Adjustments...' : 'Apply Adjustments'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDirectory;
