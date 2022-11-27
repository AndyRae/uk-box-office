const Thead = ({ children }) => {
	return (
		<thead className='text-xs text-gray-700 uppercase border-b-2 border-b-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-gray-400'>
			{children}
		</thead>
	);
};

const Th = ({ isNumeric, children }) => {
	return (
		<th scope='col' className={`py-3 px-3 ${isNumeric ? 'text-center' : ''}`}>
			{children}
		</th>
	);
};

export const Tr = ({ index, children }) => {
	const alternatingColor = ['bg-white', 'bg-gray-100'];
	const alternatingDarkColor = ['dark:bg-black', 'dark:bg-gray-900'];
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

export const Td = ({ isNumeric, isHighlight, children, ...rest }) => {
	return (
		<td
			className={`py-4 px-3 ${
				isNumeric ? 'text-center whitespace-nowrap' : ''
			} ${isHighlight ? 'font-medium text-gray-900 dark:text-white' : ''} ${
				rest.className
			}`}
		>
			{children}
		</td>
	);
};

export const BaseTable = ({ columns, id, children }) => {
	return (
		<div className='overflow-x-auto rounded-lg relative max-h-screen'>
			<table
				className='table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400'
				id={id}
			>
				<Thead>
					<Tr>
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
