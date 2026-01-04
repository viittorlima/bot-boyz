'use client';

import { useState } from 'react';
import { CircleHelp, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import styles from './TutorialCard.module.css';

/**
 * TutorialCard - Collapsible educational component
 * Dark premium glass design
 */
export default function TutorialCard({
    title = 'Como funciona',
    steps = [],
    link = null,
    linkText = 'Saiba mais',
    defaultOpen = false
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={styles.container}>
            <button
                className={styles.header}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className={styles.headerLeft}>
                    <CircleHelp size={18} className={styles.icon} />
                    <span className={styles.title}>{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp size={18} className={styles.chevron} />
                ) : (
                    <ChevronDown size={18} className={styles.chevron} />
                )}
            </button>

            {isOpen && (
                <div className={styles.content}>
                    <ol className={styles.steps}>
                        {steps.map((step, index) => (
                            <li key={index} className={styles.step}>
                                <span className={styles.stepNumber}>{index + 1}</span>
                                <span className={styles.stepText}>{step}</span>
                            </li>
                        ))}
                    </ol>

                    {link && (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            {linkText}
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * TutorialAlert - Non-collapsible info card
 */
export function TutorialAlert({ children, icon: Icon = CircleHelp }) {
    return (
        <div className={styles.alert}>
            <Icon size={18} className={styles.alertIcon} />
            <div className={styles.alertContent}>
                {children}
            </div>
        </div>
    );
}
