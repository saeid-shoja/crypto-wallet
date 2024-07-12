import React from 'react';
import { useMediaQuery } from 'react-responsive';

// making the wallet address shorter
const shortenAddress = (address: string, maxLength: number = 4): string => {
    if (address.length <= maxLength * 2 + 3) return address;
    return `${address.slice(0, maxLength)}...${address.slice(-maxLength)}`;
};

interface Wallet {
    walletAddress: string;
    netProfit: number;
}

interface TableProps {
    data: Wallet[];
    onSort: () => void;
    onRowClick: (walletAddress: string) => void;
    sortOrder: string;
}

const formatProfit = (profit: number): string => {
    return profit.toFixed(2);
};

const Table: React.FC<TableProps> = ({ data, onSort, onRowClick, sortOrder }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    return (
        <table className="min-w-full bg-white border-collapse">
            <thead>
                <tr>
                    <th className="py-2 px-4 border border-gray-300 cursor-pointer" onClick={onSort}>
                        Net Profit {sortOrder === 'asc' ? '▲' : '▼'}</th>
                    <th className="py-2 px-4 border border-gray-300">Wallet Address</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100 cursor-pointer text-center" onClick={() => onRowClick(item.walletAddress)}>
                        <td className="py-2 px-4 border border-gray-300">{formatProfit(item.netProfit)}</td>
                        <td className="py-2 px-4 border text-center wallet-address">
                            {isMobile ? shortenAddress(item.walletAddress) : item.walletAddress}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
