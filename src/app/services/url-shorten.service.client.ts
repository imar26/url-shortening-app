import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class URLShortenService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) { }
  
  shortenUrl(url) {
    let data = {
        url: url
    };
    return this._http.post(this.baseUrl + "/api/shortenUrl", data)
        .map((response: Response) => {
            return response;
        });
  }
  
}