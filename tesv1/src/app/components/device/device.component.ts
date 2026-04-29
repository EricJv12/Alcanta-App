import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Subject, interval, startWith, switchMap, takeUntil } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent implements OnInit, OnDestroy{
  devArr: Device[] = [];
  addrArr: Address[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private service: DataService) {

  }

  ngOnInit() {
    this.getDevData();
    this.getAddrData();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

autoFillAddrId(adrId:number){
  const idInput = document.getElementById('addrId') as HTMLInputElement;
  idInput.value=adrId.toString();
}
  getDevData(): void {
    interval(30000).pipe(startWith(0), switchMap(() =>
      this.service.getDevData()),
      takeUntil(this.unsubscribe$))
      .subscribe(item => {
        this.devArr = item;
      });
  }
  getAddrData(): void {
    interval(30000).pipe(startWith(0), switchMap(() =>
      this.service.getAddr()),
      takeUntil(this.unsubscribe$))
      .subscribe(item => {
        this.addrArr = item;
      });
  }

  addAdr(addrOne: any, addrTwo: any, stateV: any, cityV: any, zipV: any) {
    const newAdr = { address: addrOne, address_two: addrTwo, state: stateV, city: cityV, zip: zipV }
    this.service.postAddr(newAdr)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        console.log('Address added: ', response);
      }, (error) => {
        console.error('Error adding Address: ', error);
      });
  }

  addDev(name: any, addId: any) {
    const newDev = { name: name, id: addId }
    this.service.postDev(newDev)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        console.log('Device added: ', response);
      }, (error) => {
        console.error('Error creating device: ', error);
      });
  }
}

interface Address {
  id: number,
  address: string,
  address_two: string,
  state: string,
  city: string,
  zip: string
}

interface Device {
  id: number,
  name: number,
  address_id: number
}