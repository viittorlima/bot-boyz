'use client';

import { useState, useEffect } from 'react';
import { Wallet, Copy, Check, Loader2, AlertCircle, ExternalLink, Key, CreditCard, Building, Shield, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import TutorialCard from '@/components/ui/TutorialCard';
import styles from './page.module.css';

export default function FinancePage() {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();

    const [gateway, setGateway] = useState('');
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    // Gateway credentials
    const [credentials, setCredentials] = useState({
        // PushinPay
        pushinpay_api_token: '',
        // Asaas
        asaas_api_key: '',
        asaas_webhook_token: '',
        // Mercado Pago
        mp_access_token: '',
        mp_public_key: '',
        // Stripe
        stripe_secret_key: '',
        stripe_publishable_key: '',
        stripe_webhook_secret: ''
    });

    useEffect(() => {
        if (user) {
            setGateway(user.gateway_preference || 'pushinpay');
        }
    }, [user]);

    const handleCredentialChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        let isValid = false;
        let gatewayCredentials = {};

        if (gateway === 'pushinpay') {
            if (!credentials.pushinpay_api_token) {
                showToast('Informe o Token de API do PushinPay', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                api_token: credentials.pushinpay_api_token
            };
        } else if (gateway === 'asaas') {
            if (!credentials.asaas_api_key) {
                showToast('Informe a Chave de API do Asaas', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                api_key: credentials.asaas_api_key,
                webhook_token: credentials.asaas_webhook_token
            };
        } else if (gateway === 'mercadopago') {
            if (!credentials.mp_access_token || !credentials.mp_public_key) {
                showToast('Preencha Access Token e Public Key', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                access_token: credentials.mp_access_token,
                public_key: credentials.mp_public_key
            };
        } else if (gateway === 'stripe') {
            if (!credentials.stripe_secret_key || !credentials.stripe_publishable_key) {
                showToast('Preencha Secret Key e Publishable Key', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                secret_key: credentials.stripe_secret_key,
                publishable_key: credentials.stripe_publishable_key,
                webhook_secret: credentials.stripe_webhook_secret
            };
        }

        if (!isValid) return;

        setSaving(true);
        try {
            await authAPI.updateGateway(gateway, gatewayCredentials);
            updateUser({ gateway_preference: gateway });
            showToast('Gateway configurado com sucesso!', 'success');
            setCredentials({
                pushinpay_api_token: '',
                asaas_api_key: '',
                asaas_webhook_token: '',
                mp_access_token: '',
                mp_public_key: '',
                stripe_secret_key: '',
                stripe_publishable_key: '',
                stripe_webhook_secret: ''
            });
        } catch (error) {
            console.error('Error saving gateway:', error);
            showToast(
                error.response?.data?.error || 'Erro ao salvar configurações',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const copyWebhookUrl = () => {
        const webhookUrl = user?.webhook_url ||
            `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/creator/${user?.id}`;
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        showToast('URL copiada!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const gatewayInfo = {
        pushinpay: {
            name: 'PushinPay',
            description: '100% sigiloso e privado. Sem burocracia. Ideal para conteúdo adulto.',
            paymentMethods: ['PIX'],
            badge: '🔒 Somente PIX',
            link: 'https://app.pushinpay.com.br/#/register',
            recommended: true,
            tutorial: [
                'Cadastre-se em app.pushinpay.com.br',
                'Faça login e acesse o Painel',
                'Vá em Configurações → Gerar Token de API',
                'Copie o token gerado e cole abaixo',
                'Configure o Webhook URL nas configurações do PushinPay'
            ]
        },
        asaas: {
            name: 'Asaas',
            description: 'Gateway brasileiro completo. Taxa a partir de 2,99%. Saque rápido.',
            paymentMethods: ['PIX', 'Boleto', 'Cartão de Crédito'],
            badge: '💳 PIX + Cartão + Boleto',
            link: 'https://www.asaas.com',
            tutorial: [
                'Acesse app.asaas.com e faça login ou crie sua conta',
                'Vá em Configurações → Integrações',
                'Clique em "Gerar Chave de API"',
                'Copie a chave que começa com $aact_',
                'Cole a chave abaixo e configure o Webhook URL no Asaas'
            ]
        },
        mercadopago: {
            name: 'Mercado Pago',
            description: 'Gateway popular. PIX instantâneo e cartão em até 18x.',
            paymentMethods: ['PIX', 'Cartão de Crédito', 'Cartão de Débito'],
            badge: '💳 PIX + Cartão (18x)',
            link: 'https://www.mercadopago.com.br/developers',
            tutorial: [
                'Acesse mercadopago.com.br/developers e faça login',
                'Vá em "Suas Integrações" → "Criar aplicação"',
                'Marque "Pagamentos online" e crie a aplicação',
                'Em "Credenciais de produção", copie o Access Token e Public Key',
                'Cole ambas as chaves abaixo e configure o Webhook URL'
            ]
        },
        stripe: {
            name: 'Stripe',
            description: 'Gateway internacional. Aceita cartões de todo o mundo.',
            paymentMethods: ['Cartão Internacional', 'Apple Pay', 'Google Pay'],
            badge: '🌎 Cartões Internacionais',
            link: 'https://dashboard.stripe.com',
            tutorial: [
                'Acesse dashboard.stripe.com e faça login',
                'Vá em Developers → API Keys',
                'Copie a Publishable key (pk_live_...) e Secret key (sk_live_...)',
                'Vá em Developers → Webhooks e adicione o endpoint',
                'Copie o Webhook Signing Secret (whsec_...)'
            ]
        }
    };

    const webhookUrl = user?.webhook_url ||
        `${process.env.NEXT_PUBLIC_API_URL || 'https://boyzvip-api.90k5up.easypanel.host'}/api/webhooks/creator/${user?.id || 'xxx'}`;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações Financeiras</h1>
                <p className={styles.subtitle}>Configure seu gateway de pagamento para receber pagamentos</p>
            </div>

            {/* Webhook URL Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Wallet size={20} />
                    URL de Webhook
                </h2>
                <p className={styles.sectionDescription}>
                    Configure esta URL no seu gateway para receber notificações de pagamento automaticamente
                </p>

                <div className={styles.webhookBox}>
                    <input
                        type="text"
                        value={webhookUrl}
                        readOnly
                        className={styles.webhookInput}
                    />
                    <button
                        className={styles.copyButton}
                        onClick={copyWebhookUrl}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            {/* Gateway Selection */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <CreditCard size={20} />
                    Escolha seu Gateway
                </h2>

                <div className={styles.gatewayGrid}>
                    {Object.entries(gatewayInfo).map(([key, info]) => (
                        <button
                            key={key}
                            className={`${styles.gatewayCard} ${gateway === key ? styles.active : ''} ${info.recommended ? styles.recommended : ''}`}
                            onClick={() => setGateway(key)}
                        >
                            {info.recommended && (
                                <div className={styles.recommendedBadge}>
                                    <Star size={10} />
                                    Recomendado
                                </div>
                            )}
                            <div className={styles.gatewayHeader}>
                                {info.recommended ? <Shield size={24} /> : <Building size={24} />}
                                <span className={styles.gatewayName}>{info.name}</span>
                            </div>
                            <div className={styles.paymentBadge}>{info.badge}</div>
                            <p className={styles.gatewayDesc}>{info.description}</p>
                            <a
                                href={info.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.gatewayLink}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={14} />
                                Acessar
                            </a>
                        </button>
                    ))}
                </div>
            </div>

            {/* Gateway Configuration */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Key size={20} />
                    Configurar {gatewayInfo[gateway]?.name}
                </h2>

                {/* PushinPay Security Highlight */}
                {gateway === 'pushinpay' && (
                    <div className={styles.securityHighlight}>
                        <Shield size={20} />
                        <div>
                            <h3>Por que escolher PushinPay?</h3>
                            <ul>
                                <li><strong>100% Sigiloso</strong> - Não exige dados pessoais extensos</li>
                                <li><strong>Privacidade Total</strong> - Transações discretas e seguras</li>
                                <li><strong>Sem Burocracia</strong> - Cadastro rápido e simples</li>
                                <li><strong>PIX Instantâneo</strong> - Receba em segundos na sua conta</li>
                            </ul>
                        </div>
                    </div>
                )}

                <TutorialCard
                    title={`Como configurar ${gatewayInfo[gateway]?.name}`}
                    steps={gatewayInfo[gateway]?.tutorial || []}
                    defaultOpen={true}
                />

                {/* PushinPay Fields */}
                {gateway === 'pushinpay' && (
                    <div className={styles.fieldsGrid}>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>
                                <Key size={16} />
                                Token de API *
                            </label>
                            <input
                                type="password"
                                placeholder="seu_token_api_aqui"
                                value={credentials.pushinpay_api_token}
                                onChange={(e) => handleCredentialChange('pushinpay_api_token', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Painel → Configurações → Gerar Token de API
                            </p>
                        </div>
                    </div>
                )}

                {/* Asaas Fields */}
                {gateway === 'asaas' && (
                    <div className={styles.fieldsGrid}>
                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Chave de API *
                            </label>
                            <input
                                type="password"
                                placeholder="$aact_YTU5YTE0M2M2YmU..."
                                value={credentials.asaas_api_key}
                                onChange={(e) => handleCredentialChange('asaas_api_key', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Encontre em: Configurações → Integrações → Gerar Chave de API
                            </p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Token do Webhook
                            </label>
                            <input
                                type="password"
                                placeholder="Token para validar webhooks..."
                                value={credentials.asaas_webhook_token}
                                onChange={(e) => handleCredentialChange('asaas_webhook_token', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Encontre em: Configurações → Integrações → Webhooks → Token de autenticação
                            </p>
                        </div>
                    </div>
                )}

                {/* Mercado Pago Fields */}
                {gateway === 'mercadopago' && (
                    <div className={styles.fieldsGrid}>
                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Access Token *
                            </label>
                            <input
                                type="password"
                                placeholder="APP_USR-xxxxxxxx-xxxx..."
                                value={credentials.mp_access_token}
                                onChange={(e) => handleCredentialChange('mp_access_token', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Token de acesso para criar cobranças (servidor)
                            </p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Public Key *
                            </label>
                            <input
                                type="password"
                                placeholder="APP_USR-xxxxxxxx-xxxx..."
                                value={credentials.mp_public_key}
                                onChange={(e) => handleCredentialChange('mp_public_key', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Chave pública para checkout (cliente)
                            </p>
                        </div>
                    </div>
                )}

                {/* Stripe Fields */}
                {gateway === 'stripe' && (
                    <div className={styles.fieldsGrid}>
                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Publishable Key *
                            </label>
                            <input
                                type="password"
                                placeholder="pk_live_xxxxxxxxxxxxxxxx..."
                                value={credentials.stripe_publishable_key}
                                onChange={(e) => handleCredentialChange('stripe_publishable_key', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Chave pública para checkout (começa com pk_)
                            </p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Secret Key *
                            </label>
                            <input
                                type="password"
                                placeholder="sk_live_xxxxxxxxxxxxxxxx..."
                                value={credentials.stripe_secret_key}
                                onChange={(e) => handleCredentialChange('stripe_secret_key', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Chave secreta do servidor (começa com sk_)
                            </p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Webhook Signing Secret
                            </label>
                            <input
                                type="password"
                                placeholder="whsec_xxxxxxxxxxxxxxxx..."
                                value={credentials.stripe_webhook_secret}
                                onChange={(e) => handleCredentialChange('stripe_webhook_secret', e.target.value)}
                                className={styles.input}
                            />
                            <p className={styles.inputHint}>
                                Para validar webhooks (Developers → Webhooks → Signing secret)
                            </p>
                        </div>
                    </div>
                )}

                <div className={styles.securityNote}>
                    <AlertCircle size={16} />
                    <span>Suas credenciais são criptografadas e armazenadas com segurança.</span>
                </div>

                {user?.gateway_preference && (
                    <div className={styles.currentGateway}>
                        <Check size={16} />
                        <span>
                            Gateway atual: <strong>{gatewayInfo[user.gateway_preference]?.name || user.gateway_preference}</strong>
                            {' '} (configurado)
                        </span>
                    </div>
                )}

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 size={18} className={styles.spinner} />
                            Salvando...
                        </>
                    ) : (
                        'Salvar Configurações'
                    )}
                </button>
            </div>
        </div>
    );
}
