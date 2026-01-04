// Mock data for the internal system dashboard

export const statistics = {
  totalCreators: 47,
  activeCreators: 42,
  totalViews: '2.4M',
  totalRevenue: 'R$ 156.780',
  monthlyGrowth: '+23%',
  averageEngagement: '8.7%'
};

export const creators = [
  {
    id: 1,
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    platform: 'OnlyFans',
    status: 'active',
    followers: '125K',
    revenue: 'R$ 12.500',
    lastActive: '2026-01-03',
    avatar: null
  },
  {
    id: 2,
    name: 'Beatriz Costa',
    email: 'bia.costa@email.com',
    platform: 'Privacy',
    status: 'active',
    followers: '89K',
    revenue: 'R$ 8.900',
    lastActive: '2026-01-03',
    avatar: null
  },
  {
    id: 3,
    name: 'Carla Mendes',
    email: 'carla.m@email.com',
    platform: 'OnlyFans',
    status: 'paused',
    followers: '210K',
    revenue: 'R$ 21.000',
    lastActive: '2026-01-01',
    avatar: null
  },
  {
    id: 4,
    name: 'Diana Rocha',
    email: 'diana.rocha@email.com',
    platform: 'Fansly',
    status: 'active',
    followers: '56K',
    revenue: 'R$ 5.600',
    lastActive: '2026-01-02',
    avatar: null
  },
  {
    id: 5,
    name: 'Elisa Ferreira',
    email: 'elisa.f@email.com',
    platform: 'Privacy',
    status: 'active',
    followers: '340K',
    revenue: 'R$ 34.000',
    lastActive: '2026-01-03',
    avatar: null
  },
  {
    id: 6,
    name: 'Fernanda Lima',
    email: 'fer.lima@email.com',
    platform: 'OnlyFans',
    status: 'active',
    followers: '178K',
    revenue: 'R$ 17.800',
    lastActive: '2026-01-03',
    avatar: null
  }
];

export const recentActivity = [
  { id: 1, type: 'new_subscriber', creator: 'Ana Silva', message: 'Novo assinante premium', time: '5 min atrás' },
  { id: 2, type: 'payment', creator: 'Beatriz Costa', message: 'Pagamento recebido R$ 250', time: '12 min atrás' },
  { id: 3, type: 'content', creator: 'Elisa Ferreira', message: 'Novo conteúdo publicado', time: '25 min atrás' },
  { id: 4, type: 'milestone', creator: 'Fernanda Lima', message: 'Atingiu 150K seguidores', time: '1 hora atrás' }
];
