import Sidebar from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
    return (
        <ToastProvider>
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
