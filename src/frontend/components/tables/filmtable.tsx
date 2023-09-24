'use client';

import { useRouter, usePathname } from 'next/navigation';
import { SortingState, OnChangeFn } from '@tanstack/react-table';

import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/films';

export const FilmTable = ({ data }: any) => {
	const router = useRouter();
	const pathName = usePathname();

	const customSetSorting: OnChangeFn<SortingState> = (handleSorting) => {
		if (handleSorting instanceof Function) {
			const [sortingItem] = handleSorting([]);

			if (sortingItem) {
				const { id, desc } = sortingItem;

				// Generate the URL parameter based on the sorting state
				const sortParam = desc ? `desc_${id}` : `asc_${id}`;

				const url = `${pathName}?sort=${sortParam}`;
				router.push(url);
			}
		}
	};

	return (
		<>
			{data && (
				<DataTable
					columns={columns}
					data={data}
					onSortingChange={customSetSorting}
				/>
			)}
		</>
	);
};
