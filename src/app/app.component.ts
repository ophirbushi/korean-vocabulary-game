import { Component, OnInit } from '@angular/core';

import { Data } from './data';
import { Question } from './question';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  OPTIONS_COUNT = 4;
  INVERT = false;

  question: Question;
  lastCorrect: boolean = true;
  lastQuestion: Question;
  attempts = 0;
  corrects = 0;
  percentage = 0;

  private data: Data[] = [];

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.dataService.getAll()
      .subscribe(this.onDataReceive);
  }

  next() {
    let data: Data[] = JSON.parse(JSON.stringify(this.data));
    const known = this.storageService.getKnown();
    data = data.filter(item => known.findIndex(k => k === item.id) === -1);

    this.question = { source: null, options: [] };

    for (let i = 0; i < this.OPTIONS_COUNT; i++) {
      const singleData = this.popRandom(data);
      if (i === 0) this.question.source = singleData;
      this.question.options.push(singleData);
    }

    this.question.options = this.scramble(this.question.options);
  }

  isCorrect(option: Data) {
    this.lastCorrect = this.INVERT ? option.english === this.question.source.english : option.korean === this.question.source.korean;

    this.lastQuestion = this.question;
    this.attempts++;
    if (this.lastCorrect) this.corrects++;

    this.percentage = Math.round((this.corrects / this.attempts) * 100);

    this.next();
  }

  markAsKnown(data: Data) {
    this.storageService.markAsKnown(data);
    this.next();
  }

  private onDataReceive = (response: Data[]) => {
    this.data = response.slice(0, 50);
    this.next();
  }

  private popRandom<T>(array: T[]): T {
    let index = Math.round(Math.random() * array.length) - 1;
    index = Math.min(index, array.length);
    index = Math.max(index, -1);

    return array.splice(index, 1)[0];
  }

  private scramble<T>(array: T[]): T[] {
    return array.sort(() => 0.5 - Math.random());
  }
}
