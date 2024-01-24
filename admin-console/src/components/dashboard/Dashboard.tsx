import React from 'react';
import styles from './Dashboard.module.css';

type DashboardProps = {
    children: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export default Dashboard;
