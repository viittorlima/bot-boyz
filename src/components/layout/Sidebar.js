'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Megaphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/bots', label: 'Meus Bots', icon: Bot },
    { href: '/dashboard/sales', label: 'Vendas', icon: Receipt },
    { href: '/dashboard/finance', label: 'Financeiro', icon: CreditCard },
    { href: '/dashboard/promotion', label: 'Divulgação', icon: Megaphone },
    { href: '/dashboard/profile', label: 'Minha Página', icon: Eye },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

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
                    <button onClick={logout} className={styles.logoutButton}>
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
