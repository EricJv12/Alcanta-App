import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Output() toggleMeasurement = new EventEmitter<void>();

  onToggleMeasurement(){
    console.log('Toggle measurement button clicked');
    this.toggleMeasurement.emit();

  }
}
