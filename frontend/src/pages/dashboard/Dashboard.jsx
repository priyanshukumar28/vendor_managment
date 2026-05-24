import React, { useEffect, useState } from 'react'
import {
  MdPeople, MdFolder, MdCode, MdTask,
  MdWarning, MdEscalatorWarning, MdSpeed, MdCalendarToday
} from 'react-icons/md'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { SectionCard, AlertCard } from '../../components/Cards/Cards'
import { vendorService } from '../../services/vendor.service'
import { userService } from '../../services/user.service'
import api from '../../api/axios'
import styles from './Dashboard.module.css'

const PIE_COLORS = ['#10B981', '#F59E0B', '#6B7280']

// Stat card matching Visily top row
const StatBlock = ({ icon: Icon, iconColor, value, label, delta, deltaType }) => (
  <div className={styles.statBlock}>
    <div className={styles.statTop}>
      <Icon size={20} style={{ color: iconColor || 'var(--brand-blue)' }} />
      {delta && (
        <span className={`${styles.delta} ${deltaType === 'down' ? styles.deltaNeg : styles.deltaPos}`}>
          {delta}
        </span>
      )}
    </div>
    <p className={styles.statValue}>{value}</p>
    <p className={styles.statLabel}>{label}</p>
  </div>
)

const Dashboard = () => {
  const [vendors, setVendors] = useState([])
  const [users, setUsers] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, uRes] = await Promise.allSettled([
          vendorService.getVendors({ page: 1, limit: 5 }),
          userService.getUsers({ page: 1, limit: 5 }),
        ])
        if (vRes.status === 'fulfilled') setVendors(vRes.value?.data || vRes.value || [])
        if (uRes.status === 'fulfilled') setUsers(uRes.value?.data || uRes.value || [])
      } catch (e) {
        // Silently handle — backend not required to match exactly
      } finally {
        setStatsLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalVendors = Array.isArray(vendors) ? vendors.length : 0
  const totalUsers = Array.isArray(users) ? users.length : 0

  // Chart placeholder data (real data would come from your analytics endpoint)
  const progressData = [
    { week: 'Wk 1', completed: 48, planned: 50 },
    { week: 'Wk 2', completed: 52, planned: 55 },
    { week: 'Wk 3', completed: 55, planned: 58 },
    { week: 'Wk 4', completed: 65, planned: 62 },
    { week: 'Wk 5', completed: 72, planned: 68 },
    { week: 'Wk 6', completed: 82, planned: 75 },
  ]

  const vendorPerfData = [
    { name: 'TechSol', score: 94 },
    { name: 'DevFlow', score: 82 },
    { name: 'DataCore', score: 91 },
    { name: 'CloudNet', score: 68 },
  ]

  const devUtilData = [
    { dept: 'UI/UX', util: 88 },
    { dept: 'Backend', util: 95 },
    { dept: 'Mobile', util: 92 },
    { dept: 'DevOps', util: 85 },
  ]

  const taskDist = [
    { name: 'Completed', value: 60 },
    { name: 'Review', value: 25 },
    { name: 'Backlog', value: 15 },
  ]

  const pendingApprovals = [
    { entity: 'SkyLine ERP', type: 'Invoice', status: 'review' },
    { entity: 'Vertex App', type: 'Deployment', status: 'final' },
    { entity: 'H. Miller', type: 'Access', status: 'review' },
    { entity: 'AWS Renewal', type: 'Contract', status: 'pending' },
    { entity: 'BugFix v2.4', type: 'Code', status: 'testing' },
  ]

  const activities = [
    { dot: '#3B82F6', text: "Project 'Neo' Milestone Approved", time: '12 mins ago' },
    { dot: '#6B7280', text: "Vendor 'SoftLogic' submitted invoice #882", time: '45 mins ago' },
    { dot: '#10B981', text: 'Critical bug resolved by Dev Team A', time: '1.5 hours ago' },
    { dot: '#F59E0B', text: 'New Vendor Application: GlobalDev Inc', time: '3 hours ago' },
  ]

  const statusColor = { review: '#F59E0B', final: '#3B82F6', pending: '#9CA3AF', testing: '#8B5CF6' }

  return (
    <div className={styles.page}>
      {/* Top KPI Row */}
      <div className={styles.kpiRow}>
        <StatBlock icon={MdPeople} iconColor="#3B82F6" value="124" label="TOTAL VENDORS" delta="↑ +12%" />
        <StatBlock icon={MdFolder} iconColor="#10B981" value="42" label="ACTIVE PROJECTS" delta="↑ +5%" />
        <StatBlock icon={MdCode} iconColor="#8B5CF6" value="856" label="ACTIVE DEVELOPERS" delta="0%" deltaType="neutral" />
        <StatBlock icon={MdTask} iconColor="#F59E0B" value="1,204" label="PENDING TASKS" />
        <StatBlock icon={MdWarning} iconColor="#EF4444" value="18" label="DELAYED DELIVERIES" delta="↓ -8%" deltaType="down" />
        <StatBlock icon={MdEscalatorWarning} iconColor="#F97316" value="7" label="OPEN ESCALATIONS" delta="↓ -15%" deltaType="down" />
        <StatBlock icon={MdSpeed} iconColor="#10B981" value="92.4%" label="PRODUCTIVITY %" delta="↑ +2" />
        <StatBlock icon={MdCalendarToday} iconColor="#6B7280" value="24" label="TODAY'S DEADLINES" delta="Steady" />
      </div>

      {/* Actions Row */}
      <div className={styles.actionsRow}>
        <button className={styles.quickAction}>⚡ Quick Action</button>
        <button className={styles.exportBtn}>⬇ Export Data</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className={styles.filterBtn}>⚙ Advanced Filters</button>
          <span className={styles.liveStatus}>● Live Status: Operational</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left: Charts */}
        <div className={styles.leftCol}>
          {/* Progress Chart */}
          <SectionCard
            title="Project Progress Overview"
            action={<span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Weekly milestone completion vs. planning</span>}
          >
            <div style={{ padding: '16px 20px 20px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="completed" name="Completed Tasks" stroke="#1565D8" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="planned" name="Planned Tasks" stroke="#93C5FD" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Bottom two charts */}
          <div className={styles.twoCol}>
            <SectionCard title="Vendor Performance" action={<span className={styles.topBadge}>Top 4 Rated</span>}>
              <div style={{ padding: '12px 16px 16px' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={vendorPerfData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    <Bar dataKey="score" fill="#1565D8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: '#9CA3AF' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#1565D8', flexShrink: 0 }} />
                  Efficiency Score
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Developer Utilization" action={<span className={styles.greenDelta}>↑ +2.4%</span>}>
              <div style={{ padding: '12px 16px 16px' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={devUtilData}>
                    <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    <Bar dataKey="util" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Right: Sidebar Widgets */}
        <div className={styles.rightCol}>
          {/* Donut */}
          <SectionCard title="Task Status Distribution">
            <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={taskDist} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" stroke="none">
                    {taskDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                {taskDist.map((d, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], display: 'inline-block' }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Pending Approvals */}
          <SectionCard title="Pending Approvals" action={<button className={styles.viewAll}>View All</button>}>
            <div className={styles.approvalList}>
              <div className={styles.approvalHeader}>
                <span>ENTITY</span><span>TYPE</span><span>STATUS</span>
              </div>
              {pendingApprovals.map((a, i) => (
                <div key={i} className={styles.approvalRow}>
                  <span className={styles.approvalEntity}>{a.entity}</span>
                  <span className={styles.approvalType}>{a.type}</span>
                  <span className={styles.approvalStatus} style={{ background: `${statusColor[a.status]}22`, color: statusColor[a.status] }}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent Activity */}
          <SectionCard title="Recent Activities">
            <div className={styles.activityList}>
              {activities.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles.activityDot} style={{ background: a.dot }} />
                  <div>
                    <p className={styles.activityText}>{a.text}</p>
                    <p className={styles.activityTime}>🕐 {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Critical Alerts */}
          <SectionCard title="🔺 Critical Alerts">
            <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AlertCard type="danger" icon="⚠" title="API Endpoint Latency > 2s" count={3} />
              <AlertCard type="warning" icon="⚠" title="Deployment Delay: Project X" count={1} />
              <AlertCard type="danger" icon="⚠" title="Vendor Compliance Expired" count={2} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
