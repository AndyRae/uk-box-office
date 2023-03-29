'use client';

import * as React from 'react';
import clsx from 'clsx';

import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={clsx(
			'inline-flex items-center justify-center rounded-md bg-slate-100 p-1 dark:bg-slate-900',
			className
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		className={clsx(
			'inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5 text-sm font-medium text-slate-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100',
			className
		)}
		{...props}
		ref={ref}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		className={clsx('mt-2 p-6', className)}
		{...props}
		ref={ref}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// export const RadixTabs = () => (
//   <Tabs.Root defaultValue="tab1">
//     <Tabs.List aria-label="tabs example">
//       <Tabs.Trigger value="tab1">One</Tabs.Trigger>
//       <Tabs.Trigger value="tab2">Two</Tabs.Trigger>
//       <Tabs.Trigger value="tab3">Three</Tabs.Trigger>
//     </Tabs.List>
//     <Tabs.Content value="tab1">Tab one content</Tabs.Content>
//     <Tabs.Content value="tab2">Tab two content</Tabs.Content>
//     <Tabs.Content value="tab3">Tab three content</Tabs.Content>
//   </Tabs.Root>
// );
