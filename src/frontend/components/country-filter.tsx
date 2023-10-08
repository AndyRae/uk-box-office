'use client';

import { useState, forwardRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Select from 'react-select';

import { fetchCountryList } from '@/lib/api/dataFetching';
import { toTitleCase } from '@/lib/helpers/toTitleCase';

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

export const CountryFilter = forwardRef<HTMLDivElement>(async ({}) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(searchParams);

	const [selectedCountry, setCountry] = useState<SelectOption[]>([]);
	const countries = await fetchCountryList(1, 100);

	const handleSelectCountry = async (data: any) => {
		setCountry(data);

		const urlIds = data.map((option: SelectOption) => option.value);
		queryParams.set('country', urlIds);

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	const countryOptions = mapToValues(countries.results);

	return (
		<>
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
		</>
	);
});
