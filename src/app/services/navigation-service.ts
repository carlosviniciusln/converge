import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private history: string[] = [];

  previousUrl: string = null;
  currentUrl: string = null;

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //console.log(event.url);
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  navigate(url: string): void {
    this.router.navigateByUrl(`/${url}`);
  }

  back(): void {
    this.history.pop();

    if (this.previousUrl) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
