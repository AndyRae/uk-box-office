'use client';

import Select from 'react-select';
import { Distributor } from 'interfaces/Distributor';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toTitleCase } from 'lib/utils/toTitleCase';
import { Button } from 'components/ui/button-new';
import { useState, useEffect } from 'react';

type DistributorOption = {
	value: string;
	label: string;
};

const mapToValues = (array: any[]) => {
	return array.map((item) => ({
		value: item.id.toString(),
		label: toTitleCase(item.name),
	}));
};

export const SearchFilters = ({
	query,
	distributors,
}: {
	query: string;
	distributors: Distributor[];
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const [selected, setDistributors] = useState<DistributorOption[]>([]);

	// Run on start to set state, if already filtered.
	useEffect(() => {
		const distributorIds = searchParams
			.get('distributor')
			?.split(',')
			.filter(Boolean);
		if (distributorIds) {
			setDistributors(mapToValues(distributors));
		}
	}, []);

	// map to values
	const options = mapToValues(distributors);

	// Fetch data when an option is selected
	const handleOptionChange = async (data: any) => {
		setDistributors(data);
	};

	const handleFilter = async () => {
		// Add Ids to the url
		const urlIds = selected.map(
			(distributor: DistributorOption) => distributor.value
		);
		router.push(pathName + `?q=${query}&distributor=${urlIds}`);
	};

	const handleClearFilter = async () => {
		setDistributors([]);
		router.push(pathName + `?q=${query}`);
	};

	return (
		<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
			<Select
				isMulti
				value={selected}
				onChange={handleOptionChange}
				options={options}
				className='compare-select-container'
				classNamePrefix='compare-select'
				inputId='compare-select'
				instanceId='compare-select'
				noOptionsMessage={() => 'Distributors...'}
			/>
			<Button onClick={handleFilter} variant={'outline'}>
				Apply Filter
			</Button>
			<Button onClick={handleClearFilter} variant={'outline'}>
				Clear Filter
			</Button>
		</div>
	);
};
