'use client';

import { useState, useEffect } from 'react';
import { Wallet, Copy, Check, Loader2, AlertCircle, ExternalLink, Key, CreditCard, Building, Shield, Star, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import TutorialCard from '@/components/ui/TutorialCard';
import styles from './page.module.css';

export default function FinancePage() {
    const { user, updateUser, refreshUser } = useAuth();
    const { showToast } = useToast();

    const [gateway, setGateway] = useState('');
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showsecrets, setShowSecrets] = useState({});

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
        stripe_webhook_secret: '',
        // SyncPay
        syncpay_api_key: '',
        // ParadisePag
        paradisepag_public_key: '',
        paradisepag_secret_key: ''
    });

    useEffect(() => {
        // Force refresh on mount to ensure we have latest tokens
        refreshUser().then(userData => {
            console.log('Refreshed User Data:', userData);
        });

        console.log('FinancePage mounted. User:', user);
        console.log('Gateway Preference:', user?.gateway_preference);
        console.log('Gateway API Token:', user?.gateway_api_token);

        if (user) {
            setGateway(user.gateway_preference || 'pushinpay');

            // Load existing credentials
            if (user.gateway_api_token) {
                console.log('Parsing gateway_api_token:', user.gateway_api_token);
                try {
                    let tokenData = user.gateway_api_token;

                    // Try to parse if it looks like JSON
                    if (typeof tokenData === 'string' && (tokenData.startsWith('{') || tokenData.startsWith('['))) {
                        tokenData = JSON.parse(tokenData);
                    }
                    console.log('Parsed tokenData:', tokenData);

                    // Map backend data to local state
                    // If it's a simple string, it depends on the gateway preference (legacy support)
                    if (typeof tokenData === 'string') {
                        // Legacy handling or simple token gateways
                        const pref = user.gateway_preference;
                        if (pref === 'pushinpay') setCredentials(prev => ({ ...prev, pushinpay_api_token: tokenData }));
                        if (pref === 'syncpay') setCredentials(prev => ({ ...prev, syncpay_api_key: tokenData }));
                        // Add others if needed
                    } else if (typeof tokenData === 'object') {
                        // Structured data
                        setCredentials(prev => ({
                            ...prev,
                            // PushinPay
                            pushinpay_api_token: tokenData.api_token || prev.pushinpay_api_token,
                            // Asaas
                            asaas_api_key: tokenData.api_key || prev.asaas_api_key,
                            asaas_webhook_token: tokenData.webhook_token || prev.asaas_webhook_token,
                            // Mercado Pago
                            mp_access_token: tokenData.access_token || prev.mp_access_token,
                            mp_public_key: tokenData.public_key || prev.mp_public_key,
                            // Stripe
                            stripe_secret_key: tokenData.secret_key || prev.stripe_secret_key,
                            stripe_publishable_key: tokenData.publishable_key || prev.stripe_publishable_key,
                            stripe_webhook_secret: tokenData.webhook_secret || prev.stripe_webhook_secret,
                            // SyncPay
                            syncpay_api_key: tokenData.api_key || prev.syncpay_api_key,
                            // ParadisePag
                            paradisepag_public_key: tokenData.public_key || prev.paradisepag_public_key,
                            paradisepag_secret_key: tokenData.secret_key || prev.paradisepag_secret_key
                        }));
                    }
                } catch (e) {
                    console.error("Error parsing gateway credentials:", e);
                }
            } else {
                console.log('No gateway_api_token found in user object.');
            }
        }
    }, [user]);

    const handleCredentialChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const toggleSecret = (field) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Helper to render password input with toggle
    const PasswordInput = ({ value, onChange, placeholder, fieldName }) => (
        <div className={styles.passwordWrapper}>
            <input
                type={showsecrets[fieldName] ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.input}
            />
            <button
                type="button"
                className={styles.eyeButton}
                onClick={() => toggleSecret(fieldName)}
            >
                {showsecrets[fieldName] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );

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
        } else if (gateway === 'syncpay') {
            if (!credentials.syncpay_api_key) {
                showToast('Informe a API Key do SyncPay', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                api_key: credentials.syncpay_api_key
            };
        } else if (gateway === 'paradisepag') {
            if (!credentials.paradisepag_public_key || !credentials.paradisepag_secret_key) {
                showToast('Preencha Public Key e Secret Key do ParadisePag', 'error');
                return;
            }
            isValid = true;
            gatewayCredentials = {
                public_key: credentials.paradisepag_public_key,
                secret_key: credentials.paradisepag_secret_key
            };
        }

        if (!isValid) return;

        setSaving(true);
        try {
            await authAPI.updateGateway(gateway, gatewayCredentials);
            // Update local user state immediately to reflect changes
            updateUser({
                gateway_preference: gateway,
                gateway_api_token: JSON.stringify(gatewayCredentials) // Update locally as well
            });
            showToast('Gateway configurado com sucesso!', 'success');
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
        syncpay: {
            name: 'SyncPay',
            description: 'Gateway brasileiro com PIX instantâneo. Taxa competitiva.',
            paymentMethods: ['PIX'],
            badge: '⚡ PIX Rápido',
            link: 'https://syncpay.com.br',
            recommended: true,
            tutorial: [
                'Crie sua conta no SyncPay (https://syncpay.com.br)',
                'Acesse o painel e vá em Configurações',
                'Gere uma nova API Key',
                'Copie a API Key e cole abaixo',
                'Configure o Webhook URL'
            ]
        },
        paradisepag: {
            name: 'ParadisePag',
            description: 'Gateway especializado em conteúdo digital.',
            paymentMethods: ['PIX', 'Cartão'],
            badge: '🌴 PIX + Cartão',
            link: 'https://paradisepag.com',
            tutorial: [
                'Crie sua conta no ParadisePag (https://paradisepag.com)',
                'Acesse o painel e vá em API',
                'Copie a Public Key e Secret Key',
                'Cole as chaves nos campos abaixo',
                'Configure o Webhook URL'
            ]
        }
    };

    const webhookUrl = user?.webhook_url ||
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.boyzvip.com'}/api/webhooks/creator/${user?.id || 'xxx'}`;

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

                {/* SyncPay Fields */}
                {gateway === 'syncpay' && (
                    <div className={styles.fieldsGrid}>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>
                                <Key size={16} />
                                API Key *
                            </label>
                            <PasswordInput
                                placeholder="sua_api_key_syncpay..."
                                value={credentials.syncpay_api_key}
                                onChange={(val) => handleCredentialChange('syncpay_api_key', val)}
                                fieldName="syncpay_api_key"
                            />
                            <p className={styles.inputHint}>
                                Painel → Configurações → API Key
                            </p>
                        </div>
                    </div>
                )}

                {/* ParadisePag Fields */}
                {gateway === 'paradisepag' && (
                    <div className={styles.fieldsGrid}>
                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Public Key *
                            </label>
                            <PasswordInput
                                placeholder="pk_xxxxxxxxxxxx..."
                                value={credentials.paradisepag_public_key}
                                onChange={(val) => handleCredentialChange('paradisepag_public_key', val)}
                                fieldName="paradisepag_public_key"
                            />
                            <p className={styles.inputHint}>
                                Chave pública do ParadisePag
                            </p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Key size={16} />
                                Secret Key *
                            </label>
                            <PasswordInput
                                placeholder="sk_xxxxxxxxxxxx..."
                                value={credentials.paradisepag_secret_key}
                                onChange={(val) => handleCredentialChange('paradisepag_secret_key', val)}
                                fieldName="paradisepag_secret_key"
                            />
                            <p className={styles.inputHint}>
                                Chave secreta do ParadisePag
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
