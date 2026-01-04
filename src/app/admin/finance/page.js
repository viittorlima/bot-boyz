'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard, Wallet, Key, Check, Loader2, AlertCircle,
    ExternalLink, Copy, Building, Percent, DollarSign, Info
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function AdminFinancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [settings, setSettings] = useState({
        platformFee: 10,
        gateway: 'mercadopago',
        // Mercado Pago
        mp_access_token: '',
        mp_public_key: '',
        // Asaas
        asaas_api_key: '',
        asaas_webhook_token: ''
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            setSettings(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://geral-boyzclubapi.r954jc.easypanel.host'}/api/webhooks`;

    const copyWebhook = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Configurações Financeiras</h1>
                <p className={styles.subtitle}>Configure o gateway de pagamento da plataforma para receber as comissões</p>
            </div>

            {/* How it Works */}
            <div className={styles.infoCard}>
                <Info size={20} />
                <div>
                    <h3>Como funciona o recebimento?</h3>
                    <p>
                        Os pagamentos dos clientes vão <strong>direto para a conta do criador</strong>.
                        A plataforma recebe automaticamente sua comissão via <strong>Split de Pagamento</strong>
                        - uma funcionalidade do gateway que divide o valor no momento do pagamento.
                    </p>
                    <p style={{ marginTop: '8px' }}>
                        <strong>Você NÃO precisa de uma conta separada</strong> - o gateway do criador já
                        envia sua parte automaticamente para sua conta configurada abaixo.
                    </p>
                </div>
            </div>

            {/* Platform Fee */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Percent size={20} />
                    Taxa da Plataforma (Split)
                </h2>
                <p className={styles.sectionDesc}>
                    Porcentagem que você recebe de cada venda. Este valor é descontado automaticamente do pagamento do criador.
                </p>

                <div className={styles.feeRow}>
                    <div className={styles.feeInput}>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={settings.platformFee}
                            onChange={(e) => setSettings({ ...settings, platformFee: parseFloat(e.target.value) })}
                        />
                        <span>%</span>
                    </div>
                    <div className={styles.feeExample}>
                        <DollarSign size={16} />
                        <span>Exemplo: Em uma venda de R$ 100, você recebe R$ {settings.platformFee?.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Gateway Selection */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Building size={20} />
                    Gateway para Receber Comissões
                </h2>
                <p className={styles.sectionDesc}>
                    Escolha onde você quer receber sua parte das vendas (comissão via split)
                </p>

                <div className={styles.gatewayGrid}>
                    <button
                        className={`${styles.gatewayCard} ${settings.gateway === 'mercadopago' ? styles.active : ''}`}
                        onClick={() => setSettings({ ...settings, gateway: 'mercadopago' })}
                    >
                        <div className={styles.gatewayHeader}>
                            <CreditCard size={24} />
                            <span>Mercado Pago</span>
                        </div>
                        <p>PIX, cartão. Saque para qualquer banco.</p>
                    </button>

                    <button
                        className={`${styles.gatewayCard} ${settings.gateway === 'asaas' ? styles.active : ''}`}
                        onClick={() => setSettings({ ...settings, gateway: 'asaas' })}
                    >
                        <div className={styles.gatewayHeader}>
                            <Wallet size={24} />
                            <span>Asaas</span>
                        </div>
                        <p>PIX, boleto, cartão. Taxas a partir de 2,99%.</p>
                    </button>
                </div>
            </div>

            {/* Mercado Pago Config */}
            {settings.gateway === 'mercadopago' && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Key size={20} />
                        Credenciais Mercado Pago
                    </h2>
                    <p className={styles.sectionDesc}>
                        Acesse <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" rel="noopener noreferrer">mercadopago.com.br/developers <ExternalLink size={12} /></a>
                        → Suas integrações → Credenciais de produção
                    </p>

                    <div className={styles.fieldsGrid}>
                        <div className={styles.field}>
                            <label>Access Token *</label>
                            <input
                                type="password"
                                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..."
                                value={settings.mp_access_token}
                                onChange={(e) => setSettings({ ...settings, mp_access_token: e.target.value })}
                            />
                            <span className={styles.hint}>Token secreto para criar cobranças</span>
                        </div>

                        <div className={styles.field}>
                            <label>Public Key *</label>
                            <input
                                type="password"
                                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..."
                                value={settings.mp_public_key}
                                onChange={(e) => setSettings({ ...settings, mp_public_key: e.target.value })}
                            />
                            <span className={styles.hint}>Chave pública para checkout</span>
                        </div>
                    </div>

                    <div className={styles.webhookSection}>
                        <label>URL do Webhook (configure no Mercado Pago):</label>
                        <div className={styles.webhookBox}>
                            <input type="text" value={`${webhookUrl}/mercadopago`} readOnly />
                            <button onClick={() => copyWebhook(`${webhookUrl}/mercadopago`)}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <span className={styles.hint}>Configurações → Webhooks → Adicionar URL</span>
                    </div>
                </div>
            )}

            {/* Asaas Config */}
            {settings.gateway === 'asaas' && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Key size={20} />
                        Credenciais Asaas
                    </h2>
                    <p className={styles.sectionDesc}>
                        Acesse <a href="https://app.asaas.com" target="_blank" rel="noopener noreferrer">app.asaas.com <ExternalLink size={12} /></a>
                        → Configurações → Integrações
                    </p>

                    <div className={styles.fieldsGrid}>
                        <div className={styles.field}>
                            <label>Chave de API *</label>
                            <input
                                type="password"
                                placeholder="$aact_YTU5YTE0M2M2YmU..."
                                value={settings.asaas_api_key}
                                onChange={(e) => setSettings({ ...settings, asaas_api_key: e.target.value })}
                            />
                            <span className={styles.hint}>Gerar Chave de API → Copiar</span>
                        </div>

                        <div className={styles.field}>
                            <label>Token do Webhook</label>
                            <input
                                type="password"
                                placeholder="Token de autenticação..."
                                value={settings.asaas_webhook_token}
                                onChange={(e) => setSettings({ ...settings, asaas_webhook_token: e.target.value })}
                            />
                            <span className={styles.hint}>Webhooks → Configurar → Token</span>
                        </div>
                    </div>

                    <div className={styles.webhookSection}>
                        <label>URL do Webhook (configure no Asaas):</label>
                        <div className={styles.webhookBox}>
                            <input type="text" value={`${webhookUrl}/asaas`} readOnly />
                            <button onClick={() => copyWebhook(`${webhookUrl}/asaas`)}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        <span className={styles.hint}>Integrações → Webhooks → Adicionar URL</span>
                    </div>
                </div>
            )}

            {/* Save Button */}
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
                    <>
                        <Check size={18} />
                        Salvar Configurações
                    </>
                )}
            </button>
        </div>
    );
}
