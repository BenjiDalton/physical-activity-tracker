import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  	providedIn: 'root'
})
export class DataUploadService {

	constructor(private http: HttpClient) { 
	}
  	userAuthContent="benAdmin"
  	httpOptions = {
    	headers: new HttpHeaders({
        	// 'Content-Type': 'multipart/form-data', // comment this out
			Authorization: "benAdmin"
    	})
	};

	public uploadData(data: any): Promise<any> {
		console.log("data to upload: ", data)
		return new Promise((resolve, reject) => {
			this.http.post('https://6oy0aulfj8.execute-api.us-east-2.amazonaws.com/dev/upload-data', data, this.httpOptions)
			.subscribe(
				(response: any) => {
				resolve(response);
				}
			);
		});
	}
}
