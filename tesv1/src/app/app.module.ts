import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { MeasurementComponent } from './components/measurement/measurement.component';

import { DataService } from './services/data.service';

import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { DeviceComponent } from './components/device/device.component';
import { AlarmComponent } from './components/alarm/alarm.component';


@NgModule({
  declarations: [ //components go in here
    AppComponent, UserComponent, MeasurementComponent, HeaderComponent, MainComponent, SideNavComponent, DeviceComponent, AlarmComponent
  ],
  imports: [ //modules in here``
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [DataService], //services go in here
  bootstrap: [AppComponent]
})
export class AppModule { }
