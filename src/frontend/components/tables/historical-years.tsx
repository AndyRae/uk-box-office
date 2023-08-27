'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { BoxOfficeSummary } from '@/interfaces/BoxOffice';
import { MetricChange } from '@/components/metric-change';

export const columns: ColumnDef<BoxOfficeSummary>[] = [
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
		accessorKey: 'weekend_gross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weekend (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('weekend_gross'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'week_gross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Total (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('week_gross'));
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
	{
		accessorKey: 'siteAverage',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Site Average'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const value: number = row.getValue('siteAverage');
			return (
				<div className='text-right font-medium tabular-nums'>
					{value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
				</div>
			);
		},
	},
	{
		accessorKey: 'number_of_cinemas',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Number of Cinemas'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					{row.getValue('number_of_cinemas')}
				</div>
			);
		},
	},
];
