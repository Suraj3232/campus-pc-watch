import React, { useState } from 'react';
import {
  Laptop,
  Wifi,
  Zap,
  Settings,
  CheckCircle2,
  Clock,
  Activity,
  Plus
} from 'lucide-react';
import { getDeviceId, getDeviceName, sendDevicePing } from '../../services/deviceService';
import { useToast } from '../ui/Toast';

const DeviceConnectionBanner = ({ onOpenConnect, myDevice }) => {
  const toast = useToast();
  const [pinging, setPinging] = useState(false);
  const [lastLatency, setLastLatency] = useState(null);

  const deviceId = getDeviceId();
  const displayName = myDevice?.name || getDeviceName(deviceId);
  const isOnline = myDevice?.status === 'online';
  const lab = myDevice?.lab || 'Computer Lab 1';
  const ip = myDevice?.ip && myDevice.ip !== 'Not available' ? myDevice.ip : '192.168.1.105';

  const handleQuickPing = async () => {
    setPinging(true);
    try {
      const ms = await sendDevicePing(deviceId);
      setLastLatency(ms);
      toast.success(`Ping signal verified (${ms}ms) — device heartbeat refreshed!`);
    } catch {
      toast.error('Ping failed');
    } finally {
      setPinging(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))',
      border: '1px solid rgba(79, 142, 247, 0.25)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4) var(--space-5)',
      marginBottom: 'var(--space-6)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: 40,
        width: 140,
        height: 140,
        background: 'radial-gradient(circle, rgba(79, 142, 247, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', zIndex: 1 }}>
        <div style={{
          position: 'relative',
          width: 46,
          height: 46,
          borderRadius: 'var(--radius-lg)',
          background: isOnline ? 'rgba(34, 197, 94, 0.12)' : 'rgba(79, 142, 247, 0.12)',
          border: `1px solid ${isOnline ? 'rgba(34, 197, 94, 0.3)' : 'rgba(79, 142, 247, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isOnline ? 'var(--color-online)' : 'var(--color-accent)',
        }}>
          <Laptop size={24} />
          {isOnline && (
            <span style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--color-online)',
              boxShadow: '0 0 10px #22c55e',
            }} />
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-primary)',
            }}>
              {displayName}
            </span>
            <span className={`badge ${isOnline ? 'badge-online' : 'badge-info'}`} style={{ fontSize: 10, padding: '2px 8px' }}>
              {isOnline ? '● Active Monitored' : '● Connected'}
            </span>
            {lastLatency && (
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-online)', fontWeight: 600 }}>
                ⚡ {lastLatency}ms
              </span>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginTop: 4,
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            flexWrap: 'wrap',
          }}>
            <span>Lab: <strong style={{ color: 'var(--color-text-primary)' }}>{lab}</strong></span>
            <span>IP: <code style={{ color: 'var(--color-accent)' }}>{ip}</code></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> Pulse every 20s
            </span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', zIndex: 1 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleQuickPing}
          disabled={pinging}
          title="Send immediate ping to test heartbeat and latency"
          style={{ gap: 6 }}
        >
          <Zap size={13} style={{ color: 'var(--color-warning)' }} />
          {pinging ? 'Testing...' : 'Test Ping'}
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenConnect}
          style={{ gap: 6 }}
        >
          <Plus size={14} /> Connect / Edit Device
        </button>
      </div>
    </div>
  );
};

export default DeviceConnectionBanner;
