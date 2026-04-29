import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

import { DataService } from '../../services/data.service';
import { isEmpty, Subject, takeUntil, interval, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  template: `  
  <canvas #areaChartFlow></canvas>
  <canvas #areaChartpH></canvas>
  `
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  dataArr: Data[] = [];
  date: any[] = [];
  dev_id: any[] = [];

  dev1: Data[] = [];
  dev2: Data[] = [];

  dev1Flow: any[] = [];
  dev2Flow: any[] = [];
  dev1pH: any[] =[];
  dev2pH: any[] = [];

  areaChartwF!: Chart;
  areaChartpH!: Chart;

  @ViewChild('areaChartFlow', { static: true }) areaChartFlowCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaChartpH', { static: true }) areaChartpHCanvas!: ElementRef<HTMLCanvasElement>;

  private unsubscribe$ = new Subject<void>();

  constructor(private service: DataService) {

  }
  ngOnInit(): void {
    this.getData();



  }


  ngAfterViewInit() {


  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getData() {
    console.log('This is get data-main component');
    interval(10000) //1000 = 1sec, 60000 = 1min
      .pipe(
        startWith(0),
        switchMap(() => this.service.getSensorData()),
        takeUntil(this.unsubscribe$)
      ).subscribe((item) => {
        this.dataArr = item;
        console.log('this is dataArr', this.dataArr);
        this.mapDataArea();
      });

  }
//maps data for area chart
  mapDataArea() {
    this.date=[];

    this.dev1Flow = [];
    this.dev2Flow = [];
    this.dev1 = this.dataArr.filter(data => data.device_id === 1);
    this.dev2 = this.dataArr.filter(data => data.device_id === 2);
    if (this.dev1 != null) {
      this.dev1.map(c => {
        this.dev1Flow.push(c.wflow);
        this.dev1pH.push(c.ph);
        this.date.push(c.date);
      });
    }
    if (this.dev2 != null) {
      this.dev2.map(c => {
        this.dev2pH.push(c.ph);
        this.dev2Flow.push(c.wflow);
      });
    }
    //If variables aren't null call chart destroy in order to reuse ID's
    if (this.areaChartwF != null || this.areaChartpH != null) {
      this.areaChartwF.destroy();
      this.areaChartpH.destroy();
    }
    // console.log('This is mapDataArea: ' dev)
    this.loadAreaChartFlow(this.date, this.dev1Flow, this.dev2Flow);
    this.loadAreaChartpH(this.date, this.dev1pH, this.dev2pH);
  }



  loadAreaChartFlow(dataX: any, s1DataY: any, s2DataY: any) {
    const areaChartRef = this.areaChartFlowCanvas.nativeElement.getContext('2d');
    if (areaChartRef) {
      this.areaChartwF = new Chart(areaChartRef, {
        type: 'line',
        data: {
          labels: dataX,
          datasets: [{
            label: 'Device 1',
            data: s1DataY,
            fill: true,
            borderColor: 'rgba(255, 99, 132, 1)',   // rgba(128, 0, 128, 1) Dark Purple || rgba(255, 99, 71, 1) dark salmon
            backgroundColor: 'rgba(255, 99, 132, 0.1)',  // rgba(216, 191, 216, 0.2) light purple || rgba(255, 160, 122, 0.2) light salmon
            borderWidth: 1
          }, {
            label: 'Device 2',
            data: s2DataY,
            fill: true,
            borderColor: 'rgba(54, 162, 235, 1)', // rgba(0, 128, 0, 1) Dark Green
            backgroundColor: 'rgba(54, 162, 235, 0.1)',//rgba(144, 238, 144, 0.2) light green
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
      });
    }
  }
  loadAreaChartpH(dataX: any, s1DataY: any, s2DataY: any) {
    const areaChartpHRef = this.areaChartpHCanvas.nativeElement.getContext('2d');
    if (areaChartpHRef) {
      this.areaChartpH = new Chart(areaChartpHRef, {
        type: 'line',
        data: {
          labels: dataX,
          datasets: [{
            label: 'Device 1',
            data: s1DataY,
            fill: true,
            borderColor: 'rgba(128, 0, 128, 1)',   // rgba(128, 0, 128, 1) Dark Purple || rgba(255, 99, 71, 1) dark salmon
            backgroundColor: 'rgba(128, 0, 128, 0.1)',  // rgba(128, 0, 128, 1) light purple || rgba(255, 160, 122, 0.2) light salmon
            borderWidth: 1
          }, {
            label: 'Device 2',
            data: s2DataY,
            fill: true,
            borderColor: 'rgba(0, 128, 0, 1)', // rgba(0, 128, 0, 1) Dark Green
            backgroundColor: 'rgba(144, 238, 144, 0.2)',//rgba(144, 238, 144, 0.2) light green
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          
        }
      });
    }
  }

}
interface Data {
  id: number,
  ph: number,
  wlevel: string,
  wflow: number,
  date: string,
  time: string,
  device_id: number
}
