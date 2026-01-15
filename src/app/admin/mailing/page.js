'use client';

import { useState, useEffect } from 'react';
import {
    Mail, Send, Loader2, Trash2, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function MailingPage() {
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        type: 'text',
        filter_status: 'vips',
        filter_behavior: 'all',
        filter_origin: 'all',
        message_text: '',
        media_url: '',
        button_text: '',
        button_url: '',
        send_now: true
    });

    useEffect(() => {
        loadBroadcasts();
    }, []);

    const loadBroadcasts = async () => {
        try {
            const res = await api.get('/admin/broadcasts');
            if (res.data && res.data.broadcasts) {
                setBroadcasts(res.data.broadcasts);
            }
        } catch (error) {
            console.error('Error loading broadcasts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/admin/broadcasts', formData);
            setMessage({ type: 'success', text: 'Mailing criado com sucesso!' });
            setFormData({
                type: 'text',
                filter_status: 'vips',
                filter_behavior: 'all',
                filter_origin: 'all',
                message_text: '',
                media_url: '',
                button_text: '',
                button_url: '',
                send_now: true
            });
            loadBroadcasts();
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao criar mailing.' });
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await api.delete(`/admin/broadcasts/${id}`);
            loadBroadcasts();
        } catch (e) {
            alert('Erro ao excluir');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <Mail size={24} />
                    Mailing (Broadcast)
                </h1>
                <p className={styles.subtitle}>Envie mensagens em massa para seus usuários</p>
            </div>

            {/* Creation Form */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Novo Envio</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.grid}>
                        {/* Filters */}
                        <div className={styles.section}>
                            <h3>Filtros de Destinatários</h3>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <label>Status</label>
                                    <select
                                        value={formData.filter_status}
                                        onChange={e => setFormData({ ...formData, filter_status: e.target.value })}
                                    >
                                        <option value="vips">VIPs (Ativos)</option>
                                        <option value="new">Novos (7 dias)</option>
                                        <option value="expired">Expirados</option>
                                        <option value="pending">Pendentes</option>
                                        <option value="all">Todos</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Comportamento</label>
                                    <select
                                        value={formData.filter_behavior}
                                        onChange={e => setFormData({ ...formData, filter_behavior: e.target.value })}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="upsellers">Upsellers (Comprou +)</option>
                                        <option value="downsellers">Downsellers</option>
                                        <option value="order_bump">Order Bump</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Origem</label>
                                    <select
                                        value={formData.filter_origin}
                                        onChange={e => setFormData({ ...formData, filter_origin: e.target.value })}
                                    >
                                        <option value="all">Todas</option>
                                        <option value="packages">Pacotes</option>
                                        <option value="premium">Telegram Premium</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className={styles.section}>
                            <h3>Conteúdo da Mensagem</h3>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <label>Tipo de Mídia</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="text">Apenas Texto</option>
                                        <option value="photo">Foto</option>
                                        <option value="video">Vídeo</option>
                                        <option value="audio">Áudio (OGG)</option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label>Mensagem / Legenda</label>
                                    <textarea
                                        rows={4}
                                        value={formData.message_text}
                                        onChange={e => setFormData({ ...formData, message_text: e.target.value })}
                                        placeholder="Digite sua mensagem aqui..."
                                        required
                                    />
                                </div>

                                {formData.type !== 'text' && (
                                    <div className={styles.field}>
                                        <label>URL da Mídia (Upload em breve)</label>
                                        <input
                                            type="url"
                                            value={formData.media_url}
                                            onChange={e => setFormData({ ...formData, media_url: e.target.value })}
                                            placeholder="https://exemplo.com/imagem.jpg"
                                            required
                                        />
                                    </div>
                                )}

                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Texto do Botão (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.button_text}
                                            onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                                            placeholder="Ex: Clique Aqui"
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Link do Botão (Opcional)</label>
                                        <input
                                            type="url"
                                            value={formData.button_url}
                                            onChange={e => setFormData({ ...formData, button_url: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`${styles.message} ${styles[message.type]}`}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn} disabled={sending}>
                            {sending ? <Loader2 className={styles.spinner} /> : <Send size={18} />}
                            {sending ? 'Enviando...' : 'Enviar Mailing'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className={styles.listSection}>
                <div className={styles.listHeader}>
                    <h2>Histórico de Envios</h2>
                    <button onClick={loadBroadcasts} className={styles.refreshBtn}>
                        <RefreshCw size={16} />
                    </button>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Mensagem</th>
                                <th>Destinatários</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {broadcasts.map(b => (
                                <tr key={b.id}>
                                    <td>{new Date(b.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className={styles.messageCol}>{b.message_text.substring(0, 50)}...</td>
                                    <td>
                                        {b.sent_count} / {b.total_recipients || '?'}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className={styles.deleteBtn}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
