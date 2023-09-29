import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  	constructor() { }
	
	private _axesColor = "#000000";
	private _axesWidth = 2;
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

	public newChart(canvas: HTMLCanvasElement, chartData: any): Chart {
		this.chart = new Chart(canvas, {
			type: 'line',
			data: chartData,
			options: {
				scales: {
					y: {
						...this._commonScaleOptions,
						title: {
							text: 'Distance (miles)'
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
