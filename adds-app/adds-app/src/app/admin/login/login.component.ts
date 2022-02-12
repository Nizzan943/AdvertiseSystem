import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.loginForm.valid){
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.auth.login(username, password).subscribe(({isAuth}) => {
        if(isAuth){
          this.auth.setAuth(true);
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/screen/3']);
        }
      })
    }
  }

}
