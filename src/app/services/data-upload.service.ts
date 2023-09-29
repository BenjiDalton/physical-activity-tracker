import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class DataUploadService {

	constructor(private http: HttpClient) { 
	}
  	userAuthContent="benAdmin"
  	httpOptions = {
    	headers: new HttpHeaders({
			Authorization: "benAdmin"
    	})
	};

	public uploadData(data: any): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http.post('https://6oy0aulfj8.execute-api.us-east-2.amazonaws.com/dev/upload-data', data, this.httpOptions)
			.subscribe(
				(response: any) => {
				resolve(response);
				}
			);
		});
	}
	public pullData(): Observable<any[]> {
		return new Observable<any[]>((observer) => {
		this.http.get<any[]>('https://6oy0aulfj8.execute-api.us-east-2.amazonaws.com/dev/pull-data').subscribe(result => {
			console.log("data returned: ", result);
			observer.next(result);
			observer.complete();
		})});
	}
	
}
