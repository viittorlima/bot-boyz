'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  DollarSign,
  Zap,
  Users,
  Check,
  Lock,
  Send,
  Bot,
  CreditCard,
  RefreshCcw,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  Play,
  Sparkles
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [fixedFee, setFixedFee] = useState(0.55); // Default R$ 0.55

  // Fetch platform fee from admin settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/public/settings');
        if (response.data?.fixed_fee_amount) {
          setFixedFee(response.data.fixed_fee_amount);
        }
      } catch (error) {
        console.log('Using default fixed fee');
      }
    };
    fetchSettings();
  }, []);

  const tutorials = [
    {
      id: 1,
      title: 'Configurando seu Bot',
      subtitle: 'Aprenda a criar e conectar seu bot do Telegram',
      steps: [
        { title: 'Crie seu bot no BotFather', desc: 'Abra o Telegram, procure por @BotFather e envie /newbot. Siga as instruções para criar seu bot e anote o token gerado.' },
        { title: 'Faça login na Boyz Vip', desc: 'Acesse sua conta no painel e vá em "Meus Bots". Clique em "Conectar Novo Bot".' },
        { title: 'Cole o token', desc: 'Cole o token que você recebeu do BotFather no campo indicado e dê um nome ao seu bot.' },
        { title: 'Configure o canal VIP', desc: 'Adicione o bot como administrador do seu canal/grupo VIP e copie o ID do canal para o painel.' },
        { title: 'Pronto!', desc: 'Seu bot está conectado e pronto para receber assinantes. Agora crie seus planos de assinatura!' }
      ]
    },
    {
      id: 2,
      title: 'Integrando Pagamentos',
      subtitle: 'Configure PIX e cartão de crédito',
      steps: [
        { title: 'Crie sua conta na Asaas', desc: 'Acesse asaas.com.br e crie sua conta gratuita. Complete o cadastro com seus dados.' },
        { title: 'Verifique sua conta', desc: 'Envie os documentos solicitados para verificação. O processo leva de 1 a 3 dias úteis.' },
        { title: 'Gere sua API Key', desc: 'No painel Asaas, vá em "Minha Conta" > "API" e gere uma nova chave de integração.' },
        { title: 'Configure na Boyz Vip', desc: 'No painel Boyz Vip, vá em "Financeiro" e cole sua API Key da Asaas.' },
        { title: 'Teste uma cobrança', desc: 'Faça uma compra teste para verificar se tudo está funcionando corretamente.' }
      ]
    },
    {
      id: 3,
      title: 'Gerenciando Assinantes',
      subtitle: 'Controle total sobre seus membros VIP',
      steps: [
        { title: 'Visualize seus assinantes', desc: 'No painel, acesse "Vendas" para ver a lista completa de assinantes ativos e inativos.' },
        { title: 'Filtre por status', desc: 'Use os filtros para ver apenas assinantes ativos, expirados ou cancelados.' },
        { title: 'Verifique renovações', desc: 'Acompanhe quais assinaturas estão próximas de vencer e envie mensagens personalizadas.' },
        { title: 'Gerencie acessos', desc: 'Assinantes são adicionados e removidos automaticamente do grupo VIP conforme a assinatura.' },
        { title: 'Exporte relatórios', desc: 'Baixe relatórios em CSV ou Excel para análise detalhada do seu negócio.' }
      ]
    }
  ];

  const features = [
    { icon: Shield, title: 'Acesso Protegido', desc: 'Controle total sobre quem pode acessar seu grupo VIP.' },
    { icon: Bot, title: 'Bot Telegram', desc: 'Bot próprio conectado ao seu canal para automação.' },
    { icon: CreditCard, title: 'Múltiplos Pagamentos', desc: 'PIX, cartão de crédito e boleto aceitos.' },
    { icon: Zap, title: 'Entrada Automática', desc: 'Acesso liberado em segundos após pagamento.' },
    { icon: BarChart3, title: 'Dashboard Completo', desc: 'Métricas de vendas, assinantes e receita.' },
    { icon: Bell, title: 'Notificações', desc: 'Alertas de novas vendas e renovações.' },
  ];

  const automationFeatures = [
    { icon: Zap, text: 'Entrada Automática' },
    { icon: RefreshCcw, text: 'Renovação Inteligente' },
    { icon: Bell, text: 'Alerta de Expiração' },
    { icon: Send, text: 'Convite Automático' },
    { icon: Lock, text: 'Remoção Automática' },
    { icon: DollarSign, text: 'Gerenciamento de Planos' },
    { icon: BarChart3, text: 'Relatórios Completos' },
    { icon: Settings, text: 'Configurações Avançadas' },
  ];

  const faqs = [
    { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos PIX, cartão de crédito em até 12x e boleto bancário.' },
    { q: 'Qual é a taxa da plataforma?', a: `Cobramos apenas R$ ${fixedFee.toFixed(2).replace('.', ',')} por venda aprovada. Sem mensalidade, sem taxa percentual!` },
    { q: 'Posso ter mais de um grupo VIP?', a: 'Sim! Você pode conectar quantos bots quiser e gerenciar múltiplos grupos.' },
    { q: 'Como recebo os pagamentos?', a: 'Os pagamentos vão direto para sua conta via gateway configurado. Você pode sacar a qualquer momento.' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>B</div>
          <span>Boyz Vip</span>
        </div>

        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>Recursos</a>
          <a href="#automation" className={styles.navLink}>Automação</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </nav>

        <Link href="/login" className={styles.loginButton}>
          Entrar
          <ArrowRight size={16} />
        </Link>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlow2} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            MONETIZAÇÃO DE TELEGRAM
          </div>

          <h1 className={styles.heroTitle}>
            Transforme seu Telegram em
            <span className={styles.gradientText}> lucro automatizado!</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Crie grupos VIP, gerencie assinaturas e receba pagamentos de forma 100% automática.
            <span className={styles.heroHighlight}> Apenas R$ {fixedFee.toFixed(2).replace('.', ',')} por venda!</span>
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/join">
              <button className={styles.ctaButton}>
                Começar Agora
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/login" className={styles.secondaryCta}>
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>RECURSOS</p>
          <h2 className={styles.sectionTitle}>Tudo que você precisa</h2>
          <p className={styles.sectionSubtitle}>
            Uma plataforma completa para gerenciar seu negócio digital
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.featureIcon}>
                <feature.icon size={24} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Automation Section */}
      <section id="automation" className={styles.automation}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>COMO FUNCIONA</p>
          <h2 className={styles.sectionTitle}>Automação Inteligente</h2>
          <p className={styles.sectionSubtitle}>
            Seu negócio funciona 24/7 sem você precisar fazer nada
          </p>
        </div>

        <div className={styles.automationContent}>
          {/* Bot Mockup */}
          <div className={styles.botMockup}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupDot} />
              <div className={styles.mockupDot} />
              <div className={styles.mockupDot} />
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockupMessage + ' ' + styles.incoming}>
                <span className={styles.msgIcon}><Bot size={16} /></span>
                <div>
                  <strong>Bot VIP</strong>
                  <p>👋 Olá! Escolha seu plano:</p>
                </div>
              </div>
              <div className={styles.mockupButtons}>
                <div className={styles.mockupBtn}>Mensal - R$ 29,90</div>
                <div className={styles.mockupBtn}>Trimestral - R$ 79,90</div>
                <div className={styles.mockupBtn + ' ' + styles.selected}>Anual - R$ 249,90</div>
              </div>
              <div className={styles.mockupMessage + ' ' + styles.success}>
                <span className={styles.msgIcon}><Check size={16} /></span>
                <div>
                  <p>✅ Pagamento confirmado!</p>
                  <p className={styles.msgSmall}>Acesso liberado automaticamente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className={styles.automationFeatures}>
            {automationFeatures.map((item, index) => (
              <div key={index} className={styles.automationItem} style={{ animationDelay: `${index * 0.08}s` }}>
                <div className={styles.automationIcon}>
                  <item.icon size={18} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>PASSO A PASSO</p>
          <h2 className={styles.sectionTitle}>Tutoriais Passo a Passo</h2>
          <p className={styles.sectionSubtitle}>
            Clique em um tutorial para ver o passo a passo completo
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className={styles.stepCard}
              onClick={() => setActiveTutorial(tutorial)}
            >
              <div className={styles.stepThumb}>
                <Play size={32} />
              </div>
              <div className={styles.stepInfo}>
                <h3>{tutorial.title}</h3>
                <p>{tutorial.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tutorial Modal */}
      {activeTutorial && (
        <div className={styles.modalOverlay} onClick={() => setActiveTutorial(null)}>
          <div className={styles.tutorialModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setActiveTutorial(null)}>
              ✕
            </button>

            <div className={styles.modalHeader}>
              <h2>{activeTutorial.title}</h2>
              <p>{activeTutorial.subtitle}</p>
            </div>

            <div className={styles.tutorialSteps}>
              {activeTutorial.steps.map((step, index) => (
                <div key={index} className={styles.tutorialStep}>
                  <div className={styles.tutorialStepNumber}>{index + 1}</div>
                  <div className={styles.tutorialStepContent}>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.ctaButton}
                onClick={() => setActiveTutorial(null)}
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section id="faq" className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>DÚVIDAS</p>
          <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className={styles.faqQuestion}>
                <span>{faq.q}</span>
                <ChevronDown size={20} className={styles.faqChevron} />
              </div>
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Pronto para começar?</h2>
        <p>Crie sua conta gratuita e comece a monetizar hoje mesmo.</p>
        <Link href="/join">
          <button className={styles.ctaButton}>
            Criar Conta Grátis
            <ArrowRight size={18} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <div className={styles.logoIcon}>B</div>
          <span>Boyz Vip</span>
        </div>

        <div className={styles.footerLinks}>
          <a href="/termos" className={styles.footerLink}>Termos de Uso</a>
          <a href="/termos#privacidade" className={styles.footerLink}>Privacidade</a>
          <a href="/termos#responsabilidade" className={styles.footerLink}>Responsabilidade</a>
        </div>

        <p className={styles.footerCopy}>© 2026 Boyz Vip. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
