import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

loginForm = new FormGroup({
  password: new FormControl('', Validators.required)
});

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.loginForm.invalid){
      return ;
    }
    const password = this.loginForm.get('password')?.value;

    this.adminService.changePassword(password).subscribe(res => {
      if(res.success){
        this.router.navigate(['dashboard']);
      } else {
        alert('Error')
      }
    })
  }
}
