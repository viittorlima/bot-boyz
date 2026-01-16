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
                                <option value="syncpay">SyncPay</option>
                                <option value="paradisepag">ParadisePag</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>API Key / Token</label>
                            <input
                                type="password"
                                value={config.apiToken}
                                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                                placeholder="Insira sua chave de API"
                                className={styles.input}
                            />
                            <span className={styles.helper}>
                                Encontre sua chave no painel do provedor
                            </span>
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
