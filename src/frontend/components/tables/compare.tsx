'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { Date } from '@/components/date';
import { toTitleCase } from '@/lib/helpers/toTitleCase';
import { Distributor } from '@/interfaces/Distributor';

export type FilmCompare = {
	color?: string;
	title: string;
	release: string;
	distributor: Distributor[];
	total: number;
	weeks: number;
	multiple: string;
	cinemas: number;
	siteAverage: number;
};

export const columns: ColumnDef<FilmCompare>[] = [
	{
		accessorKey: 'color',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='' className='' />
		),
		cell: ({ row }) => {
			const divStyle: { backgroundColor: string } = {
				backgroundColor: row.getValue('color'),
			};

			return (
				<span className={`flex w-4 h-4 b rounded-full`} style={divStyle}></span>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Title' className='' />
		),
		enableHiding: false,
	},
	{
		accessorKey: 'release',
		header: 'Release',
		cell: ({ row }) => {
			const date: string = row.getValue('release');
			const [year, month, day] = date?.split('-');
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
		accessorKey: 'distributor',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Distributor' className='' />
		),
		cell: ({ row }) => {
			const distributors: Distributor[] = row.getValue('distributor');
			return (
				<div className='font-medium'>
					{distributors &&
						distributors.map((distributor) => toTitleCase(distributor.name))}
				</div>
			);
		},
	},
	{
		accessorKey: 'total',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Total Box Office (£)'
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
		accessorKey: 'weeks',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weeks'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					{row.getValue('weeks')}
				</div>
			);
		},
	},
	{
		accessorKey: 'multiple',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Multiple'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium tabular-nums'>
					x{row.getValue('multiple')}
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
			const amount = parseFloat(row.getValue('cinemas'));
			return (
				<div className='text-right font-medium tabular-nums'>{amount}</div>
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
];
