'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './page.module.css';

export default function TermsPage() {
    const [content, setContent] = useState({
        termsOfUse: '',
        privacyPolicy: '',
        disclaimer: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const response = await api.get('/public/legal');
            if (response.data) {
                setContent(response.data);
            }
        } catch (error) {
            console.error('Error loading legal content:', error);
            // Use default content
            setContent({
                termsOfUse: getDefaultTerms(),
                privacyPolicy: getDefaultPrivacy(),
                disclaimer: getDefaultDisclaimer()
            });
        } finally {
            setLoading(false);
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

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={18} />
                    Voltar ao início
                </Link>

                <div className={styles.header}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>B</div>
                        <span>Boyz Vip</span>
                    </div>
                    <h1>Termos e Condições</h1>
                    <p>Última atualização: Janeiro 2026</p>
                </div>

                {/* Terms of Use */}
                <section className={styles.section}>
                    <h2>
                        <FileText size={24} />
                        Termos de Uso
                    </h2>
                    <div className={styles.text}>
                        {content.termsOfUse ? (
                            <div dangerouslySetInnerHTML={{ __html: content.termsOfUse.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <DefaultTerms />
                        )}
                    </div>
                </section>

                {/* Privacy Policy */}
                <section className={styles.section}>
                    <h2>
                        <FileText size={24} />
                        Política de Privacidade
                    </h2>
                    <div className={styles.text}>
                        {content.privacyPolicy ? (
                            <div dangerouslySetInnerHTML={{ __html: content.privacyPolicy.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <DefaultPrivacy />
                        )}
                    </div>
                </section>

                {/* Disclaimer */}
                <section className={styles.section}>
                    <h2>
                        <FileText size={24} />
                        Isenção de Responsabilidade
                    </h2>
                    <div className={styles.text}>
                        {content.disclaimer ? (
                            <div dangerouslySetInnerHTML={{ __html: content.disclaimer.replace(/\n/g, '<br/>') }} />
                        ) : (
                            <DefaultDisclaimer />
                        )}
                    </div>
                </section>

                <div className={styles.footer}>
                    <p>Em caso de dúvidas, entre em contato conosco.</p>
                    <Link href="/" className={styles.homeButton}>
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}

function DefaultTerms() {
    return (
        <>
            <h3>1. Aceitação dos Termos</h3>
            <p>
                Ao acessar e utilizar a plataforma Boyz Vip, você concorda em cumprir e estar vinculado
                a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não
                deverá usar nossos serviços.
            </p>

            <h3>2. Descrição do Serviço</h3>
            <p>
                A Boyz Vip é uma plataforma que permite a criadores de conteúdo monetizar grupos
                VIP no Telegram através de assinaturas automatizadas. Fornecemos ferramentas de
                gestão de bots, processamento de pagamentos e controle de acesso.
            </p>

            <h3>3. Elegibilidade</h3>
            <p>
                Para utilizar nossos serviços, você deve ter pelo menos 18 anos de idade e
                capacidade legal para celebrar contratos. Ao se cadastrar, você confirma que
                atende a esses requisitos.
            </p>

            <h3>4. Responsabilidades do Usuário</h3>
            <p>
                Você é responsável por todo conteúdo que criar, compartilhar ou distribuir através
                da plataforma. É proibido usar nossos serviços para atividades ilegais, violação
                de direitos autorais ou distribuição de conteúdo que viole leis aplicáveis.
            </p>

            <h3>5. Taxas e Pagamentos</h3>
            <p>
                Os criadores concordam em pagar as taxas aplicáveis conforme definido em seu plano
                escolhido. As taxas são automaticamente deduzidas dos pagamentos recebidos através
                do sistema de split de pagamentos.
            </p>

            <h3>6. Direitos da Plataforma</h3>
            <p>
                Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos,
                modificar os serviços oferecidos e atualizar estes termos a qualquer momento.
            </p>

            <h3>7. Limitação de Responsabilidade</h3>
            <p>
                A plataforma não se responsabiliza pelo conteúdo criado pelos usuários, falhas
                em serviços de terceiros (como gateways de pagamento) ou perdas indiretas
                decorrentes do uso de nossos serviços.
            </p>
        </>
    );
}

function DefaultPrivacy() {
    return (
        <>
            <h3>1. Dados Coletados</h3>
            <p>
                Coletamos informações necessárias para fornecer nossos serviços, incluindo:
                nome, email, dados de pagamento e informações de uso da plataforma.
            </p>

            <h3>2. Uso dos Dados</h3>
            <p>
                Seus dados são utilizados para: processar pagamentos, fornecer suporte,
                melhorar nossos serviços e enviar comunicações relevantes.
            </p>

            <h3>3. Compartilhamento</h3>
            <p>
                Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais
                (processadores de pagamento) e quando exigido por lei.
            </p>

            <h3>4. Segurança</h3>
            <p>
                Utilizamos criptografia e medidas de segurança para proteger seus dados.
                Porém, nenhum sistema é 100% seguro.
            </p>

            <h3>5. Seus Direitos</h3>
            <p>
                Você pode acessar, corrigir ou excluir seus dados a qualquer momento
                através das configurações da conta ou entrando em contato conosco.
            </p>
        </>
    );
}

function DefaultDisclaimer() {
    return (
        <>
            <h3>Isenção de Responsabilidade sobre Conteúdo</h3>
            <p>
                A plataforma Boyz Vip atua exclusivamente como intermediadora de pagamentos
                e ferramenta de automação. <strong>Não nos responsabilizamos pelo conteúdo
                    criado ou distribuído pelos usuários.</strong>
            </p>

            <h3>Conteúdo para Maiores de 18 Anos</h3>
            <p>
                Esta plataforma pode ser utilizada para distribuição de conteúdo adulto.
                Ao utilizar nossos serviços, você confirma ter 18 anos ou mais e assume
                total responsabilidade pelo conteúdo que criar.
            </p>

            <h3>Cumprimento das Leis</h3>
            <p>
                Os usuários são responsáveis por garantir que seu conteúdo cumpra todas
                as leis aplicáveis em suas jurisdições, incluindo leis sobre conteúdo
                adulto, direitos autorais e proteção de dados.
            </p>

            <h3>Sem Garantias</h3>
            <p>
                Os serviços são fornecidos "como estão", sem garantias de disponibilidade
                contínua ou adequação a um propósito específico.
            </p>
        </>
    );
}

function getDefaultTerms() {
    return '';
}

function getDefaultPrivacy() {
    return '';
}

function getDefaultDisclaimer() {
    return '';
}
