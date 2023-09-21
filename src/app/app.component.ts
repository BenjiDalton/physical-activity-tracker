import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'physical-activity-tracker';

	// new run button that pops ups a window when clicked
	// field entries for time, distance, temperature, humidity, elevation
	// submit button that sends info to python script that stores inputted information into SQL database

}
