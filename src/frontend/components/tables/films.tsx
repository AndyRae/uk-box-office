'use client';

import * as React from 'react';
import Link from 'next/link';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';
import { useRouter, usePathname } from 'next/navigation';

import { toTitleCase } from '@/lib/helpers/toTitleCase';

import { Country } from '@/interfaces/Country';
import { Distributor } from '@/interfaces/Distributor';
import { Film } from '@/interfaces/Film';

import { DataTable } from '@/components/vendor/data-table';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';

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

export const columns: ColumnDef<Film>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Title'
				className='tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const name: string = row.getValue('name');
			const slug: string = row.original.slug;
			return (
				<Link href={`/film/${slug}`} className='font-medium'>
					{toTitleCase(name)}
				</Link>
			);
		},
		enableHiding: false,
		enableSorting: true,
	},
	{
		accessorKey: 'distributors',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Distributor' />
		),
		cell: ({ row }) => {
			const distributors: Distributor[] = row.getValue('distributors');
			return (
				<div className='font-medium'>
					{distributors.map((distributor, index) => (
						<React.Fragment key={distributor.id}>
							{index > 0 && ', '}
							{toTitleCase(distributor.name)}
						</React.Fragment>
					))}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'countries',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Countries' />
		),
		cell: ({ row }) => {
			const countries: Country[] = row.getValue('countries');
			return (
				<div className='font-medium'>
					{countries.map((country, index) => (
						<React.Fragment key={country.id}>
							{index > 0 && ', '}
							{toTitleCase(country.name)}
						</React.Fragment>
					))}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: 'gross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Box Office (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('gross'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
		enableSorting: true,
	},
];
