import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  @Output() buttonClick = new EventEmitter<void>();
  onButtonClick() {
    this.buttonClick.emit();
    
  }
}
