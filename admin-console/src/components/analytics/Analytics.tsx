import React from 'react';
import AvgReviewAnalytics from './AvgReviewAnalytics';
import ReservationsAnalytics from './ReservationsAnalytics';
import styles from './Analytics.module.css';

const Analytics: React.FC = () => {
    return (
        <div className={styles.analyticsContainer}>
            <h2 className={styles.analyticsTitle}>Analytics</h2>
            <div className={styles.analyticsCharts}>
                <AvgReviewAnalytics />
                <ReservationsAnalytics />
            </div>
        </div>
    );
};

export default Analytics;
