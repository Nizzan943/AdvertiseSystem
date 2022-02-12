import {NgModule} from "@angular/core";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSnackBarModule} from "@angular/material/snack-bar";




const modules = [
  MatTableModule,
  MatFormFieldModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatToolbarModule,
  MatSnackBarModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}
