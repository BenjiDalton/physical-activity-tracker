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
	
	private tableData: any;
	public tableColumns = [
		"Date",
		"Distance (mi)",
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
			this.tableData = result;
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

		this.closeDataEntry();
	}
	public createTable(): void {
		let table = document.getElementById('dataTable') as HTMLElement;
		// if ( table.style.display !== "none" ) {
		// 	table.parentNode?.removeChild(table);
		// }
		this.createTableHeaders();
		this.populateTableWithData();
		this.fillChartData();
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
		
		this.tableData = this.tableData.map((item: any[], index: number) => {
			const combinedTime = `${String(item[2]).padStart(2, '0')}:${String(item[3]).padStart(2, '0')}:${String(item[4]).padStart(2, '0')}`;
			return [item[0], item[1], combinedTime, item[5]];
		});
		for ( const rowData of this.tableData ) {
			let row = document.createElement("tr");
			for ( let i = 0; i < rowData.length; i++ ) {
				const td = document.createElement("td");
				let cellData = rowData[i];
				if ( !isNaN(parseFloat(cellData)) && i === rowData.length - 1 ) {
					cellData = parseFloat(cellData).toFixed(2);
				}
				td.textContent = cellData;
				row.appendChild(td);
			}
			tbody?.appendChild(row);
		}
		table.style.display = "inline-block";
	}
	private fillChartData(): void {
		this.destroyChart();
		this.chartData = {
			labels: this.tableData.slice(0).map((item: any[]) => item[0]), // Dates
			datasets: [
				{
					label: "Distance", // Label for your dataset
					data: this.tableData.slice(0).map((item: any[]) => parseFloat(item[1])), // Numeric data
					borderColor: "blue",
					borderWidth: 2,
					
				}
			]
		};
		this.generateChart();
	}
	private generateChart(): void {
		const canvas: any = document.getElementById("myChart");
		this.chart = new Chart(canvas, {
			type: 'line',
			data: this.chartData,
			options: {
				scales: {
					y: {
						beginAtZero: true,
						grid: {
							display: false
						}
					},
					x: {
						beginAtZero: false,
						grid: {
							display: false
						}
					}
				},
				interaction: {
					intersect: true,
					mode: 'index'
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function(context) {
								// this.title = ["Game"+ `${context.dataIndex + 1}`];
								// let label = context.dataset.label || '';
								// let wins = 0;
								// let losses = 0;
								// if (label) {
								// 	label += ': ';
								// }
								// if (context.parsed.y !== null) {
								// 	const dataIndex = context.dataIndex;
								// 	const winLoss: any = context.dataset.data;
								// 	for (let i=0; i<=dataIndex; i++) {
								// 		const value: any=winLoss[i];
								// 		if (value > winLoss[i-1]) {
								// 			wins+=1;
								// 		} else {
								// 			losses+=1;
								// 		}
								// 	}
								// 	label+=`${wins}-${losses}`;
								// }
								// return label;
							}
						}
					},
					legend: {
						position: 'top',
						labels: {
							font: {
								size: 14,
								weight: 'bold'
							},
							usePointStyle: true
						}
					}
				},
			}
		});
	}
	private destroyChart(): void {
		if ( this.chart ) {
		  this.chart.destroy();
		}
	}

}
