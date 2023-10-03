import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  	constructor() { }
	
	private _axesColor = "#000000";
	private _axesWidth = 2;
	private _primaryYAxisColor = "#554AA4"
	private _secondaryYAxisColor = "#D45807"
	private _commonScaleOptions = {
		title: {
			display: true,
			font: {
				size: 14,
				weight: 'bold'
			},
			color: this._axesColor
		},
		beginAtZero: false,
		grid: {
			drawOnChartArea: false,
			drawTicks: true,
			lineWidth: this._axesWidth,
			color: this._axesColor
		},
		border: {
			width: this._axesWidth,
			color: this._axesColor
		},
		ticks: {
			display: true
		}
	};
	private chart: any;
	private chartData: any = {
		"labels": {},
		"datasets": []
	};


	public fillData(tableData: Array<any>, xIndex: number, primaryYIndex: number, secondaryYIndex: number): any {
		return {
			labels: tableData.slice(0).map((item: any[]) => item[xIndex]), // Dates
			datasets: [
				{
					label: "Distance",
					data: tableData.slice(0).map((item: any[]) => parseFloat(item[primaryYIndex])),
					borderColor: this._primaryYAxisColor,
					borderWidth: 4,
					pointRadius: 5,
					hoverBorderWidth: 10,
					hoverBorderColor: "#554AA4",
					yAxisID: "y"
				},
				{
					label: "Run Score",
					data: tableData.slice(0).map((item: any[]) => parseFloat(item[secondaryYIndex])),
					borderColor: this._secondaryYAxisColor,
					borderWidth: 4,
					pointRadius: 5,
					hoverBorderWidth: 10,
					hoverBorderColor: "#FF00B7",
					yAxisID: "y1"
				}
			]
		}
	}
	public newChart(canvas: HTMLCanvasElement, chartData: any): Chart {
		console.log("chart data in chart service: ", chartData)
		this.chart = new Chart(canvas, {
			type: 'line',
			data: chartData,
			options: {
				scales: {
					y: {
						title: {
							text: 'Distance (miles)',
							display: true,
							font: {
								size: 14,
								weight: 'bold'
							},
							color: this._primaryYAxisColor
						},
						grid: {
							drawOnChartArea: false,
							drawTicks: true,
							lineWidth: this._axesWidth,
							color: this._primaryYAxisColor
						},
						border: {
							width: this._axesWidth,
							color: this._primaryYAxisColor
						},
						beginAtZero: true
					},
					y1: {
						position: "right",
						title: {
							text: 'Run Score (Distance + Pace)',
							display: true,
							font: {
								size: 14,
								weight: 'bold'
							},
							color: this._secondaryYAxisColor
						},
						grid: {
							drawOnChartArea: false,
							drawTicks: true,
							lineWidth: this._axesWidth,
							color: this._secondaryYAxisColor
						},
						border: {
							width: this._axesWidth,
							color: this._secondaryYAxisColor
						},
						beginAtZero: true
					},
					x: {
						...this._commonScaleOptions,
						title: {
							text: 'Date'
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
								this.title = ["Running Stats"];
								let label = context.dataset.label || '';

								return label;
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
		return this.chart
	}
	
	public highlightPoint(datasetIndex: number, rowIndex: number): void {
		this.chart.setActiveElements([{ datasetIndex, index: rowIndex }]);
		this.chart.update();
	}
	public set axesColor(axesColor: string) {
		this._axesColor = axesColor;
	}
	public set axesWidth(axesWidth: number) {
		this._axesWidth = axesWidth;
	}
}
