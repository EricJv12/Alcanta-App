
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil, interval,switchMap, startWith, take } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})


export class UserComponent implements OnInit, OnDestroy{
  @ViewChild('adName') adName: any;
  @ViewChild('adLname') adLname: any;
  @ViewChild('adEmail') adEmail: any;
  @ViewChild('adPass') adPass: any;

  users: User[] = [];
  names: any[] = [];
  lname: any[] = [];
  email: any[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(private service: DataService) {

  }

  ngOnInit(): void {
    //Debugging:
    console.log('ngOnInit called');
    this.getData();
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

delUser(id:any){
this.service.deleteUser(id).pipe(takeUntil(this.unsubscribe$))
  .subscribe((response)=>{
    console.log('Delete was succesful: ', response);
  }, (error) => {
    console.error('Error in executing post: ', error);
  });
}

  addUser(name: string, lname: string, email: string, password: string): void {
    const newUser = { name:name, lname:lname, email:email, password:password };
    this.service.postAcc(newUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        console.log('Post request succesful: ', response);
      }, (error) => {
        console.error('Error in executing post: ', error);
      });
    //this.users.push(newUser) .unshift() it pushes value to begining of arr instead of the end like push does.
  }

  // Clears form template by blanking out the reference variables.

  getData() {
    interval(10000)
   .pipe(
    startWith(0),
    switchMap(() => this.service.getAccData()),
    takeUntil(this.unsubscribe$) 
   ).subscribe((item) => {
        this.users = item;
      }, (error) => {
        console.log('Error getting user data: ', error);
      }
      );
  }
}


interface User {
  id:number;
  name: string,
  lname: string,
  email: string,
  password: string
}
