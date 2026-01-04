'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Shield,
    CreditCard
} from 'lucide-react';
import styles from './Sidebar.module.css';

const adminMenuItems = [
    { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/admin/creators', label: 'Criadores', icon: Users },
    { href: '/admin/finance', label: 'Financeiro', icon: CreditCard },
    { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <div className={styles.logoMobile}>
                    <div className={`${styles.logoIcon} ${styles.admin}`}>
                        <Shield size={16} />
                    </div>
                    <span>Admin</span>
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
            <aside className={`${styles.sidebar} ${styles.adminSidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <div className={`${styles.logoIcon} ${styles.admin}`}>
                        <Shield size={18} />
                    </div>
                    <span>BoyzClub Admin</span>
                </div>

                <nav className={styles.nav}>
                    {adminMenuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
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

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <div className={`${styles.userAvatar} ${styles.adminAvatar}`}>
                            <Shield size={16} />
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>Super Admin</span>
                            <span className={styles.userRole}>Administrador</span>
                        </div>
                    </div>
                    <Link href="/login" className={styles.logoutButton}>
                        <LogOut size={18} />
                    </Link>
                </div>
            </aside>
        </>
    );
}
