import { Injectable, signal , inject } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { environment } from '../../../environments/environment';

import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from 'firebase/remote-config';
import { initializeApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  readonly categoriesEnabled = signal(false);
  private readonly http = inject(HTTP);

  async init(): Promise<void> {
    await new Promise<void>((resolve) => {
      if ((window as any).cordova) {
        document.addEventListener('deviceready', () => resolve(), {
          once: true,
        });
      } else {
        resolve();
      }
    });

    try {
      const app = initializeApp(environment.firebaseConfig);
      const rc = getRemoteConfig(app);
      rc.settings.minimumFetchIntervalMillis = 0;
      await fetchAndActivate(rc);
      this.categoriesEnabled.set(
        getValue(rc, 'categories_enabled').asBoolean(),
      );

    } catch (error: any) {
      this.categoriesEnabled.set(false);
    }
  }
}
