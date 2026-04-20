import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment.prod';

const SECRET_KEY = environment.storageKey;

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted ? (JSON.parse(decrypted) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    const data = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
