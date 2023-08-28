'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { MetricChange } from '@/components/metric-change';
import Time from '@/interfaces/Time';

export const columns: ColumnDef<Time>[] = [
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
		accessorKey: 'admissions',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Admissions'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const value: number = row.getValue('admissions');
			return <div className='text-right font-medium tabular-nums'>{value}</div>;
		},
	},
	{
		accessorKey: 'ticketAverage',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Average Ticket (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const value: number = row.getValue('ticketAverage');
			const formatted = new Intl.NumberFormat('en-GB').format(value);
			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'number_of_releases',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Number of Releases'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					{row.getValue('number_of_releases')}
				</div>
			);
		},
	},
];
