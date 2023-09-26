import { AfterViewInit, Component } from '@angular/core';
import { DataUploadService } from './services/data-upload.service';
import { Data } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	title = 'physical-activity-tracker';

	// new run button that pops ups a window when clicked
	// field entries for time, distance, temperature, humidity, elevation
	// submit button that sends info to python script that stores inputted information into SQL database
	// log in button w/ optional new user display
	constructor(private dataUploadService: DataUploadService) {}
	
	ngAfterViewInit(): void {
		

		// this.gameStateSubscription = this.gameState.gameStateMessage.subscribe(result => {
		// 	let message = result[0];
		// 	let notificationColor = result[1]
		// 	this.updatePlayerNotification(message, notificationColor);
		// });
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

		this.dataUploadService.uploadData([distanceInt, hoursInt, minutesInt, secondsInt, calculatedPace]);
		
	}

	
}
