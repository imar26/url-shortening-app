import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLShortenService } from '../../services/url-shorten.service.client';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('f') urlForm: NgForm;
  //properties
  shortUrl: string;
  constructor(private urlShortenService: URLShortenService) { }

  ngOnInit() {
    // Calculate dynamic height for the page
    let windowHeight = window.innerHeight;
    let totalHeight = windowHeight - 64 - 56;
    document.getElementById("home-page").setAttribute('style', 'min-height: ' + totalHeight + 'px');
  }
  //function called when the user wants to generate shortened url
  shortenUrl() {
    let url = this.urlForm.value.url;
    this.urlShortenService.shortenUrl(url)
      .subscribe((shortenUrl) => {
        this.shortUrl = "http://localhost:3000/" + shortenUrl;
      }, (err) => {
        console.log(err);
      });
    this.urlForm.reset();
  }

}
