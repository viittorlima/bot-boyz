'use client';

import { useState, useEffect } from 'react';
import {
    Mail, Send, Loader2, CheckCircle, AlertCircle, Image, Video, Type, ExternalLink, Bot
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function CreatorMailingPage() {
    const [bots, setBots] = useState([]);
    const [loadingBots, setLoadingBots] = useState(true);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        bot_id: 'all',
        type: 'text',
        filter: 'all',
        message: '',
        media_url: '',
        buttons: []
    });

    // Button state
    const [buttonText, setButtonText] = useState('');
    const [buttonUrl, setButtonUrl] = useState('');

    useEffect(() => {
        loadBots();
    }, []);

    const loadBots = async () => {
        try {
            const res = await api.get('/bots');
            if (res.data && res.data.bots) {
                setBots(res.data.bots);
            }
        } catch (error) {
            console.error('Error loading bots:', error);
        } finally {
            setLoadingBots(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.message && !formData.media_url) {
            setResult({ type: 'error', text: 'Digite uma mensagem ou adicione mídia.' });
            return;
        }

        setSending(true);
        setResult({ type: '', text: '' });

        try {
            // Build buttons array
            const buttons = [];
            if (buttonText && buttonUrl) {
                buttons.push({ text: buttonText, url: buttonUrl });
            }

            const response = await api.post('/creator/broadcasts', {
                ...formData,
                buttons
            });

            setResult({
                type: 'success',
                text: `✅ Enviado! ${response.data.stats.sent} mensagens enviadas, ${response.data.stats.failed} falhas.`
            });

            // Reset form
            setFormData({
                bot_id: 'all',
                type: 'text',
                filter: 'all',
                message: '',
                media_url: '',
                buttons: []
            });
            setButtonText('');
            setButtonUrl('');
        } catch (error) {
            setResult({ type: 'error', text: error.response?.data?.error || 'Erro ao enviar broadcast.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <Mail size={28} />
                    Mailing
                </h1>
                <p className={styles.subtitle}>Envie mensagens para os assinantes dos seus bots</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.card}>
                {/* Bot Selection */}
                <div className={styles.section}>
                    <h3>Selecionar Bot</h3>
                    <div className={styles.botGrid}>
                        <button
                            type="button"
                            className={`${styles.botCard} ${formData.bot_id === 'all' ? styles.active : ''}`}
                            onClick={() => setFormData({ ...formData, bot_id: 'all' })}
                        >
                            <Bot size={20} />
                            <span>Todos os Bots</span>
                        </button>
                        {bots.map(bot => (
                            <button
                                key={bot.id}
                                type="button"
                                className={`${styles.botCard} ${formData.bot_id === bot.id ? styles.active : ''}`}
                                onClick={() => setFormData({ ...formData, bot_id: bot.id })}
                            >
                                <Bot size={20} />
                                <span>@{bot.username || bot.name}</span>
                            </button>
                        ))}
                    </div>
                    {loadingBots && <p className={styles.loading}>Carregando bots...</p>}
                </div>

                {/* Message Type */}
                <div className={styles.section}>
                    <h3>Tipo de Mensagem</h3>
                    <div className={styles.typeGrid}>
                        <button
                            type="button"
                            className={`${styles.typeCard} ${formData.type === 'text' ? styles.active : ''}`}
                            onClick={() => setFormData({ ...formData, type: 'text' })}
                        >
                            <Type size={24} />
                            <span>Texto</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeCard} ${formData.type === 'photo' ? styles.active : ''}`}
                            onClick={() => setFormData({ ...formData, type: 'photo' })}
                        >
                            <Image size={24} />
                            <span>Foto</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeCard} ${formData.type === 'video' ? styles.active : ''}`}
                            onClick={() => setFormData({ ...formData, type: 'video' })}
                        >
                            <Video size={24} />
                            <span>Vídeo</span>
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className={styles.section}>
                    <h3>Destinatários</h3>
                    <select
                        value={formData.filter}
                        onChange={e => setFormData({ ...formData, filter: e.target.value })}
                        className={styles.select}
                    >
                        <option value="all">Todos os assinantes</option>
                        <option value="active">Assinantes ativos (VIPs)</option>
                        <option value="expired">Assinaturas expiradas</option>
                    </select>
                </div>

                {/* Content */}
                <div className={styles.section}>
                    <h3>Conteúdo</h3>

                    {formData.type !== 'text' && (
                        <div className={styles.field}>
                            <label>URL da Mídia</label>
                            <input
                                type="url"
                                value={formData.media_url}
                                onChange={e => setFormData({ ...formData, media_url: e.target.value })}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className={styles.input}
                            />
                            <span className={styles.hint}>
                                {formData.type === 'photo' ? 'JPG, PNG até 10MB' : 'MP4 até 25MB'}
                            </span>
                        </div>
                    )}

                    <div className={styles.field}>
                        <label>{formData.type === 'text' ? 'Mensagem' : 'Legenda (opcional)'}</label>
                        <textarea
                            rows={5}
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Digite sua mensagem aqui... Suporta *negrito* e _itálico_"
                            className={styles.textarea}
                        />
                    </div>
                </div>

                {/* Promo Button */}
                <div className={styles.section}>
                    <h3>Botão de Promoção (Opcional)</h3>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Texto do Botão</label>
                            <input
                                type="text"
                                value={buttonText}
                                onChange={e => setButtonText(e.target.value)}
                                placeholder="Ex: 🔥 Ver Oferta"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Link do Botão</label>
                            <input
                                type="url"
                                value={buttonUrl}
                                onChange={e => setButtonUrl(e.target.value)}
                                placeholder="https://..."
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview */}
                {(formData.message || formData.media_url) && (
                    <div className={styles.preview}>
                        <h4>Preview</h4>
                        <div className={styles.previewBox}>
                            {formData.media_url && formData.type === 'photo' && (
                                <img src={formData.media_url} alt="Preview" className={styles.previewImage} />
                            )}
                            {formData.media_url && formData.type === 'video' && (
                                <video src={formData.media_url} controls className={styles.previewVideo} />
                            )}
                            {formData.message && (
                                <p className={styles.previewText}>{formData.message}</p>
                            )}
                            {buttonText && buttonUrl && (
                                <div className={styles.previewButton}>
                                    <ExternalLink size={14} />
                                    {buttonText}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Result Message */}
                {result.text && (
                    <div className={`${styles.result} ${styles[result.type]}`}>
                        {result.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {result.text}
                    </div>
                )}

                {/* Submit */}
                <button type="submit" className={styles.submitBtn} disabled={sending || bots.length === 0}>
                    {sending ? (
                        <>
                            <Loader2 className={styles.spinner} size={18} />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Enviar para Assinantes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
