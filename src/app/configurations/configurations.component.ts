import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {
  @Input() initialStatus: {[code: string]: Observable<boolean>} = {};

  constructor() { }

  ngOnInit() {
  }

}
