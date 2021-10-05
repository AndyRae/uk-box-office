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
					'#FF473E',
				],
				borderColor: [
					'#FF473E',
				],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y'
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						callback: function(value, index, values) {
							return '£ ' + value;
						}
					}
				},
			}
		}
	});
}

async function getPages(start_date, end_date) {
	// set some variables
	const baseUrl = '/api?start_date='+start_date+'&end_date='+end_date+"&start=";
	let page = 1;
	// create empty array where we want to store the people objects for each loop
	let results = [];
	// create a lastResult array which is going to be used to check if there is a next page
	let lastResult = [];
	do {
		// try catch to catch any errors in the async api call
		try {
		// use node-fetch to make api call
		const resp = await fetch(`${baseUrl}${page}`);
		const data = await resp.json();
		lastResult = data;
		data.results.forEach(week => {
			// destructure the person object and add to array
			const { date, week_gross } = week;
			results.push({ date, week_gross });
		});
		// increment the page with 20 on each loop
		page += 20;
		} catch (err) {
		console.error(`Oeps, something is wrong ${err}`);
		}
		// keep running until there's no next page
	} while (lastResult.next !== "");

	// Map reduce the results to dates / values
	const res = Array.from(results.reverse().reduce(
		(m, {date, week_gross}) => m.set(date, (m.get(date) || 0) + week_gross), new Map
		), ([date, week_gross]) => ({date, week_gross}));

	dates = []
	values = []
	for (i in res) {
		dates.push(res[i].date)
		values.push(res[i].week_gross)
	}

	graph(dates, values)

}

getPages("2020-02-20", "2020-10-27")
