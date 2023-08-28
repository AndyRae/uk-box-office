'use client';

import clsx from 'clsx';
import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import { StatusEvent } from '@/interfaces/Event';

import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';
import { DateTime } from '@/components/date';

type Status = 'default' | 'warning' | 'success' | 'error' | string;
const statusStyle: { [key in Status]: string } = {
	default: 'text-gray-800 bg-white dark:text-grey-100 dark:bg-blue-900',
	success: 'text-green-800 bg-green-300 dark:text-green-300 dark:bg-green-900',
	warning:
		'text-yellow-800 bg-yellow-300 dark:text-yellow-300 dark:bg-yellow-900',
	error: 'text-red-800 bg-red-300 dark:text-red-300 dark:bg-red-900',
};

const StatusTag = ({ status }: { status: Status }): JSX.Element => {
	return (
		<span
			className={clsx(
				'text-xs font-medium mr-2 px-2.5 py-0.5 rounded',
				statusStyle[status]
			)}
		>
			{status}
		</span>
	);
};

export const columns: ColumnDef<StatusEvent>[] = [
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Date' />
		),
		cell: ({ row }) => {
			const date: string = row.getValue('date');
			return <DateTime dateString={date} />;
		},
		enableHiding: false,
		enableSorting: true,
	},
	{
		accessorKey: 'area',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Area' />
		),
	},
	{
		accessorKey: 'state',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='State' />
		),
		cell: ({ row }) => {
			const value: string = row.getValue('state');

			return <StatusTag status={value.toLowerCase()} />;
		},
	},
	{
		accessorKey: 'message',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Message' />
		),
	},
];
