import React from 'react';
import { Button } from './button';
// import { ButtonProps } from './button';

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
	children: React.ReactNode;
};

export const ButtonGroup = ({ children }: ButtonGroupProps): JSX.Element => {
	const childrenArray = React.Children.toArray(children);

	return (
		<div className='inline-flex rounded-md px-4' role='group'>
			{childrenArray.map((child, index) => {
				if (React.isValidElement(child)) {
					return (
						<Button
							onClick={child.props.onClick}
							isActive={child.props.isActive}
							key={index}
							className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900
								${index === 0 ? 'rounded-l-lg' : ''} ${
									index === childrenArray.length - 1 ? 'rounded-r-lg' : ''
								}
								group bg-gradient-to-br from-bo-primary to-cyan-500
								hover:text-white dark:text-white focus:ring-4 focus:outline-none `}
						>
							{child.props.children}
						</Button>
					);
				}
			})}
		</div>
	);
};
