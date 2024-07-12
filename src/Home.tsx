import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from './components/Table';
import Pagination from './components/Pagination';
import Spinner from './components/Spinner';
import { useNavigate } from 'react-router-dom';

interface Wallet {
    walletAddress: string;
    netProfit: number;
}

const HomePage: React.FC = () => {
    const [data, setData] = useState<Wallet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://onchain.dextrading.com/valuable_wallets', {
                    params: {
                        network: 'eth',
                        page: 1,
                        limit: 50,
                    }
                });
                setData(response.data);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error.message)
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSort = () => {
        const sortedData = [...data].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.netProfit - b.netProfit;
            } else {
                return b.netProfit - a.netProfit;
            }
        });
        setData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleRowClick = (walletAddress: string) => {
        navigate(`/wallet/${walletAddress}`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-16 mb-10">All users wallets</h1>
            {error && (<h1 className="text-2xl font-bold text-center my-4 text-red-500">there is a problem with fetching data, please refresh the page
                <br /> {error}
            </h1>)}
            {loading ? (
                <Spinner />
            ) : !error && (
                <>
                    <div className="overflow-x-auto">
                        <Table data={currentData} onSort={handleSort} onRowClick={handleRowClick} sortOrder={sortOrder} />
                    </div>
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={data.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </>
            )}
        </div>
    );
};

export default HomePage;
