'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Bot,
    CreditCard,
    Package,
    Receipt,
    Menu,
    X,
    LogOut,
    ChevronRight,
    ExternalLink,
    Eye,
    Settings,
    Trophy,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/bots', label: 'Meus Bots', icon: Bot },
    { href: '/dashboard/sales', label: 'Vendas', icon: Receipt },
    { href: '/dashboard/ranking', label: 'Ranking', icon: Trophy },
    { href: '/dashboard/finance', label: 'Financeiro', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Minha Página', icon: Eye },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 1000));

        logout();
        router.push('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Logout animation overlay
    if (isLoggingOut) {
        return (
            <div className={styles.logoutOverlay}>
                <div className={styles.logoutContent}>
                    <div className={styles.logoutIcon}>
                        <Loader2 size={32} className={styles.spinnerLogout} />
                    </div>
                    <h3>Saindo...</h3>
                    <p>Até logo, {user?.name?.split(' ')[0] || 'Criador'}!</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <div className={styles.logoMobile}>
                    <div className={styles.logoIcon}>B</div>
                    <span>Boyz Vip</span>
                </div>
                <button className={styles.menuButton} onClick={toggleSidebar}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={toggleSidebar} />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>B</div>
                    <span>Boyz Vip</span>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {isActive && <ChevronRight size={16} className={styles.chevron} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Preview Card */}
                {user?.username && (
                    <div className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <Eye size={14} />
                            <span>Sua página pública</span>
                        </div>
                        <Link
                            href={`/${user.username}`}
                            target="_blank"
                            className={styles.previewLink}
                        >
                            <span>boyzclub.com/{user.username}</span>
                            <ExternalLink size={14} />
                        </Link>
                    </div>
                )}

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {getInitials(user?.name)}
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name || 'Usuário'}</span>
                            <span className={styles.userRole}>Criador</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}

