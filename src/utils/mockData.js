// Mock Data for BoyzClub SaaS Hub - Complete

// Current logged-in user (Creator)
export const currentUser = {
    id: 'user_123',
    name: 'João Silva',
    email: 'joao@email.com',
    username: 'joaosilva',
    avatar: null,
    role: 'creator',
    webhookUrl: 'https://api.boyzclub.com/webhooks/user_123',
    createdAt: '2025-10-15',
    stats: {
        totalRevenue: 'R$ 12.450,00',
        todayRevenue: 'R$ 890,00',
        activeSubscribers: 156,
        pendingSales: 3
    }
};

// Admin view data
export const adminView = {
    platformStats: {
        totalRevenue: 'R$ 145.890,00',
        totalCommission: 'R$ 14.589,00',
        totalCreators: 47,
        activeCreators: 38,
        totalSubscribers: 2847,
        pendingPayouts: 'R$ 8.230,00'
    },
    recentCreators: [
        { id: 1, name: 'Ana Costa', email: 'ana@email.com', status: 'active', revenue: 'R$ 8.540,00' },
        { id: 2, name: 'Pedro Alves', email: 'pedro@email.com', status: 'active', revenue: 'R$ 12.890,00' },
        { id: 3, name: 'Maria Santos', email: 'maria@email.com', status: 'paused', revenue: 'R$ 3.200,00' },
    ]
};

// Bot configurations with plans
export const bots = [
    {
        id: 'bot_1',
        name: 'VIP Principal',
        token: '7123456789:AAH...hidden',
        status: 'active',
        welcomeMessage: 'Olá {nome}! Bem-vindo ao grupo VIP! 🎉\n\nAqui você terá acesso a conteúdo exclusivo.',
        requestMediaOnStart: true,
        channelId: '-1001234567890',
        createdAt: '2025-11-01',
        stats: {
            totalMembers: 156,
            messagesCount: 4520
        },
        plans: [
            { id: 'plan_1', name: 'Mensal', price: 29.90, duration: 30, active: true },
            { id: 'plan_2', name: 'Trimestral', price: 79.90, duration: 90, active: true },
            { id: 'plan_3', name: 'Vitalício', price: 199.90, duration: 0, active: true }
        ]
    },
    {
        id: 'bot_2',
        name: 'Curso Premium',
        token: '7987654321:BBK...hidden',
        status: 'active',
        welcomeMessage: 'Seja bem-vindo {nome} ao curso exclusivo!',
        requestMediaOnStart: false,
        channelId: '-1009876543210',
        createdAt: '2025-12-10',
        stats: {
            totalMembers: 89,
            messagesCount: 1230
        },
        plans: [
            { id: 'plan_4', name: 'Acesso Completo', price: 149.90, duration: 365, active: true }
        ]
    }
];

// Sales history
export const sales = [
    {
        id: 'sale_001',
        customer: 'Carlos M.',
        email: 'carlos@email.com',
        plan: 'Mensal',
        amount: 29.90,
        status: 'confirmed',
        botName: 'VIP Principal',
        createdAt: '2026-01-03T18:45:00'
    },
    {
        id: 'sale_002',
        customer: 'Ana P.',
        email: 'ana.p@email.com',
        plan: 'Vitalício',
        amount: 199.90,
        status: 'confirmed',
        botName: 'VIP Principal',
        createdAt: '2026-01-03T17:30:00'
    },
    {
        id: 'sale_003',
        customer: 'Roberto S.',
        email: 'roberto@email.com',
        plan: 'Trimestral',
        amount: 79.90,
        status: 'pending',
        botName: 'VIP Principal',
        createdAt: '2026-01-03T16:15:00'
    },
    {
        id: 'sale_004',
        customer: 'Julia F.',
        email: 'julia@email.com',
        plan: 'Acesso Completo',
        amount: 149.90,
        status: 'confirmed',
        botName: 'Curso Premium',
        createdAt: '2026-01-03T14:20:00'
    },
    {
        id: 'sale_005',
        customer: 'Marcos L.',
        email: 'marcos@email.com',
        plan: 'Mensal',
        amount: 29.90,
        status: 'failed',
        botName: 'VIP Principal',
        createdAt: '2026-01-03T12:00:00'
    }
];

// Gateway configuration
export const gatewayConfig = {
    provider: 'asaas',
    apiToken: '',
    isConfigured: false,
    webhookUrl: 'https://api.boyzclub.com/webhooks/user_123'
};

// Legacy exports for compatibility
export const statistics = {
    totalCreators: 47,
    activeCreators: 38,
    totalViews: '2.847',
    totalRevenue: 'R$ 145.890,00',
    totalBots: 5,
    monthlyGrowth: '+18.5%'
};

export const creators = [
    {
        id: 1,
        name: 'Ana Silva',
        username: 'anasilva',
        email: 'ana@email.com',
        avatar: null,
        status: 'active',
        platform: 'Telegram',
        channelId: '-1001234567890',
        subscribers: 234,
        revenue: 'R$ 8.540,00',
        price: 29.90,
        duration: 30,
        pixKey: 'ana@email.com',
        splitPercent: 85,
        createdAt: '2025-11-15'
    },
    {
        id: 2,
        name: 'Carlos Mendes',
        username: 'carlosm',
        email: 'carlos@email.com',
        avatar: null,
        status: 'active',
        platform: 'Telegram',
        channelId: '-1009876543210',
        subscribers: 189,
        revenue: 'R$ 6.230,00',
        price: 39.90,
        duration: 30,
        pixKey: '11999887766',
        splitPercent: 80,
        createdAt: '2025-10-22'
    },
    {
        id: 3,
        name: 'Marina Costa',
        username: 'marinac',
        email: 'marina@email.com',
        avatar: null,
        status: 'paused',
        platform: 'Telegram',
        channelId: '-1005554443332',
        subscribers: 156,
        revenue: 'R$ 4.120,00',
        price: 24.90,
        duration: 30,
        pixKey: '123.456.789-00',
        splitPercent: 85,
        createdAt: '2025-12-01'
    }
];

export const webhookLogs = [
    { id: 'TXN-001234', type: 'payment.confirmed', amount: 29.90, status: 'success', creator: 'anasilva', timestamp: '2026-01-03T18:45:00' },
    { id: 'TXN-001233', type: 'payment.confirmed', amount: 39.90, status: 'success', creator: 'carlosm', timestamp: '2026-01-03T18:30:00' },
    { id: 'TXN-001232', type: 'payment.failed', amount: 24.90, status: 'failed', creator: 'marinac', timestamp: '2026-01-03T18:15:00' }
];
