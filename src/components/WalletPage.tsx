import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import Spinner from './Spinner';
import ChartDataLabels from 'chartjs-plugin-datalabels';


interface WalletSummary {
    month: string;
    buyVolume: number | string;
    sellVolume: number | string;
    totalTransactions: number;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);


const WalletPage: React.FC = () => {
    const { walletAddress } = useParams<{ walletAddress: string }>();
    const [data, setData] = useState<WalletSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://onchain.dextrading.com/walletsummary/${walletAddress}`, {
                    params: {
                        network: 'eth',
                    }
                });

                const totalBuyAmounts = response.data.totalBuyAmounts?.month || {};
                const totalSellAmounts = response.data.totalSellAmounts?.month || {};
                const totalBuySellTimes = response.data.totalBuySellTimes?.month || {};

                // make usable data structure 
                const chartData = Object.keys(totalBuyAmounts).map(month => ({
                    month,
                    buyVolume: totalBuyAmounts[month],
                    sellVolume: totalSellAmounts[month],
                    totalTransactions: totalBuySellTimes[month] || 0,
                }));

                // sorting the date
                chartData.sort((a, b) => {
                    const dateA = new Date(a.month);
                    const dateB = new Date(b.month);
                    return dateA.getTime() - dateB.getTime();
                });

                setData(chartData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [walletAddress]);

    const formatYAxisValue = (value: string | number): string => {
        if (typeof value === 'number') {
            if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
            if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
            if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
            return value.toString();
        }
        return value.toString();
    };

    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        plugins: {
            datalabels: {
                display: true,
                color: 'black',
                anchor: 'center',
                align: 'top',
                formatter: formatYAxisValue,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return `${label}: ${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            'y-left': {
                type: 'linear' as const,
                position: 'left' as const,
                ticks: {
                    callback: formatYAxisValue
                }
            },
            'y-right': {
                type: 'linear' as const,
                position: 'right' as const,
                suggestedMin: 5,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 50, // Minimum value for the axis
                    precision: 0, // Remove decimal points
                    callback: function (value: number | any) {
                        return value.toString();
                    },
                },
            },
        },
    };

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Buy Amount',
                data: data.map(item => item.buyVolume),
                backgroundColor: 'rgba(81, 236, 76, 0.941)',
                borderColor: '#58f255',
                yAxisID: 'y-left',
                barPercentage: 0.5,
                order: 2,
            },
            {
                type: 'bar' as const,
                label: 'Sell Amount',
                data: data.map(item => item.sellVolume),
                backgroundColor: 'rgb(241, 75, 75)',
                borderColor: '#fc5378',
                yAxisID: 'y-left',
                barPercentage: 0.5,
                order: 2,
            },
            {
                type: 'line' as const,
                label: 'Total Transactions',
                data: data.map(item => item.totalTransactions),
                borderColor: '#123953',
                backgroundColor: 'rgba(53, 114, 155, 0.2)',
                yAxisID: 'y-right',
                order: 1,
                fill: false,
                borderWidth: 1,
            }
        ],
    };



    return (
        <div>
            <h1 className="text-2xl font-bold text-center my-4">Wallet Details</h1>
            {loading ? (
                <Spinner />
            ) : (
                <div className="flex justify-center items-center min-w-full sm:w-full">
                    <Chart type='bar' data={chartData} options={options} />
                </div>
            )}
        </div>
    );
};

export default WalletPage;
