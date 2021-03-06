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

  ready = false;
  userCollection: Data[] = [];

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

  onPreGameItemClick(index: number) {
    this.userCollection.push(this.data[index]);
    this.data.splice(index, 1);
  }

  onDoneClick() {
    this.data = this.userCollection;
    this.ready = true;
    this.next();
  }

  private onDataReceive = (response: Data[]) => {
    this.data = response;
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
