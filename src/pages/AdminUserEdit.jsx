import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

export default function AdminUserEdit({ userId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState(new Set());
  const [hostStatus, setHostStatus] = useState(null);

  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true); setError('');
        let roleList;
        try {
          roleList = await api.admin.listRoles(token);
        } catch (e) {
          // Fallback to static role IDs if roles endpoint not available yet
          roleList = [
            { Role_ID: 1, Role_Name: 'Student' },
            { Role_ID: 2, Role_Name: 'Host' },
            { Role_ID: 3, Role_Name: 'Admin' },
          ];
        }
        const details = await api.admin.getUser(userId, token);
        if (cancelled) return;
        setRoles(roleList || []);
        const payload = details?.data || details; // expect { user, roles, roleIds, hostStatus }
        const usr = payload?.user || null;
        const r = payload?.roles || [];
        setUser(usr);
        setName(usr?.Name || '');
        setEmail(usr?.Email || '');

        // Determine initial selected role IDs robustly (supports various backend shapes)
        const initialIds = (() => {
          if (Array.isArray(payload?.roleIds) && payload.roleIds.length) {
            return payload.roleIds.map((n) => Number(n)).filter((n) => Number.isFinite(n));
          }
          if (Array.isArray(r) && r.length) {
            return r.map((x) => Number(x?.Role_ID ?? x?.RoleId ?? x?.id ?? x)).filter((n) => Number.isFinite(n));
          }
          const ru = (usr && (usr.Roles || usr.roles)) || [];
          if (Array.isArray(ru) && ru.length) {
            return ru
              .map((val) => {
                if (typeof val === 'number') return val;
                const n = Number(val);
                if (Number.isFinite(n)) return n;
                const name = String(val).toLowerCase();
                if (name.includes('student')) return 1;
                if (name.includes('host')) return 2;
                if (name.includes('admin')) return 3;
                return null;
              })
              .filter((n) => Number.isFinite(n));
          }
          return [];
        })();
        setSelectedRoleIds(new Set(Array.from(new Set(initialIds))));

        setHostStatus(payload?.hostStatus || null);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load user');
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [token, userId]);

  const toggleRole = (roleId) => {
    const s = new Set(selectedRoleIds);
    if (s.has(roleId)) s.delete(roleId); else s.add(roleId);
    setSelectedRoleIds(s);
  };

  const isHost = useMemo(() => selectedRoleIds.has(2), [selectedRoleIds]);
  const isHostActive = !!(hostStatus && hostStatus.Is_Active === 1);

  async function save() {
    try {
      if (newPassword && newPassword.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
      }
      const body = { name, email, roles: Array.from(selectedRoleIds) };
      if (newPassword) body.password = newPassword;
      const updated = await api.admin.updateUser(userId, body, token);
      // refresh host status if host role toggled
      if (selectedRoleIds.has(2)) {
        const fresh = await api.admin.getUser(userId, token);
        const payload = fresh?.data || fresh; setHostStatus(payload?.hostStatus || null);
      }
      alert('Saved');
      onBack(updated);
    } catch (e) { alert(e.message || 'Failed to save'); }
  }

  async function reactivate() {
    try {
      await api.admin.reactivateHost(userId, token);
      const fresh = await api.admin.getUser(userId, token);
      const payload = fresh?.data || fresh; setHostStatus(payload?.hostStatus || null);
      alert('Host account reactivated');
    } catch (e) { alert(e.message || 'Failed to reactivate'); }
  }

  async function remove() {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.admin.deleteUser(userId, token);
      onBack({ deleted: true, id: userId });
    } catch (e) { alert(e.message || 'Failed to delete'); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Edit User</h2>
          <button className="rounded px-3 py-1 text-secondary hover:bg-secondary/10" onClick={() => onBack(null)}>Back</button>
        </div>
        {loading && <div className="flex items-center justify-center py-8"><div className="spinner" /></div>}
        {error && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>}
        {!loading && !error && user && (
          <div className="grid gap-4 text-left">
            <div>
              <label className="text-sm text-secondary">Name</label>
              <input className="mt-1 w-full rounded border p-2" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-secondary">Email</label>
              <input className="mt-1 w-full rounded border p-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="text-sm text-secondary">New Password</label>
                <div className="mt-1 flex">
                  <input type={showPw ? 'text' : 'password'} className="w-full rounded-l border p-2" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Leave blank to keep" />
                  <button type="button" onClick={()=>setShowPw(v=>!v)} className="rounded-r border border-l-0 px-3 text-sm text-secondary hover:bg-secondary/10">{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div>
                <label className="text-sm text-secondary">Confirm Password</label>
                <input type={showPw ? 'text' : 'password'} className="mt-1 w-full rounded border p-2" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
              </div>
            </div>
            <div>
              <label className="text-sm text-secondary">Roles</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {roles.map((r) => (
                  <label key={r.Role_ID} className="flex items-center gap-2 rounded-full border border-secondary/40 px-3 py-1 text-sm">
                    <input type="checkbox" checked={selectedRoleIds.has(Number(r.Role_ID))} onChange={() => toggleRole(Number(r.Role_ID))} />
                    <span>{r.Role_Name}</span>
                  </label>
                ))}
                {roles.length === 0 && (
                  <span className="text-sm text-secondary">No roles found</span>
                )}
              </div>
            </div>

            {isHost && (
              <div className="rounded-lg bg-white p-3 border border-secondary/40">
                <p className="text-sm text-secondary">Host Status</p>
                {hostStatus ? (
                  <div className="mt-1 text-sm">
                    <div>Approval: <span className="font-medium">{hostStatus.Approval_Status}</span></div>
                    <div>Activity: <span className="font-medium">{hostStatus.Activity_Status}</span></div>
                    <div>Active: <span className="font-medium">{hostStatus.Is_Active === 1 ? 'Yes' : 'No'}</span></div>
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-secondary">No host profile found</div>
                )}
                {!isHostActive && (
                  <button className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={reactivate}>Reactivate Host</button>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={remove}>Delete</button>
              <div className="flex gap-2">
                <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm text-secondary hover:border-primary hover:text-primary" onClick={() => onBack(null)}>Cancel</button>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
