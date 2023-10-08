'use client';

import { useState, forwardRef, HTMLAttributes } from 'react';
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

		const handleSelectCountry = async (data: any) => {
			setCountry(data);

			const urlIds = data.map((option: SelectOption) => option.value);
			queryParams.set('country', urlIds);

			const url = `${pathName}?${queryParams.toString()}`;
			router.push(url);
		};

		return (
			<>
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
			</>
		);
	}
);
