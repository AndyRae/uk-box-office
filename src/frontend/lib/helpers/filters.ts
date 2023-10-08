import { toTitleCase } from '@/lib/helpers/toTitleCase';
import { SelectOption } from '@/interfaces/Filter';

interface SelectInput {
	id: string | number;
	name: string;
}

/**
 * Maps a list of values to React Select options.
 * @param array
 * @returns array of Select Options.
 */
export const mapToValues = (array: SelectInput[]): SelectOption[] => {
	return array.map((item) => ({
		value: item.id.toString(),
		label: toTitleCase(item.name),
	}));
};
