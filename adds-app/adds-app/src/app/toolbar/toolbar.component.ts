import { Component, OnInit } from '@angular/core';
import {AuthService} from "../admin/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.auth.isAuth.subscribe(res => {
      this.isLoggedIn = res;
    })
  }

  onLogout(){
    this.auth.logout();
  }

}
