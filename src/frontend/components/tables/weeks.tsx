'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { Date } from '@/components/date';
import { BoxOfficeGroup } from '@/interfaces/BoxOffice';
import { MetricChange } from '../metric-change';

export const columns: ColumnDef<BoxOfficeGroup>[] = [
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Week ending' />
		),
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
		enableHiding: false,
		enableSorting: false,
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
	// {
	// 	accessorKey: 'changeWeekend',
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader
	// 			column={column}
	// 			title='Change Weekend'
	// 			className='text-right tabular-nums'
	// 		/>
	// 	),
	// 	cell: ({ row }) => {
	// 		const amount = parseFloat(row.getValue('changeWeekend'));

	// 		return (
	// 			<div className='text-right font-medium tabular-nums'>
	// 				<MetricChange value={amount} />
	// 			</div>
	// 		);
	// 	},
	// },
	{
		accessorKey: 'newReleases',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='New Releases'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					{row.getValue('newReleases')}
				</div>
			);
		},
	},
];
