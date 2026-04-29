import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';
import { MeasurementComponent } from './components/measurement/measurement.component';
import { DeviceComponent } from './components/device/device.component';
import { AlarmComponent } from './components/alarm/alarm.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'data', component: MeasurementComponent},
  {path: 'user', component: UserComponent},
  {path: 'device', component: DeviceComponent},
  {path: 'alarm', component: AlarmComponent},
  {path: '**', component: MainComponent}
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
