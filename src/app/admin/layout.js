import AdminSidebar from '@/components/layout/AdminSidebar';
import { ToastProvider } from '@/components/ui/Toast';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
    return (
        <ToastProvider>
            <div className={styles.container}>
                <AdminSidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
