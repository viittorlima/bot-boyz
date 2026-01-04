'use client';

import { useState, useEffect } from 'react';
import { Wallet, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import TutorialCard from '@/components/ui/TutorialCard';
import styles from './page.module.css';

export default function FinancePage() {
    const { user, updateUser } = useAuth();
    const { showToast } = useToast();

    const [gateway, setGateway] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            setGateway(user.gateway_preference || 'asaas');
        }
    }, [user]);

    const handleSave = async () => {
        if (!apiToken.trim()) {
            showToast('Informe o token da API', 'error');
            return;
        }

        setSaving(true);
        try {
            await authAPI.updateGateway(gateway, apiToken);
            updateUser({ gateway_preference: gateway });
            showToast('Gateway configurado com sucesso!', 'success');
            setApiToken('');
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

    const gatewayTutorials = {
        asaas: [
            'Acesse app.asaas.com e faça login',
            'Vá em Configurações → Integrações',
            'Clique em "Gerar Chave de API"',
            'Copie a chave e cole aqui',
            'Configure o Webhook URL no Asaas'
        ],
        mercadopago: [
            'Acesse mercadopago.com.br/developers',
            'Vá em "Suas Integrações" → "Criar aplicação"',
            'Em Credenciais de produção, copie o Access Token',
            'Cole o token aqui',
            'Configure o Webhook URL nas configurações'
        ],
        stripe: [
            'Acesse dashboard.stripe.com',
            'Vá em Developers → API Keys',
            'Copie a Secret Key (sk_live_...)',
            'Cole aqui',
            'Configure o Webhook em Developers → Webhooks'
        ]
    };

    const webhookUrl = user?.webhook_url ||
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.boyzclub.com'}/api/webhooks/creator/${user?.id || 'xxx'}`;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações Financeiras</h1>
                <p className={styles.subtitle}>Configure seu gateway de pagamento</p>
            </div>

            {/* Webhook URL Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Wallet size={20} />
                    URL de Webhook
                </h2>
                <p className={styles.sectionDescription}>
                    Configure esta URL no seu gateway para receber notificações de pagamento
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

            {/* Gateway Configuration */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Wallet size={20} />
                    Gateway de Pagamento
                </h2>

                <div className={styles.gatewaySelector}>
                    {['asaas', 'mercadopago', 'stripe'].map((g) => (
                        <button
                            key={g}
                            className={`${styles.gatewayOption} ${gateway === g ? styles.active : ''}`}
                            onClick={() => setGateway(g)}
                        >
                            {g === 'asaas' && 'Asaas'}
                            {g === 'mercadopago' && 'Mercado Pago'}
                            {g === 'stripe' && 'Stripe'}
                        </button>
                    ))}
                </div>

                <TutorialCard
                    title={`Como configurar ${gateway === 'asaas' ? 'Asaas' : gateway === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}`}
                    steps={gatewayTutorials[gateway]}
                    defaultOpen={true}
                />

                <div className={styles.inputGroup}>
                    <label>
                        {gateway === 'asaas' && 'Chave de API (Asaas)'}
                        {gateway === 'mercadopago' && 'Access Token (Mercado Pago)'}
                        {gateway === 'stripe' && 'Secret Key (Stripe)'}
                    </label>
                    <input
                        type="password"
                        placeholder={
                            gateway === 'asaas'
                                ? '$aact_xxx...'
                                : gateway === 'mercadopago'
                                    ? 'APP_USR-xxx...'
                                    : 'sk_live_xxx...'
                        }
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        className={styles.input}
                    />
                    <p className={styles.inputHint}>
                        Sua chave é criptografada e armazenada com segurança
                    </p>
                </div>

                {user?.gateway_preference && (
                    <div className={styles.currentGateway}>
                        <AlertCircle size={16} />
                        <span>
                            Gateway atual: <strong>{user.gateway_preference}</strong>
                            {' '} (configurado)
                        </span>
                    </div>
                )}

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving || !apiToken}
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
