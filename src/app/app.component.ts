import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataUploadService } from './services/data-upload.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'physical-activity-tracker';
	private sampleData = [
		["2023-09-27", "5.0", "8.0", "45:00", "9:00"],
		["2023-09-26", "3.5", "5.6", "30:00", "8:34"]
	];
	
	public tableColumns = [
		"Date",
		"Distance (mi)",
		"Distance (km)",
		"Time",
		"Pace"
	]
	private chart: any;
	private chartData: any = {
		"labels": {},
		"datasets": []
	};
	// new run button that pops ups a window when clicked
	// field entries for time, distance, temperature, humidity, elevation
	// submit button that sends info to python script that stores inputted information into SQL database
	// log in button w/ optional new user display
	constructor(private dataUploadService: DataUploadService) {}

	ngOnInit(): void {
		
		this.dataUploadService.pullData().subscribe((result) => {
			console.log("result from data upload serviceL: ", result);
		});;
	}

	public openDataEntry(): void {
		let modal = document.getElementById('physical-acitvity-entry') as HTMLElement;
		modal.style.display = 'block';
	}
	public closeDataEntry(): void {
		let modal = document.getElementById('physical-acitvity-entry') as HTMLElement;
		modal.style.display = 'none';
	}
	public submitData(): void {
		let date = document.querySelector('input[name="dateEntry"]') as HTMLInputElement;
		let distance = document.querySelector('input[name="distanceEntry"]') as HTMLInputElement;
		let hours = document.querySelector('input[name="hoursEntry"]') as HTMLInputElement;
		let minutes = document.querySelector('input[name="minutesEntry"]') as HTMLInputElement;
		let seconds = document.querySelector('input[name="secondsEntry"]') as HTMLInputElement;
		let pace = document.querySelector('input[name="paceEntry"]') as HTMLInputElement;

		let distanceInt = Number(distance.value);
		let hoursInt = Number(hours.value);
		let minutesInt = Number(minutes.value);
		let secondsInt = Number(seconds.value);
		
		if ( minutesInt > 60 ) {
			hoursInt = hoursInt + 1;
			hours.value = String(hoursInt);
			minutes.value = String(minutesInt - 60);
			minutesInt = Number(minutes.value);
		}

		let totalTime = (hoursInt * 60) + minutesInt + (secondsInt / 60);
		let calculatedPace = totalTime / distanceInt;
		pace.value = calculatedPace.toFixed(2);

		this.dataUploadService.uploadData({
			"Date": date.value,
			"Distance": distanceInt,
			"Hours": hoursInt,
			"Minutes": minutesInt,
			"Seconds": secondsInt,
			"Pace": calculatedPace
		});

		this.createTableHeaders();
		this.populateTableWithData();
		this.closeDataEntry();
	}
	private createTableHeaders(): void {
		let tableHeadersRow = document.getElementById("tableHeaders");
	
		for ( const columnName of this.tableColumns ) {
			let th = document.createElement("th");
			th.textContent = columnName;
			tableHeadersRow?.appendChild(th);
		}
	}
	private populateTableWithData(): void {
		let table = document.getElementById("dataTable") as HTMLElement;
		let tbody = table?.getElementsByTagName("tbody")[0];
	
		for ( const rowData of this.sampleData ) {
			let row = document.createElement("tr");
			for ( let cellData of rowData ) {
				const td = document.createElement("td");
				td.textContent = cellData;
				row.appendChild(td);
			}
			tbody?.appendChild(row);
		}
		table.style.display = "block";
		this.fillChartData();
	}
	private fillChartData(): void {
		this.destroyChart();
		this.chartData={"labels": {}, "datasets": []};
		const increment=1;
		let maxGames: any;
		let pointStyle: any;
		
		// const labels = Array.from({ length: Math.ceil(maxGames / increment) }, (_, index) => (index * increment).toString());
		// this.chartData["labels"] = labels;
		
		// const yearData=this.activeTeams[year].map((team: any, index: any) => ({
		// 	label: team.name + ` (${year})`,
		// 	data: team.netRecord
			// backgroundColor: team.mainColor,
			// borderColor: team.secondaryColor,
			// borderWidth: 2,
			// pointRadius: this.pointRadius,
			// pointStyle: pointStyle
		// }));


		// this.chartData["datasets"] = {
		// 	label: this.tableColumns['Date'],
		// 	data: this.tableColumns['Distance (km)']
		// };
		console.log(this.chartData)
		
		// this.generateChart();
	}
	// private generateChart(): void {
	// 	const canvas: any = document.getElementById("myChart");
	// 	this.chart = new Chart(canvas, {
	// 		type: 'line',
	// 		data: {
	// 			labels: this.tableColumns['Date'],
	// 			datasets: [{
	// 				label: 'Distance (mi)',
	// 				data: this.tableColumns['Distance (mi)'],
	// 				borderColor: 'blue',
	// 				borderWidth: 2,
	// 				pointRadius: 6
	// 			}]
	// 		},
	// 		options: {
	// 			scales: {
	// 				y: {
	// 					beginAtZero: true,
	// 					grid: {
	// 						display: false
	// 					}
	// 				},
	// 				x: {
	// 					beginAtZero: false,
	// 					grid: {
	// 						display: false
	// 					}
	// 				}
	// 			},
	// 			interaction: {
	// 				intersect: true,
	// 				mode: 'index'
	// 			},
	// 			plugins: {
	// 				tooltip: {
	// 					callbacks: {
	// 						label: function(context) {
	// 							// this.title = ["Game"+ `${context.dataIndex + 1}`];
	// 							// let label = context.dataset.label || '';
	// 							// let wins = 0;
	// 							// let losses = 0;
	// 							// if (label) {
	// 							// 	label += ': ';
	// 							// }
	// 							// if (context.parsed.y !== null) {
	// 							// 	const dataIndex = context.dataIndex;
	// 							// 	const winLoss: any = context.dataset.data;
	// 							// 	for (let i=0; i<=dataIndex; i++) {
	// 							// 		const value: any=winLoss[i];
	// 							// 		if (value > winLoss[i-1]) {
	// 							// 			wins+=1;
	// 							// 		} else {
	// 							// 			losses+=1;
	// 							// 		}
	// 							// 	}
	// 							// 	label+=`${wins}-${losses}`;
	// 							// }
	// 							// return label;
	// 						}
	// 					}
	// 				},
	// 				legend: {
	// 					position: 'top',
	// 					labels: {
	// 						font: {
	// 							size: 14,
	// 							weight: 'bold'
	// 						},
	// 						usePointStyle: true
	// 					}
	// 				}
	// 			},
	// 		}
	// 	});
	// }
	private destroyChart(): void {
		if (this.chart) {
		  this.chart.destroy();
		}
	}

}
