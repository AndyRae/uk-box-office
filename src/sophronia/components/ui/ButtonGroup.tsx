import React from 'react';
import { Button } from './Button';

/**
 * @file ButtonGroup.jsx
 * @description ButtonGroup component with a branded gradient outline.
 * @param {JSX.Button} children - The buttons to display inside the group
 * @returns {JSX.Element}
 * @example
 * <ButtonGroup>
 *  <Button onClick={() => console.log('Hello World!')}>Hello World!</Button>
 * </ButtonGroup>
 */

type ButtonGroupProps = {
	children: React.ReactChild;
};

export const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => {
	const childrenArray = React.Children.toArray(children);

	return (
		<div className='inline-flex rounded-md shadow-sm px-4' role='group'>
			{childrenArray.map((child, index) => {
				return (
					<Button
						onClick={child.props.onClick}
						isActive={child.props.isActive}
						key={index}
						className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900
              ${index === 0 ? 'rounded-l-lg' : ''} ${
								index === childrenArray.length - 1 ? 'rounded-r-lg' : ''
							}
              group bg-gradient-to-br from-pink-500 to-bo-primary group-hover:from-pink-500 group-hover:to-orange-400
               hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800`}
					>
						{child.props.children}
					</Button>
				);
			})}
		</div>
	);
};
