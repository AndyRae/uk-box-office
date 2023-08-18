'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import Link from 'next/link';
import { Date } from '@/components/date';
import { MetricChange } from '@/components/metric-change';
import { TableData } from '@/interfaces/BoxOffice';
import { Distributor } from '@/interfaces/Distributor';
import { toTitleCase } from '@/lib/helpers/toTitleCase';

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

export const columns: ColumnDef<TableData>[] = [
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
			const film: { title: string; slug: string } = row.getValue('film');
			const title: string = film.title;
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
			const distributors: string = row.getValue('distributor');
			return <div className='font-medium'>{toTitleCase(distributors)}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'weekendGross',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weekend (£)'
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
				title='Total (£)'
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
		accessorKey: 'weeks',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Weeks'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('weeks'));
			return (
				<div className='text-right font-medium tabular-nums'>{amount}</div>
			);
		},
	},
	{
		accessorKey: 'numberOfCinemas',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Cinemas'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('numberOfCinemas'));
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
				title='Site Average'
				className='text-right tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('siteAverage'));
			const formatted = new Intl.NumberFormat('en-GB', {
				maximumFractionDigits: 0,
			}).format(amount);

			return (
				<div className='text-right font-medium tabular-nums'>{formatted}</div>
			);
		},
	},
];
