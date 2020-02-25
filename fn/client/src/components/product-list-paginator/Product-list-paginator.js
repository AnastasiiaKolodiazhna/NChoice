import React from 'react'

export default function ProductListPaginator({ postPerPage, totalPosts, paginate, currentPage }) {
    const pageNumbers = [];
    const pagesCount = Math.ceil(totalPosts / postPerPage);
    for (let i = 1; i <= pagesCount; i++) {
        pageNumbers.push(i);
    };
    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number=>(
                    <li key = {number} className="page-item">
                        <a onClick={()=>paginate(number)} className="page-link">{number}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}