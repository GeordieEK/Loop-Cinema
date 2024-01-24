import React, { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESERVATIONS } from '../../api/reservationQueries';
import { Chart } from 'chart.js/auto';

const ReservationsAnalytics: React.FC = () => {
    const { data: reservationData } = useQuery(GET_RESERVATIONS);

    useEffect(() => {
        if (reservationData) {
            // Process the data to calculate the number of reservations per day
            const reservations = reservationData.reservations;
            console.log('reservations:', reservations);

            // TODO: Fix any type
            const reservationsPerDay = reservations.reduce(
                (acc: { [date: string]: number }, reservation: any) => {
                    const date = reservation.createdAt;
                    if (acc[date]) {
                        acc[date] += 1;
                    } else {
                        acc[date] = 1;
                    }
                    return acc;
                },
                {}
            );

            const dates = Object.keys(reservationsPerDay);
            // Convert the values to numbers (TODO: Double check this, this is some weird TS stuff)
            const reservationCounts = Object.values(reservationsPerDay).map(Number);

            renderChart(dates, reservationCounts);
        }
    }, [reservationData]);

    // Create a reference for the chart canvas
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    // Create a function to render the chart
    const renderChart = (dates: string[], reservationCounts: number[]) => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Destroy the previous chart instance
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Number of Reservations Per Day',
                            data: reservationCounts,
                            backgroundColor: [
                                'blue',
                                'cyan',
                                'orange',
                                'magenta',
                                'green',
                                'yellow',
                            ],
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    };

    return (
        <div>
            <h3>Ticket Reservations</h3>
            <canvas ref={chartRef} width={400} height={200} />
        </div>
    );
};

export default ReservationsAnalytics;
