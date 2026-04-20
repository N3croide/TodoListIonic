import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { listOutline, close, pricetagOutline, menu, closeOutline, trashOutline, pencilOutline, pencilSharp } from 'ionicons/icons';
import { HomePage } from './home/home.page';

@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   imports: [IonicModule, HomePage],
})
export class AppComponent {

   constructor() {
      addIcons({
         'list-outline': listOutline,
         close: close,
         'pricetag-outline': pricetagOutline,
         menu: menu,
         'close-outline': closeOutline,
         'trash-outline': trashOutline,
         'pencil-outline': pencilOutline,
         'pencil-sharp': pencilSharp,
      });
   }
}
