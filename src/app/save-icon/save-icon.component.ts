import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-icon',
  templateUrl: './save-icon.component.html',
  styleUrls: ['./save-icon.component.css']
})
export class SaveIconComponent implements OnInit {
  currentText: string = "loading";

  constructor() { }

  ngOnInit() {
  }
  setLoading(){
    this.currentText = "saving...";
  }
  setLoaded(){
    this.currentText = "saved";
  }
}
