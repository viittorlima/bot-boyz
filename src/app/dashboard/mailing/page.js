'use client';

import { useState, useEffect } from 'react';
import {
    Mail, Send, Loader2, CheckCircle, AlertCircle, Image, Video, Type, ExternalLink, Bot, Users
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

export default function CreatorMailingPage() {
    const [bots, setBots] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loadingBots, setLoadingBots] = useState(true);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState({ type: '', text: '' });
    const [hasGateway, setHasGateway] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        bot_id: '',
        type: 'text',
        filter: 'all',
        message: '',
        media_url: '',
        buttons: [],
        isCheckout: false
    });

    // Button state
    const [buttonText, setButtonText] = useState('');
    const [buttonUrl, setButtonUrl] = useState('');
    const [offerAmount, setOfferAmount] = useState('');

    useEffect(() => {
        loadBots();
    }, []);

    // Load plans when bot changes
    useEffect(() => {
        if (formData.bot_id && formData.bot_id !== 'all') {
            loadPlans(formData.bot_id);
        } else {
            setPlans([]);
        }
    }, [formData.bot_id]);

    const loadBots = async () => {
        try {
            const res = await api.get('/bots');
            if (res.data && res.data.bots) {
                setBots(res.data.bots);
                setHasGateway(res.data.hasGateway);
                // Auto-select first bot if available
                if (res.data.bots.length > 0) {
                    setFormData(prev => ({ ...prev, bot_id: res.data.bots[0].id }));
                }
            }
        } catch (error) {
            console.error('Error loading bots:', error);
        } finally {
            setLoadingBots(false);
        }
    };

    const loadPlans = async (botId) => {
        try {
            const res = await api.get(`/bots/${botId}`);
            if (res.data && res.data.bot && res.data.bot.plans) {
                setPlans(res.data.bot.plans);
            }
        } catch (error) {
            console.error('Error loading plans:', error);
            setPlans([]);
        }
    };

    const handleBotSelect = (botId) => {
        setFormData({ ...formData, bot_id: botId, filter: 'all' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bot_id) {
            setResult({ type: 'error', text: 'Selecione um bot.' });
            return;
        }

        if (!formData.message && !formData.media_url) {
            setResult({ type: 'error', text: 'Digite uma mensagem ou adicione mídia.' });
            return;
        }

        // Validate Checkout Mode
        let finalButtons = [];
        if (formData.isCheckout) {
            if (!hasGateway) {
                setResult({ type: 'error', text: 'Gateway de pagamento não configurado.' });
                return;
            }
            if (!offerAmount || parseFloat(offerAmount) <= 0) {
                setResult({ type: 'error', text: 'Digite um valor válido para a oferta.' });
                return;
            }
            if (!buttonText) {
                setResult({ type: 'error', text: 'Digite o texto do botão.' });
                return;
            }

            // Generate Checkout URL
            const checkoutUrl = `${window.location.origin}/checkout?bot_id=${formData.bot_id}&amount=${offerAmount}&desc=${encodeURIComponent(buttonText)}`;
            finalButtons.push({ text: buttonText, url: checkoutUrl });
        } else {
            // Standard Button Mode
            if (buttonText && buttonUrl) {
                finalButtons.push({ text: buttonText, url: buttonUrl });
            }
        }

        setSending(true);
        setResult({ type: '', text: '' });

        try {
            const response = await api.post('/creator/broadcasts', {
                ...formData,
                buttons: finalButtons
            });

            setResult({
                type: 'success',
                text: `✅ Enviado! ${response.data.stats.sent} mensagens enviadas, ${response.data.stats.failed} falhas.`
            });

            // Reset form
            setFormData(prev => ({
                ...prev,
                type: 'text',
                filter: 'all',
                message: '',
                media_url: '',
                buttons: [],
                isCheckout: false
            }));
            setButtonText('');
            setButtonUrl('');
            setOfferAmount('');
        } catch (error) {
            setResult({ type: 'error', text: error.response?.data?.error || 'Erro ao enviar broadcast.' });
        } finally {
            setSending(false);
        }
    };

    const selectedBot = bots.find(b => b.id === formData.bot_id);

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
                    {loadingBots ? (
                        <p className={styles.loading}>Carregando bots...</p>
                    ) : bots.length === 0 ? (
                        <div className={styles.emptyBots}>
                            <Bot size={32} />
                            <p>Você ainda não possui bots cadastrados.</p>
                            <a href="/dashboard/bots" className={styles.createBotBtn}>
                                Criar meu primeiro Bot
                            </a>
                        </div>
                    ) : (
                        <div className={styles.botGrid}>
                            <button
                                type="button"
                                className={`${styles.botCard} ${formData.bot_id === 'all' ? styles.active : ''}`}
                                onClick={() => handleBotSelect('all')}
                            >
                                <Bot size={20} />
                                <span>Todos os Bots</span>
                            </button>
                            {bots.map(bot => (
                                <button
                                    key={bot.id}
                                    type="button"
                                    className={`${styles.botCard} ${formData.bot_id === bot.id ? styles.active : ''}`}
                                    onClick={() => handleBotSelect(bot.id)}
                                >
                                    <Bot size={20} />
                                    <span>@{bot.username || bot.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
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

                {/* Recipients Filter */}
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
                        {plans.length > 0 && (
                            <optgroup label="Por Plano">
                                {plans.map(plan => (
                                    <option key={plan.id} value={`plan_${plan.id}`}>
                                        {plan.name} - R$ {parseFloat(plan.price).toFixed(2).replace('.', ',')}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                    {selectedBot && (
                        <span className={styles.hint}>
                            <Users size={12} style={{ display: 'inline', marginRight: 4 }} />
                            Enviando para @{selectedBot.username || selectedBot.name}
                        </span>
                    )}
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
                    <h3>Botão de Promoção / Checkout</h3>
                    <p className={styles.hint} style={{ marginBottom: 12 }}>
                        Adicione um botão clicável abaixo da mensagem.
                    </p>

                    {/* Button Type Selector */}
                    <div className={styles.buttonTypeSelector} style={{ marginBottom: 16 }}>
                        <div className={styles.row}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="btnType"
                                    checked={!formData.isCheckout}
                                    onChange={() => setFormData({ ...formData, isCheckout: false })}
                                />
                                Link Externo
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="btnType"
                                    checked={formData.isCheckout}
                                    onChange={() => setFormData({ ...formData, isCheckout: true })}
                                />
                                Checkout / Oferta (Cobrança)
                            </label>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Título do Botão</label>
                            <input
                                type="text"
                                value={buttonText}
                                onChange={e => setButtonText(e.target.value)}
                                placeholder={formData.isCheckout ? "Ex: 🚀 Comprar por R$ 29,90" : "Ex: 🔥 Ver Oferta"}
                                className={styles.input}
                            />
                        </div>

                        {formData.isCheckout ? (
                            <div className={styles.field}>
                                <label>Valor da Promoção (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={offerAmount}
                                    onChange={e => setOfferAmount(e.target.value)}
                                    placeholder="29.90"
                                    className={styles.input}
                                />
                                <span className={styles.hint}>
                                    O link de checkout será gerado automaticamente.
                                </span>
                            </div>
                        ) : (
                            <div className={styles.field}>
                                <label>Link de Destino</label>
                                <input
                                    type="url"
                                    value={buttonUrl}
                                    onChange={e => setButtonUrl(e.target.value)}
                                    placeholder="https://"
                                    className={styles.input}
                                />
                            </div>
                        )}
                    </div>

                    {formData.isCheckout && !hasGateway && (
                        <div className={`${styles.result} ${styles.error}`} style={{ marginTop: 8 }}>
                            <AlertCircle size={16} />
                            Você precisa configurar um Gateway de Pagamento na aba Financeiro para usar o Checkout.
                        </div>
                    )}
                </div>

                {/* Telegram Preview */}
                {(formData.message || formData.media_url) && (
                    <div className={styles.section}>
                        <h3>Preview (Telegram)</h3>
                        <div className={styles.preview}>
                            {/* Header */}
                            <div className={styles.telegramHeader}>
                                <div className={styles.telegramAvatar}>
                                    {selectedBot?.name?.[0] || 'B'}
                                </div>
                                <div className={styles.telegramInfo}>
                                    <span className={styles.telegramName}>{selectedBot?.name || 'Bot VIP'}</span>
                                    <span className={styles.telegramStatus}>bot</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className={styles.telegramBody}>
                                <div className={styles.telegramDate}>Hoje</div>

                                {/* Message Bubble */}
                                <div className={styles.telegramBubble}>
                                    {/* Media */}
                                    {formData.media_url && (
                                        <div className={styles.telegramMedia}>
                                            {formData.type === 'photo' ? (
                                                <img src={formData.media_url} alt="Media" />
                                            ) : (
                                                <video src={formData.media_url} controls />
                                            )}
                                        </div>
                                    )}

                                    {/* Text */}
                                    {formData.message && (
                                        <div className={styles.telegramContent}>
                                            {formData.message}
                                            <span className={styles.telegramMeta}>
                                                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Inline Buttons */}
                                {buttonText && (
                                    <div className={styles.telegramButtons}>
                                        <div className={styles.telegramButton}>
                                            {buttonText}
                                            <ExternalLink size={12} style={{ opacity: 0.7 }} />
                                        </div>
                                    </div>
                                )}
                            </div>
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
