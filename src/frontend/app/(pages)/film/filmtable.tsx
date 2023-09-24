'use client';
import * as React from 'react';

import { SortingState, OnChangeFn } from '@tanstack/react-table';

import { useRouter, usePathname } from 'next/navigation';

import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/films';

export const FilmTable = ({ data }: any) => {
	const router = useRouter();
	const pathName = usePathname();
	const [sorting, setSorting] = React.useState<SortingState>([]);

	// Custom setSorting function with additional logic
	const customSetSorting: OnChangeFn<SortingState> = (handleSorting) => {
		if (handleSorting instanceof Function) {
			const [sortingItem] = handleSorting([]);

			if (sortingItem) {
				const { id, desc } = sortingItem;

				// Generate the URL parameter based on the sorting state
				const sortParam = desc ? `desc_${id}` : `asc_${id}`;

				// Get the current pathname and append the sorting parameter
				const url = `${pathName}?sort=${sortParam}`;

				// Use router.push to navigate to the updated URL
				router.push(url);
			}
		}

		setSorting(handleSorting);
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
