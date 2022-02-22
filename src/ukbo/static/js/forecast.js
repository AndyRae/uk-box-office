function graph(time_dates, week_gross, yhat, yhat_high, yhat_low) {
	var ctx = document.getElementById('myChart');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: time_dates,
			datasets: [{
				label: 'Box Office',
				data: week_gross,
				backgroundColor: [
					'#FE7E6D',
				],
				borderColor: [
					'#FE7E6D',
				],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y'
			},
			{
				label: 'yhat',
				data: yhat,
				backgroundColor: [
					'#ede7d8',
				],
				borderColor: [
					'#ede7d8',
				],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y'
			},
			{
				label: 'yhat_upper',
				data: yhat_high,
				backgroundColor: [
					'#aeaae8',
				],
				borderColor: [
					'#aeaae8',
				],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y'
			},
			{
				label: 'yhat_low',
				data: yhat_low,
				backgroundColor: [
					'#7f83de',
				],
				borderColor: [
					'#7f83de',
				],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y'
			}]
		},
		options: {
			scales: {
				x: {
					grid: {
						display:false
					},
					offset: false,
				},
				y: {
					beginAtZero: true,
					ticks: {
						autoSkip: true,
						stepSize: 10000000,
						callback: function(value, index, values) {
							var ranges = [
								{ divider: 1e6, suffix: 'M' },
								{ divider: 1e3, suffix: 'k' }
							];
							function formatNumber(n) {
								for (var i = 0; i < ranges.length; i++) {
								if (n >= ranges[i].divider) {
									return (n / ranges[i].divider).toString() + ranges[i].suffix;
								}
								}
								return n;
							}
							return '£' + formatNumber(value);
						}
					}
				},
			}
		}
	});
}

graph(time_dates, week_gross, yhat, yhat_high, yhat_low)
