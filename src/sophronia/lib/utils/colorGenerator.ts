/**
 * @file Color generator.
 * @exports interpolateColors
 */

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
		colorArray.push(colorScale(colorPoint));
	}

	return colorArray;
};
