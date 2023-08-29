'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

type PaginationProps = {
	pages: number[];
	pageIndex: string | number;
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
	const searchParams = useSearchParams();

	let pageNumber: number;
	if (typeof pageIndex === 'string') {
		pageNumber = parseInt(pageIndex, 10);
	} else {
		pageNumber = pageIndex;
	}

	const setPageIndex = (pageNumber: number) => {
		// Preserve any existing url params
		const queryParams = new URLSearchParams();

		for (const [key, value] of searchParams.entries()) {
			queryParams.append(key, value);
		}

		// Remove any existing page parameter
		queryParams.delete('p');
		queryParams.append('p', pageNumber.toString());

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	return (
		<nav aria-label='Pagination'>
			<ul className='inline-flex -space-x-px py-5'>
				{pageNumber > 1 && (
					<li>
						<Button
							onClick={() => setPageIndex(pageNumber - 1)}
							variant={'outline'}
							className='rounded-r-none'
						>
							Previous
						</Button>
					</li>
				)}
				{pages.map((page, index) => {
					const isActive = pageNumber === page;
					const variant = isActive ? 'default' : 'outline';
					return (
						<li key={index}>
							<Button
								onClick={() => setPageIndex(page)}
								variant={variant}
								className='rounded-none'
							>
								{page}
							</Button>
						</li>
					);
				})}
				{pageNumber < pages[pages.length - 1] && (
					<li>
						<Button
							onClick={() => setPageIndex(pageNumber + 1)}
							variant={'outline'}
							className='rounded-l-none'
						>
							Next
						</Button>
					</li>
				)}
			</ul>
		</nav>
	);
};
