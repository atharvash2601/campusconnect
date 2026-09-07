'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  HeartHandshake,
  Home as HomeIcon,
  ImagePlus,
  Lightbulb,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  PenLine,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const requests = [
  {
    title: 'Need help with DSA Graph Problem',
    desc: 'I am stuck on this BFS problem. Can someone explain the approach?',
    tags: ['DSA', 'Programming'],
    name: 'Rahul Mehta',
    dept: 'TE IT',
    time: '12 min ago',
    replies: 4,
    icon: Code2,
    tint: 'blue'
  },
  {
    title: 'Need a Photographer for College Event',
    desc: 'We need a photographer for our cultural event this Saturday.',
    tags: ['Photography', 'Event'],
    name: 'Sneha Patil',
    dept: 'SE CSE',
    time: '28 min ago',
    replies: 7,
    icon: ImagePlus,
    tint: 'violet'
  },
  {
    title: 'Need React Developer for Project',
    desc: 'Looking for someone who knows React and can help with our final year project.',
    tags: ['React', 'Project'],
    name: 'Aditya Shah',
    dept: 'BE IT',
    time: '1 hr ago',
    replies: 3,
    icon: BookOpen,
    tint: 'green'
  }
]

const navItems = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'ask', label: 'Ask for Help', icon: CircleHelp },
  { id: 'help', label: 'Help Others', icon: HeartHandshake },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'profile', label: 'My Profile', icon: UserRound }
]

const leaders = [
  {
    rank: 1,
    name: 'Rahul Mehta',
    dept: 'TE IT',
    points: '1,250',
    solved: 42,
    initials: 'RM'
  },
  {
    rank: 2,
    name: 'Atharva Shinde',
    dept: 'BE IT',
    points: '1,120',
    solved: 38,
    initials: 'AS'
  },
  {
    rank: 3,
    name: 'Sneha Patil',
    dept: 'SE CSE',
    points: '980',
    solved: 31,
    initials: 'SP'
  },
  {
    rank: 4,
    name: 'Meera Joshi',
    dept: 'TE E&TC',
    points: '845',
    solved: 27,
    initials: 'MJ'
  }
]

function Avatar({
  initials,
  size = 'md'
}: {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <div className={`avatar avatar-${size}`}>
      {initials}
    </div>
  )
}

function RequestCard({
  request,
  onOpen
}: {
  request: typeof requests[number]
  onOpen: () => void
}) {
  const Icon = request.icon

  return (
    <article className="request-card">
      <div className={`request-icon ${request.tint}`}>
        <Icon size={20} />
      </div>

      <div className="request-body">
        <div className="request-heading">
          <h3>{request.title}</h3>

          <button
            className="icon-button"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <p>{request.desc}</p>

        <div className="tag-row">
          {request.tags.map((t) => (
            <span
              className="tag"
              key={t}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="request-footer">
          <div className="person">
            <Avatar
              initials={request.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
              size="sm"
            />

            <span>
              <strong>{request.name}</strong>

              <small>
                {request.dept} · {request.time}
              </small>
            </span>
          </div>

          <span className="reply-count">
            <MessageCircle size={15} />
            {request.replies} Answers
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpen}
          >
            View Request
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </article>
  )
}


/* =========================================================
   HEADER
========================================================= */

function Header({
  onMenu,
  onNavigate,
  userName
}: {
  onMenu: () => void
  onNavigate: (id: string) => void
  userName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="topbar-inner">

        <button
          className="mobile-menu icon-button"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        {/* CampusConnect Logo */}
        <button
          className="brand"
          onClick={() => onNavigate('home')}
        >
          <span className="brand-mark">
            <HeartHandshake size={18} />
          </span>

          <span>
            Campus <b>Connect</b>
          </span>
        </button>

        {/* Search */}
        <div className="global-search">
          <Search size={17} />

          <input
            placeholder="Search students, skills, or questions"
            aria-label="Search"
          />
        </div>

        {/* Right side */}
        <div className="top-actions">

          {/* Notifications */}
          <button
            className="notification-button"
            aria-label="Notifications"
            onClick={() => setOpen(!open)}
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {/* Profile */}
          <button
            className="profile-chip"
            onClick={() => onNavigate('profile')}
          >
            <Avatar
              initials="AK"
              size="sm"
            />

            <span>
              {userName}
            </span>
          </button>

        </div>
      </div>

      {/* Notification popup */}
      {open && (
        <div className="notification-popover">

          <div className="popover-title">
            <strong>
              Notifications
            </strong>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>

          <p>
            <i className="dot blue-dot" />
            Rahul answered your question.
          </p>

          <p>
            <i className="dot green-dot" />
            Your answer was marked helpful.
          </p>

          <p>
            <i className="dot purple-dot" />
            You moved to #5 on the leaderboard.
          </p>

        </div>
      )}
    </header>
  )
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  active,
  onNavigate
}: {
  active: string
  onNavigate: (id: string) => void
}) {
  return (
    <aside className="sidebar">

      <div className="side-label">
        Community
      </div>

      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item ${
            active === id ? 'active' : ''
          }`}
          onClick={() => onNavigate(id)}
        >
          <Icon size={18} />

          <span>
            {label}
          </span>

          {id === 'ask' && (
            <span className="nav-plus">
              <Plus size={14} />
            </span>
          )}
        </button>
      ))}

      <div className="sidebar-bottom">

        <div className="side-label">
          Your space
        </div>

        <button className="nav-item">
          <Settings2 size={18} />

          <span>
            Settings
          </span>
        </button>

        <div className="campus-note">
          <Sparkles size={16} />

          <p>
            <strong>
              Small acts matter.
            </strong>

            <br />

            Make someone&apos;s day a little easier.
          </p>
        </div>

      </div>
    </aside>
  )
}


/* =========================================================
   HOME
========================================================= */

function Home({
  go,
  open,
  userName
}: {
  go: (id: string) => void
  open: () => void
  userName: string
}) {
  return (
    <div className="content-shell">

      <div className="welcome-row">

        <div>
          <p className="eyebrow">
            WEDNESDAY, AUGUST 20
          </p>

          <h1>
            Good morning, {userName} <span>👋</span>
          </h1>

          <p className="subheading">
            How can you help today?
          </p>
        </div>

        <div className="streak">
          <Sparkles size={16} />

          <span>
            <strong>
              7 day
            </strong>

            <small>
              helping streak
            </small>
          </span>
        </div>

      </div>


      <div className="action-grid">

        <button
          className="big-action ask-action"
          onClick={() => go('ask')}
        >
          <span className="action-icon">
            <CircleHelp size={26} />
          </span>

          <span>
            <strong>
              Ask for Help
            </strong>

            <small>
              Get unstuck with help from a peer
            </small>
          </span>

          <ChevronRight />
        </button>


        <button
          className="big-action help-action"
          onClick={() => go('help')}
        >
          <span className="action-icon">
            <HeartHandshake size={26} />
          </span>

          <span>
            <strong>
              Help Someone
            </strong>

            <small>
              Share what you know with a classmate
            </small>
          </span>

          <ChevronRight />
        </button>

      </div>


      <div className="section-heading">

        <div>
          <h2>
            Recent Requests
          </h2>

          <p>
            Someone in your community might need you.
          </p>
        </div>

        <button
          className="text-button"
          onClick={() => go('help')}
        >
          View all
          <ChevronRight size={16} />
        </button>

      </div>


      <div className="request-list">

        {requests.map((r, i) => (
          <RequestCard
            key={r.title}
            request={r}
            onOpen={
              i === 0
                ? open
                : () => go('help')
            }
          />
        ))}

      </div>

    </div>
  )
}


/* =========================================================
   ASK
========================================================= */

function Ask({
  go
}: {
  go: (id: string) => void
}) {
  return (
    <div className="form-shell">

      <button
        className="back-button"
        onClick={() => go('home')}
      >
        <ChevronRight
          className="back-chevron"
          size={17}
        />

        Back to home
      </button>


      <div className="form-intro">

        <span className="form-icon">
          <PenLine size={21} />
        </span>

        <div>

          <p className="eyebrow">
            ASK YOUR COMMUNITY
          </p>

          <h1>
            What do you need help with?
          </h1>

          <p>
            Give a little context so the right person can find you.
          </p>

        </div>

      </div>


      <div className="form-card">

        <label>
          Title

          <input
            placeholder="e.g. Need help understanding recursion"
          />
        </label>


        <label>
          Description

          <textarea
            placeholder="Explain your problem or requirement..."
            rows={5}
          />
        </label>


        <div className="form-two">

          <label>
            Category

            <select defaultValue="">
              <option
                value=""
                disabled
              >
                Select a category
              </option>

              <option>
                Programming
              </option>

              <option>
                Academics
              </option>

              <option>
                Design
              </option>

              <option>
                Projects
              </option>

              <option>
                Placements
              </option>

              <option>
                Other
              </option>
            </select>
          </label>


          <label>
            Optional deadline

            <input type="date" />
          </label>

        </div>


        <div className="attachment-row">

          <button className="attachment-button">
            <Paperclip size={17} />

            Add attachment
          </button>

          <span>
            PDF, image, or link · max 10 MB
          </span>

        </div>


        <div className="form-actions">

          <Button
            variant="ghost"
            onClick={() => go('home')}
          >
            Cancel
          </Button>

          <Button
            onClick={() => go('home')}
          >
            <Send data-icon="inline-start" />
            Post Request
          </Button>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   HELP
========================================================= */

function Help({
  open
}: {
  open: () => void
}) {
  const [filter, setFilter] = useState('All')

  const filters = [
    'All',
    'Programming',
    'Academics',
    'Projects',
    'Design',
    'Photography'
  ]

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? requests
        : requests.filter((r) =>
            r.tags.includes(filter)
          ),
    [filter]
  )

  return (
    <div className="content-shell">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            LEND A HAND
          </p>

          <h1>
            Find someone you can help
          </h1>

          <p className="subheading">
            Your knowledge could be exactly what someone needs today.
          </p>

        </div>

      </div>


      <div className="help-toolbar">

        <div className="inline-search">

          <Search size={17} />

          <input
            placeholder="Search requests"
          />

        </div>


        <div className="filter-row">

          {filters.map((f) => (
            <button
              key={f}
              className={
                filter === f
                  ? 'selected'
                  : ''
              }
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}

        </div>

      </div>


      <div className="request-list">

        {filtered.map((r) => (
          <RequestCard
            key={r.title}
            request={r}
            onOpen={open}
          />
        ))}

      </div>

    </div>
  )
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  go
}: {
  go: (id: string) => void
}) {
  return (
    <div className="detail-shell">

      <button
        className="back-button"
        onClick={() => go('home')}
      >

        <ChevronRight
          className="back-chevron"
          size={17}
        />

        Back to requests

      </button>


      <article className="detail-card">

        <div className="detail-top">

          <div className="request-icon blue">
            <Code2 size={21} />
          </div>

          <div>

            <div className="tag-row">

              <span className="tag">
                DSA
              </span>

              <span className="open-badge">
                Open
              </span>

            </div>

            <h1>
              Need help with DSA Graph Problem
            </h1>

            <p className="detail-meta">

              <Clock3 size={14} />

              Posted 12 minutes ago in Programming

            </p>

          </div>

        </div>


        <div className="detail-person">

          <Avatar
            initials="RM"
            size="md"
          />

          <span>

            <strong>
              Rahul Mehta
            </strong>

            <small>
              TE IT · Third Year · 120 reputation
            </small>

          </span>

          <Button
            variant="outline"
            size="sm"
          >
            View profile
          </Button>

        </div>


        <div className="question">

          <h2>
            Question
          </h2>

          <p>
            I am stuck on this BFS problem. I understand the basic traversal, but I&apos;m not sure how to track the shortest path when there are multiple edges. Can someone explain the approach?
          </p>

          <div className="code-snippet">

            <span>
              graph = {'{'} A: [B, C], B: [D], C: [D] {'}'}
            </span>

            <span>
              queue = [start]
            </span>

          </div>

        </div>


        <div className="answers-heading">

          <h2>
            Answers <span>4</span>
          </h2>

          <button className="text-button">
            Oldest first
            <ChevronRight size={15} />
          </button>

        </div>


        {[
          [
            'AS',
            'Atharva Shinde',
            'BE IT · 1,120 reputation',
            'For shortest paths in an unweighted graph, BFS is perfect because it visits nodes level by level. Keep a parent map to remember where each node came from.'
          ],
          [
            'MJ',
            'Meera Joshi',
            'TE E&TC · 845 reputation',
            'Also remember to mark a node as visited when you add it to the queue, not when you remove it. This prevents duplicate entries.'
          ]
        ].map((a, i) => (

          <div
            className={`answer ${
              i === 0
                ? 'accepted'
                : ''
            }`}
            key={a[0]}
          >

            <div className="answer-header">

              <Avatar
                initials={a[0]}
                size="sm"
              />

              <span>

                <strong>
                  {a[1]}
                </strong>

                <small>
                  {a[2]}
                </small>

              </span>

              {i === 0 && (
                <span className="accepted-badge">

                  <Check size={14} />

                  Accepted Answer

                </span>
              )}

            </div>


            <p>
              {a[3]}
            </p>


            <div className="answer-actions">

              <button>

                <HeartHandshake size={16} />

                Helpful

                <span>
                  +5
                </span>

              </button>

              <button>

                <MessageCircle size={16} />

                Reply

              </button>

            </div>

          </div>

        ))}


        <div className="answer-composer">

          <Avatar
            initials="AS"
            size="sm"
          />

          <input
            placeholder="Share an answer or helpful resource..."
          />

          <Button
            size="icon"
            aria-label="Send answer"
          >
            <Send />
          </Button>

        </div>

      </article>

    </div>
  )
}


/* =========================================================
   LEADERBOARD
========================================================= */

function Leaderboard() {

  const [tab, setTab] =
    useState('This Week')

  return (
    <div className="content-shell narrow">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            RECOGNITION
          </p>

          <h1>
            Top Helpers
          </h1>

          <p className="subheading">
            Celebrating the students who make XIE better for everyone.
          </p>

        </div>

        <div className="leaderboard-icon">
          <Trophy size={23} />
        </div>

      </div>


      <div className="leaderboard-card">

        <div className="tabs">

          {[
            'This Week',
            'This Month',
            'All Time'
          ].map((t) => (

            <button
              key={t}
              className={
                tab === t
                  ? 'active'
                  : ''
              }
              onClick={() => setTab(t)}
            >
              {t}
            </button>

          ))}

        </div>


        {leaders.map((s) => (

          <div
            className="leader-row"
            key={s.rank}
          >

            <span
              className={`rank rank-${s.rank}`}
            >
              {s.rank}
            </span>

            <Avatar
              initials={s.initials}
              size="md"
            />

            <span className="leader-name">

              <strong>
                {s.name}
              </strong>

              <small>
                {s.dept}
              </small>

            </span>

            <span className="leader-stat">

              <strong>
                {s.points}
              </strong>

              <small>
                points
              </small>

            </span>

            <span className="leader-stat hide-mobile">

              <strong>
                {s.solved}
              </strong>

              <small>
                solved
              </small>

            </span>

            <ChevronRight size={17} />

          </div>

        ))}

      </div>


      <div className="points-card">

        <div className="points-icon">
          <Lightbulb size={21} />
        </div>

        <div>

          <h3>
            How reputation works
          </h3>

          <p>
            Answer a question <b>+10</b> · Helpful mark <b>+5</b> · Accepted answer <b>+50</b>
          </p>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   PROFILE
========================================================= */

function Profile({
  user
}: {
  user: {
    name: string
    email: string
    department: string
    year: string
  } | null
}) {

  const profileName = user?.name || 'Student'
  const initials = profileName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const departmentShort =
    user?.department === 'Information Technology'
      ? 'IT'
      : user?.department === 'Computer Engineering'
        ? 'CSE'
        : user?.department === 'Electronics & Telecommunication'
          ? 'E&TC'
          : user?.department === 'Mechanical Engineering'
            ? 'Mechanical'
            : ''

  return (
    <div className="content-shell profile-shell">

      <div className="profile-cover" />


      <div className="profile-card">

        <div className="profile-main">

          <Avatar
            initials={initials || 'ST'}
            size="lg"
          />

          <div>

            <h1>
              {profileName}
            </h1>

            <p>
              {departmentShort
                ? `${departmentShort} · ${user?.year || ''} Year · Xavier Institute of Engineering`
                : `${user?.year || ''} Year · Xavier Institute of Engineering`}
            </p>

            <span className="top-helper">

              <Trophy size={14} />

              Top Helper

            </span>

          </div>

          <Button variant="outline">
            Edit profile
          </Button>

        </div>


        <p className="bio">
          Building things, learning in public, and always happy to help with frontend projects.
        </p>


        <div className="skill-row">

          <span>
            React
          </span>

          <span>
            TypeScript
          </span>

          <span>
            UI Design
          </span>

          <span>
            Mentoring
          </span>

        </div>


        <div className="profile-stats">

          <div>

            <strong>
              1,120
            </strong>

            <small>
              Reputation
            </small>

          </div>

          <div>

            <strong>
              38
            </strong>

            <small>
              Problems solved
            </small>

          </div>

          <div>

            <strong>
              12
            </strong>

            <small>
              Accepted answers
            </small>

          </div>

          <div>

            <strong>
              7
            </strong>

            <small>
              Resources shared
            </small>

          </div>

        </div>

      </div>


      <div className="section-heading">

        <div>

          <h2>
            Recent helpful answers
          </h2>

          <p>
            Contributions that made a difference.
          </p>

        </div>

      </div>


      <div className="mini-answer">

        <div className="mini-answer-icon">
          <Code2 size={18} />
        </div>

        <div>

          <strong>
            Need help with DSA Graph Problem
          </strong>

          <p>
            For shortest paths in an unweighted graph, BFS is perfect because it visits nodes level by level.
          </p>

          <span>
            Marked accepted · 12 min ago
          </span>

        </div>

        <ChevronRight size={17} />

      </div>

    </div>
  )
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function Page() {

  const [active, setActive] =
    useState('home')

  const [detail, setDetail] =
    useState(false)

  const [mobile, setMobile] =
    useState(false)

  const [user, setUser] = useState<{
    name: string
    email: string
    department: string
    year: string
  } | null>(null)

  const userName = user?.name
    .trim()
    .split(' ')[0] || 'Student'

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me')

        if (!response.ok) {
          return
        }

        const result = await response.json()

        if (result.success && result.user) {
          setUser(result.user)
        }
      } catch (error) {
        console.error(
          'Failed to get current user:',
          error
        )
      }
    }

    getCurrentUser()
  }, [])


  const go = (id: string) => {

    setActive(id)

    setDetail(false)

    setMobile(false)

  }


  const content = detail
    ? <Detail go={go} />

    : active === 'home'
      ? (
        <Home
          go={go}
          open={() => setDetail(true)}
          userName={userName}
        />
      )

      : active === 'ask'
        ? <Ask go={go} />

        : active === 'help'
          ? (
            <Help
              open={() => setDetail(true)}
            />
          )

          : active === 'leaderboard'
            ? <Leaderboard />

            : <Profile user={user} />


  return (
    <div className="app-shell">

      <Header
        onMenu={() =>
          setMobile(!mobile)
        }
        onNavigate={go}
        userName={userName}
      />


      <div
        className={`app-layout ${
          mobile
            ? 'mobile-open'
            : ''
        }`}
      >

        <Sidebar
          active={active}
          onNavigate={go}
        />

        <main>
          {content}
        </main>

      </div>


      <nav className="bottom-nav">

        {navItems.map(
          ({
            id,
            label,
            icon: Icon
          }) => (

            <button
              key={id}
              className={
                active === id
                  ? 'active'
                  : ''
              }
              onClick={() => go(id)}
            >

              <Icon size={19} />

              <span>
                {id === 'ask'
                  ? 'Ask'
                  : id === 'help'
                    ? 'Help'
                    : label.replace(
                        'My ',
                        ''
                      )}
              </span>

            </button>

          )
        )}

      </nav>

    </div>
  )
}