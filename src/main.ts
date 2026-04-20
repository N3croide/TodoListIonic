import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { DbProvider } from './app/db.providers';

bootstrapApplication(AppComponent, {
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideIonicAngular(), provideRouter(routes, withPreloading(PreloadAllModules)), FirebaseX, HTTP, DbProvider()],
});
