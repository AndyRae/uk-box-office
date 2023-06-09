'use client';

import Select from 'react-select';
import { Distributor } from 'interfaces/Distributor';
import { Country } from 'interfaces/Country';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toTitleCase } from 'lib/utils/toTitleCase';
import { Button } from 'components/ui/button-new';
import { useState, useEffect } from 'react';

type SelectOption = {
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
	countries,
}: {
	query: string;
	distributors: Distributor[];
	countries: Country[];
}) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();

	const [selectedDist, setDistributors] = useState<SelectOption[]>([]);
	const [selectedCountry, setCountry] = useState<SelectOption[]>([]);

	const isFilterActive = selectedDist.length > 0 || selectedCountry.length > 0;

	// Run on start to set state, if already filtered.
	useEffect(() => {
		const distributorIds = searchParams
			.get('distributor')
			?.split(',')
			.filter(Boolean);
		if (distributorIds) {
			setDistributors(mapToValues(distributors));
		}

		const countryIds = searchParams.get('country')?.split(',').filter(Boolean);

		if (countryIds) {
			const selected = countries.filter((country) =>
				countryIds.includes(country.id.toString())
			);
			setCountry(mapToValues(selected));
			console.log(countryIds);
		}
	}, []);

	// map to values
	const distOptions = mapToValues(distributors);
	const countryOptions = mapToValues(countries);

	// Fetch data when an option is selected
	const handleOptionChange = async (data: any) => {
		setDistributors(data);
	};
	const handleSelectCountry = async (data: any) => {
		setCountry(data);
	};

	const handleFilter = async () => {
		// Add Ids to the URL
		const distIds = selectedDist.map((distributor) => distributor.value);
		const countryIds = selectedCountry.map((country) => country.value);

		const queryParams = new URLSearchParams();
		queryParams.append('q', query);

		if (distIds.length > 0) {
			queryParams.append('distributor', distIds.join(','));
		}

		if (countryIds.length > 0) {
			queryParams.append('country', countryIds.join(','));
		}

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	const handleClearFilter = async () => {
		setDistributors([]);
		setCountry([]);
		router.push(pathName + `?q=${query}`);
	};

	return (
		<div className='flex flex-wrap pb-4 gap-4'>
			<Select
				isMulti
				value={selectedDist}
				onChange={handleOptionChange}
				options={distOptions}
				className='compare-select-container w-64'
				classNamePrefix='compare-select'
				inputId='compare-select'
				instanceId='compare-select'
				noOptionsMessage={() => 'Distributors...'}
				placeholder='Filter Distributors'
			/>
			<Select
				isMulti
				value={selectedCountry}
				onChange={handleSelectCountry}
				options={countryOptions}
				className='compare-select-container w-64'
				classNamePrefix='compare-select'
				inputId='compare-select'
				instanceId='compare-select'
				noOptionsMessage={() => 'Countries...'}
				placeholder='Filter Countries'
			/>
			<Button
				onClick={handleFilter}
				variant={'outline'}
				disabled={!isFilterActive}
			>
				Apply
			</Button>
			<Button
				onClick={handleClearFilter}
				variant={'outline'}
				disabled={!isFilterActive}
			>
				Clear
			</Button>
		</div>
	);
};
