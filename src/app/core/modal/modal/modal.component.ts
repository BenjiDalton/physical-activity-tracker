import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

	constructor(
		public appComponent: AppComponent
	) {}
}
