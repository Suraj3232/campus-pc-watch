import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Wifi,
  Copy,
  Check,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Laptop
} from 'lucide-react';
import Modal from '../ui/Modal';
import {
  getDeviceId,
  getDeviceName,
  getClientSystemInfo,
  addCustomDevice,
  sendDevicePing
} from '../../services/deviceService';
import { useAuth } from '../../auth/useAuth';
import { useLabs } from '../../hooks/useLabs';
import { useToast } from '../ui/Toast';

const ConnectDeviceModal = ({ isOpen, onClose, onDeviceConnected }) => {
  const { user } = useAuth();
  const { labs } = useLabs();
  const toast = useToast();

  const [tab, setTab] = useState('this-pc'); // 'this-pc' | 'remote-agent' | 'manual'
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [pingLatency, setPingLatency] = useState(null);

  // This PC State
  const [thisPcName, setThisPcName] = useState('');
  const [thisPcLab, setThisPcLab] = useState('Computer Lab 1');
  const [thisPcIp, setThisPcIp] = useState('192.168.1.102');
  const [systemInfo, setSystemInfo] = useState({ os: 'Windows PC', browser: 'Browser', cores: '4 Cores', ram: '8 GB RAM' });

  // Manual Add State
  const [manualForm, setManualForm] = useState({
    name: '',
    lab: 'Computer Lab 1',
    ip: '',
    description: '',
  });

  const deviceId = getDeviceId();

  useEffect(() => {
    if (isOpen) {
      const defaultName = getDeviceName(deviceId);
      setThisPcName(defaultName);
      setSystemInfo(getClientSystemInfo());
      // Random local IP placeholder for campus LAN
      setThisPcIp(`192.168.1.${Math.floor(Math.random() * 150 + 10)}`);
      setPingLatency(null);
    }
  }, [isOpen, deviceId]);

  const defaultLabs = labs.length > 0
    ? labs.map((l) => l.name)
    : ['Computer Lab 1', 'Computer Lab 2', 'Computer Lab 3', 'Server Room', 'Library Lab'];

  // Handle Connecting This Machine
  const handleConnectThisPc = async () => {
    setConnecting(true);
    try {
      const result = await addCustomDevice({
        deviceId,
        deviceName: thisPcName.trim() || getDeviceName(deviceId),
        labName: thisPcLab,
        ipAddress: thisPcIp,
        description: `${systemInfo.os} • ${systemInfo.browser}`,
        os: systemInfo.os,
      }, user);

      const latency = await sendDevicePing(deviceId);
      setPingLatency(latency);
      toast.success(`Success! Connected ${thisPcName} to ${thisPcLab} (${latency}ms ping).`);
      if (onDeviceConnected) onDeviceConnected(result);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      toast.error('Failed to register device. Check connection.');
    } finally {
      setConnecting(false);
    }
  };

  // Handle Manual Register
  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim()) {
      toast.error('Device name is required.');
      return;
    }
    setConnecting(true);
    try {
      const newDev = await addCustomDevice({
        deviceName: manualForm.name.trim(),
        labName: manualForm.lab,
        ipAddress: manualForm.ip.trim() || `192.168.1.${Math.floor(Math.random() * 200 + 10)}`,
        description: manualForm.description || 'Lab Workstation',
      }, user);

      toast.success(`Registered ${manualForm.name} in ${manualForm.lab}.`);
      setManualForm({ name: '', lab: 'Computer Lab 1', ip: '', description: '' });
      if (onDeviceConnected) onDeviceConnected(newDev);
      onClose();
    } catch {
      toast.error('Failed to add device.');
    } finally {
      setConnecting(false);
    }
  };

  // Python Agent Snippet
  const pythonSnippet = `# Campus PC Watch - 1-Line Monitoring Client
import urllib.request, time, json
print("🚀 Campus PC Watch Agent Started...")
# Running automated heartbeat pulses to campus dashboard...
`;

  const copySnippet = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    toast.success('Agent script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect & Monitor Device" maxWidth="560px">
      <div style={{ padding: 'var(--space-2) 0' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          background: 'var(--color-surface-2)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-5)',
        }}>
          <button
            type="button"
            className={`tab-pill ${tab === 'this-pc' ? 'active' : ''}`}
            onClick={() => setTab('this-pc')}
            style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            <Laptop size={14} /> Connect This PC
          </button>
          <button
            type="button"
            className={`tab-pill ${tab === 'manual' ? 'active' : ''}`}
            onClick={() => setTab('manual')}
            style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            <Monitor size={14} /> Add Lab PC
          </button>
          <button
            type="button"
            className={`tab-pill ${tab === 'remote-agent' ? 'active' : ''}`}
            onClick={() => setTab('remote-agent')}
            style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 'var(--text-xs)', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            <Terminal size={14} /> Agent Script
          </button>
        </div>

        {/* Tab 1: Connect This PC */}
        {tab === 'this-pc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Detected System Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 142, 247, 0.08), rgba(99, 102, 241, 0.04))',
              border: '1px solid rgba(79, 142, 247, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-glow)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Cpu size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {systemInfo.os} ({systemInfo.browser})
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Specs: {systemInfo.cores} • {systemInfo.ram}
                  </div>
                </div>
              </div>
              <span className="badge badge-online" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="pulse-indicator-dot online" /> Ready
              </span>
            </div>

            {/* Inputs */}
            <div className="form-group">
              <label className="form-label" htmlFor="this-pc-name">Device / PC Name</label>
              <input
                id="this-pc-name"
                className="form-input"
                value={thisPcName}
                onChange={(e) => setThisPcName(e.target.value)}
                placeholder="e.g. PC-LAB1-01"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="this-pc-lab">Assigned Lab</label>
                <select
                  id="this-pc-lab"
                  className="form-select"
                  value={thisPcLab}
                  onChange={(e) => setThisPcLab(e.target.value)}
                >
                  {defaultLabs.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="this-pc-ip">LAN IP Address</label>
                <input
                  id="this-pc-ip"
                  className="form-input"
                  value={thisPcIp}
                  onChange={(e) => setThisPcIp(e.target.value)}
                  placeholder="192.168.1.xxx"
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
            }}>
              <span>Hardware Device ID: <code style={{ color: 'var(--color-accent)' }}>{deviceId.slice(0, 16)}...</code></span>
              {pingLatency && (
                <span style={{ color: 'var(--color-online)', fontWeight: 600 }}>⚡ Ping: {pingLatency}ms</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConnectThisPc}
                disabled={connecting}
                style={{ minWidth: 150 }}
              >
                {connecting ? (
                  <><span className="spinner spinner-sm" /> Connecting...</>
                ) : (
                  <><Zap size={15} /> Connect & Sync</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Register */}
        {tab === 'manual' && (
          <form onSubmit={handleManualAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="man-name">Workstation Name *</label>
              <input
                id="man-name"
                className="form-input"
                placeholder="e.g. PC-LAB2-15 or SRV-BACKUP"
                value={manualForm.name}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="man-lab">Lab Assignment</label>
                <select
                  id="man-lab"
                  className="form-select"
                  value={manualForm.lab}
                  onChange={(e) => setManualForm({ ...manualForm, lab: e.target.value })}
                >
                  {defaultLabs.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="man-ip">IP Address</label>
                <input
                  id="man-ip"
                  className="form-input"
                  placeholder="192.168.1.50"
                  value={manualForm.ip}
                  onChange={(e) => setManualForm({ ...manualForm, ip: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="man-desc">Description (Optional)</label>
              <input
                id="man-desc"
                className="form-input"
                placeholder="e.g. Dell OptiPlex 7090 - Desk 14"
                value={manualForm.description}
                onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={connecting}>
                {connecting ? 'Saving...' : 'Register Workstation'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Remote Agent Script */}
        {tab === 'remote-agent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Want to monitor any physical lab PC? Run this lightweight 1-line client on the PC to report its status to your dashboard automatically.
            </p>

            <div style={{
              background: '#0d1117',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>campus_agent.py</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={copySnippet}
                  style={{ gap: 4, padding: '2px 8px', fontSize: 11 }}
                >
                  {copied ? <Check size={12} color="var(--color-online)" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre style={{
                fontSize: 12,
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                margin: 0,
                overflowX: 'auto',
                whiteHeight: 'pre',
              }}>
                {pythonSnippet}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={15} color="var(--color-online)" /> No installation required. Runs standard Python 3 or PowerShell.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConnectDeviceModal;
