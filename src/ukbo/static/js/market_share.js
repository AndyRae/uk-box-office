function graph(years, share) {
	var ctx = document.getElementById('myChart');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: years,
			datasets: share,
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
					stacked: true,
					beginAtZero: true,
					ticks: {
						autoSkip: true,
					}
				},
			}
		}
	});
}

graph(years, share)
