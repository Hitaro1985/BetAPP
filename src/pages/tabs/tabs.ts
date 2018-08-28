import { Component } from '@angular/core';

import { MyBetPage } from '../mybet/mybet';
import { ResultPage } from '../result/result';
import { HomePage } from '../home/home';
import { MyProfilePage } from '../myprofile/myprofile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyBetPage;
  tab3Root = ResultPage;
  tab4Root = MyProfilePage;

  constructor() {

  }
}
