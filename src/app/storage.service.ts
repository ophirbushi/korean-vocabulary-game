import { Injectable } from '@angular/core';

import { Data } from './data';

@Injectable()
export class StorageService {
  readonly KNOWN_STORAGE_KEY = 'known';

  markAsKnown(data: Data): void {
    const known = this.getKnown();

    if (known.findIndex(k => k === data.id) === -1) {
      known.push(data.id);
      this.setKnown(known);
    }
  }

  getKnown(): string[] {
    const stringified = localStorage.getItem(this.KNOWN_STORAGE_KEY);
    return stringified != null ? JSON.parse(stringified) : [];
  }

  private setKnown(known: string[]): void {
    const stringified = JSON.stringify(known);
    localStorage.setItem(this.KNOWN_STORAGE_KEY, stringified);
  }
}
