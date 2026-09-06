'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Droplets,
  Heart,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquare,
  Pill,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts'

/* =========================================================
   TYPES
   ========================================================= */

type Section =
  | 'dashboard'
  | 'analytics'
  | 'alerts'
  | 'user-details'
  | 'medications'

/* =========================================================
   MOCK DATA
   Replace this later with API data.
   ========================================================= */

const patient = {
  name: 'Saanvi Jain',
  age: 72,
  gender: 'Female',
  location: 'Guwahati, Assam',
  phone: '+91 98765 43210',
  email: 'saanvi@example.com',
  relationship: 'Mother',
  language: 'Assamese',
  joined: '12 August 2026',
  emergencyContact: 'Rahul Jain',
  emergencyPhone: '+91 98765 12345',
}

const todayMetrics = {
  cognitive: 80,
  physical: 62,
  mood: 88,
  medication: 67,
}

const todayPerformance = [
  {
    name: 'Memory',
    score: 80,
  },
  {
    name: 'Attention',
    score: 60,
  },
  {
    name: 'Problem Solving',
    score: 70,
  },
  {
    name: 'Engagement',
    score: 90,
  },
]

const activityBreakdown = [
  { name: 'Cognitive Games', value: 40 },
  { name: 'Reminders', value: 20 },
  { name: 'Physical Activity', value: 15 },
  { name: 'Learning', value: 15 },
  { name: 'Other', value: 10 },
]

const weeklyPerformance = [
  {
    week: 'Week 1',
    memory: 62,
    attention: 55,
    problemSolving: 58,
    engagement: 64,
  },
  {
    week: 'Week 2',
    memory: 68,
    attention: 61,
    problemSolving: 64,
    engagement: 70,
  },
  {
    week: 'Week 3',
    memory: 74,
    attention: 67,
    problemSolving: 69,
    engagement: 78,
  },
  {
    week: 'Week 4',
    memory: 80,
    attention: 60,
    problemSolving: 70,
    engagement: 90,
  },
]

const alerts = [
  {
    id: 1,
    type: 'performance',
    title: 'Attention score dropped',
    description:
      'Attention performance decreased by 8% compared with yesterday.',
    time: 'Today, 11:20 AM',
    severity: 'medium',
  },
  {
    id: 2,
    type: 'medical',
    title: 'Afternoon medication missed',
    description:
      'The scheduled afternoon medication has not been marked as taken.',
    time: 'Today, 2:15 PM',
    severity: 'high',
  },
  {
    id: 3,
    type: 'performance',
    title: 'Great cognitive engagement',
    description:
      'Memory game performance improved by 12% this week.',
    time: 'Today, 10:30 AM',
    severity: 'low',
  },
]

const medications = [
  {
    name: 'Donepezil',
    dosage: '5 mg',
    frequency: 'Once daily',
    time: '08:00 AM',
    status: 'Taken',
    category: 'Morning',
  },
  {
    name: 'Vitamin B12',
    dosage: '500 mcg',
    frequency: 'Once daily',
    time: '01:00 PM',
    status: 'Pending',
    category: 'Afternoon',
  },
  {
    name: 'Calcium',
    dosage: '500 mg',
    frequency: 'Once daily',
    time: '08:00 PM',
    status: 'Upcoming',
    category: 'Evening',
  },
]

const recentActivities = [
  {
    icon: Activity,
    title: 'Memory Game',
    description: 'Completed · Score: 85%',
    time: '10:30 AM',
  },
  {
    icon: Pill,
    title: 'Medication Taken',
    description: 'Morning dose',
    time: '09:15 AM',
  },
  {
    icon: MessageSquare,
    title: 'Voice Conversation',
    description: 'Spoke about family memories',
    time: '08:40 AM',
  },
  {
    icon: Heart,
    title: 'Daily Check-in',
    description: 'Mood: Good',
    time: '08:00 AM',
  },
]

const reminders = [
  {
    icon: Pill,
    title: 'Medication',
    description: 'Afternoon dose',
    time: '02:00 PM',
  },
  {
    icon: Droplets,
    title: 'Hydration',
    description: 'Have a glass of water',
    time: '04:00 PM',
  },
  {
    icon: Activity,
    title: 'Evening Walk',
    description: '15 minutes',
    time: '05:00 PM',
  },
  {
    icon: Phone,
    title: 'Family Call',
    description: 'Talk to Rohan',
    time: '07:00 PM',
  },
]

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function CaregiverPage() {
  const router = useRouter()

  const [activeSection, setActiveSection] =
    useState<Section>('dashboard')

  const [profileOpen, setProfileOpen] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    router.replace('/login')
  }

  const selectSection = (section: Section) => {
    setActiveSection(section)
    setSidebarOpen(false)
    setProfileOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#17372F]">

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
          ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          bg-[#17483D] text-white
          shadow-xl transition-transform duration-200
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* Logo */}
        <div className="px-7 pb-5 pt-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="h-5 w-5 text-[#EAB05C]" />
            </div>

            <div>
              <div className="font-display text-xl font-semibold">
                Smriti <span className="text-[#56A98C]">Sahayak</span>
              </div>

              <p className="mt-0.5 text-xs text-[#B8D3CB]">
                Together for brighter tomorrows
              </p>
            </div>
          </div>
        </div>

        {/* Portal title */}
        <div className="px-7 pb-6 pt-5">
          <h2 className="text-lg font-semibold">
            Caregiver Portal
          </h2>

          <p className="mt-1 text-sm text-[#B8D3CB]">
            Support · Monitor · Empower
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeSection === 'dashboard'}
            onClick={() => selectSection('dashboard')}
          />

          <SidebarItem
            icon={LineChart}
            label="Analytics"
            active={activeSection === 'analytics'}
            onClick={() => selectSection('analytics')}
          />

          <SidebarItem
            icon={Bell}
            label="Alerts"
            badge="3"
            active={activeSection === 'alerts'}
            onClick={() => selectSection('alerts')}
          />

          <SidebarItem
            icon={UserRound}
            label="User Details"
            active={activeSection === 'user-details'}
            onClick={() => selectSection('user-details')}
          />

          <SidebarItem
            icon={Pill}
            label="Medications"
            active={activeSection === 'medications'}
            onClick={() => selectSection('medications')}
          />
        </nav>

        {/* Quote */}
        <div className="px-7 pb-7">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="font-display text-lg italic leading-relaxed text-[#D9E8E3]">
              “Care today for a brighter tomorrow.”
            </p>

            <div className="mt-3 text-2xl text-[#56A98C]">
              ♡
            </div>
          </div>

          <p className="mt-5 text-xs text-[#A9C7BE]">
            Smriti Sahayak
          </p>

          <p className="mt-1 text-xs text-[#7FA89D]">
            Caregivers make memories stronger.
          </p>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
          ===================================================== */}

      <div className="lg:pl-[270px]">

        {/* ===================================================
            TOP HEADER
            =================================================== */}

        <header className="sticky top-0 z-30 border-b border-[#DDE5DF] bg-[#F5F3ED]/95 backdrop-blur">
          <div className="flex h-[78px] items-center justify-between px-5 sm:px-8">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-[#17483D] hover:bg-[#EAF1ED] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Greeting */}
            <div className="hidden items-center gap-4 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0D8]">
                <span className="text-xl">☀</span>
              </div>

              <div>
                <h1 className="font-display text-xl font-semibold text-[#17372F]">
                  Good evening, Caregiver
                </h1>

                <p className="text-sm text-[#668078]">
                  Thank you for being there. Your support makes a difference.
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <div className="font-display text-lg font-semibold text-[#17483D] sm:hidden">
              Smriti Sahayak
            </div>

            {/* Right controls */}
            <div className="relative flex items-center gap-3">

              {/* Date */}
              <div className="hidden items-center gap-2 rounded-full border border-[#D7E2DC] bg-white px-4 py-2 text-sm text-[#4D655D] md:flex">
                <CalendarDays className="h-4 w-4 text-[#2F8069]" />
                Fri, 5 Sep 2026
              </div>

              {/* Profile */}
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="
                  flex items-center gap-3 rounded-full
                  border border-[#D7E2DC] bg-white
                  px-3 py-2 shadow-sm
                  hover:bg-[#F8FAF8]
                "
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F8069] text-sm font-bold text-white">
                  SJ
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-[#17372F]">
                    Aarav Mehta
                  </p>

                  <p className="text-xs text-[#7B9089]">
                    Caregiver
                  </p>
                </div>

                <ChevronDown className="hidden h-4 w-4 text-[#536A63] sm:block" />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[58px] w-64 overflow-hidden rounded-2xl border border-[#DDE5DF] bg-white shadow-xl">

                  <div className="border-b border-[#E6ECE8] p-4">
                    <p className="font-semibold text-[#17372F]">
                      Aarav Mehta
                    </p>

                    <p className="mt-1 text-sm text-[#70837C]">
                      aarav@example.com
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4D655D] hover:bg-[#F4F8F5]"
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#4D655D] hover:bg-[#F4F8F5]"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t border-[#E6ECE8] px-4 py-3 text-left text-sm font-medium text-[#C64D4D] hover:bg-[#FFF5F5]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
            =================================================== */}

        <main className="relative min-h-[calc(100vh-78px)] overflow-hidden px-4 py-5 sm:px-8 sm:py-7">

          {/* Soft background atmosphere */}
          <div
            className="
              pointer-events-none absolute inset-x-0 top-0
              h-56 overflow-hidden
              bg-gradient-to-b from-[#DCECE8] via-[#EDF3EF] to-transparent
            "
          >
            <div className="absolute -right-10 top-5 h-48 w-72 rounded-full bg-[#BBD8D0]/30 blur-3xl" />
            <div className="absolute left-1/4 top-16 h-28 w-72 rounded-full bg-white/70 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-[1450px]">

            {/* Patient selector / page title */}
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>
                <p className="text-sm font-medium text-[#6E867E]">
                  Caregiver overview
                </p>

                <h2 className="mt-1 font-display text-3xl font-semibold text-[#17372F]">
                  {getSectionTitle(activeSection)}
                </h2>

                <p className="mt-1 text-sm text-[#70837C]">
                  Monitoring {patient.name}'s well-being and daily engagement.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#D8E4DE] bg-white px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDEEE8] text-sm font-bold text-[#2F8069]">
                  SJ
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold text-[#17372F]">
                    {patient.name}
                  </p>

                  <p className="text-xs text-[#7B9089]">
                    Age {patient.age} · Patient
                  </p>
                </div>

                <ChevronDown className="ml-2 h-4 w-4 text-[#60776F]" />
              </div>
            </div>

            {/* =================================================
                DASHBOARD
                ================================================= */}

            {activeSection === 'dashboard' && (
              <DashboardSection />
            )}

            {/* =================================================
                ANALYTICS
                ================================================= */}

            {activeSection === 'analytics' && (
              <AnalyticsSection />
            )}

            {/* =================================================
                ALERTS
                ================================================= */}

            {activeSection === 'alerts' && (
              <AlertsSection />
            )}

            {/* =================================================
                USER DETAILS
                ================================================= */}

            {activeSection === 'user-details' && (
              <UserDetailsSection />
            )}

            {/* =================================================
                MEDICATIONS
                ================================================= */}

            {activeSection === 'medications' && (
              <MedicationsSection />
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

/* =========================================================
   SIDEBAR ITEM
   ========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: typeof LayoutDashboard
  label: string
  active: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative mb-1 flex w-full items-center gap-4
        rounded-xl px-4 py-3.5 text-left
        transition-all
        ${
          active
            ? 'bg-[#2C7665] text-white shadow-sm'
            : 'text-[#D4E5DF] hover:bg-white/10'
        }
      `}
    >
      {active && (
        <span className="absolute -left-4 top-0 h-full w-1 rounded-r-full bg-[#62C9A6]" />
      )}

      <Icon className="h-5 w-5 shrink-0" />

      <span className="text-sm font-semibold">
        {label}
      </span>

      {badge && (
        <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-[#F45D68] px-1.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}

/* =========================================================
   DASHBOARD SECTION
   ========================================================= */

function DashboardSection() {
  return (
    <div className="space-y-5">

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          icon={Activity}
          title="Cognitive Activities"
          value="4 / 5"
          subtitle="Completed today"
          progress={80}
          accent="green"
        />

        <MetricCard
          icon={Activity}
          title="Physical Activity"
          value="1,250"
          subtitle="steps today"
          progress={62}
          accent="orange"
        />

        <MetricCard
          icon={Heart}
          title="Mood"
          value="Good"
          subtitle="+12% from yesterday"
          progress={88}
          accent="purple"
        />

        <MetricCard
          icon={Pill}
          title="Medications"
          value="2 / 3"
          subtitle="Taken today"
          progress={67}
          accent="orange"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1.25fr_0.85fr]">

        {/* Today's performance */}
        <Panel>
          <PanelHeader
            title="Today's Performance"
            subtitle="Cognitive engagement across today's activities"
          />

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={todayPerformance}
                margin={{
                  top: 15,
                  right: 10,
                  left: -15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#E6ECE8"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: '#667D75',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fill: '#82958E',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #DDE7E1',
                    boxShadow: '0 8px 30px rgba(20,60,50,.10)',
                  }}
                  formatter={(value) => [
                    `${value}%`,
                    'Score',
                  ]}
                />

                <Bar
                  dataKey="score"
                  fill="#53BFA0"
                  radius={[7, 7, 0, 0]}
                  barSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Activity breakdown */}
        <Panel>
          <PanelHeader
            title="Activity Breakdown"
            subtitle="How today's time was spent"
          />

          <div className="flex h-[300px] items-center gap-5">
            <div className="relative h-52 w-52 shrink-0">
              <div className="absolute inset-0 rounded-full border-[25px] border-[#52B895]" />

              <div
                className="
                  absolute inset-[25px]
                  rounded-full bg-white
                  shadow-inner
                "
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-semibold text-[#17372F]">
                  4h 20m
                </span>

                <span className="text-xs text-[#7A9088]">
                  Total Activity
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {activityBreakdown.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          [
                            '#43B78E',
                            '#8067D8',
                            '#5C9BE8',
                            '#EBAF4F',
                            '#A8B4B0',
                          ][index],
                      }}
                    />

                    <span className="text-[#536B63]">
                      {item.name}
                    </span>
                  </div>

                  <span className="font-semibold text-[#29483F]">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Overall analysis */}
        <Panel className="bg-[#E8F5EF]">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <Sparkles className="h-5 w-5 text-[#2F9B78]" />
            </div>

            <h3 className="font-display text-lg font-semibold text-[#17372F]">
              Overall Analysis
            </h3>
          </div>

          <p className="mt-5 text-[15px] leading-7 text-[#47655B]">
            Saanvi had a productive day with good engagement in
            cognitive activities and maintained a positive mood.
            Medication adherence is currently on track. Keep
            encouraging regular participation!
          </p>

          <div className="mt-6 rounded-xl bg-white/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#688078]">
                Overall wellness
              </span>

              <span className="font-display text-xl font-semibold text-[#2F8069]">
                78%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#D7E8E0]">
              <div
                className="h-full rounded-full bg-[#49B991]"
                style={{ width: '78%' }}
              />
            </div>
          </div>
        </Panel>
      </div>

      {/* Bottom cards */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* Recent activities */}
        <Panel>
          <PanelHeader
            title="Recent Activities"
            action="View All"
          />

          <div className="space-y-1">
            {recentActivities.map((activity) => {
              const Icon = activity.icon

              return (
                <div
                  key={activity.title}
                  className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-[#F4F8F5]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF5F0]">
                    <Icon className="h-5 w-5 text-[#2F8069]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#29483F]">
                      {activity.title}
                    </p>

                    <p className="truncate text-xs text-[#7A9088]">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-[#82958E]">
                    {activity.time}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Upcoming reminders */}
        <Panel>
          <PanelHeader
            title="Upcoming Reminders"
            action="View All"
          />

          <div className="space-y-1">
            {reminders.map((reminder) => {
              const Icon = reminder.icon

              return (
                <div
                  key={reminder.title}
                  className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-[#F4F8F5]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F0FF]">
                    <Icon className="h-5 w-5 text-[#8067D8]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#29483F]">
                      {reminder.title}
                    </p>

                    <p className="text-xs text-[#7A9088]">
                      {reminder.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-[#536B63]">
                    {reminder.time}
                  </span>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Quick actions */}
        <Panel>
          <PanelHeader title="Quick Actions" />

          <div className="grid grid-cols-2 gap-3">

            <QuickAction
              icon={Phone}
              label="Start a Call"
              className="bg-[#E4F5ED]"
            />

            <QuickAction
              icon={MessageSquare}
              label="Send a Message"
              className="bg-[#E8F2FF]"
            />

            <QuickAction
              icon={CalendarDays}
              label="Add Reminder"
              className="bg-[#F1E9FF]"
            />

            <QuickAction
              icon={Pill}
              label="Update Medication"
              className="bg-[#FFF0E4]"
            />

          </div>
        </Panel>
      </div>
    </div>
  )
}

/* =========================================================
   ANALYTICS SECTION
   ========================================================= */

function AnalyticsSection() {
  return (
    <div className="space-y-5">

      <Panel>
        <PanelHeader
          title="Monthly Performance"
          subtitle="Weekly cognitive performance across the current month"
        />

        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={weeklyPerformance}
              margin={{
                top: 20,
                right: 20,
                left: -10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="#E4ECE7"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="week"
                tick={{
                  fill: '#60776F',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fill: '#82958E',
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: '1px solid #DDE7E1',
                  boxShadow: '0 10px 30px rgba(20,60,50,.10)',
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  formatMetricName(String(name)),
                ]}
              />

              <Line
                type="monotone"
                dataKey="memory"
                name="memory"
                stroke="#35A77F"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#35A77F',
                }}
                activeDot={{ r: 7 }}
              />

              <Line
                type="monotone"
                dataKey="attention"
                name="attention"
                stroke="#E08D3C"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#E08D3C',
                }}
              />

              <Line
                type="monotone"
                dataKey="problemSolving"
                name="problemSolving"
                stroke="#8067D8"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#8067D8',
                }}
              />

              <Line
                type="monotone"
                dataKey="engagement"
                name="engagement"
                stroke="#5C9BE8"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: '#5C9BE8',
                }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap gap-5 border-t border-[#E8EEE9] pt-4">
          <LegendItem color="#35A77F" label="Memory" />
          <LegendItem color="#E08D3C" label="Attention" />
          <LegendItem color="#8067D8" label="Problem Solving" />
          <LegendItem color="#5C9BE8" label="Engagement" />
        </div>
      </Panel>

      {/* Analysis cards */}
      <div className="grid gap-5 md:grid-cols-3">

        <InsightCard
          title="Strongest area"
          value="Engagement"
          description="Engagement has shown consistent improvement throughout the month."
          icon={Sparkles}
        />

        <InsightCard
          title="Needs attention"
          value="Attention"
          description="Attention fluctuated during the month and may benefit from shorter activities."
          icon={AlertCircle}
        />

        <InsightCard
          title="Overall trend"
          value="+11%"
          description="Overall cognitive engagement improved compared with the beginning of the month."
          icon={LineChart}
        />

      </div>
    </div>
  )
}

/* =========================================================
   ALERTS SECTION
   ========================================================= */

function AlertsSection() {
  const performanceAlerts = alerts.filter(
    (alert) => alert.type === 'performance'
  )

  const medicalAlerts = alerts.filter(
    (alert) => alert.type === 'medical'
  )

  return (
    <div className="space-y-5">

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Performance */}
        <Panel>
          <PanelHeader
            title="Performance Alerts"
            subtitle="Cognitive and engagement changes"
          />

          <div className="space-y-3">
            {performanceAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
              />
            ))}
          </div>
        </Panel>

        {/* Medical */}
        <Panel>
          <PanelHeader
            title="Medical Alerts"
            subtitle="Medication and health-related reminders"
          />

          <div className="space-y-3">
            {medicalAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
              />
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#FFF4E8] p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C97827]" />

              <p className="text-xs leading-5 text-[#76583D]">
                These alerts are intended to support caregiver
                awareness and are not a medical diagnosis.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

/* =========================================================
   USER DETAILS SECTION
   ========================================================= */

function UserDetailsSection() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

      {/* Profile */}
      <Panel>
        <div className="flex flex-col items-center text-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DDEEE8] text-2xl font-bold text-[#2F8069]">
            SJ
          </div>

          <h3 className="mt-4 font-display text-2xl font-semibold text-[#17372F]">
            {patient.name}
          </h3>

          <p className="mt-1 text-sm text-[#71857E]">
            Patient · Age {patient.age}
          </p>

          <span className="mt-4 rounded-full bg-[#E5F4ED] px-3 py-1 text-xs font-semibold text-[#2F8069]">
            Active patient
          </span>
        </div>

        <div className="mt-7 border-t border-[#E5ECE8] pt-5">
          <DetailRow
            icon={Users}
            label="Relationship"
            value={patient.relationship}
          />

          <DetailRow
            icon={Phone}
            label="Phone"
            value={patient.phone}
          />

          <DetailRow
            icon={MessageSquare}
            label="Email"
            value={patient.email}
          />

          <DetailRow
            icon={Stethoscope}
            label="Language"
            value={patient.language}
          />
        </div>
      </Panel>

      {/* Personal information */}
      <Panel>
        <PanelHeader
          title="Personal Details"
          subtitle="Patient information available to the caregiver"
        />

        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">

          <DetailField
            label="Full Name"
            value={patient.name}
          />

          <DetailField
            label="Age"
            value={`${patient.age} years`}
          />

          <DetailField
            label="Gender"
            value={patient.gender}
          />

          <DetailField
            label="Location"
            value={patient.location}
          />

          <DetailField
            label="Preferred Language"
            value={patient.language}
          />

          <DetailField
            label="Connected Since"
            value={patient.joined}
          />

          <DetailField
            label="Emergency Contact"
            value={patient.emergencyContact}
          />

          <DetailField
            label="Emergency Phone"
            value={patient.emergencyPhone}
          />

        </div>

        <div className="mt-7 rounded-xl bg-[#F1F7F4] p-4">
          <div className="flex gap-3">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#2F8069]" />

            <div>
              <p className="text-sm font-semibold text-[#29483F]">
                Care note
              </p>

              <p className="mt-1 text-sm leading-6 text-[#668078]">
                Keep interactions calm and encouraging. The
                patient's preferred language is Assamese and voice
                assistance is enabled.
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

/* =========================================================
   MEDICATIONS SECTION
   ========================================================= */

function MedicationsSection() {
  return (
    <div className="space-y-5">

      <Panel>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#17372F]">
              Medication List
            </h3>

            <p className="mt-1 text-sm text-[#71857E]">
              Medicines and schedules set by the caregiver.
            </p>
          </div>

          <button
            type="button"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-[#2F8069] px-4 py-2.5
              text-sm font-semibold text-white
              hover:bg-[#286E5B]
            "
          >
            <Pill className="h-4 w-4" />
            Add Medication
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E3EBE6] text-left">
                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#82958E]">
                  Medication
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#82958E]">
                  Dosage
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#82958E]">
                  Frequency
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#82958E]">
                  Time
                </th>

                <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#82958E]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {medications.map((medication) => (
                <tr
                  key={medication.name}
                  className="border-b border-[#EDF1EE] last:border-0"
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E4]">
                        <Pill className="h-5 w-5 text-[#D77B32]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#29483F]">
                          {medication.name}
                        </p>

                        <p className="text-xs text-[#82958E]">
                          {medication.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-sm text-[#536B63]">
                    {medication.dosage}
                  </td>

                  <td className="px-3 py-4 text-sm text-[#536B63]">
                    {medication.frequency}
                  </td>

                  <td className="px-3 py-4 text-sm font-medium text-[#29483F]">
                    {medication.time}
                  </td>

                  <td className="px-3 py-4">
                    <MedicationStatus
                      status={medication.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Adherence */}
      <div className="grid gap-5 md:grid-cols-3">

        <MedicationStat
          label="Today's doses"
          value="2 / 3"
          progress={67}
        />

        <MedicationStat
          label="This week"
          value="18 / 21"
          progress={86}
        />

        <MedicationStat
          label="Monthly adherence"
          value="92%"
          progress={92}
        />

      </div>
    </div>
  )
}

/* =========================================================
   REUSABLE UI
   ========================================================= */

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`
        rounded-2xl border border-[#DEE8E2]
        bg-white p-5 shadow-[0_8px_30px_rgba(29,72,60,0.05)]
        sm:p-6
        ${className}
      `}
    >
      {children}
    </section>
  )
}

function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: string
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-[#17372F]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-xs text-[#82958E]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-[#2F8069]"
        >
          {action}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  progress,
  accent,
}: {
  icon: typeof Activity
  title: string
  value: string
  subtitle: string
  progress: number
  accent: 'green' | 'orange' | 'purple'
}) {
  const colors = {
    green: {
      bg: '#EAF7F1',
      icon: '#35A77F',
      bar: '#4DBD97',
    },
    orange: {
      bg: '#FFF2E2',
      icon: '#E39A3D',
      bar: '#E9A74A',
    },
    purple: {
      bg: '#F1EBFF',
      icon: '#8067D8',
      bar: '#8067D8',
    },
  }

  const current = colors[accent]

  return (
    <div className="rounded-2xl border border-[#DEE8E2] bg-white p-5 shadow-[0_8px_30px_rgba(29,72,60,0.05)]">
      <div className="flex items-start justify-between gap-3">

        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: current.bg }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: current.icon }}
              />
            </div>

            <p className="text-sm font-semibold text-[#29483F]">
              {title}
            </p>
          </div>

          <p className="mt-4 font-display text-2xl font-semibold text-[#17372F]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#82958E]">
            {subtitle}
          </p>
        </div>

        <div
          className="relative hidden h-14 w-14 items-center justify-center rounded-full sm:flex"
          style={{
            background: `conic-gradient(${current.bar} ${progress * 3.6}deg, #E8EEEA 0deg)`,
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#36564C]">
            {progress}%
          </div>
        </div>
      </div>

      {accent === 'orange' && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-[#E9ECE9]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: current.bar,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  className,
}: {
  icon: typeof Phone
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={`
        flex min-h-[90px] flex-col
        items-start justify-between rounded-xl
        p-4 text-left transition-transform
        hover:-translate-y-0.5
        ${className ?? ''}
      `}
    >
      <Icon className="h-5 w-5 text-[#356B5C]" />

      <span className="text-sm font-semibold text-[#29483F]">
        {label}
      </span>
    </button>
  )
}

function LegendItem({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#647A72]">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      {label}
    </div>
  )
}

function InsightCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: typeof Sparkles
}) {
  return (
    <Panel>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5F0]">
          <Icon className="h-5 w-5 text-[#2F8069]" />
        </div>

        <div>
          <p className="text-xs text-[#82958E]">
            {title}
          </p>

          <p className="font-display text-lg font-semibold text-[#17372F]">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#647A72]">
        {description}
      </p>
    </Panel>
  )
}

function AlertCard({
  alert,
}: {
  alert: {
    title: string
    description: string
    time: string
    severity: string
  }
}) {
  const high = alert.severity === 'high'
  const medium = alert.severity === 'medium'

  return (
    <div
      className={`
        rounded-xl border p-4
        ${
          high
            ? 'border-[#F2CCCC] bg-[#FFF7F7]'
            : medium
              ? 'border-[#F1DFC7] bg-[#FFF9F1]'
              : 'border-[#D9EAE2] bg-[#F6FBF8]'
        }
      `}
    >
      <div className="flex gap-3">

        <div
          className={`
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-full
            ${
              high
                ? 'bg-[#FBE1E1] text-[#C84E4E]'
                : medium
                  ? 'bg-[#FFF0D7] text-[#CC812B]'
                  : 'bg-[#DFF3E9] text-[#31906D]'
            }
          `}
        >
          <AlertCircle className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#29483F]">
            {alert.title}
          </p>

          <p className="mt-1 text-sm leading-5 text-[#6E827B]">
            {alert.description}
          </p>

          <p className="mt-2 text-xs text-[#8A9A94]">
            {alert.time}
          </p>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#EDF1EE] py-3 last:border-0">
      <Icon className="h-4 w-4 shrink-0 text-[#6A847A]" />

      <div className="min-w-0">
        <p className="text-xs text-[#8A9A94]">
          {label}
        </p>

        <p className="truncate text-sm font-medium text-[#29483F]">
          {value}
        </p>
      </div>
    </div>
  )
}

function DetailField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#879891]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#29483F]">
        {value}
      </p>
    </div>
  )
}

function MedicationStatus({
  status,
}: {
  status: string
}) {
  if (status === 'Taken') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3F5EC] px-3 py-1 text-xs font-semibold text-[#2E8A69]">
        <Check className="h-3.5 w-3.5" />
        Taken
      </span>
    )
  }

  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1DD] px-3 py-1 text-xs font-semibold text-[#C77A27]">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF2F0] px-3 py-1 text-xs font-semibold text-[#667C74]">
      <Clock3 className="h-3.5 w-3.5" />
      Upcoming
    </span>
  )
}

function MedicationStat({
  label,
  value,
  progress,
}: {
  label: string
  value: string
  progress: number
}) {
  return (
    <Panel>
      <p className="text-sm text-[#71857E]">
        {label}
      </p>

      <p className="mt-2 font-display text-2xl font-semibold text-[#17372F]">
        {value}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6ECE8]">
        <div
          className="h-full rounded-full bg-[#43B78E]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-[#82958E]">
        {progress}% adherence
      </p>
    </Panel>
  )
}

/* =========================================================
   HELPERS
   ========================================================= */

function getSectionTitle(section: Section) {
  switch (section) {
    case 'dashboard':
      return 'Dashboard'

    case 'analytics':
      return 'Analytics'

    case 'alerts':
      return 'Alerts'

    case 'user-details':
      return 'User Details'

    case 'medications':
      return 'Medications'

    default:
      return 'Dashboard'
  }
}

function formatMetricName(name: string) {
  switch (name) {
    case 'problemSolving':
      return 'Problem Solving'

    default:
      return name.charAt(0).toUpperCase() + name.slice(1)
  }
}