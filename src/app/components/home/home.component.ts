import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Calculate dynamic height for the page
    let windowHeight = window.innerHeight;
    let totalHeight = windowHeight - 64 - 56;
    document.getElementById("home-page").setAttribute('style', 'min-height: ' + totalHeight + 'px');
  }

}
