'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { Date } from '@/components/date';
import { MetricChange } from '@/components/metric-change';

export type FilmWeek = {
	week: number;
	date: string;
	rank: number;
	cinemas: number;
	weekendGross: number;
	weekGross: number;
	total: number;
	siteAverage: number;
	changeWeekend: number;
};

export const columns: ColumnDef<FilmWeek>[] = [
	{
		accessorKey: 'week',
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
		cell: ({ row }) => {
			const date: string = row.getValue('date');
			const [year, month, day] = date.split('-');
			return (
				<Link
					href={`/time/${year}/m/${parseInt(month, 10)}/d/${day}`}
					className='font-medium'
				>
					<Date dateString={date} />
				</Link>
			);
		},
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
		accessorKey: 'cinemas',
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
					{row.getValue('cinemas')}
				</div>
			);
		},
	},
	{
		accessorKey: 'weekendGross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weekend Gross (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('weekendGross'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'weekGross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Week Gross (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('weekGross'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
	{
		accessorKey: 'changeWeekend',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Change Weekend'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('changeWeekend'));

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
				title='Site Average (£)'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('siteAverage'));
			const formatted = new Intl.NumberFormat('en-GB').format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
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
];
