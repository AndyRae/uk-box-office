'use client';

import { useState, useEffect, forwardRef, HTMLAttributes } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Select from 'react-select';

import { SelectOption } from '@/interfaces/Filter';

interface FilterProps extends HTMLAttributes<HTMLDivElement> {
	countries: SelectOption[];
}

export const CountryFilter = forwardRef<HTMLDivElement, FilterProps>(
	async ({ countries }) => {
		const router = useRouter();
		const pathName = usePathname();
		const searchParams = useSearchParams();
		const queryParams = new URLSearchParams(searchParams);

		const [selectedCountry, setCountry] = useState<SelectOption[]>([]);

		// Run on start to set the selected list of countries.
		useEffect(() => {
			const ids = searchParams.get('country')?.split(',').filter(Boolean);
			const filteredList = countries.filter((option) =>
				ids?.includes(option.value)
			);
			setCountry(filteredList);
		}, []);

		const handleSelectCountry = async (data: any) => {
			setCountry(data);

			const urlIds = data.map((option: SelectOption) => option.value);

			// Check if they exist so not to push an empty parameter.
			if (urlIds.length === 0) {
				queryParams.delete('country');
			} else {
				queryParams.set('country', urlIds);
			}

			const url = `${pathName}?${queryParams.toString()}`;
			router.push(url);
		};

		return (
			<div className='px-4'>
				<Select
					isMulti
					value={selectedCountry}
					onChange={handleSelectCountry}
					options={countries}
					className='compare-select-container w-64'
					classNamePrefix='compare-select'
					inputId='compare-select'
					instanceId='compare-select'
					noOptionsMessage={() => 'Countries...'}
					placeholder='Filter Countries'
				/>
			</div>
		);
	}
);
