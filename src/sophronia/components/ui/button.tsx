export type ButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
	isActive?: boolean;
	aria?: string;
	[x: string]: any;
};

/**
 * @file Button.jsx
 * @description Button component with a branded gradient outline.
 * @param {Object} props - Props object
 * @param {string} props.children - The text to display inside the button
 * @param {function} props.onClick - The function to call when the button is clicked
 * @param {boolean} props.isActive - Whether the button is active or not
 * @returns {JSX.Element}
 * @example
 * <Button onClick={() => console.log('Hello World!')}>Hello World!</Button>
 */
export const Button = ({
	children,
	onClick,
	isActive,
	aria,
	...props
}: ButtonProps): JSX.Element => {
	return (
		<button
			onClick={onClick}
			aria-label={aria}
			className=' max-w-fit relative inline-flex items-center justify-center p-0.5 mr-2 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-bo-primary to-cyan-500 group-hover:from-bo-primary group-hover:to-cyan-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
			{...props}
		>
			<span
				className={`relative px-5 py-2 transition-all inline-flex items-center ease-in duration-150 rounded-md group-hover:bg-opacity-0 ${
					isActive ? 'bg-opacity-0' : 'bg-white dark:bg-black'
				}`}
			>
				{children}
			</span>
		</button>
	);
};
