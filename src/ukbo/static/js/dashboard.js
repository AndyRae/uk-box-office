Vue.filter("TitleCase", value => {
	if (Number.isInteger(value)) {
		return value
	}
	return value.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase()).replace(/&#39;/g, "'");;
});


Vue.filter("Currency", value => {
	return value.toLocaleString('en-US')
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

// This structure is so the charts updates when chartdata changes
Vue.component('area-chart', {
	extends: VueChartJs.Line,
	props: {
		chartdataarea: {
			datasets: [],
			default: null
		},
		optionsarea: {
			type: Object,
			default: null
		}
	},
	computed: {
		data: function() {
			return this.chartdataarea;
		}
	},
	methods: {
		renderAreaChart: function() {
			this.renderChart(this.data, this.optionsarea)
		}
	},
	mounted () {
		this.renderAreaChart()
	},
	watch: {
		data: function() {
			this.$data._chart.destroy();
			this.renderAreaChart();
		}
	}
})


var vm = new Vue({
	el: '#dash',
	delimiters: ['${','}'],
	data: () => ({
		loaded: false,
		loading: true,
		boxOffice: 0,
		numberOfFilms: 0,
		numberOfCinemas: 0,
		lastUpdated: "-",
		filmTableData: [],
		chartdata: {
			labels: [],
			datasets: [],
			default: null
		},
		chartdataarea: {
			datasets: [],
			default: null
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'series',
					ticks: {
						maxRotation: 0,
						minRotation: 0,
						autoSkip: true
					},
					time: {
					  unit: 'week',
					  tooltipFormat:'DD/MM/YYYY',
					},
					gridLines: {
						display:false
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						autoSkip: true,
						stepSize: 10000000,
						callback: function(value, index, values) {
							return '£ ' + value / 1e6 + 'M';
						}
					},
				}],
			},
			legend: {
				display: false,
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItems, data) {
						return "£" + tooltipItems.yLabel.toString();
					}
				}
			},
		},
		optionsarea: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'series',
					ticks: {
						maxRotation: 0,
						minRotation: 0,
						autoSkip: true
					},
					time: {
						unit: 'week',
						tooltipFormat:'DD/MM/YYYY',
					},
					gridLines: {
						display:false
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						autoSkip: true,
						stepSize: 10000000,
						callback: function(value, index, values) {
							return '£ ' + value / 1e6 + 'M';
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
			return this.filmTableData.sort(function(a, b) {
				return b.week_gross - a.week_gross;
			})
		}

	},

	async mounted () {
		this.generateDatePickers()
		this.getLastUpdated()
		// Initial queryData is from the template data for speed.
		this.updateChart(queryData)
	},

	methods: {

		getLastUpdated: function() {
			fetch('/api')
			.then(response => response.json())
			.then(data => this.lastUpdated = data.results[0].date);
		},

		async queryApi(start_date, end_date) {
			const baseUrl = '/api?start_date='+start_date+'&end_date='+end_date+"&limit=150&start=";
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
					const { date, film, film_slug, distributor, week_gross, number_of_cinemas, weeks_on_release } = week;
					results.push({ date, film, film_slug, distributor, week_gross, number_of_cinemas, weeks_on_release });
				});
				// increment the page on each loop
				page += 150;
				} catch (err) {
				console.error(`Something is wrong ${err}`);
				break
				}
				// keep running until there's no next page
			} while (lastResult.next !== "");

			this.updateChart(results)
		},

		updateChart: function(results) {
			// Where to do the data logic for each graph

			// Area Graph
			const areaData = this.groupForAreaChart(results)

			this.$set(this.chartdataarea = {
				datasets: areaData
			})

			// Line Graph
			const results_by_date = this.groupForLineChart(results)

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
					borderColor: ['#FE7E6D'],
					backgroundColor: ['#FE7E6D'],
					pointStyle: 'circle',
					tension: 0.5,
					fill: false,
				}
			]
			this.$set(this.chartdata = {
				labels: dates,
				datasets: x
			})

			// Scorecards
			this.boxOffice = values.reduce((a, b) => a + b, 0)
			this.numberOfFilms = this.calculateNumberOfFilms(results)
			this.numberOfCinemas = this.calculateNumberOfCinemas(results)

			// Film Table
			this.filmTableData = this.groupForTable(results)

			this.loaded = true
			this.loading = false
		},

		groupForLineChart: function(results) {
			groupedDate = Array.from(results)
			return Array.from(groupedDate.reverse().reduce(
				(m, {date, week_gross}) => m.set(date, (m.get(date) || 0) + week_gross), new Map
				), ([date, week_gross]) => ({date, week_gross}));
		},

		groupForTable: function(results) {
			// TODO: Explain this.
			var result = results.reduce( (acc, curr) => {
				let item = acc.find(x => x.film == curr["film"]);
				if(!item){
					item = {film: curr["film"], slug: curr["film_slug"], distributor: curr["distributor"], weeks:{}}
					acc.push(item);
				}
				item.weeks[curr.weeks_on_release] = (item.weeks[curr.weeks_on_release] || 0) + curr.week_gross
				return acc;
			},[])
				.map(x => ({
				"film": x.film,
				"film_slug": x.slug,
				"distributor": x.distributor,
				"weeks": Math.max(...Object.keys(x.weeks).map(Number)),
				"week_gross": Object.values(x.weeks).reduce( (a,b) => a+b ,0)
			}))

			return result
		},

		groupForAreaChart: function(results) {
			// Reduce array to single films with box office
			groupedArea = Array.from(results)
			let groupedFilms = Array.from(groupedArea.reduce(
				(m, {film, week_gross}) => m.set(film, (m.get(film) || 0) + week_gross), new Map
				), ([film, week_gross]) => ({film, week_gross}));

			// Filter so we only graph the top N
			topNFilms = 30
			groupedFilms.sort(function(a, b) {
				return b.week_gross - a.week_gross;
			})
			groupedFilms.splice(topNFilms)

			// Create the dataset objects - loop through the films, and then original results for matching weeks
			datasets = []
			for (i in groupedFilms) {
				let randomColor = Math.floor(Math.random()*16777215).toString(16);

				x = {
						label: groupedFilms[i].film,
						borderColor: '#'+randomColor,
						fill: false,
				}

				weeks = []
				for (j in results) {
					if(results[j].film == groupedFilms[i].film) {
						weeks.push({x: results[j].date, y: results[j].week_gross })
					}
				}
				x.data = weeks
				datasets.push(x)
			}
			return datasets
		},

		calculateNumberOfFilms: function(results) {
			// Reduce array to number of unique films
			grouped = Array.from(results)
			let groupedNumber = Array.from(groupedArea.reduce(
				(m, {film, week_gross}) => m.set(film, (m.get(film) || 0) + week_gross), new Map
				), ([film, week_gross]) => ({film, week_gross}));
			return groupedNumber.length
		},

		calculateNumberOfCinemas: function(results) {
			x = Math.max.apply(Math, results.map(function(o) { return o.number_of_cinemas; }))
			return x
		},

		generateDatePickers: function() {
			// Create date picker objects
			var start = new Date();
			start.setDate(start.getDate() - 60 );
			this.dateStart = document.querySelector('.date-start');
			this.dateStart.valueAsDate = start

			var min = new Date();
			min.setDate(min.getDate() - 365); // allow to go back 1 years
			min = min.toISOString()
			min = min.substring(0, min.indexOf('T'))
			this.dateStart.min = min

			var end = new Date();
			this.dateEnd = document.querySelector('.date-end');
			this.dateEnd.valueAsDate = end
		},

		filter_date: function() {
			// Get dates from datepickers
			this.loaded = false
			this.loading = true

			let start_date = this.dateStart.valueAsDate.toISOString()
			let end_date = this.dateEnd.valueAsDate.toISOString()

			start_date = start_date.substring(0, start_date.indexOf('T'));
			end_date = end_date.substring(0, end_date.indexOf('T'));

			this.queryApi(start_date, end_date)
		},

		filter_days: function(days) {
			// Set dates from the value from button
			var s = new Date();
			var end = new Date();
			s.setDate(s.getDate() - days );

			this.dateStart.valueAsDate = s
			this.dateEnd.valueAsDate = end

			this.filter_date()
		}
	}
})
