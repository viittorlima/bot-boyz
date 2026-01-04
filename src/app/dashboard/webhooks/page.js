'use client';

import { useState } from 'react';
import { Webhook, Copy, Check, RefreshCw } from 'lucide-react';
import { webhookLogs, gatewayConfig } from '@/utils/mockData';
import { StatusBadge } from '@/components/ui/Badge';
import styles from './page.module.css';

export default function WebhooksPage() {
    const [copied, setCopied] = useState(false);

    const copyUrl = () => {
        navigator.clipboard.writeText(gatewayConfig.webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Webhooks</h1>
                    <p className={styles.subtitle}>Endpoint e logs de transações</p>
                </div>
                <button className={styles.refreshButton}>
                    <RefreshCw size={16} />
                    Atualizar
                </button>
            </div>

            {/* Webhook URL Card */}
            <div className={styles.urlCard}>
                <div className={styles.urlHeader}>
                    <div className={styles.urlIcon}>
                        <Webhook size={20} />
                    </div>
                    <div>
                        <h2 className={styles.urlTitle}>URL do Webhook</h2>
                        <p className={styles.urlSubtitle}>
                            Configure esta URL no painel do seu gateway
                        </p>
                    </div>
                </div>
                <div className={styles.urlBox}>
                    <code>{gatewayConfig.webhookUrl}</code>
                    <button className={styles.copyButton} onClick={copyUrl}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className={styles.logsCard}>
                <div className={styles.logsHeader}>
                    <h2 className={styles.logsTitle}>Logs Recentes</h2>
                    <span className={styles.logsCount}>{webhookLogs.length} registros</span>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Criador</th>
                                <th>Status</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {webhookLogs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <code className={styles.logId}>{log.id}</code>
                                    </td>
                                    <td>
                                        <span className={styles.logType}>{log.type}</span>
                                    </td>
                                    <td>
                                        <span className={styles.logAmount}>
                                            R$ {log.amount.toFixed(2).replace('.', ',')}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.logCreator}>@{log.creator}</span>
                                    </td>
                                    <td>
                                        <StatusBadge status={log.status === 'success' ? 'active' : 'paused'} />
                                    </td>
                                    <td>
                                        <span className={styles.logDate}>{formatDate(log.timestamp)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
