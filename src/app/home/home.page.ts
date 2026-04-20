import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RemoteConfigService } from '../shared/services/remote-config.service';

@Component({
  selector: 'acc-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, RouterModule],
})
export class HomePage implements OnInit {
  year = new Date().getFullYear();
   isMenuOpen: WritableSignal<boolean> = signal(false);

  // luego esto lo conectas a Firebase (Remote Config o Firestore)
  remoteConfigService = inject(RemoteConfigService);
  categoriesEnabled: Signal<boolean> =
    this.remoteConfigService.categoriesEnabled;

  async ngOnInit(): Promise<void> {
    console.log('Inicializando HomePage...');
    await this.remoteConfigService.init();
  }

  constructor(private menu: MenuController) {}

  closeMenu() {
      // this.menu.close('main-menu');
      this.isMenuOpen.set(false);
  }
}
