'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { BoxOfficeYear } from '@/interfaces/BoxOffice';
import { MetricChange } from '@/components/metric-change';

export const columns: ColumnDef<BoxOfficeYear>[] = [
	{
		accessorKey: 'year',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Year' />
		),
		cell: ({ row }) => {
			const year: number = row.getValue('year');
			return (
				<Link href={`/time/${year}`} className='font-medium'>
					<div className='font-medium'>{year}</div>
				</Link>
			);
		},
		enableHiding: false,
		enableSorting: true,
	},
	{
		accessorKey: 'count',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Films'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('count'));

			return (
				<div className='text-right font-medium tabular-nums'>{amount}</div>
			);
		},
	},
	{
		accessorKey: 'total',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Total (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('total'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'change',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Change YOY'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('change'));

			return (
				<div className='text-right font-medium tabular-nums'>
					<MetricChange value={amount} />
				</div>
			);
		},
	},
];
