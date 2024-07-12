import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import Spinner from './Spinner';

interface WalletSummary {
    month: string;
    buyVolume: number | string;
    sellVolume: number | string;
    totalTransactions: number;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
};

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

                // تبدیل داده‌ها به قالب مناسب برای نمودار
                const chartData = Object.keys(totalBuyAmounts).map(month => ({
                    month,
                    buyVolume: totalBuyAmounts[month],
                    sellVolume: totalSellAmounts[month],
                    totalTransactions: totalBuySellTimes[month] || 0,
                }));

                // مرتب‌سازی داده‌ها بر اساس تاریخ
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

    const options = {
        scales: {
            'y-left': {
                type: 'linear' as const,
                position: 'left' as const,
                ticks: {
                    callback: function (value: number) {
                        return formatNumber(value);
                    }
                }
            },
            'y-right': {
                type: 'linear' as const,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false, // فقط یکی از دو محور y باید دارای خطوط شبکه باشد
                },
                ticks: {
                    callback: function (value: number) {
                        return formatNumber(value);
                    }
                }
            },
        },
    };

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                type: 'bar' as const,
                label: 'Buy Volume',
                data: data.map(item => item.buyVolume),
                backgroundColor: 'rgba(81, 236, 76, 0.941)',
                borderColor: '#58f255',
                yAxisID: 'y-left',
                barPercentage: 0.5,
                order: 2,
            },
            {
                type: 'bar' as const,
                label: 'Sell Volume',
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
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y-right',
                order: 1,
            }
        ],
    };



    return (
        <div>
            <h1 className="text-2xl font-bold text-center my-4">Wallet Details</h1>
            {loading ? (
                <Spinner />
            ) : (
                <div className="w-full md:w-3/4 lg:w-1/2 mobile-chart-height min-h-48">
                    <Chart type='bar' data={chartData} options={options} />
                </div>
            )}
        </div>
    );
};

export default WalletPage;
