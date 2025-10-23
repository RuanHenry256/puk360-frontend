import React, { useEffect, useMemo, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory';
import jsPDF from 'jspdf';
import AdminUserEdit from './AdminUserEdit';
import HostCreateEvent from './HostCreateEvent';
import HostEventDetail from './HostEventDetail';
import Sidebar from '../components/Sidebar';
import { Home, CalendarDays, ClipboardList, User2, FileText } from 'lucide-react';
import Button from '../components/Button';
import { api } from '../api/client';

function StatTile({ label, value, sub }) {
  return (
    <div className="rounded-lg bg-secondary/10 p-4">
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {sub ? <p className="text-xs text-secondary">{sub}</p> : null}
    </div>
  );
}

function BarsChart({ data = [], labels = [] }) {
  const points = (labels.length ? labels : data.map((_, i) => i + 1)).map((name, i) => ({ name, value: Number(data[i] || 0) }));
  return (
    <div className="h-56">
      <VictoryChart theme={VictoryTheme.material} domainPadding={10} padding={{ top: 10, bottom: 40, left: 50, right: 10 }}>
        <VictoryAxis style={{ tickLabels: { fontSize: 8, angle: 0 } }} tickFormat={(t) => String(t)} />
        <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 8 } }} />
        <VictoryBar data={points} x="name" y="value" style={{ data: { fill: '#6b3fa0' } }} />
      </VictoryChart>
    </div>
  );
}

function LineChart({ data = [], labels = [] }) {
  const points = (labels.length ? labels : data.map((_, i) => i + 1)).map((name, i) => ({ name, value: Number(data[i] || 0) }));
  return (
    <div className="h-56">
      <VictoryChart theme={VictoryTheme.material} padding={{ top: 10, bottom: 40, left: 50, right: 10 }}>
        <VictoryAxis style={{ tickLabels: { fontSize: 8 } }} tickFormat={(t) => String(t)} />
        <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 8 } }} />
        <VictoryLine data={points} x="name" y="value" style={{ data: { stroke: '#6b3fa0' } }} />
      </VictoryChart>
    </div>
  );
}

// Compute fallback/augmented metrics from raw events and users
function buildAugmentedMetrics(raw = {}, events = [], users = []) {
  const safeNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const byMonthLast12 = () => {
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${dt.getFullYear()}-${dt.getMonth()}`, label: dt.toLocaleString(undefined, { month: 'short' }) });
    }
    return months;
  };

  // Events per month (last 12 months)
  const months = byMonthLast12();
  const eventsPerMonth = months.map(({ key }) => {
    const [y, m] = key.split('-').map(Number);
    return events.filter((e) => {
      const d = new Date(typeof e.Date === 'string' ? e.Date : e.Date?.toString());
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  });

  // User growth: monthly cumulative registrations if any timestamp; else linear interpolation
  const pickDate = (u) => u?.createdAt || u?.CreatedAt || u?.created_at || u?.Register_Date || u?.registeredAt || u?.registered_at || u?.created || null;
  let monthlyAdds = months.map(() => 0);
  let haveDates = false;
  users.forEach((u) => {
    const ds = pickDate(u);
    const d = ds ? new Date(ds) : null;
    if (d && !isNaN(d)) {
      haveDates = true;
      const idx = months.findIndex(({ key }) => {
        const [y, m] = key.split('-').map(Number);
        return d.getFullYear() === y && d.getMonth() === m;
      });
      if (idx >= 0) monthlyAdds[idx] += 1;
    }
  });
  if (!haveDates) {
    const total = users.length;
    const step = total / months.length;
    monthlyAdds = months.map((_, i) => Math.round((i + 1) * step) - Math.round(i * step));
  }
  const userGrowth = monthlyAdds.reduce((acc, v, i) => { acc.push((acc[i - 1] || 0) + v); return acc; }, []);

  // Event analytics from event list
  const status = (s) => String(s || '').toLowerCase();
  const upcomingCount = events.filter((e) => status(e.Status) !== 'cancelled').length;
  const cancelledCount = events.filter((e) => status(e.Status) === 'cancelled').length;

  const catCounts = {};
  events.forEach((e) => {
    const c = (e.category || e.Category || 'Unknown');
    catCounts[c] = (catCounts[c] || 0) + 1;
  });
  const categoryBreakdown = Object.entries(catCounts).map(([name, count]) => ({ name, count }));

  const venueCounts = {};
  events.forEach((e) => { const v = (e.venue || e.Venue || 'Unknown'); venueCounts[v] = (venueCounts[v] || 0) + 1; });
  const topVenues = Object.entries(venueCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([name]) => name);

  // ---- User insights derived from users + events -------------------------
  const getRoles = (u) => {
    const r = u?.Roles || u?.roles || [];
    if (Array.isArray(r)) return r;
    if (typeof r === 'string') return [r];
    return [];
  };
  const roleHasHost = (u) => {
    const rr = getRoles(u);
    return rr.some((val) => {
      if (typeof val === 'number') return Number(val) === 2; // 2 = Host (fallback id)
      const s = String(val?.Role_Name ?? val?.name ?? val).toLowerCase();
      return s.includes('host');
    });
  };
  const hostIsActive = (u) => {
    const hs = u?.hostStatus || u?.HostStatus || u?.host_status || null;
    if (!hs) return null;
    const isActive = hs.Is_Active ?? hs.isActive ?? hs.active ?? hs.Active;
    return Number(isActive) === 1 || isActive === true;
  };

  const now = new Date();
  const isSameMonth = (d) => d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  const userDate = (u) => {
    const ds = u?.createdAt || u?.CreatedAt || u?.created_at || u?.Register_Date || u?.registeredAt || u?.registered_at || null;
    return ds ? new Date(ds) : null;
  };

  const newThisMonth = users.reduce((acc, u) => acc + (isSameMonth(userDate(u)) ? 1 : 0), 0);
  let verifiedHosts = 0; let pendingHosts = 0;
  users.forEach((u) => {
    if (roleHasHost(u)) {
      const act = hostIsActive(u);
      if (act === null) { verifiedHosts += 1; }
      else if (act) verifiedHosts += 1; else pendingHosts += 1;
    }
  });

  // Most active user by events hosted — restrict to actual Host users
  const hostCountById = {};
  events.forEach((e) => {
    const id = e.Host_User_ID || e.hostUserId || e.host_user_id || null;
    if (id) hostCountById[id] = (hostCountById[id] || 0) + 1;
  });
  let mostActiveUser = null;
  Object.entries(hostCountById).forEach(([id, cnt]) => {
    const u = users.find((x) => String(x.User_ID || x.id) === String(id));
    if (!u) return;
    if (!roleHasHost(u)) return; // only consider real hosts
    const name = u.Name || u.name || 'Host';
    if (!mostActiveUser || cnt > mostActiveUser.score) mostActiveUser = { name, score: cnt };
  });
  // Fallback: map hostedBy name to a known Host user if possible only
  if (!mostActiveUser) {
    const byName = {};
    events.forEach((e) => { const n = e.hostedBy || e.Hosted_By || null; if (n) byName[String(n).toLowerCase()] = (byName[String(n).toLowerCase()] || 0) + 1; });
    users.filter(roleHasHost).forEach((u) => {
      const nm = String(u.Name || u.name || '').toLowerCase();
      const cnt = byName[nm] || 0;
      if (cnt > 0 && (!mostActiveUser || cnt > mostActiveUser.score)) {
        mostActiveUser = { name: u.Name || u.name, score: cnt };
      }
    });
  }

  // Merge with backend data if present
  const m = raw && typeof raw === 'object' ? raw : {};
  const merged = {
    ...m,
    charts: {
      eventsPerMonth: Array.isArray(m?.charts?.eventsPerMonth) ? m.charts.eventsPerMonth : eventsPerMonth,
      userGrowth: Array.isArray(m?.charts?.userGrowth) ? m.charts.userGrowth : userGrowth,
    },
    events: {
      ...(m.events || {}),
      upcomingCount: safeNum(m?.events?.upcomingCount, upcomingCount),
      cancelledCount: safeNum(m?.events?.cancelledCount, cancelledCount),
      categoryBreakdown: m?.events?.categoryBreakdown || categoryBreakdown,
      topVenues: m?.events?.topVenues || topVenues,
    },
    users: {
      ...(m.users || {}),
      newThisMonth: safeNum(m?.users?.newThisMonth, newThisMonth),
      verifiedHosts: safeNum(m?.users?.verifiedHosts, verifiedHosts),
      pendingHosts: safeNum(m?.users?.pendingHosts, pendingHosts),
      avgHostRating: safeNum(m?.users?.avgHostRating, m?.reviews?.averageRating ?? 0),
      mostActiveUser: m?.users?.mostActiveUser || mostActiveUser || null,
    },
    engagement: m.engagement || {},
    reviews: {
      ...(m.reviews || {}),
      totalReviews: safeNum(m?.reviews?.totalReviews, m?.counts?.totalReviews ?? 0),
    },
    system: m.system || {},
  };
  return merged;
}

function OverviewPage({ metrics = {} }) {
  const m = metrics || {};
  const engagement = m.engagement || {};
  const events = m.events || {};
  const users = m.users || {};
  const reviews = m.reviews || {};
  const system = m.system || {};

  const eventsPerMonth = m.charts?.eventsPerMonth || [2, 5, 3, 8, 6, 9, 4, 7, 5, 6, 8, 10];
  const userGrowth = m.charts?.userGrowth || [10, 12, 15, 20, 24, 28, 33, 35, 40, 46, 53, 60];
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Normalize possible backend shapes
  const categoriesArray = Array.isArray(events.categoryBreakdown)
    ? events.categoryBreakdown.map((item) => [
        String(item?.category ?? item?.name ?? 'Unknown'),
        Number(item?.count ?? item?.value ?? 0),
      ])
    : Object.entries(events.categoryBreakdown || {}).map(([k, v]) => [
        String(k),
        Number(typeof v === 'object' && v !== null ? (v.count ?? v.value ?? 0) : v),
      ]);
  const categoriesCount = categoriesArray.length;
  const topVenueNames = Array.isArray(events.topVenues)
    ? events.topVenues
        .map((tv) => (typeof tv === 'string' ? tv : (tv?.name ?? tv?.title ?? tv?.venue ?? 'Unknown')))
        .slice(0, 3)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Engagement</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Events Attended (Total)" value={engagement.attendedTotal ?? 0} />
          <StatTile label="Attended (This Month)" value={engagement.attendedThisMonth ?? 0} />
          <StatTile label="Avg Attendance / Event" value={(engagement.avgAttendancePerEvent ?? 0).toFixed(1)} />
          <StatTile label="Active Users (7d)" value={engagement.activeUsers7d ?? 0} />
        </div>
        <div className="mt-3 text-sm text-secondary">
          Most popular event: <span className="font-semibold text-primary">{engagement?.mostPopularEvent?.title || '—'}</span>
          {typeof engagement?.mostPopularEvent?.attendees === 'number' && (
            <span className="ml-1">({engagement.mostPopularEvent.attendees})</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Event Analytics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Upcoming Events" value={events.upcomingCount ?? 0} />
          <StatTile label="Cancelled Events" value={events.cancelledCount ?? 0} />
          <StatTile label="Top 3 Venues" value={(events.topVenues?.length ?? 0)} sub={topVenueNames.join(', ')} />
          <StatTile label="Categories" value={categoriesCount} />
        </div>
        {categoriesArray.length > 0 && (
          <div className="mt-3 text-sm text-secondary">
            {categoriesArray.map(([k, v]) => (
              <span key={k} className="mr-3">{k}: <span className="text-primary font-semibold">{v}</span></span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">User Insights</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="New Users (This Month)" value={users.newThisMonth ?? 0} />
          <StatTile label="Verified Hosts" value={users.verifiedHosts ?? 0} sub={`Pending: ${users.pendingHosts ?? 0}`} />
          <StatTile label="Average Host Rating" value={(users.avgHostRating ?? 0).toFixed(2)} />
          <StatTile label="Most Active User" value={users.mostActiveUser?.name ? users.mostActiveUser.name : '—'} sub={typeof users.mostActiveUser?.score === 'number' ? `Score: ${users.mostActiveUser.score}` : ''} />
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Feedback & Reviews</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Total Reviews" value={reviews.totalReviews ?? 0} />
          <StatTile label="Average Event Rating" value={(reviews.averageRating ?? 0).toFixed(2)} />
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Most Reviewed Event</p>
            <p className="mt-1 font-semibold text-primary">{reviews.mostReviewedEvent?.title || '—'}</p>
            <p className="text-xs text-secondary">{reviews.mostReviewedEvent?.reviews ?? 0} reviews</p>
          </div>
        </div>
        {Array.isArray(reviews.recentSnippets) && reviews.recentSnippets.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {reviews.recentSnippets.slice(0, 3).map((t, i) => {
              const text = typeof t === 'string' ? t : (t?.text ?? t?.comment ?? t?.content ?? String(t));
              return (
                <div key={i} className="rounded-lg border border-secondary/30 bg-white p-3 text-sm text-text">“{text}”</div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">System Health</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">DB Connection</p>
            <p className="mt-1 text-3xl font-bold"><span title={system.dbConnected ? 'Connected' : 'Disconnected'}>{system.dbConnected ? '🟢' : '🔴'}</span></p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Last Backup</p>
            <p className="mt-1 text-primary">{system.lastBackup || 'Unknown'}</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">API Uptime (past 24h)</p>
            <p className="mt-1 text-3xl font-bold text-primary">{system.apiUptimePct ?? 0}%</p>
          </div>
          <div className="rounded-lg bg-secondary/10 p-4">
            <p className="text-sm text-secondary">Storage Used</p>
            <p className="mt-1 text-primary">{system.storageUsed ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Events Per Month</h3>
        <BarsChart data={eventsPerMonth} labels={monthLabels} />
      </div>
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">User Growth</h3>
        <LineChart data={userGrowth} labels={monthLabels} />
      </div>
    </div>
  );
}

function LogsPage() {
  const [lines, setLines] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [clearDone, setClearDone] = useState(false);

  async function load() {
    try {
      setLoading(true); setError('');
      const token = localStorage.getItem('token');
      const logs = await api.admin.auditLogs(500, token, q);
      const text = logs.map((l) => {
        const t = l.createdAt ? new Date(l.createdAt).toLocaleString() : '';
        const who = l.userName ? `${l.userName} <${l.userEmail||''}>` : (l.userId ? `User #${l.userId}` : 'System');
        const tgt = l.targetType ? `${l.targetType}${l.targetId?`#${l.targetId}`:''}` : '';
        let meta = '';
        try { meta = l.metadata ? JSON.stringify(JSON.parse(l.metadata), null, 2) : ''; }
        catch { meta = l.metadata || ''; }
        return `[${t}] ${l.eventType}${tgt?` (${tgt})`:''} — ${who}${meta?`\n${meta}`:''}`;
      }).join('\n\n');
      setLines(text || 'No logs.');
    } catch (e) {
      setError(e.message || 'Failed to load logs');
      setLines('');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const savePdf = async (mode) => {
    try {
      setLoading(true); setError('');
      const token = localStorage.getItem('token');
      const wantAll = mode === 'all';
      const raw = await api.admin.auditLogs(wantAll ? 'all' : 100, token, q);
      const text = (raw || []).map((l) => {
        const t = l.createdAt ? new Date(l.createdAt).toLocaleString() : '';
        const who = l.userName ? `${l.userName} <${l.userEmail||''}>` : (l.userId ? `User #${l.userId}` : 'System');
        const tgt = l.targetType ? `${l.targetType}${l.targetId?`#${l.targetId}`:''}` : '';
        let meta = '';
        try { meta = l.metadata ? JSON.stringify(JSON.parse(l.metadata), null, 2) : ''; }
        catch { meta = l.metadata || ''; }
        return `[${t}] ${l.eventType}${tgt?` (${tgt})`:''} — ${who}${meta?`\n${meta}`:''}`;
      }).join('\n\n');

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 36; // 0.5in
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const linesArr = doc.splitTextToSize(text || 'No logs.', maxWidth);
      let cursorY = margin;
      const header = `PUK360 Audit Logs — ${new Date().toLocaleString()} (${wantAll ? 'All' : 'Last 100'})`;
      doc.setFont('courier', 'normal');
      doc.setFontSize(12);
      doc.text(header, margin, cursorY);
      cursorY += 20;
      for (const ln of linesArr) {
        if (cursorY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage(); cursorY = margin;
          doc.setFont('courier', 'normal'); doc.setFontSize(12);
        }
        doc.text(ln, margin, cursorY);
        cursorY += 14;
      }
      const stamp = new Date().toISOString().replace(/[:T]/g,'-').slice(0,19);
      doc.save(`puk360-logs-${wantAll ? 'all' : 'last100'}-${stamp}.pdf`);
    } catch (e) {
      setError(e.message || 'Failed to save PDF');
    } finally { setLoading(false); }
  };

  const openClearModal = () => { setConfirming(true); setConfirmText(''); };
  const performClear = async () => {
    if ((confirmText || '').trim().toLowerCase() !== 'confirm') return;
    try {
      setDeleting(true); setError('');
      // Save a final copy of all logs locally
      await savePdf('all');
      // Call backend to clear
      const token = localStorage.getItem('token');
      await api.admin.clearLogs(token);
      setConfirmText('');
      setClearDone(true);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to clear logs');
    } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-3">
      {/* Controls: stack on mobile to match Events list style */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:w-auto">
          <input className="w-full rounded border px-3 py-2 text-sm sm:w-64" placeholder="Search logs" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button className="flex-1 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 sm:flex-none" onClick={() => savePdf('100')} disabled={loading}>Save PDF (Last 100)</button>
          <button className="flex-1 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 sm:flex-none" onClick={() => savePdf('all')} disabled={loading}>Save PDF (All)</button>
          <button className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:flex-none" onClick={openClearModal} disabled={loading || deleting}>Clear Logs</button>
        </div>
      </div>
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">
            {!clearDone ? (
              <>
                <h3 className="mb-2 text-lg font-semibold text-red-700">Delete all logs?</h3>
                <p className="mb-3 text-sm text-text">This will permanently delete all logs and cannot be undone. A final entry will be recorded that the logs were cleared. Type <span className="font-semibold text-red-700">confirm</span> to proceed.</p>
                <input className="mb-4 w-full rounded border px-3 py-2" value={confirmText} onChange={(e)=>setConfirmText(e.target.value)} placeholder="confirm" />
                <div className="flex justify-end gap-2">
                  <button className="rounded border border-secondary/40 px-4 py-2 text-sm text-secondary hover:bg-secondary/10" onClick={()=>{ setConfirming(false); setConfirmText(''); setClearDone(false); }} disabled={deleting}>Cancel</button>
                  <button className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60" disabled={deleting || (confirmText||'').trim().toLowerCase()!=='confirm'} onClick={performClear}>{deleting ? 'Deleting…' : 'Delete Logs'}</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-lg font-semibold text-green-700">Logs cleared</h3>
                <p className="mb-4 text-sm text-text">A final copy was saved and an entry was added noting the clear operation.</p>
                <div className="flex justify-end">
                  <button className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={()=>{ setConfirming(false); setClearDone(false); }}>Back</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {error && <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
      <textarea readOnly spellCheck={false} className="h-[70vh] w-full resize-none rounded-lg bg-black p-4 font-mono text-sm text-green-200" value={lines} />
    </div>
  );
}

function AdminProfile({ onUpdated }) {
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ name: user?.name || '', email: user?.email || '' }); }, [user?.name, user?.email]);

  const isDirty = (form.name || '').trim() !== (user?.name || '') || (form.email || '').trim() !== (user?.email || '');
  const onChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setStatus(''); setError(''); };
  const onSave = async () => {
    try {
      setSaving(true); setError(''); setStatus('');
      const token = localStorage.getItem('token');
      const { user: updated } = await api.updateProfile({ name: form.name.trim(), email: form.email.trim() }, token);
      const next = { ...(user || {}), ...updated };
      localStorage.setItem('user', JSON.stringify(next));
      setUser(next);
      onUpdated?.(next);
      setStatus('Profile updated.');
    } catch (e) { setError(e.message || 'Failed to update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold text-primary">Your Details</h3>
        {(status || error) && <p className={`text-sm ${error ? 'text-red-600' : 'text-green-700'}`}>{error || status}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-secondary">Name
            <input className="mt-1 w-full rounded-lg border px-3 py-2" name="name" value={form.name} onChange={onChange} />
          </label>
          <label className="text-sm text-secondary">Email
            <input type="email" className="mt-1 w-full rounded-lg border px-3 py-2" name="email" value={form.email} onChange={onChange} />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setForm({ name: user?.name || '', email: user?.email || '' })}>Reset</Button>
          <Button variant="primary" onClick={onSave} disabled={!isDirty || saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [query, setQuery] = useState('');
  const [range, setRange] = useState('upcoming'); // 'upcoming' | 'past' | 'all'
  const [statusFilter, setStatusFilter] = useState(''); // '', 'Scheduled','Cancelled','Completed'

  async function loadAllEvents() {
    setLoading(true);
    setError('');
    try {
      const list = await api.events.list({}); // no host filter => all events
      setEvents(Array.isArray(list) ? list : []);
    } catch (_) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAllEvents(); }, []);

  const filteredEvents = events.filter((e) => {
    const d = new Date((typeof e.Date === 'string' ? e.Date : e.Date?.toString()) + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const textMatch = !query || (e.Title || '').toLowerCase().includes(query.toLowerCase());
    const statusMatch = !statusFilter || (e.Status || '').toLowerCase() === statusFilter.toLowerCase();
    const dateMatch = range === 'all' ? true : range === 'upcoming' ? d >= today : d < today;
    return textMatch && statusMatch && dateMatch;
  });

  async function duplicateEvent(e) {
    try {
      const token = localStorage.getItem('token');
      await api.events.create({
        Title: `${e.Title} (Copy)`,
        Description: e.Description,
        Date: typeof e.Date === 'string' ? e.Date : new Date(e.Date).toISOString().slice(0,10),
        startTime: e.startTime,
        endTime: e.endTime,
        campus: e.campus,
        venue: e.venue,
        category: e.category,
        hostedBy: e.hostedBy,
        ImageUrl: e.ImageUrl,
        Host_User_ID: e.Host_User_ID, // keep original host unless backend enforces current user
        Status: e.Status || 'Scheduled',
      }, token);
      await loadAllEvents();
    } catch (_) {}
  }
  async function deleteEvent(e) {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.events.delete(e.Event_ID, token);
      await loadAllEvents();
    } catch (_) {}
  }
  async function updateStatus(e, Status) {
    try {
      const token = localStorage.getItem('token');
      await api.events.updateStatus(e.Event_ID, Status, token);
      await loadAllEvents();
    } catch (_) {}
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-white p-6 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by title" className="w-full rounded border px-3 py-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[300px] overflow-hidden rounded-lg border border-secondary/40">
            {['upcoming','past','all'].map((r, idx) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`flex-1 px-3 py-2 text-sm text-center ${range===r ? 'bg-primary text-white' : 'bg-white text-secondary hover:bg-primary/5'} ${idx < 2 ? 'border-r border-secondary/30' : ''}`}
              >
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['','Scheduled','Cancelled','Completed'].map((s) => (
              <button
                key={s || 'all'}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-sm ${statusFilter===s ? 'border-primary text-primary bg-primary/5' : 'border-secondary/40 text-secondary hover:bg-primary/5'}`}
              >
                {s || 'All statuses'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="ml-auto rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Create Event
          </button>
        </div>
      </div>

      {loading && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">Loading…</div>}
      {error && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="rounded-lg border border-secondary/40 bg-white p-6 text-secondary">No events match your filters.</div>
      )}
      {!loading && !error && filteredEvents.map((e) => (
        <div
          key={e.Event_ID}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedEventId(e.Event_ID)}
          onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') setSelectedEventId(e.Event_ID); }}
          className="flex cursor-pointer items-center justify-between rounded-lg border border-secondary/40 bg-white p-4 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={`Open details for ${e.Title}`}
        >
          <div>
            <p className="text-left font-semibold text-text">{e.Title}</p>
            <p className="text-sm text-secondary">{new Date((typeof e.Date === 'string' ? e.Date : e.Date?.toString()) + 'T00:00:00').toLocaleDateString('en-ZA', { year:'numeric', month:'short', day:'2-digit' })} • {e.venue || e.campus}</p>
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{e.Status || 'Scheduled'}</span>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row sm:items-start">
            <button
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
              onClick={(ev)=>{ ev.stopPropagation(); duplicateEvent(e); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Duplicate
            </button>
            <button
              className="w-full sm:w-auto rounded-lg border border-secondary/60 px-3 py-1.5 text-sm text-secondary hover:border-primary hover:text-primary"
              onClick={(ev)=>{ ev.stopPropagation(); updateStatus(e,'Cancelled'); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              onClick={(ev)=>{ ev.stopPropagation(); deleteEvent(e); }}
              onKeyDown={(ev)=>ev.stopPropagation()}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Create form overlay */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <HostCreateEvent
              onCancel={() => setCreating(false)}
              onCreated={() => { setCreating(false); loadAllEvents(); }}
            />
          </div>
        </div>
      )}

      {/* Event detail overlay - admins can always edit */}
      {selectedEventId && (
        <HostEventDetail canEdit={true} eventId={selectedEventId} onClose={() => { setSelectedEventId(null); loadAllEvents(); }} />
      )}
    </div>
  );
}

function UsersPage({ users = [], loading = false, error = '', searchTerm, setSearchTerm, onEdit, roleFilter = 'All', setRoleFilter = () => {} }) {
  const shortEmail = (value) => {
    if (!value) return '';
    const str = String(value);
    const [local, domain = ''] = str.split('@');
    const localShort = local.length > 8 ? local.slice(0, 8) : local;
    const domainShort = domain.length > 3 ? domain.slice(0, 3) + '...' : domain;
    return domain ? `${localShort}@${domainShort}` : localShort;
  };
  const filtered = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    const normFilter = String(roleFilter || 'All');
    const matchText = (u) =>
      String(u.Name || u.name || '').toLowerCase().includes(q) ||
      String(u.Email || u.email || '').toLowerCase().includes(q);
    const matchRole = (u) => {
      if (normFilter === 'All') return true;
      const roles = u.Roles || u.roles || [];
      return Array.isArray(roles) && roles.map(String).some((r) => r.toLowerCase() === normFilter.toLowerCase());
    };
    return users.filter((u) => (!q || matchText(u)) && matchRole(u));
  }, [users, searchTerm, roleFilter]);

  const roleChipClass = (roleName) => {
    switch ((roleName || '').toLowerCase()) {
      case 'student':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'host':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'admin':
        return 'bg-green-200 text-green-800 border border-green-300';
      default:
        return 'bg-secondary/10 text-secondary';
    }
  };
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-primary">User Management</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-secondary/60 p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {['All', 'Student', 'Host', 'Admin'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setRoleFilter(opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                (roleFilter || 'All') === opt
                  ? 'bg-primary text-white'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
              aria-pressed={(roleFilter || 'All') === opt}
            >
              {opt}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8"><div className="spinner" /></div>
        )}
        {error && (
          <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <div className="space-y-3 text-left">
            {filtered.map((user) => {
              const name = user.Name || user.name || '';
              const email = user.Email || user.email || '';
              const roles = user.Roles || user.roles || [];
              const roleBadge = Array.isArray(roles) && roles.length ? roles[0] : (user.role || 'User');
              const badgeClass = roleChipClass(roleBadge);
              return (
                <button type="button" onClick={() => onEdit(user)}
                  key={user.User_ID || `${name}-${email}`}
                  className="flex w-full items-center justify-between rounded-lg border border-secondary/40 bg-white p-4 text-left hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {String(name).charAt(0) || '?'}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-text">{name}</p>
                      <p className="text-xs text-secondary sm:hidden">{shortEmail(email)}</p>
                      <p className="hidden sm:block text-sm text-secondary">{email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ml-2 ${badgeClass}`}>
                    {roleBadge}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard({ onSignOut }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState({ counts: {}, recent: {} });
  const [currentUser, setCurrentUser] = useState(() => {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const [appsSearch, setAppsSearch] = useState('');
  const [appsStatusFilter, setAppsStatusFilter] = useState('Pending');
  const [selectedApp, setSelectedApp] = useState(null);
  const [users, setUsers] = useState([]);
  // Events for analytics/overview (separate from EventsPage local state)
  const [allEvents, setAllEvents] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [editingUser, setEditingUser] = useState(null);

  async function loadApps(status = 'Pending') {
    try {
      setAppsLoading(true); setAppsError('');
      const token = localStorage.getItem('token');
      const list = await api.admin.listHostApplications(status, token);
      setApps(list);
      setAppsStatusFilter(status);
    } catch (e) {
      setAppsError(e.message || 'Failed to load applications');
    } finally { setAppsLoading(false); }
  }

  useEffect(() => {
    if (activeTab === 'hostapps') loadApps('Pending');
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
    if (activeTab === 'overview') {
      loadStats();
    }
  }, [activeTab, users.length]);

  useEffect(() => {
    if (users.length === 0) loadUsers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadUsers(q = '') {
    try {
      setUsersLoading(true); setUsersError('');
      const token = localStorage.getItem('token');
      const list = await api.admin.listUsers(q, token);
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      setUsersError(e.message || 'Failed to load users');
    } finally { setUsersLoading(false); }
  }

  async function review(id, decision, comment) {
    try {
      const token = localStorage.getItem('token');
      await api.admin.reviewHostApplication(id, { decision, comment }, token);
      setApps((prev) => prev.filter((a) => a.Application_ID !== id));
      setSelectedApp(null);
    } catch (e) { alert(e.message || 'Failed to update'); }
  }

  async function loadStats() {
    try {
      const token = localStorage.getItem('token');
      const [data, usersList, eventsList] = await Promise.all([
        api.admin.dashboard(token).catch(() => ({})),
        users.length ? Promise.resolve(users) : api.admin.listUsers('', token).catch(() => []),
        allEvents.length ? Promise.resolve(allEvents) : api.events.list({}).catch(() => []),
      ]);
      if (Array.isArray(usersList) && users.length === 0) setUsers(usersList);
      if (Array.isArray(eventsList) && allEvents.length === 0) setAllEvents(eventsList);
      let merged = buildAugmentedMetrics(data, Array.isArray(eventsList) ? eventsList : allEvents, Array.isArray(usersList) ? usersList : users);

      // If reviews look missing, aggregate from event review endpoints (best‑effort)
      const needsReviewAgg = !merged?.reviews || (!Number(merged?.reviews?.totalReviews) && (Array.isArray(eventsList) ? eventsList : allEvents).length <= 50);
      if (needsReviewAgg) {
        try {
          const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const evs = Array.isArray(eventsList) ? eventsList : allEvents;
          let total = 0; let sumRating = 0; let mostCount = 0; let mostTitle = '';
          for (const e of evs) {
            const id = e.Event_ID || e.id;
            if (!id) continue;
            const res = await fetch(`${API_BASE}/api/events/${id}/reviews`);
            const js = await res.json().catch(()=>null);
            const arr = Array.isArray(js?.data) ? js.data : (Array.isArray(js) ? js : []);
            const c = arr.length;
            total += c;
            sumRating += arr.reduce((s, r) => s + (Number(r.rating) || 0), 0);
            if (c > mostCount) { mostCount = c; mostTitle = e.Title || e.title || 'Event'; }
          }
          const avg = total ? (sumRating / total) : 0;
          merged = {
            ...merged,
            reviews: {
              ...(merged.reviews || {}),
              totalReviews: total,
              averageRating: avg,
              mostReviewedEvent: mostCount ? { title: mostTitle, reviews: mostCount } : (merged.reviews?.mostReviewedEvent || null),
            },
          };
        } catch { /* ignore */ }
      }

      setMetrics(merged);
    } catch (_) {
      setMetrics({ counts: {}, recent: {} });
    }
  }

  function HostAppsPage() {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-secondary/40 bg-primary/5 p-6 shadow-sm">
          <div className="mb-4 grid gap-2 sm:grid-cols-2 sm:items-center">
            <h2 className="text-2xl font-bold text-primary">Host Applications</h2>
            <div className="flex w-full flex-wrap gap-2 sm:justify-end">
              {['Pending','Approved','Rejected','All'].map((s) => (
                <button
                  key={s}
                  className={[
                    'px-4 py-2 text-sm rounded-full border',
                    appsStatusFilter === s
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-secondary border-secondary/60 hover:border-primary hover:text-primary',
                  ].join(' ')}
                  onClick={() => loadApps(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="w-full rounded-lg border border-secondary/60 px-3 py-2 text-sm sm:w-80"
              placeholder="Search by org or applicant"
              value={appsSearch}
              onChange={(e)=>setAppsSearch(e.target.value)}
            />
          </div>
          {appsLoading && <div className="flex items-center justify-center py-8"><div className="spinner" /></div>}
          {appsError && <div className="rounded-lg border border-secondary/40 bg-white p-4 text-red-600">{appsError}</div>}
          {!appsLoading && !appsError && (
            <div>
              {apps.length === 0 ? (
                <div className="rounded-lg border border-secondary/40 bg-white p-4 text-secondary">No applications</div>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(apps || []).filter((a)=>{
                    const q=(appsSearch||'').toLowerCase().trim(); if(!q) return true;
                    const hay=[a.Org_Name,a.Applicant_Name,a.Applicant_Email].map(x=>String(x||'').toLowerCase());
                    return hay.some(h=>h.includes(q));
                  }).map((a) => (
                    <li key={a.Application_ID}>
                      <button
                        type="button"
                        onClick={() => setSelectedApp(a)}
                        className="w-full rounded-2xl border border-secondary/40 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-primary">{a.Org_Name} • {a.Event_Type}</h3>
                            <p className="text-sm text-secondary">Applicant: {a.Applicant_Name} ({a.Applicant_Email})</p>
                          </div>
                          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-secondary">{a.Status}</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-secondary">{a.Motivation || 'No motivation provided.'}</p>
                        <p className="mt-2 text-xs text-secondary">Tap to review</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function HostAppDetailModal({ app, onClose }) {
    const [comment, setComment] = useState('');
    if (!app) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-secondary/40 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-primary">Review Application</h3>
            <button className="rounded px-3 py-1 text-secondary hover:bg-secondary/10" onClick={onClose}>×</button>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Organisation • Category</p>
              <p className="font-semibold text-primary">{app.Org_Name} • {app.Event_Type}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Applicant</p>
              <p className="font-medium text-text">{app.Applicant_Name} ({app.Applicant_Email})</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-sm text-secondary">Motivation</p>
              <p className="text-text">{app.Motivation || 'No motivation provided.'}</p>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <label className="text-sm font-medium text-secondary">Reviewer comment (sent to applicant later)</label>
              <textarea className="mt-1 h-28 w-full rounded border p-2" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-lg border border-secondary/60 px-4 py-2 text-sm text-secondary hover:border-primary hover:text-primary" onClick={onClose}>Cancel</button>
            {app.Status === 'Pending' && (
              <>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90" onClick={() => review(app.Application_ID, 'APPROVED', comment)}>Approve</button>
                <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => review(app.Application_ID, 'REJECTED', comment)}>Reject</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage metrics={metrics} />;
      case 'events':
        return <EventsPage />;
      case 'hostapps':
        return <HostAppsPage />;
      case 'users':
        return (
          editingUser ? (
            <AdminUserEdit
              userId={editingUser.User_ID || editingUser.id}
              onBack={(result) => {
                setEditingUser(null);
                if (result?.deleted) {
                  setUsers((prev) => prev.filter((u) => u.User_ID !== result.id));
                } else if (result) {
                  loadUsers();
                }
              }}
            />
          ) : (
            <UsersPage
              users={users}
              loading={usersLoading}
              error={usersError}
              searchTerm={userSearch}
              setSearchTerm={setUserSearch}
              roleFilter={userRoleFilter}
              setRoleFilter={setUserRoleFilter}
              onEdit={(u) => setEditingUser(u)}
            />
          )
        );
      case 'profile':
        return <AdminProfile onUpdated={(u)=>setCurrentUser(u)} />;
      case 'logs':
        return <LogsPage />;
      default:
        return <OverviewPage metrics={metrics} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Admin Dashboard';
      case 'events':
        return 'Events Management';
      case 'users':
        return 'User Management';
      case 'hostapps':
        return 'Host Applications';
      case 'profile':
        return 'My Profile';
      case 'logs':
        return 'System Logs';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="min-h-screen text-text">
      <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-secondary/40 bg-primary/5 backdrop-blur">
        <div className="flex h-full items-center justify-start px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="rounded p-2 text-primary hover:bg-primary/10" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
            <h1 className="text-xl font-bold text-primary lg:text-left">{getTitle()}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 page-animate">
        {renderPage()}
      </div>
      {activeTab === 'hostapps' && selectedApp && (
        <HostAppDetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      <Sidebar
        dropdown
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeId={activeTab}
        onSelect={setActiveTab}
        items={[
          { id: 'overview', label: 'Overview', icon: <Home size={16} /> },
          { id: 'events', label: 'Events', icon: <CalendarDays size={16} /> },
          { id: 'hostapps', label: 'Host Applications', icon: <ClipboardList size={16} /> },
          { id: 'users', label: 'Users', icon: <User2 size={16} /> },
          { id: 'profile', label: 'Profile', icon: <User2 size={16} /> },
          { id: 'logs', label: 'Logs', icon: <FileText size={16} /> },
        ]}
        onSignOut={onSignOut}
      />
    </div>
  );
}
