import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

	constructor(
		public appComponent: AppComponent
	) {}
}
