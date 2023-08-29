'use client';

import * as React from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';

import { toTitleCase } from '@/lib/helpers/toTitleCase';

import { DataTableColumnHeader } from '@/components/vendor/data-table-column-header';

import { Country } from '@/interfaces/Country';

export const columns: ColumnDef<Country>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title='Country'
				className='tabular-nums'
			/>
		),
		cell: ({ row }) => {
			const name: string = row.getValue('name');
			const slug: string = row.original.slug;
			return (
				<Link href={`/country/${slug}`} className='font-medium'>
					{toTitleCase(name)}
				</Link>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
];
