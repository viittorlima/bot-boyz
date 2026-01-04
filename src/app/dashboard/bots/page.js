'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Plus, Users, MessageSquare, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react';
import { botsAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import TutorialCard from '@/components/ui/TutorialCard';
import styles from './page.module.css';

export default function BotsPage() {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBotToken, setNewBotToken] = useState('');
    const [newBotName, setNewBotName] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');

    const { showToast } = useToast();

    useEffect(() => {
        loadBots();
    }, []);

    const loadBots = async () => {
        try {
            const response = await botsAPI.list();
            setBots(response.data.bots || []);
        } catch (error) {
            console.error('Error loading bots:', error);
            showToast('Erro ao carregar bots', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectBot = async (e) => {
        e.preventDefault();
        setError('');
        setConnecting(true);

        try {
            const response = await botsAPI.connect(newBotToken, newBotName);
            showToast('Bot conectado com sucesso!', 'success');
            setBots([response.data.bot, ...bots]);
            setShowModal(false);
            setNewBotToken('');
            setNewBotName('');
        } catch (err) {
            console.error('Error connecting bot:', err);
            setError(
                err.response?.data?.error ||
                'Erro ao conectar bot. Verifique o token.'
            );
        } finally {
            setConnecting(false);
        }
    };

    const botFatherTutorial = [
        'Abra o Telegram e busque por @BotFather',
        'Envie o comando /newbot',
        'Escolha um nome para seu bot (ex: "Meu VIP Bot")',
        'Escolha um username (deve terminar em "bot")',
        'Copie o HTTP API Token gerado',
        'Cole o token aqui e clique em Conectar'
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Carregando bots...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Meus Bots</h1>
                    <p className={styles.subtitle}>Gerencie seus bots do Telegram</p>
                </div>
                <button
                    className={styles.addButton}
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Conectar Bot
                </button>
            </div>

            {bots.length === 0 ? (
                <div className={styles.emptyState}>
                    <Bot size={48} className={styles.emptyIcon} />
                    <h3>Nenhum bot conectado</h3>
                    <p>Conecte seu primeiro bot do Telegram</p>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={18} />
                        Conectar Bot
                    </button>
                </div>
            ) : (
                <div className={styles.botsGrid}>
                    {bots.map((bot) => (
                        <Link
                            key={bot.id}
                            href={`/dashboard/bots/${bot.id}`}
                            className={styles.botCard}
                        >
                            <div className={styles.botHeader}>
                                <div className={styles.botIcon}>
                                    <Bot size={24} />
                                </div>
                                <span className={`${styles.botStatus} ${styles[bot.status]}`}>
                                    {bot.status === 'active' ? 'Ativo' : 'Pausado'}
                                </span>
                            </div>

                            <h3 className={styles.botName}>{bot.name || bot.username}</h3>
                            <p className={styles.botUsername}>@{bot.username}</p>

                            <div className={styles.botStats}>
                                <div className={styles.botStat}>
                                    <Users size={16} />
                                    <span>{bot.plans?.length || 0} planos</span>
                                </div>
                            </div>

                            <div className={styles.botAction}>
                                <span>Configurar</span>
                                <ChevronRight size={16} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Connect Bot Modal */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Conectar Bot</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <TutorialCard
                            title="Como criar um Bot no Telegram"
                            steps={botFatherTutorial}
                            link="https://t.me/BotFather"
                            linkText="Abrir @BotFather"
                            defaultOpen={true}
                        />

                        {error && (
                            <div className={styles.errorAlert}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleConnectBot} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label>Nome do Bot (opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Meu VIP Premium"
                                    value={newBotName}
                                    onChange={(e) => setNewBotName(e.target.value)}
                                    className={styles.input}
                                    disabled={connecting}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Token do BotFather *</label>
                                <input
                                    type="text"
                                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                    value={newBotToken}
                                    onChange={(e) => setNewBotToken(e.target.value)}
                                    className={styles.input}
                                    required
                                    disabled={connecting}
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={connecting || !newBotToken}
                            >
                                {connecting ? (
                                    <>
                                        <Loader2 size={18} className={styles.spinner} />
                                        Conectando...
                                    </>
                                ) : (
                                    'Conectar Bot'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
