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
		boxOffice: 0,
		weekendBoxOffice: 0,
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
					offset: true,
					time: {
					  unit: 'week'
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function(value, index, values) {
							return '£ ' + value;
						}
					},
				}],
			},
			legend: {
				display: false,
			},
		},
		optionsarea: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					type: 'time',
					offset: true,
					time: {
						unit: 'week'
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
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
			return this.filmTableData.sort(function(a, b) {
				return b.week_gross - a.week_gross;
			})
		}

	},

	async mounted () {
		this.generateDatePickers()

		this.getLastUpdated()

		// get dates
		let start_date = this.date_picker_start.dateSelected.toISOString().split('T', 1)[0]
		let end_date = this.date_picker_end.dateSelected.toISOString().split('T', 1)[0]

		this.queryApi(start_date, end_date)
	},

	methods: {

		getLastUpdated: function() {
			fetch('/api')
			.then(response => response.json())
			.then(data => this.lastUpdated = data.results[0].date);
		},

		async queryApi(start_date, end_date) {
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
					const { date, film, film_slug, distributor_id, week_gross, weekend_gross } = week;
					results.push({ date, film, film_slug, distributor_id, week_gross, weekend_gross });
				});
				// increment the page with 20 on each loop
				page += 100;
				} catch (err) {
				console.error(`Oeps, something is wrong ${err}`);
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
			console.log(values)

			x = [
				{
					label: "Box Office",
					data: values,
					borderColor: ['#FF8321'],
					backgroundColor: ['#FF8321'],
					pointStyle: 'circle',
					tension: 0.3,
					fill: false,
				}
			]
			this.$set(this.chartdata = {
				labels: dates,
				datasets: x
			})

			// Scorecards
			this.boxOffice = values.reduce((a, b) => a + b, 0)
			this.weekendBoxOffice = 0

			// Film Table
			this.filmTableData = this.groupForTable(results)

			this.loaded = true
		},

		groupForLineChart: function(results) {
			groupedDate = Array.from(results)
			return Array.from(groupedDate.reverse().reduce(
				(m, {date, week_gross}) => m.set(date, (m.get(date) || 0) + week_gross), new Map
				), ([date, week_gross]) => ({date, week_gross}));
		},

		groupForTable: function(results) {
			groupedFilm = Array.from(results)
			groupedFilm.forEach(function(v){ delete v.date, delete v.weekend_gross });
			return Array.from(groupedFilm.reduce((acc, {week_gross, ...r}) => {
				const key = JSON.stringify(r);
				const current = acc.get(key) || {...r, week_gross: 0};  
				return acc.set(key, {...current, week_gross: current.week_gross + week_gross});
			  }, new Map).values());
		},

		groupForAreaChart: function(results) {
			// Reduce array to single films with box office
			groupedArea = Array.from(results)
			let groupedFilms = Array.from(groupedArea.reduce(
				(m, {film, week_gross}) => m.set(film, (m.get(film) || 0) + week_gross), new Map
				), ([film, week_gross]) => ({film, week_gross}));

			// Filter so we only graph the top N
			groupedFilms.sort(function(a, b) {
				return b.week_gross - a.week_gross;
			})
			groupedFilms.splice(30)

			const colors = ['#FFA188', '#006277', '#FF473E', '#009F41', '#FF8321', '#003f5c', '#2f4b7c',
			'#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'] 

			// Create the dataset objects - loop through the films, and then original results for matching weeks 
			datasets = []
			for (i in groupedFilms) {
				let randomColor = colors[Math.floor(Math.random()*colors.length)]

				x = {
						label: groupedFilms[i].film,
						borderColor: randomColor+'4d',
						backgroundColor: randomColor+'4d',
						fill: true,
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

		generateDatePickers: function() {
			var start = new Date();
			var end = new Date();
			var min = new Date();
			start.setDate(start.getDate() - 90 );
			min.setDate(min.getDate() - 547); // allow to go back 1.5 years
	
			this.date_picker_start = datepicker('#start', { dateSelected: new Date(start)}, { id: 1 })
			this.date_picker_end = datepicker('#end', { dateSelected: new Date(end)}, { id: 1 })

			this.date_picker_start.setMin(min)
			
			this.date_picker_start.calendarContainer.style.setProperty('font-size', '0.8rem')
			this.date_picker_end.calendarContainer.style.setProperty('font-size', '0.8rem')
		},

		filter_date: function() {
			let start_date = this.date_picker_start.dateSelected.toISOString().split('T', 1)[0]
			let end_date = this.date_picker_end.dateSelected.toISOString().split('T', 1)[0]

			this.queryApi(start_date, end_date)
		},

		filter_days: function(days) {
			var s = new Date();
			var end = new Date();
			s.setDate(s.getDate() - days );

			this.date_picker_start.setDate(new Date(s), true)
			this.date_picker_end.setDate(new Date(end), true)

			this.filter_date()
		} 
	}
})
