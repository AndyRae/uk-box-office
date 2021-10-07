Vue.filter("TitleCase", value => {
	if (Number.isInteger(value)) {
		return value
	}

	return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
});


Vue.filter("Currency", value => {
	return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
});


Vue.component('line-chart', {
	extends: VueChartJs.Line,
	props: {
		chartdata: {
			labels: [],
			datasets: [],
			default: null
		},
		options: {
			type: Object,
			default: null
		}
		},
	mounted () {
		this.renderChart(this.chartdata, this.options)
	}
})


var vm = new Vue({
	el: '#dash',
	delimiters: ['${','}'],
	data: () => ({
		loaded: false,
		start,
		filmdata: [],
		chartdata: {
			labels: [],
			datasets: [],
			default: null
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					beginAtZero: true,
					ticks: {
						callback: function(value, index, values) {
							return '£ ' + value;
						}
					},
				}],
			},
			legend: {
				display: false,
			},
		}
	}),
	computed: {
		sortedfilms: function () {
			return this.filmdata.sort(function(a, b) {
				return b.week_gross - a.week_gross;
			})
		}
	},
	async mounted () {
		console.log("Running...")
		var e = new Date();
		var s = new Date();
		s.setDate(s.getDate() - 400 );

		const start = datepicker('#start', { dateSelected: new Date(s)}, { id: 1 })
		const end = datepicker('#end', { dateSelected: new Date(e)}, { id: 1 })

		start.calendarContainer.style.setProperty('font-size', '0.8rem')
		end.calendarContainer.style.setProperty('font-size', '0.8rem')

		let start_date = start.dateSelected.toISOString().split('T', 1)[0]
		let end_date = end.dateSelected.toISOString().split('T', 1)[0]

		const baseUrl = '/api?start_date='+start_date+'&end_date='+end_date+"&limit=100&start=";
		let page = 1;
		let results = [];
		let lastResult = [];
		do {
			// try catch to catch any errors in the async api call
			try {
			// use node-fetch to make api call
			const resp = await fetch(`${baseUrl}${page}`);
			const data = await resp.json();
			lastResult = data;
			data.results.forEach(week => {
				// destructure the object and add to array
				const { date, film_id, week_gross, weeks_on_release } = week;
				results.push({ date, film_id, week_gross, weeks_on_release });
			});
			// increment the page with 20 on each loop
			page += 100;
			} catch (err) {
			console.error(`Oeps, something is wrong ${err}`);
			break
			}
			// keep running until there's no next page
		} while (lastResult.next !== "");

		// Map reduce the results to dates / values
		const results_by_date = this.group_by_date(results)
		this.filmdata = this.group_by_film(results)
		
		dates = []
		values = []
		for (i in results_by_date) {
			dates.push(results_by_date[i].date)
			values.push(results_by_date[i].week_gross)
		}
		x = [
			{
				label: "Box Office",
				data: values,
				borderColor: ['#FFCDD2'],
				backgroundColor: [
					'#FFCDD2',
				],
				pointStyle: 'circle',
				tension: 0.3,
				fill: false,
			}
		]
		this.chartdata.labels = dates
		this.chartdata.datasets = x
		this.loaded = true
	},
	methods: {
		group_by_date: function(results) {
			return Array.from(results.reverse().reduce(
				(m, {date, week_gross}) => m.set(date, (m.get(date) || 0) + week_gross), new Map
				), ([date, week_gross]) => ({date, week_gross}));
		},
		group_by_film: function(results) {
			return Array.from(results.reverse().reduce(
				(m, {film_id, week_gross, weeks_on_release}) => m.set(film_id, (m.get(film_id) || 0) + week_gross), new Map
				), ([film_id, week_gross, weeks_on_release]) => ({film_id, week_gross, weeks_on_release}));
		},
		filter_date: function(click) {
			console.log("Welp!")
		}
	}
})
