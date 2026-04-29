/*
* To run server: In terminal: ng serve.
* To generate components using Angular CLI-
*   in terminal: ng g component components/user <- command used to generate
*   user component inside the component folder.
*/
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
showMeasurement = true;

  constructor(private http:HttpClient){
  }
  ngOnInit(){

  } 
}
