import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInfoStore } from './store/user-info.store';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  constructor() {
    inject(UserInfoStore).restore();
  }
}
