'use client';

import { useState } from 'react';
import { CreditCard, Save, AlertCircle, Check } from 'lucide-react';
import { gatewayConfig as initialConfig } from '@/utils/mockData';
import styles from './page.module.css';

export default function GatewaysPage() {
    const [config, setConfig] = useState(initialConfig);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gateways de Pagamento</h1>
                    <p className={styles.subtitle}>Configure a integração de pagamentos</p>
                </div>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className={styles.cardTitle}>Configuração do Gateway</h2>
                            <p className={styles.cardSubtitle}>
                                Conecte seu gateway de pagamento para receber vendas
                            </p>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Provedor</label>
                            <select
                                value={config.provider}
                                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                                className={styles.select}
                            >
                                <option value="asaas">Asaas</option>
                                <option value="mercadopago">Mercado Pago</option>
                                <option value="stripe">Stripe</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Token de API (Produção)</label>
                            <input
                                type="password"
                                value={config.apiToken}
                                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                                placeholder="Insira seu token de produção"
                                className={styles.input}
                            />
                            <span className={styles.helper}>
                                Encontre seu token no painel do provedor
                            </span>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Taxa de Comissão Global (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={config.commissionPercent}
                                onChange={(e) => setConfig({ ...config, commissionPercent: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                            />
                            <span className={styles.helper}>
                                Porcentagem que a plataforma retém de cada venda
                            </span>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Ambiente</label>
                            <div className={styles.toggleGroup}>
                                <button
                                    type="button"
                                    className={`${styles.toggleButton} ${!config.isProduction ? styles.active : ''}`}
                                    onClick={() => setConfig({ ...config, isProduction: false })}
                                >
                                    Sandbox
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toggleButton} ${config.isProduction ? styles.active : ''}`}
                                    onClick={() => setConfig({ ...config, isProduction: true })}
                                >
                                    Produção
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.infoCard}>
                    <AlertCircle size={20} />
                    <div>
                        <strong>Importante:</strong> Ao usar o ambiente de produção, todas as transações serão reais.
                        Teste primeiro no ambiente Sandbox.
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveButton}>
                        {isSaved ? (
                            <>
                                <Check size={18} />
                                Salvo com sucesso
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Salvar Configurações
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
