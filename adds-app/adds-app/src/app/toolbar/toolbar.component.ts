import { Component, OnInit } from '@angular/core';
import {AuthService} from "../admin/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(res => {
      this.isLoggedIn = res === 'true';
    })
  }

  onLogout(){
    this.auth.logout();
  }
}
