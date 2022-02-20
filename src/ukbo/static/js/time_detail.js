function graph(time_dates, week_gross) {
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

function bargraph(films, week_gross) {
	var ctx = document.getElementById('barChart');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: films,
			datasets: [{
				label: 'Box Office',
				data: week_gross,
				backgroundColor: [
					'#FE7E6D',
				],
				borderColor: [
					'#FE7E6D',
				],
				yAxisID: 'y'
			}]
		},
		options: {

			scales: {
				x: {
					grid: {
						display:false
					},
					offset: true,
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

function exportToCSV(tableEle, separator = ','){
	const head = ["Rank", "Film", "Box Office"]
	let csvRows = [head]
	//only get direct children of the table in question (thead, tbody)
	Array.from(tableEle.children).forEach(function(node){
		//using scope to only get direct tr of node
		node.querySelectorAll(':scope > tr').forEach(function(tr){
			let csvLine = []
			//again scope to only get direct children
			tr.querySelectorAll(':scope > td').forEach(function(td){
				//clone as to not remove anything from original
				let copytd = td.cloneNode(true)
				let data = copytd.textContent

				data = data.replace(/(\s\s)/gm, ' ').replace(/"/g, '""')
				csvLine.push('"'+data+'"')
			})
			csvRows.push(csvLine.join(separator))
		})
	})
	var a = document.createElement("a")
	a.style = "display: none; visibility: hidden" //safari needs visibility hidden
	a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'))
	a.download = 'box_office.csv'
	document.body.appendChild(a)
	a.click()
	a.remove()
}

graph(time_dates, week_gross)
bargraph(films, box)
