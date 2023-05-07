/**
 * Base Table Header component
 * @param {JSX.Element} children - Header to be displayed
 * @returns {JSX.Element}
 * @example
 * <Thead>
 * 	<Tr>
 * 		<Th>1</Th>
 * 	</Tr>
 * </Thead>
 */
const Thead = ({ children }: { children: React.ReactNode }): JSX.Element => {
	return (
		<thead className='text-xs text-gray-700 capitalize border-b-2 border-b-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-gray-400'>
			{children}
		</thead>
	);
};

/**
 * Base Table Header component
 * @param {Boolean} isNumeric - Whether the header is numeric
 * @param {JSX.Element} children - Header to be displayed
 * @returns {JSX.Element}
 * @example
 * <Th isNumeric>1</Th>
 */
const Th = ({
	isNumeric,
	children,
}: {
	isNumeric?: boolean;
	children: React.ReactNode;
}): JSX.Element => {
	return (
		<th scope='col' className={`py-3 px-3 ${isNumeric ? 'text-right' : ''}`}>
			{children}
		</th>
	);
};

/**
 * Base Table Row component
 * @param {Number} index - Index of the row
 * @param {JSX.Element} children - Row elements to be displayed
 * @returns {JSX.Element}
 * @example
 * <Tr index={0}>
 * 	<Td>1</Td>
 * 	<Td>2</Td>
 * </Tr>
 */
export const Tr = ({
	index,
	children,
}: {
	index: number;
	children: React.ReactNode;
}): JSX.Element => {
	const alternatingColor = ['bg-white', 'bg-gray-100'];
	const alternatingDarkColor = ['dark:bg-black', 'dark:bg-bo-black'];
	return (
		<tr
			className={`${alternatingColor[index % alternatingColor.length]} ${
				alternatingDarkColor[index % alternatingDarkColor.length]
			} py-4 px-3 hover:bg-gray-50 dark:hover:bg-gray-800`}
		>
			{children}
		</tr>
	);
};

type TdProps = {
	isNumeric?: boolean;
	isHighlight?: boolean;
	children: React.ReactNode;
	[x: string]: any;
};
/**
 * Base Table Data component
 * @param {Boolean} isNumeric - Whether the data is numeric
 * @param {Boolean} isHighlight - Whether the data is highlighted
 * @param {JSX.Element} children - Data to be displayed
 * @returns {JSX.Element}
 * @example
 * <Td isNumeric isHighlight>1</Td>
 */
export const Td = ({
	isNumeric,
	isHighlight,
	children,
	...rest
}: TdProps): JSX.Element => {
	return (
		<td
			className={`py-4 px-3 ${
				isNumeric ? 'text-right whitespace-nowrap tabular-nums' : ''
			} ${isHighlight ? 'font-medium text-gray-900 dark:text-white' : ''} ${
				rest.className
			}`}
		>
			{children}
		</td>
	);
};

type BaseTableProps = {
	columns: {
		label: string;
		isNumeric?: boolean;
	}[];
	id?: string;
	children: React.ReactNode;
};

/**
 * Base Table component
 * @param {Object} columns - Columns to be displayed in the table
 * @param {String} id - Id of the table
 * @param {JSX.Element} children - Table elements to be displayed
 * @returns {JSX.Element}
 * @example
 * <BaseTable columns={columns} id='table'>
 * 	<Tr index={0}>
 * 		<Td>1</Td>
 * 		<Td>2</Td>
 * 		<Td>3</Td>
 * 	</Tr>
 * </BaseTable>
 */
export const BaseTable = ({
	columns,
	id,
	children,
}: BaseTableProps): JSX.Element => {
	return (
		<div className='overflow-x-auto rounded-lg relative max-h-screen'>
			<table
				className='table-auto w-full text-sm text-left text-gray-600 dark:text-gray-400'
				id={id}
			>
				<Thead>
					<Tr index={1}>
						{columns.map((column, index) => {
							return (
								<Th key={index} isNumeric={column.isNumeric}>
									{column.label}
								</Th>
							);
						})}
					</Tr>
				</Thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
};
