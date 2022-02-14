import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Commercial} from "../../../shared/shared";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.scss']
})
export class EditAddComponent implements OnInit {
  loginForm: FormGroup;
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: Commercial,
              private dialogRef: MatDialogRef<EditAddComponent>) { }

  ngOnInit(): void {
    const { title, image, duration, timeRange } = this.passedData;
    const { days, startHour, endHour } = timeRange;
    this.loginForm = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      image: new FormControl(image, [Validators.required]),
      duration: new FormControl(duration, [Validators.required]),
      days: new FormControl(days, [Validators.required]),
      startHour: new FormControl(startHour, [Validators.required]),
      endHour: new FormControl(endHour, [Validators.required]),
    })
  }

  onApply() {
    const { title, image, duration, timeRange } = this.passedData;
    const { days, startHour, endHour } = timeRange;
    const editedAdd: Commercial = {
      duration: this.loginForm.get('duration')?.value || duration,
      id: this.passedData.id,
      image: this.loginForm.get('image')?.value || image,
      timeRange: {
        days: this.loginForm.get('days')?.value || days,
        startHour: this.loginForm.get('startHour')?.value || startHour,
        endHour: this.loginForm.get('endHour')?.value || endHour,
      },
      title: this.loginForm.get('title')?.value || title,
    }

    this.dialogRef.close({ add: editedAdd })
  }
}
