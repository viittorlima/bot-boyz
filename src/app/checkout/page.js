'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    CreditCard,
    QrCode,
    Loader2,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowLeft
} from 'lucide-react';
import api from '@/services/api';
import styles from './page.module.css';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');
    const ref = searchParams.get('ref');
    const tgId = searchParams.get('tg_id');
    const tgName = searchParams.get('tg_name');
    const tgUser = searchParams.get('tg_user');

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('pix');
    const [generating, setGenerating] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState('');

    useEffect(() => {
        if (planId) {
            loadPlan();
        }
    }, [planId]);

    useEffect(() => {
        // Poll for payment status when we have payment data
        if (paymentData?.paymentId) {
            const interval = setInterval(checkPaymentStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [paymentData]);

    const loadPlan = async () => {
        try {
            const response = await api.get(`/plans/${planId}`);
            setPlan(response.data.plan);
        } catch (err) {
            setError('Plano não encontrado');
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const response = await api.get(`/checkout/status/${paymentData.paymentId}`);
            if (response.data.status === 'paid' || response.data.status === 'confirmed') {
                setStatus('success');
            }
        } catch (err) {
            console.error('Status check error:', err);
        }
    };

    const handlePayment = async () => {
        setGenerating(true);
        setError('');
        setStatus('processing');

        try {
            const response = await api.post('/checkout/create', {
                planId,
                paymentMethod,
                telegramId: tgId,
                telegramName: tgName,
                telegramUsername: tgUser,
                externalRef: ref
            });

            if (response.data.paymentUrl) {
                // Redirect to external payment
                window.location.href = response.data.paymentUrl;
            } else {
                // PIX - show QR code
                setPaymentData(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao gerar pagamento');
            setStatus('error');
        } finally {
            setGenerating(false);
        }
    };

    const copyPixCode = () => {
        if (paymentData?.pixCopyPaste) {
            navigator.clipboard.writeText(paymentData.pixCopyPaste);
        }
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

    if (error && !plan) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <AlertCircle size={48} />
                    <h2>Erro</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className={styles.container}>
                <div className={styles.successState}>
                    <CheckCircle size={64} />
                    <h2>Pagamento Confirmado!</h2>
                    <p>Volte ao Telegram para receber o link do grupo VIP.</p>
                    <a
                        href={`https://t.me/${plan?.bot?.username || ''}`}
                        className={styles.telegramButton}
                    >
                        Abrir Telegram
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Finalizar Compra</h1>

                {/* Plan Summary */}
                <div className={styles.planSummary}>
                    <div className={styles.planInfo}>
                        <h2>{plan?.name}</h2>
                        <span className={styles.duration}>
                            {plan?.duration_days === 0
                                ? 'Vitalício'
                                : `${plan?.duration_days} dias`
                            }
                        </span>
                    </div>
                    <div className={styles.planPrice}>
                        R$ {parseFloat(plan?.price || 0).toFixed(2).replace('.', ',')}
                    </div>
                </div>

                {/* User Info */}
                {tgName && (
                    <div className={styles.userInfo}>
                        <span>Assinante:</span>
                        <strong>{tgName} {tgUser && `(@${tgUser})`}</strong>
                    </div>
                )}

                {/* Payment Method Selection */}
                {!paymentData && (
                    <>
                        <div className={styles.methodSection}>
                            <h3>Forma de Pagamento</h3>

                            <div className={styles.methods}>
                                <button
                                    className={`${styles.methodCard} ${paymentMethod === 'pix' ? styles.selected : ''}`}
                                    onClick={() => setPaymentMethod('pix')}
                                >
                                    <QrCode size={28} />
                                    <span>PIX</span>
                                    <span className={styles.methodDesc}>Aprovação instantânea</span>
                                </button>

                                <button
                                    className={`${styles.methodCard} ${paymentMethod === 'credit_card' ? styles.selected : ''}`}
                                    onClick={() => setPaymentMethod('credit_card')}
                                >
                                    <CreditCard size={28} />
                                    <span>Cartão</span>
                                    <span className={styles.methodDesc}>Crédito em até 12x</span>
                                </button>
                            </div>
                        </div>

                        <button
                            className={styles.payButton}
                            onClick={handlePayment}
                            disabled={generating}
                        >
                            {generating ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} />
                                    Gerando...
                                </>
                            ) : (
                                'Continuar para Pagamento'
                            )}
                        </button>
                    </>
                )}

                {/* PIX Payment */}
                {paymentData && paymentMethod === 'pix' && (
                    <div className={styles.pixSection}>
                        <div className={styles.pixQr}>
                            {paymentData.qrCodeImage && (
                                <img
                                    src={paymentData.qrCodeImage}
                                    alt="PIX QR Code"
                                />
                            )}
                        </div>

                        <div className={styles.pixCode}>
                            <label>Código PIX Copia e Cola:</label>
                            <div className={styles.codeBox}>
                                <input
                                    type="text"
                                    value={paymentData.pixCopyPaste || ''}
                                    readOnly
                                />
                                <button onClick={copyPixCode}>Copiar</button>
                            </div>
                        </div>

                        <div className={styles.waitingPayment}>
                            <Clock size={20} className={styles.spinner} />
                            <span>Aguardando pagamento...</span>
                        </div>
                    </div>
                )}

                {error && <div className={styles.errorMsg}>{error}</div>}
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.loading}>
                    <Loader2 size={32} className={styles.spinner} />
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
