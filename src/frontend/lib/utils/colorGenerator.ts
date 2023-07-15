/**
 * @file Color generator.
 * @exports interpolateColors
 */

import { interpolateCool } from 'd3-scale-chromatic';
/**
 * A function to generate an array of colors based on the length of the data.
 * @param {number} i - The index of the color.
 * @param {number} intervalSize - The size of the interval.
 * @param {Object} colorRangeInfo - The color range information.
 * @returns {number} The color point.
 * @example
 * const colorPoint = calculatePoint(0, 0.1, { colorStart: 0, colorEnd: 1, useEndAsStart: false });
 */
function calculatePoint(
	i: number,
	intervalSize: number,
	colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
): number {
	var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
	return useEndAsStart
		? colorEnd - i * intervalSize
		: colorStart + i * intervalSize;
}

/**
 * A function to generate an array of colors based on the length of the data.
 * Must use an interpolated color scale, which has a range of [0, 1]
 * @param {number} dataLength - The length of the data.
 * @param {function} colorScale - The color scale.
 * @param {Object} colorRangeInfo - The color range information.
 * @returns {Array} The array of colors.
 * @example
 * const colorArray = interpolateColors(10, d3.interpolateBlues, { colorStart: 0, colorEnd: 1, useEndAsStart: false });
 */
export const interpolateColors = (
	dataLength: number,
	colorScale: (arg0: any) => any,
	colorRangeInfo: { colorStart: any; colorEnd: any; useEndAsStart: any }
): Array<string> => {
	var { colorStart, colorEnd } = colorRangeInfo;
	var colorRange = colorEnd - colorStart;
	var intervalSize = colorRange / dataLength;
	var i: number, colorPoint: number;
	var colorArray = [];

	for (i = 0; i < dataLength; i++) {
		colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
		var color = colorScale(colorPoint);
		colorArray.push(rgbToHex(color));
	}

	return colorArray;
};

/**
 * Gets the default array of colours for a given array
 * @param {number} length - Length of the array needed
 */
export const getDefaultColorArray = (length: number): Array<string> => {
	const colorScale = interpolateCool;
	const colorRangeInfo = {
		colorStart: 0.2,
		colorEnd: 1,
		useEndAsStart: false,
	};
	return interpolateColors(length, colorScale, colorRangeInfo);
};

/**
 * Converts a RGB component to its hex value
 * @param c - R|G|B number
 * @returns hex string
 */
function componentToHex(c: number) {
	const hex = c.toString(16);

	return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * Converts a RGB colour string to hex
 * e.g rgb(158, 1, 66) => #9e0142
 * @param rgb - RGB string
 * @returns - Hex colour
 */
function rgbToHex(rgb: string) {
	const [r, g, b] = rgb
		.replace('rgb(', '')
		.replace(')', '')
		.split(',')
		.map(Number);

	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
