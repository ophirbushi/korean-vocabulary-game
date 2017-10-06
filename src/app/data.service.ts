import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Data } from './data';

const toJson = (response: Response) => response.json();

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  getVerbs(): Observable<Data[]> {
    return this.http.get('./assets/500-verbs.json')
      .map(toJson);
  }

  getAdjectives(): Observable<Data[]> {
    return this.http.get('./assets/500-adjectives.json')
      .map(toJson);
  }

  getAll(): Observable<Data[]> {
    return Observable
      .forkJoin(this.getVerbs(), this.getAdjectives())
      .map(responses => responses[0].concat(responses[1]));
  }
}
