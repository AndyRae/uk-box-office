'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { toTitleCase } from '@/lib/helpers/toTitleCase';
import { Distributor } from '@/interfaces/Distributor';

type MarketShare = {
	name: string;
	slug: string;
	marketShare?: number;
	marketPercentage?: number;
};

export const columns: ColumnDef<MarketShare>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Distributor'
				className='tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const name: string = row.getValue('name');
			const slug: string = row.original.slug;

			return (
				<Link href={`/distributor/${slug}`} className='font-medium'>
					{toTitleCase(name)}
				</Link>
			);
		},
		enableHiding: false,
		enableSorting: true,
	},
	{
		accessorKey: 'marketShare',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Box Office (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('marketShare'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'marketPercentage',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Market Share'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('marketPercentage'));
			const formatted = new Intl.NumberFormat('en-GB', {
				maximumFractionDigits: 2,
			}).format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}%</div>
			);
		},
	},
];
