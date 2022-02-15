import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { MatDialogRef} from "@angular/material/dialog";
import {Commercial} from "../../../shared/shared";


@Component({
  selector: 'app-add-comercial',
  templateUrl: './add-comercial.component.html',
  styleUrls: ['./add-comercial.component.scss']
})
export class AddComercialComponent implements OnInit {
  loginForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    days: new FormControl('', [Validators.required]),
    startHour: new FormControl('', [Validators.required]),
    endHour: new FormControl('', [Validators.required]),
  })

  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private dialogRef: MatDialogRef<AddComercialComponent>) { }

  ngOnInit(): void {
  }

  onAdd() {
    if(this.loginForm.invalid){
      return ;
    }

    const editedAdd: Omit<Commercial, 'id'> = {
      duration: this.loginForm.get('duration')?.value,
      image: this.loginForm.get('image')?.value,
      timeRange: {
        days: this.loginForm.get('days')?.value,
        startHour: this.loginForm.get('startHour')?.value,
        endHour: this.loginForm.get('endHour')?.value,
      },
      title: this.loginForm.get('title')?.value,
    }

    this.dialogRef.close({ add: editedAdd })
  }
}
