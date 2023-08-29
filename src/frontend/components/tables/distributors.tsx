'use client';

import * as React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

import { toTitleCase } from '@/lib/helpers/toTitleCase';

import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';

import { Distributor } from '@/interfaces/Distributor';

export const columns: ColumnDef<Distributor>[] = [
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
		enableSorting: false,
	},
];
