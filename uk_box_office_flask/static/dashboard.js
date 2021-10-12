Vue.filter("TitleCase", value => {
	if (Number.isInteger(value)) {
		return value
	}
	return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
});


Vue.filter("Currency", value => {
	value= "" + value
	return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
});


// This structure is so the charts updates when chartdata changes
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
	computed: {
		data: function() {
		  return this.chartdata;
		}
	},
	methods: {
		renderLineChart: function() {
			this.renderChart(this.data, this.options)
		}
	},
	mounted () {
		this.renderLineChart()
	},
	watch: {
		data: function() {
			this.$data._chart.destroy();
			this.renderLineChart();
		}
	}
})


var vm = new Vue({
	el: '#dash',
	delimiters: ['${','}'],
	data: () => ({
		loaded: false,
		boxOffice: 0,
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

		this.generate_date_pickers()

		// get dates
		let start_date = this.date_picker_start.dateSelected.toISOString().split('T', 1)[0]
		let end_date = this.date_picker_end.dateSelected.toISOString().split('T', 1)[0]

		this.query_api(start_date, end_date)
	},
	methods: {
		async query_api(start_date, end_date) {
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
					const { date, film, film_slug, distributor_id, week_gross } = week;
					results.push({ date, film, film_slug, distributor_id, week_gross });
				});
				// increment the page with 20 on each loop
				page += 100;
				} catch (err) {
				console.error(`Oeps, something is wrong ${err}`);
				break
				}
				// keep running until there's no next page
			} while (lastResult.next !== "");

			this.update_chart(results)
		},
		generate_date_pickers: function() {
			var e = new Date();
			var s = new Date();
			s.setDate(s.getDate() - 400 );
	
			this.date_picker_start = datepicker('#start', { dateSelected: new Date(s)}, { id: 1 })
			this.date_picker_end = datepicker('#end', { dateSelected: new Date(e)}, { id: 1 })
			
			this.date_picker_start.calendarContainer.style.setProperty('font-size', '0.8rem')
			this.date_picker_end.calendarContainer.style.setProperty('font-size', '0.8rem')
		},
		group_by_date: function(results) {
			return Array.from(results.reverse().reduce(
				(m, {date, week_gross}) => m.set(date, (m.get(date) || 0) + week_gross), new Map
				), ([date, week_gross]) => ({date, week_gross}));
		},
		group_by_film: function(results) {
			results.forEach(function(v){ delete v.date });
			return Array.from(results.reduce((acc, {week_gross, ...r}) => {
				const key = JSON.stringify(r);
				const current = acc.get(key) || {...r, week_gross: 0};  
				return acc.set(key, {...current, week_gross: current.week_gross + week_gross});
			  }, new Map).values());
		},
		update_chart: function(results) {
			const results_by_date = this.group_by_date(results)
			this.filmdata = this.group_by_film(results)
	
			console.log(this.filmdata)
			
			dates = []
			values = []
			for (i in results_by_date) {
				dates.push(results_by_date[i].date)
				values.push(results_by_date[i].week_gross)
			}
			// sum up for the total
			this.boxOffice = values.reduce((a, b) => a + b, 0)
	
			x = [
				{
					label: "Box Office",
					data: values,
					borderColor: ['#FFCDD2'],
					backgroundColor: ['#FFCDD2'],
					pointStyle: 'circle',
					tension: 0.3,
					fill: false,
				}
			]
			this.$set(this.chartdata = {
				labels: dates,
				datasets: x
			})
			this.loaded = true

		},
		filter_date: function() {
			let start_date = this.date_picker_start.dateSelected.toISOString().split('T', 1)[0]
			let end_date = this.date_picker_end.dateSelected.toISOString().split('T', 1)[0]

			// need to get data
			this.query_api(start_date, end_date)
		}
	}
})
