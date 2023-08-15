'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BoxOfficeWeekStrict } from '@/interfaces/BoxOffice';
import * as React from 'react';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<BoxOfficeWeekStrict>[] = [
	{
		accessorKey: 'weeks_on_release',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Week'
				className='tabular-nums'
			/>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'date',
		header: 'Date',
	},
	{
		accessorKey: 'rank',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Rank'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					{row.getValue('rank')}
				</div>
			);
		},
	},
	{
		accessorKey: 'number_of_cinemas',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Cinemas'
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
	{
		accessorKey: 'weekend_gross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weekend Gross (£)'
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
				title='Week Gross (£)'
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
		accessorKey: 'total_gross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Total (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('total_gross'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
];
