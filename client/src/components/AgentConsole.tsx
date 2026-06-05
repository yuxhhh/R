import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Terminal as TermIcon, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare,
  Users
} from 'lucide-react';
import { AgentPlan, AgentStep } from '../types';

interface AgentConsoleProps {
  onCampaignCreated: () => void;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({ onCampaignCreated }) => {
  const [goalPrompt, setGoalPrompt] = useState<string>('');
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [activePlan, setActivePlan] = useState<AgentPlan | null>(null);
  const [revealSteps, setRevealSteps] = useState<AgentStep[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const samplePrompts = [
    "Win back dormant users with high churn risk with 20% discount on clothing",
    "Double points booster campaign for VIP members (Gold & Platinum)",
    "Increase conversions for dining segment using WhatsApp promo"
  ];

  // Simulated planning loop when agent starts
  useEffect(() => {
    if (!isPlanning || !activePlan) return;

    if (currentStepIndex < activePlan.steps.length) {
      const timer = setTimeout(() => {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        
        if (nextIndex < activePlan.steps.length) {
          // Add next step to reveal array, setting it as "Running"
          setRevealSteps(prev => {
            const copy = [...prev];
            // Set previous step as Completed
            if (copy.length > 0) {
              copy[copy.length - 1].status = 'Completed';
            }
            // Add new step as Running
            const nextStep = activePlan.steps[nextIndex];
            copy.push({
              ...nextStep,
              status: 'Running'
            });
            return copy;
          });
        } else {
          // Staging complete
          setRevealSteps(prev => {
            if (prev.length > 0) {
              prev[prev.length - 1].status = 'Completed';
            }
            return [...prev];
          });
          setIsPlanning(false);
        }
      }, 1500); // 1.5s per step planning delay
      return () => clearTimeout(timer);
    }
  }, [isPlanning, currentStepIndex, activePlan]);

  const handleFormulatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalPrompt.trim()) return;

    try {
      setActivePlan(null);
      setRevealSteps([]);
      setCurrentStepIndex(-1);
      setIsPlanning(true);
      setSuccessMsg('');

      const res = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalPrompt })
      });
      const data: AgentPlan = await res.json();
      setActivePlan(data);
      setCurrentStepIndex(0);
      
      // Inject the first step as running
      setRevealSteps([{
        ...data.steps[0],
        status: 'Running'
      }]);
    } catch (error) {
      console.error('Error getting agent plan:', error);
      setIsPlanning(false);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!activePlan) return;

    try {
      // Determine values for discount & multiplier based on goal parsing
      const goalLower = activePlan.campaignGoal.toLowerCase();
      let discountPercentage = 10;
      let pointsMultiplier = 1;

      if (goalLower.includes('dormant') || goalLower.includes('win back')) {
        discountPercentage = 20;
        pointsMultiplier = 2;
      } else if (goalLower.includes('vip') || goalLower.includes('gold') || goalLower.includes('platinum')) {
        discountPercentage = 15;
        pointsMultiplier = 3;
      }

      // Determine channel
      const isSMS = activePlan.channelSelectionRationale.includes('SMS');
      const isEmail = activePlan.channelSelectionRationale.includes('Email');
      const channel = isSMS ? 'SMS' : isEmail ? 'Email' : 'WhatsApp';

      // Determine segment name
      let segment = 'Engaged Loyalty Members';
      if (goalLower.includes('dormant') || goalLower.includes('win back')) {
        segment = 'Dormant Customers';
      } else if (goalLower.includes('vip') || goalLower.includes('gold') || goalLower.includes('platinum')) {
        segment = 'VIP Loyalty Members';
      } else if (goalLower.includes('dining') || goalLower.includes('food')) {
        segment = 'Dining Preference Segment';
      }

      const campaignRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: activePlan.campaignGoal,
          targetSegment: segment,
          channel,
          discountPercentage,
          pointsMultiplier,
          agentPlan: activePlan
        })
      });

      if (campaignRes.ok) {
        setSuccessMsg('✨ Campaign successfully scheduled & routed to live dispatch monitor!');
        onCampaignCreated();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="agent-view">
      <header className="view-header">
        <h1 className="view-title">Autonomous AI Planner</h1>
        <p className="view-subtitle">Give the AI Agent an objective. It will query cohorts, optimize channels, and structure copy templates.</p>
      </header>

      <div className="agent-grid">
        {/* Left Input Pane */}
        <div className="agent-input-panel">
          <form className="glass-card" onSubmit={handleFormulatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} color="var(--accent-purple)" />
              <span>Prompt AI Agent</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Define Campaign Objective</label>
              <textarea 
                className="agent-prompt-box"
                placeholder="Example: Send a win-back campaign to dormant users on their preferred channel with double points booster..."
                value={goalPrompt}
                onChange={(e) => setGoalPrompt(e.target.value)}
                disabled={isPlanning}
              />
            </div>

            <button 
              type="submit" 
              className="glow-btn"
              disabled={isPlanning || !goalPrompt.trim()}
            >
              <Sparkles size={16} />
              <span>{isPlanning ? 'AI Agent Planning...' : 'Formulate Strategy'}</span>
            </button>
          </form>

          {/* Prompt Shortcuts */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card-title" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} color="var(--accent-cyan)" />
              <span>Suggested Objectives</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {samplePrompts.map((p, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    fontSize: '12px', 
                    padding: '10px 12px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    cursor: isPlanning ? 'not-allowed' : 'pointer',
                    color: 'var(--text-muted)',
                    transition: 'var(--transition-fast)'
                  }}
                  onClick={() => !isPlanning && setGoalPrompt(p)}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Planning Terminal */}
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <TermIcon size={12} />
              <span>xeno-agent-planner-daemon</span>
            </div>
          </div>

          <div className="terminal-body">
            {revealSteps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`terminal-step ${step.status === 'Running' ? 'running' : step.status === 'Completed' ? 'completed' : ''}`}
              >
                <div className="step-header-row">
                  <span className="step-name" style={{ color: step.status === 'Running' ? 'var(--accent-cyan)' : step.status === 'Completed' ? '#ffffff' : 'var(--text-dark)' }}>
                    [{idx + 1}] {step.name}
                  </span>
                  <span className={`step-status ${step.status.toLowerCase()}`}>
                    {step.status}
                  </span>
                </div>
                <div className="step-output">{step.output}</div>
              </div>
            ))}

            {isPlanning && (
              <div className="terminal-typing">
                <span>⚡ AI Agent is evaluating optimization loops...</span>
              </div>
            )}

            {!isPlanning && activePlan && currentStepIndex >= activePlan.steps.length && (
              <div className="agent-results-card">
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '16px' }}>
                  <div className="card-title" style={{ color: 'var(--accent-cyan)', fontSize: '12px' }}>AI Orchestration Strategy Formulated</div>
                  
                  <div className="results-grid">
                    <div className="results-meta-item">
                      <div className="results-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> Target Audience
                      </div>
                      <div className="results-value">{activePlan.targetCount} matching profiles</div>
                    </div>

                    <div className="results-meta-item">
                      <div className="results-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={12} /> Dispatch Channel
                      </div>
                      <div className="results-value">{activePlan.channelSelectionRationale.includes('WhatsApp') ? 'WhatsApp' : activePlan.channelSelectionRationale.includes('SMS') ? 'SMS' : 'Email'}</div>
                    </div>

                    <div className="results-meta-item" style={{ gridColumn: 'span 2' }}>
                      <div className="results-label">Channel Selection Optimization</div>
                      <div className="results-value" style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{activePlan.channelSelectionRationale}</div>
                    </div>

                    <div className="results-meta-item" style={{ gridColumn: 'span 2' }}>
                      <div className="results-label">Loyalty Reward Strategy</div>
                      <div className="results-value" style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{activePlan.discountRationale}</div>
                    </div>

                    <div className="template-box">
                      <div style={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.5 }}>Generated Personalization Template:</div>
                      {activePlan.generatedTemplate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                    <button 
                      className="glow-btn" 
                      style={{ background: 'linear-gradient(135deg, var(--status-success), #059669)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}
                      onClick={handleLaunchCampaign}
                      disabled={!!successMsg}
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve & Stage Campaign</span>
                    </button>
                    {successMsg && (
                      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--status-success)', padding: '10px', border: '1px solid var(--status-success-glow)', borderRadius: '8px', background: 'var(--status-success-glow)' }}>
                        {successMsg}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {revealSteps.length === 0 && !isPlanning && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-dark)' }}>
                <Bot size={48} style={{ opacity: 0.2 }} />
                <span>Planner is idle. Input campaign criteria to generate details.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
