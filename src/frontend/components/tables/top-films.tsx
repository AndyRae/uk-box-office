'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { toTitleCase } from '@/lib/helpers/toTitleCase';
import { TopFilm } from '@/interfaces/Film';
import { Distributor } from '../../interfaces/Distributor';

export const columns: ColumnDef<TopFilm>[] = [
	{
		accessorKey: 'index',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Rank'
				className='tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const rownumber = row.index + 1;
			return <>{rownumber}</>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'film',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Title'
				className='tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const film: { name: string; slug: string } = row.getValue('film');
			const title: string = film.name;
			const slug: string = film.slug;
			return (
				<Link href={`/film/${slug}`} className='font-medium'>
					{toTitleCase(title)}
				</Link>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'distributor',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Distributor' className='' />
		),
		cell: ({ row }) => {
			const film: { name: string; slug: string; distributors: Distributor[] } =
				row.getValue('film');
			return (
				<div className='font-medium'>
					{film.distributors.map((distributor) =>
						toTitleCase(distributor.name)
					)}
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
				title='Total (£)'
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
	},
];
