import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

import { DataService } from '../../services/data.service';
import { isEmpty, Subject, takeUntil, interval, switchMap, startWith } from 'rxjs';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrl: './measurement.component.css',
  template: `
  <canvas #linechartpH></canvas>
  <canvas #chartFlow></canvas>
  `
})

export class MeasurementComponent implements OnInit, AfterViewInit {
  lineChart!: Chart;
  barChart!: Chart;


  dataArr: Data[] = [];
  id: any[] = [];
  pH: any[] = [];
  waterLevel: any[] = [];
  waterFlow: any[] = [];
  time: any[] = [];
  date: any[] = [];
  dev_id: any[] = [];



  // !: tells typescript that these properties won't be null when accessed. All variables must be initialized in typescript before compile.
  @ViewChild('linechartpH', { static: true }) lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartFlow', { static: true }) barChartCanvas!: ElementRef<HTMLCanvasElement>;


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

  getData(): void {
    interval(30000).pipe(startWith(0), switchMap(() =>
      this.service.getSensorData()),
      takeUntil(this.unsubscribe$))
      .subscribe(item => {
        this.dataArr = item;
        console.log("This is updating every 30secs");
        this.mapData();
      });
  }

  addAlarm(stat: string, dataId:any){
    const newAlarm = {status: stat, id:dataId}
    this.service.postAlarm(newAlarm)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((response) => {
      console.log('Post request succesful: ', response);
    }, (error) => {
      console.error('Error in executing post: ', error);
    });
  }


  //Function maps data to individual variables, then loads data for chart generation.
  mapData() {
    this.id = [];
    this.pH = [];
    this.waterLevel = [];
    this.waterFlow = [];
    this.time = [];
    this.date = [];
    this.dev_id = [];
    if (this.dataArr != null) {
      this.dataArr.map(c => {
        this.id.push(c.id);
        this.pH.push(c.ph);
        this.waterFlow.push(c.wflow);
        this.time.push(c.time);
        this.date.push(c.date);
        this.dev_id.push(c.device_id);
      });
    }
    //If variables aren't null call chart destroy in order to reuse ID's
    if (this.lineChart != null && this.barChart != null) {
      this.lineChart.destroy();
      this.barChart.destroy();
    }

    this.loadChartData('line', this.time, this.pH, 'green');
    this.loadChartData('bar', this.time, this.waterFlow, 'blue');
  }

  loadChartData(graph: string, dataX: any, dataY: any, color: string) {
    switch (graph) {

      case 'line': {
        this.loadLineChart(dataX, dataY, color);
      } break;

      case 'area': {
        // this.loadAreaChart(dataX, dataY, color);

      } break;

      case 'bar': {
        this.loadBarChart(dataX, dataY, color);
      } break;
      default:
        console.log('Invalid graph type.');

    }

  }
  // Generates Line Chart.
  loadLineChart(dataX: any, dataY: any, color: string) {
    const lineChartRef = this.lineChartCanvas.nativeElement.getContext('2d');
    if (lineChartRef) {
      this.lineChart = new Chart(lineChartRef, {
        type: 'line',
        data: {
          labels: dataX,
          datasets: [
            {
              label: 'Ph Values Over Time',
              data: dataY,
              backgroundColor: color
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    } else console.error('Failed to get rendering context');

  }

  //Generates bar chart.
  loadBarChart(dataX: any, dataY: any, color: string) {
    const barChartRef = this.barChartCanvas.nativeElement.getContext('2d');
    if (barChartRef) {
      this.barChart = new Chart(barChartRef, {
        type: 'bar',
        data: {
          labels: dataX,
          datasets: [
            {
              label: 'Water Flow over Time',
              data: dataY,
              backgroundColor: color
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    } else console.error('Failed to get rendering context');

  }

}//Class ends


interface Data {
  id: number,
  ph: number,
  wlevel: string,
  wflow: number,
  date: string,
  time: string,
  device_id: number
}
