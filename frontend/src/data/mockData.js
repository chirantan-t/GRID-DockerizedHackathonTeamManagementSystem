// ===================================================================
// GRID - COMPREHENSIVE MOCK DATA REPOSITORY
// Meticulously matched to reference UI designs
// ===================================================================

export const MOCK_USERS = [
  {
    id: 1,
    name: 'Chirantan Tondale',
    username: 'chirantan',
    email: 'chirantan@vit.edu.in',
    role: 'TEAM',
    teamRole: 'Team Lead',
    joinedOn: '10 Nov 2026',
    status: 'Active',
    avatar: 'CT'
  },
  {
    id: 2,
    name: 'Aarav Deshmukh',
    username: 'aarav',
    email: 'aarav.deshmukh@vit.edu.in',
    role: 'TEAM',
    teamRole: 'Developer',
    joinedOn: '09 Nov 2026',
    status: 'Active',
    avatar: 'AD'
  },
  {
    id: 3,
    name: 'Meera Joshi',
    username: 'meera',
    email: 'meera.joshi@vit.edu.in',
    role: 'TEAM',
    teamRole: 'UI/UX Designer',
    joinedOn: '08 Nov 2026',
    status: 'Active',
    avatar: 'MJ'
  },
  {
    id: 4,
    name: 'Rohit Patil',
    username: 'rohit',
    email: 'rohit.patil@vit.edu.in',
    role: 'TEAM',
    teamRole: 'ML Engineer',
    joinedOn: '08 Nov 2026',
    status: 'Inactive',
    avatar: 'RP'
  },
  {
    id: 5,
    name: 'VIT Events',
    username: 'vitevents',
    email: 'vitevents@vit.edu.in',
    role: 'ORGANIZER',
    hackathonsCount: 6,
    joinedOn: '15 Oct 2026',
    status: 'Active',
    avatar: 'VE'
  },
  {
    id: 6,
    name: 'CodeCell',
    username: 'codecell',
    email: 'codecell@vit.edu.in',
    role: 'ORGANIZER',
    hackathonsCount: 4,
    joinedOn: '20 Oct 2026',
    status: 'Active',
    avatar: 'CC'
  },
  {
    id: 7,
    name: 'Tech Society',
    username: 'techsoc',
    email: 'techsoc@vit.edu.in',
    role: 'ORGANIZER',
    hackathonsCount: 3,
    joinedOn: '24 Oct 2026',
    status: 'Active',
    avatar: 'TS'
  },
  {
    id: 8,
    name: 'Innovators Club',
    username: 'innovators',
    email: 'innovators@vit.edu.in',
    role: 'ORGANIZER',
    hackathonsCount: 2,
    joinedOn: '28 Oct 2026',
    status: 'Inactive',
    avatar: 'IC'
  },
  {
    id: 9,
    name: 'Super Admin',
    username: 'superadmin',
    email: 'admin@grid.dev',
    role: 'SUPER_ADMIN',
    joinedOn: '01 Oct 2026',
    status: 'Active',
    avatar: 'SA'
  }
];

export const MOCK_HACKATHONS = [
  {
    id: 'innovatex-2026',
    title: 'InnovateX 2026',
    tagline: 'A 36-hour national hackathon on real-world tech challenges.',
    description: 'InnovateX 2026 brings together bright minds to solve real-world problems through technology, collaboration, and creativity. Focus on AI/ML, Cloud Infrastructure, and Sustainable Computing.',
    status: 'Ongoing',
    registrationStatus: 'Registration Open',
    dates: '15 – 16 Nov 2026 (36 Hours)',
    teamSize: '2 – 4 Members',
    prizePool: '₹50,000',
    category: 'AI / ML',
    mode: 'Offline – VIT, Mumbai',
    registeredTeams: 48,
    submissionsCount: 30,
    organizer: 'VIT Events',
    organizerEmail: 'vitevents@vit.edu.in',
    featured: true,
    progressPercent: 60
  },
  {
    id: 'buildforgood',
    title: 'BuildForGood',
    tagline: 'Build technology solutions for a sustainable tomorrow.',
    description: 'Dedicated to UN Sustainable Development Goals. Hack hardware, software, and generative algorithms to tackle environmental monitoring and renewable microgrids.',
    status: 'Registration Open',
    registrationStatus: 'Registration Open',
    dates: '22 – 23 Nov 2026',
    teamSize: '2 – 5 Members',
    prizePool: '₹75,000',
    category: 'Sustainability & IoT',
    mode: 'Online',
    registeredTeams: 32,
    submissionsCount: 14,
    organizer: 'CodeCell',
    organizerEmail: 'codecell@vit.edu.in',
    featured: true,
    progressPercent: 20
  },
  {
    id: 'aiverse-hackathon',
    title: 'AIverse Hackathon',
    tagline: 'Exploring autonomous agents and LLM orchestration.',
    description: 'Push the frontiers of multi-agent AI, automated reasoning, and edge inference systems with leading industry mentors.',
    status: 'Upcoming',
    registrationStatus: 'Upcoming',
    dates: '05 – 07 Dec 2026',
    teamSize: '1 – 4 Members',
    prizePool: '₹1,00,000',
    category: 'AI / Agents',
    mode: 'Online',
    registeredTeams: 12,
    submissionsCount: 0,
    organizer: 'Tech Society',
    organizerEmail: 'techsoc@vit.edu.in',
    featured: false,
    progressPercent: 0
  },
  {
    id: 'finsolve-2-0',
    title: 'FinSolve 2.0',
    tagline: 'Next-generation algorithmic micro-lending and fraud detection.',
    description: 'Decentralized credit scoring, high-frequency fraud detection pipelines, and zero-knowledge identity verification.',
    status: 'Completed',
    registrationStatus: 'Completed',
    dates: '10 – 12 Oct 2026',
    teamSize: '2 – 4 Members',
    prizePool: '₹60,000',
    category: 'FinTech',
    mode: 'Offline',
    registeredTeams: 65,
    submissionsCount: 58,
    organizer: 'Innovators Club',
    organizerEmail: 'innovators@vit.edu.in',
    featured: false,
    progressPercent: 100
  },
  {
    id: 'cybershield-2026',
    title: 'CyberShield 2026',
    tagline: 'Zero-trust architecture and automated threat containment.',
    description: 'Build automated SOC telemetry pipelines, eBPF network defense, and zero-trust authentication harnesses for distributed cloud clusters.',
    status: 'Registration Open',
    registrationStatus: 'Registration Open',
    dates: '18 – 20 Dec 2026',
    teamSize: '2 – 4 Members',
    prizePool: '₹80,000',
    category: 'CyberSecurity',
    mode: 'Online',
    registeredTeams: 28,
    submissionsCount: 0,
    organizer: 'InfoSec Guild',
    organizerEmail: 'infosec@vit.edu.in',
    featured: true,
    progressPercent: 10
  },
  {
    id: 'healthpulse-hack',
    title: 'HealthPulse Hack',
    tagline: 'AI diagnostic engines and decentralized health telemetry.',
    description: 'Transform preventive medicine with quantized edge models, HIPAA-compliant federated learning, and real-time biometric telemetry.',
    status: 'Upcoming',
    registrationStatus: 'Upcoming',
    dates: '10 – 12 Jan 2027',
    teamSize: '2 – 5 Members',
    prizePool: '₹1,20,000',
    category: 'Healthcare AI',
    mode: 'Hybrid – VIT, Mumbai',
    registeredTeams: 15,
    submissionsCount: 0,
    organizer: 'BioTech Society',
    organizerEmail: 'biotech@vit.edu.in',
    featured: false,
    progressPercent: 0
  }
];

export const MOCK_TEAMS = [
  {
    id: 'team-alpha',
    name: 'Team Alpha',
    tag: 'ALPHA',
    hackathonId: 'innovatex-2026',
    hackathonName: 'InnovateX 2026',
    projectTitle: 'Smart City Waste Management',
    projectDescription: 'A smart, AI-driven system for efficient urban waste collection and segregation.',
    domain: 'AI / ML',
    membersCount: 4,
    lead: 'Chirantan Tondale',
    status: 'Approved',
    registeredOn: '10 Nov 2026',
    progress: 60,
    techStack: ['Python', 'React', 'FastAPI', 'PostgreSQL'],
    repoUrl: 'https://github.com/teamalpha/scwm',
    docsUrl: 'https://docs.teamalpha.dev',
    members: [
      { name: 'Chirantan Tondale', role: 'Team Lead', email: 'chirantan@vit.edu.in', avatar: 'CT' },
      { name: 'Aarav Deshmukh', role: 'Developer', email: 'aarav.deshmukh@vit.edu.in', avatar: 'AD' },
      { name: 'Meera Joshi', role: 'UI/UX Designer', email: 'meera.joshi@vit.edu.in', avatar: 'MJ' },
      { name: 'Rohit Patil', role: 'ML Engineer', email: 'rohit.patil@vit.edu.in', avatar: 'RP' }
    ]
  },
  {
    id: 'byte-brigade',
    name: 'Byte Brigade',
    tag: 'BYTE',
    hackathonId: 'innovatex-2026',
    hackathonName: 'InnovateX 2026',
    projectTitle: 'EduLink',
    projectDescription: 'Peer-to-peer decentralized study network with verified proof-of-knowledge credentials.',
    domain: 'Web3 / Education',
    membersCount: 4,
    lead: 'Siddharth Rao',
    status: 'Pending',
    registeredOn: '10 Nov 2026',
    progress: 45,
    techStack: ['Solidity', 'Next.js', 'Ethers.js'],
    repoUrl: 'https://github.com/bytebrigade/edulink',
    docsUrl: 'https://edulink.network',
    members: [
      { name: 'Siddharth Rao', role: 'Team Lead', email: 'sid@vit.edu.in', avatar: 'SR' },
      { name: 'Ananya Verma', role: 'Smart Contract Dev', email: 'ananya@vit.edu.in', avatar: 'AV' }
    ]
  },
  {
    id: 'code-crafters',
    name: 'CodeCrafters',
    tag: 'CC',
    hackathonId: 'innovatex-2026',
    hackathonName: 'InnovateX 2026',
    projectTitle: 'GreenRoute',
    projectDescription: 'Real-time carbon emissions telemetry optimizer for logistics delivery fleets.',
    domain: 'Sustainability',
    membersCount: 3,
    lead: 'Vikram Mehta',
    status: 'Approved',
    registeredOn: '09 Nov 2026',
    progress: 80,
    techStack: ['Go', 'Flutter', 'Kafka', 'TimescaleDB'],
    repoUrl: 'https://github.com/codecrafters/greenroute',
    docsUrl: 'https://greenroute.app',
    members: [
      { name: 'Vikram Mehta', role: 'Team Lead', email: 'vikram@vit.edu.in', avatar: 'VM' }
    ]
  },
  {
    id: 'null-pointers',
    name: 'Null Pointers',
    tag: 'NULL',
    hackathonId: 'innovatex-2026',
    hackathonName: 'InnovateX 2026',
    projectTitle: 'BioMonitor X',
    projectDescription: 'Low-latency wearable cardiac anomaly detector utilizing quantized edge neural networks.',
    domain: 'HealthTech',
    membersCount: 3,
    lead: 'Karan Sen',
    status: 'Approved',
    registeredOn: '09 Nov 2026',
    progress: 50,
    techStack: ['C++', 'TensorFlow Lite', 'React Native'],
    repoUrl: 'https://github.com/nullpointers/biomonitor',
    docsUrl: 'https://biomonitor.tech',
    members: [
      { name: 'Karan Sen', role: 'Team Lead', email: 'karan@vit.edu.in', avatar: 'KS' }
    ]
  }
];

export const MOCK_SUBMISSIONS = [
  {
    id: 'sub-01',
    teamId: 'team-alpha',
    teamName: 'Team Alpha',
    hackathonId: 'innovatex-2026',
    hackathonTitle: 'InnovateX 2026',
    projectTitle: 'Smart City Waste Management',
    submissionName: 'Final Build v1.0',
    status: 'Submitted',
    submittedOn: '15 Nov 2026, 11:42 PM',
    repoUrl: 'https://github.com/teamalpha/scwm',
    demoUrl: 'https://scwm-demo.vercel.app',
    videoUrl: 'https://youtu.be/dummy-scwm',
    scores: {
      innovation: 27,
      technical: 25,
      impact: 18,
      presentation: 17,
      total: 87
    }
  },
  {
    id: 'sub-02',
    teamId: 'byte-brigade',
    teamName: 'Byte Brigade',
    hackathonId: 'innovatex-2026',
    hackathonTitle: 'InnovateX 2026',
    projectTitle: 'EduLink',
    submissionName: 'Beta Release Candidate',
    status: 'Submitted',
    submittedOn: '15 Nov 2026, 10:19 PM',
    repoUrl: 'https://github.com/bytebrigade/edulink',
    demoUrl: 'https://edulink.testnet',
    scores: {
      innovation: 24,
      technical: 26,
      impact: 17,
      presentation: 15,
      total: 82
    }
  },
  {
    id: 'sub-03',
    teamId: 'code-crafters',
    teamName: 'CodeCrafters',
    hackathonId: 'innovatex-2026',
    hackathonTitle: 'InnovateX 2026',
    projectTitle: 'GreenRoute',
    submissionName: 'GreenRoute Core',
    status: 'Submitted',
    submittedOn: '15 Nov 2026, 09:57 PM',
    repoUrl: 'https://github.com/codecrafters/greenroute',
    demoUrl: 'https://greenroute.live',
    scores: {
      innovation: 26,
      technical: 27,
      impact: 19,
      presentation: 18,
      total: 90
    }
  },
  {
    id: 'sub-04',
    teamId: 'team-alpha',
    teamName: 'Team Alpha',
    hackathonId: 'buildforgood',
    hackathonTitle: 'BuildForGood',
    projectTitle: 'EcoGrid',
    submissionName: 'Initial Proposal',
    status: 'Draft',
    submittedOn: 'In Progress',
    repoUrl: 'https://github.com/teamalpha/ecogrid',
    demoUrl: ''
  }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    hackathonTitle: 'InnovateX 2026',
    title: 'Final Submission Reminder',
    time: '4 hours ago',
    type: 'urgent',
    content: 'Reminder: The final code repository and video demo submission deadline is tonight at 11:59 PM sharp. Late pull requests will not be scored.'
  },
  {
    id: 'ann-2',
    hackathonTitle: 'InnovateX 2026',
    title: 'Shortlisted Teams Announced',
    time: '1 day ago',
    type: 'normal',
    content: 'The jury has concluded preliminary screening. Top 15 teams across tracks are now live on the evaluation board for live pitch sessions.'
  },
  {
    id: 'ann-3',
    hackathonTitle: 'InnovateX 2026',
    title: 'Hackathon Kickoff Briefing',
    time: '3 days ago',
    type: 'normal',
    content: 'The opening ceremony and keynote by engineering leadership begins tomorrow at 10:00 AM in the Main Auditorium and Zoom Stream 1.'
  },
  {
    id: 'ann-4',
    hackathonTitle: 'Platform',
    title: 'Platform Maintenance Notice',
    time: '5 days ago',
    type: 'alert',
    content: 'GRID database index maintenance scheduled on Sunday from 02:00 AM – 03:00 AM IST. All running sessions will be preserved without interruption.'
  }
];

export const MOCK_SUPERADMIN_METRICS = {
  totalOrganizers: 12,
  totalHackathons: 36,
  totalUsers: '2,842',
  platformActivity: '76%',
  userGrowthTrend: '+12%',
  hackathonsTrend: '+20%',
  teamsTrend: '+18%',
  submissionsTrend: '+24%',
  participationByRole: [
    { name: 'Participants', value: 74, color: '#00ff66' },
    { name: 'Team Leads', value: 17, color: '#06b6d4' },
    { name: 'Organizers', value: 6, color: '#8b5cf6' },
    { name: 'Super Admin', value: 3, color: '#f59e0b' }
  ],
  systemHealth: [
    { service: 'Web Application', status: 'Operational', uptime: '99.99%' },
    { service: 'Database Cluster (MySQL 8)', status: 'Operational', uptime: '99.98%' },
    { service: 'File & Artifact Storage', status: 'Operational', uptime: '100.0%' },
    { service: 'Authentication & RBAC', status: 'Operational', uptime: '99.99%' },
    { service: 'Email & Notification Dispatcher', status: 'Operational', uptime: '99.95%' }
  ],
  performanceMetrics: {
    uptime: '99.98%',
    responseTime: '312 ms',
    activeSessions: '1,428',
    serverLoad: '34%'
  }
};


// ===================================================================
// NAMED EXPORTS & ALIASES FOR ROLE EXPERIENCES
// ===================================================================

export const mockHackathons = MOCK_HACKATHONS;
export const mockTeams = MOCK_TEAMS;
export const mockSubmissions = MOCK_SUBMISSIONS;
export const mockAnnouncements = MOCK_ANNOUNCEMENTS;

export const mockOrganizerStats = {
  totalHackathons: 6,
  registeredTeams: 128,
  submissions: 84,
  ongoing: 3
};

export const mockRegisteredTeams = [
  { id: 't1', name: 'Team Alpha', members: 4, status: 'Approved', registeredOn: '10 Nov 2026' },
  { id: 't2', name: 'Byte Brigade', members: 4, status: 'Pending', registeredOn: '10 Nov 2026' },
  { id: 't3', name: 'Null Pointers', members: 3, status: 'Approved', registeredOn: '09 Nov 2026' },
  { id: 't4', name: 'CodeCrafters', members: 4, status: 'Approved', registeredOn: '09 Nov 2026' },
  { id: 't5', name: 'DevOpsDynasty', members: 3, status: 'Pending', registeredOn: '08 Nov 2026' }
];

export const mockSubmissionsList = [
  { id: 's1', team: 'Team Alpha', projectTitle: 'Smart City Waste Management', submittedOn: '15 Nov, 11:42 PM', status: 'Submitted' },
  { id: 's2', team: 'Byte Brigade', projectTitle: 'EduLink', submittedOn: '15 Nov, 10:19 PM', status: 'Submitted' },
  { id: 's3', team: 'CodeCrafters', projectTitle: 'GreenRoute', submittedOn: '15 Nov, 09:57 PM', status: 'Submitted' },
  { id: 's4', team: 'DevOpsDynasty', projectTitle: 'AutoDeploy Pro', submittedOn: '15 Nov, 09:12 PM', status: 'Submitted' }
];

export const mockEvaluationTeams = [
  { id: 'e1', name: 'Team Alpha', projectTitle: 'Smart City Waste Management', initialScores: { innovation: 27, technical: 25, impact: 18, presentation: 17 } },
  { id: 'e2', name: 'Byte Brigade', projectTitle: 'EduLink', initialScores: { innovation: 24, technical: 26, impact: 16, presentation: 18 } },
  { id: 'e3', name: 'CodeCrafters', projectTitle: 'GreenRoute', initialScores: { innovation: 28, technical: 22, impact: 19, presentation: 15 } },
  { id: 'e4', name: 'DevOpsDynasty', projectTitle: 'AutoDeploy Pro', initialScores: { innovation: 25, technical: 28, impact: 17, presentation: 16 } }
];

export const mockAnalyticsRegistrationTrend = [
  { date: 'Oct 24', count: 20 },
  { date: 'Oct 28', count: 45 },
  { date: 'Nov 1', count: 68 },
  { date: 'Nov 5', count: 95 },
  { date: 'Nov 9', count: 128 }
];

export const mockTeamStatusDistribution = [
  { name: 'Approved', value: 56, color: '#00ff66' },
  { name: 'Pending', value: 24, color: '#f59e0b' },
  { name: 'Rejected', value: 20, color: '#ff4d4f' }
];

export const mockOrganizerAnnouncements = [
  { id: 1, title: 'Final Submission Reminder', hackathon: 'InnovateX 2026', time: '4h ago', content: 'Reminder: The final submission deadline is tonight at 11:59 PM. Please verify your repository and video pitch link.' },
  { id: 2, title: 'Shortlisted Teams Announced', hackathon: 'BuildForGood', time: '1 day ago', content: 'The shortlisted teams for the mentorship round are now live in the teams tab.' },
  { id: 3, title: 'Hackathon Kickoff', hackathon: 'InnovateX 2026', time: '3 days ago', content: 'InnovateX 2026 officially begins tomorrow at 10:00 AM. Opening ceremony streaming link is live.' }
];

export const mockSuperAdminStats = {
  organizers: 12,
  hackathons: 36,
  totalUsers: '2,842',
  platformActivity: '76%'
};

export const mockPlatformActivityData = [
  { day: 'Mon', activity: 45 },
  { day: 'Tue', activity: 60 },
  { day: 'Wed', activity: 55 },
  { day: 'Thu', activity: 80 },
  { day: 'Fri', activity: 70 },
  { day: 'Sat', activity: 95 },
  { day: 'Sun', activity: 88 }
];

export const mockOrganizersList = [
  { id: 1, name: 'VIT Events', email: 'vitevents@vit.edu.in', hackathons: 6, status: 'Active' },
  { id: 2, name: 'CodeCell', email: 'codecell@vit.edu.in', hackathons: 4, status: 'Active' },
  { id: 3, name: 'Tech Society', email: 'techsoc@vit.edu.in', hackathons: 3, status: 'Active' },
  { id: 4, name: 'Innovators Club', email: 'innovators@vit.edu.in', hackathons: 2, status: 'Inactive' }
];

export const mockPlatformHackathons = [
  { id: 1, title: 'InnovateX 2026', organizer: 'VIT Events', teams: 48, status: 'Ongoing' },
  { id: 2, title: 'BuildForGood', organizer: 'CodeCell', teams: 32, status: 'Registration Open' },
  { id: 3, title: 'AIverse Hackathon', organizer: 'Tech Society', teams: 12, status: 'Upcoming' },
  { id: 4, title: 'FinSolve 2.0', organizer: 'Innovators Club', teams: 65, status: 'Completed' }
];

export const mockUserDirectory = [
  { id: 1, name: 'Chirantan Tondale', role: 'Participant', joinedOn: '10 Nov 2026', status: 'Active' },
  { id: 2, name: 'Aarav Deshmukh', role: 'Team Lead', joinedOn: '09 Nov 2026', status: 'Active' },
  { id: 3, name: 'Meera Joshi', role: 'Organizer', joinedOn: '08 Nov 2026', status: 'Active' },
  { id: 4, name: 'Rohit Patil', role: 'Participant', joinedOn: '08 Nov 2026', status: 'Inactive' }
];

export const mockUserGrowthTrend = [
  { date: 'Oct 1', users: 1200 },
  { date: 'Oct 8', users: 1650 },
  { date: 'Oct 15', users: 2100 },
  { date: 'Oct 22', users: 2500 },
  { date: 'Oct 29', users: 2842 }
];

export const mockRoleParticipationData = [
  { name: 'Participants', value: 74, color: '#00ff66' },
  { name: 'Team Leads', value: 17, color: '#06b6d4' },
  { name: 'Organizers', value: 6, color: '#8b5cf6' },
  { name: 'Admin', value: 3, color: '#f59e0b' }
];

export const mockRolePermissionsList = [
  { id: 1, role: 'Super Admin', description: 'Full access to the entire platform.', permissionsCount: 48 },
  { id: 2, role: 'Organizer', description: 'Create and manage hackathons, teams, and submissions.', permissionsCount: 32 },
  { id: 3, role: 'Team / Participant', description: 'Participate in hackathons, manage team, and submissions.', permissionsCount: 18 }
];

export const mockMonthlyParticipationData = [
  { month: 'Sep', teams: 200 },
  { month: 'Oct', teams: 300 },
  { month: 'Nov', teams: 400 }
];

export const mockPlatformHealthServices = [
  { name: 'Web Application', status: 'Operational' },
  { name: 'Database', status: 'Operational' },
  { name: 'File Storage', status: 'Operational' },
  { name: 'Authentication', status: 'Operational' },
  { name: 'Email Service', status: 'Operational' }
];

export const mockServerMetrics = {
  uptime: '99.98%',
  responseTime: '312 ms',
  activeSessions: '1,428',
  serverLoad: '34%'
};
