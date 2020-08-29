import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePath } from './common/routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'waynepovey-portfolio';

  constructor(private router: Router) {
    this.initialiseApp();
  }

  public initialiseApp() {
    this.router.navigateByUrl(RoutePath.HOME);
  }
}
