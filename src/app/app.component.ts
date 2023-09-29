import { AfterViewInit, Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DataUploadService } from './services/data-upload.service';
import { ChartService } from './services/chart.service';
import { Chart } from 'chart.js/auto';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'physical-activity-tracker';
	constructor(
		private dataUploadService: DataUploadService, 
		private chartService: ChartService, 
		private el: ElementRef, 
		private renderer: Renderer2,
	) {}
	
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

	ngOnInit(): void {
		this.dataUploadService.pullData().subscribe((result) => {
			this.tableData = result;
		});

		const modal = this.el.nativeElement.querySelector('.pop-up-modal');
		const inputFields = this.el.nativeElement.querySelectorAll('.form-group input');
		let date = document.querySelector('input[name="dateEntry"]') as HTMLInputElement;
		let distance = document.querySelector('input[name="distanceEntry"]') as HTMLInputElement;
		let hours = document.querySelector('input[name="hoursEntry"]') as HTMLInputElement;
		let minutes = document.querySelector('input[name="minutesEntry"]') as HTMLInputElement;
		let seconds = document.querySelector('input[name="secondsEntry"]') as HTMLInputElement;
	
		inputFields.forEach((input: any) => {
		  this.renderer.listen(input, 'keydown', (event) => {
			if ( event.key === 'Enter' && date.value && distance.value && minutes.value ) {
			  this.submitData();
			  this.closeDataEntry();
			}
		  });
		});


		
	}

	/* pop up modal functions */
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
	/* table functions */
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
			th.setAttribute("data-sort-by", columnName);
			// Set a unique ID for each column by converting column name to lowercase and replace spaces with underscores
			th.id = columnName.toLowerCase().replace(/\s/g, "_"); // 
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
		
		this.allowHighlighting();
	}
	private allowHighlighting(): void {
		const table = document.getElementById("dataTable") as HTMLTableElement;
		const tbody = table?.getElementsByTagName("tbody")[0];
		tbody?.addEventListener("mouseover", (event) => {
			const target = event.target as HTMLElement;
			if (target.tagName.toLowerCase() === "td") {
				let row = target.parentElement as HTMLTableRowElement; /* grab specific cells entire row */
				row.style.backgroundColor = "rgba(0, 0, 0, .50)" /* highlight entire row on mouse entry */
				this.chart = this.chartService.highlightPoint(0, row.rowIndex - 1); /* highlight point on graph that corresponds to data hovered */
			}
		});
		tbody?.addEventListener("mouseout", (event) => {
			const target = event.target as HTMLElement;
			if (target.tagName.toLowerCase() === "td") {
				let row = target.parentElement as HTMLTableRowElement; /* grab specific cells entire row */
				row.style.backgroundColor = "" /* remove highlight on mouse exit */
			}
		});
	}
	public sortTable(target: any): void {
		var table, rows, switching, i, x, y, shouldSwitch, sortDirection, switchcount = 0;
		/* get index of column chosen */
		let columnIndex = this.tableColumns.indexOf(target.getAttribute("data-sort-by"));
		table = document.getElementById('dataTable') as HTMLTableElement;
		switching = true;
		sortDirection = "asc";
		while (switching) {
			switching = false;
			rows = table.rows;
			// loop through rows, ignoring header row
			for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			// get rows to compare from specific column pressed
			x = rows[i].getElementsByTagName("td")[columnIndex];
			y = rows[i + 1].getElementsByTagName("td")[columnIndex];
			// check if rows should switch places
			if ( x && y ) {
				if ( sortDirection  == "asc" ) {
					if ( parseFloat(x.innerHTML) > parseFloat(y.innerHTML) ) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
					} else if ( sortDirection == "desc" ) {
						if ( parseFloat(x.innerHTML) < parseFloat(y.innerHTML) ) {
							// If so, mark as a switch and break the loop:
							shouldSwitch = true;
							break;
						}
					}
				}
			}
			if ( shouldSwitch ) {
				/* If a switch has been marked, make the switch
				and mark that a switch has been done: */
				rows[i].parentNode?.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				/* Each time a switch is done, increase this count by 1: */
				switchcount ++;
				} else {
				/* If no switching has been done AND the direction is "asc",
				set the direction to "desc" and run the while loop again. */
				if (switchcount == 0 && sortDirection == "asc") {
					sortDirection = "desc";
					switching = true;
				}
			}
		}
	}
	/* chart functions */
	private fillChartData(): void {
		this.destroyChart();
		this.chartData = {
			labels: this.tableData.slice(0).map((item: any[]) => item[0]), // Dates
			datasets: [
				{
					label: "Distance",
					data: this.tableData.slice(0).map((item: any[]) => parseFloat(item[1])),
					borderColor: "#302868",
					borderWidth: 4,
					pointRadius: 5,
					hoverBorderWidth: 10,
					hoverBorderColor: "#FF00B7"
				}
			]
		};
		this.generateChart();
	}
	private generateChart(): void {
		const canvas: any = document.getElementById("myChart");
		this.chartService.newChart(canvas, this.chartData);
	}
	private destroyChart(): void {
		if ( this.chart ) {
		  this.chart.destroy();
		}
	}

}
