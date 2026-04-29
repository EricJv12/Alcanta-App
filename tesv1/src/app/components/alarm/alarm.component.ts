import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { DataService } from '../../services/data.service';
import { isEmpty, Subject, takeUntil, interval, switchMap, startWith } from 'rxjs';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent implements OnInit, OnDestroy {

  @ViewChild('alarmID') formAlrmId: any;
  @ViewChild('alarmStat') formStat: any;

  dataArr: Alarm[] = [];
  status: string[] = [];
  stat: string[] = []

  private unsubscribe$ = new Subject<void>();

  constructor(private service: DataService) {

  }

  ngOnInit(): void {
    this.getData();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  autoFillAlarmId(id: number) {
    const idInput = document.getElementById('ID-form') as HTMLInputElement;
    idInput.value = id.toString();
  }
  getData() {
    interval(10000) //1000 = 1sec, 60000 = 1min
      .pipe(
        startWith(0),
        switchMap(() => this.service.getAlarm()),
        takeUntil(this.unsubscribe$)
      ).subscribe((item) => {
        this.dataArr = item;
      }
      )
  }
  //get id for update and status string must be resolved, unresolved, in progress
  upAlarm(id: any, stat: any): void {

    if (stat == 'resolved' || stat == 'in progress' || stat == 'unresolved') {
      const upAlarm = { status: stat };
      console.log("Alarm update contents", upAlarm);
      this.service.updAlarm(id, upAlarm).pipe(takeUntil(this.unsubscribe$))
        .subscribe((response) => {
          console.log('Update request succesful: ', response);
        }, (error) => {
          console.error('Error in executing update: ', error);
        });
    } else {
      console.log('Error with values submited');
    }
  }

}

interface Alarm {
  id: number,
  date: string,
  time: string,
  status: string,
  measurement_id: number
}