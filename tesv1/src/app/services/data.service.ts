import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly servUrl = "http://192.168.0.2:5000";
  readonly dataUrl = "/measurement";
  readonly accUrl = "/account";
  readonly devUrl = "/device";
  readonly addUrl = "/address";
  readonly alarmUrl = "/alarm";
  hUrl: string = "";




  constructor(public http: HttpClient) {
    console.log('Data service is running..');
  }

  getDevData() {
    this.hUrl = this.servUrl + this.devUrl;
    return this.http.get<any>(this.hUrl).pipe(
      map(res => res))
  }

  getSensorData(): Observable<any> {
    this.hUrl = this.servUrl + this.dataUrl;
    return this.http.get<any>(this.hUrl).pipe(
      map(res => res) //Http Client return JSON by default.
    )
  }

  getAccData(): Observable<any> {
    this.hUrl = this.servUrl + this.accUrl;
    return this.http.get<any>(this.hUrl).pipe(
      map(res => res) //Http Client return JSON by default.
    )
  }

  getAlarm() {
    this.hUrl = this.servUrl + this.alarmUrl;
    return this.http.get<any>(this.hUrl).pipe(
      map(res => res))
  }

  getAddr() {
    this.hUrl = this.servUrl + this.addUrl;
    return this.http.get<any>(this.hUrl).pipe(
      map(res => res))
  }

  getAddById(id:any){
    this.hUrl = this.servUrl+this.addUrl+'/';
    return this.http.get<any>(this.hUrl,id );
  }
  
  postDev(data:any): Observable<any>{
    this.hUrl = this.servUrl + this.devUrl + '/add';
    return this.http.post<any>(this.hUrl, data)
  }

  postAddr(data:any): Observable<any>{
    this.hUrl = this.servUrl + this.addUrl + '/add';
    return this.http.post<any>(this.hUrl, data)
  }

  postAcc(data: any): Observable<any> {
    this.hUrl = this.servUrl + this.accUrl + '/add';
    return this.http.post<any>(this.hUrl, data)

  }

  postAlarm(data: any): Observable<any> {
    this.hUrl = this.servUrl + this.alarmUrl + '/add';
    return this.http.post<any>(this.hUrl, data)
  }


  updAlarm(id:any, stat:any){
    this.hUrl = this.servUrl + this.alarmUrl + '/'+id;
    return this.http.put<any>(this.hUrl, stat);
  }

  deleteUser(id:any){
    this.hUrl = this.servUrl+this.accUrl+'/'+id;
    return this.http.delete<any>(this.hUrl)
  }

}//Ends DataService class
