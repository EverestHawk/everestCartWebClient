import { Component, OnInit, OnDestroy } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/AuthenticationService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit, OnDestroy {
  public currencies = ['CAD', 'USD'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/ca.svg' },
    // { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    // { name:'Russian', image: 'assets/images/flags/ru.svg' },
    // { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag:any;
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(public appService:AppService,
    private authService: AuthenticationService,
    private router: Router) { 
      this.currentUserSubscription = this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
      });
    }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];    
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  public changeCurrency(currency){
    this.currency = currency;
  }

  public changeLang(flag){
    this.flag = flag;
  }

  public signOut() {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }

}
