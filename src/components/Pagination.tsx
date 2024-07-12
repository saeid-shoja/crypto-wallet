import { is } from '@babel/types';
import React from 'react';
import { useMediaQuery } from 'react-responsive';


interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="my-4 max-w-full">
            <ul className="flex justify-center items-center">
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className="px-3 py-1 mx-1 border rounded bg-white text-blue-500"
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                </li>
                {isMobile ? <button className='px-3 py-1 border rounded bg-blue-500 text-white'>
                    {currentPage}
                </button> : pageNumbers.map(number => (
                    <li key={number} className={`mx-1 ${currentPage === number ? 'text-blue-500' : ''}`}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="px-3 py-1 mx-1 border rounded bg-white text-blue-500"
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
