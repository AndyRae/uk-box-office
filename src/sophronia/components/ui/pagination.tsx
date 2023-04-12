'use client';
import { useRouter, usePathname } from 'next/navigation';

type PaginationProps = {
	pages: number[];
	pageIndex: string;
};

/**
 * Client side Pagination component
 * @param {Array} pages - The array of pages numbers.
 * @param {number} pageIndex - The current page index
 * @returns {JSX.Element}
 * @example
 * <Pagination pages={pages} pageIndex={pageIndex} />
 */
export const Pagination = ({
	pages,
	pageIndex,
}: PaginationProps): JSX.Element => {
	const router = useRouter();
	const pathName = usePathname();
	const pageNumber = parseInt(pageIndex);

	const setPageIndex = (pageNumber: number) => {
		router.push(pathName + `?p=${pageNumber}`);
	};

	return (
		<nav aria-label='Pagination'>
			<ul className='inline-flex -space-x-px py-5'>
				{pageNumber > 1 && (
					<li>
						<button
							onClick={() => setPageIndex(pageNumber - 1)}
							className='py-2 px-3 ml-0 leading-tight rounded-l-lg border border-gray-300 bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500 hover:text-white dark:border-gray-700 transition-all duration-300'
						>
							Previous
						</button>
					</li>
				)}
				{pages.map((page, index) => {
					const isActive = pageNumber === page;
					return (
						<li key={index}>
							<button
								onClick={() => setPageIndex(page)}
								className={`py-2 px-3 leading-tight border border-gray-300 bg-gradient-to-br  hover:from-bo-primary hover:to-cyan-500 hover:text-white dark:border-gray-700 transition-all duration-300 ${
									isActive
										? 'from-bo-primary to-cyan-500 text-white'
										: 'from-transparent to-transparent'
								}`}
							>
								{page}
							</button>
						</li>
					);
				})}
				{pageNumber < pages[pages.length - 1] && (
					<li>
						<button
							onClick={() => setPageIndex(pageNumber + 1)}
							className='py-2 px-3 leading-tight rounded-r-lg border border-gray-300 bg-gradient-to-br from-transparent to-transparent hover:from-bo-primary hover:to-cyan-500 hover:text-white dark:border-gray-700 transition-all duration-300'
						>
							Next
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
};
