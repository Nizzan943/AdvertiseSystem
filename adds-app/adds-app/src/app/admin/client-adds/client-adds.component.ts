import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Add, Client} from "../../shared/shared";
import {AdminService} from "../admin.service";
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DeleteAddComponent} from "./delete-add/delete-add.component";
import {EditAddComponent} from "./edit-add/edit-add.component";
import {AddComercialComponent} from "./add-comercial/add-comercial.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-client-adds',
  templateUrl: './client-adds.component.html',
  styleUrls: ['./client-adds.component.scss']
})
export class ClientAddsComponent implements OnInit {
  client: Client;
  displayedColumns = ['Image', 'Title', 'Duration', 'Actions'];
  dataSource = new MatTableDataSource<Add>();

  constructor(private adminService: AdminService, private route: ActivatedRoute, private dialog: MatDialog,
              private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.adminService.getClient(id).subscribe(client => {
      this.client = client;
      this.dataSource.data = this.client.adds;
    });
  }

  onDelete(add: Add){
    const dialogRef = this.dialog.open(DeleteAddComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.adminService.deleteAdd(this.client.id, add.id).subscribe(res => {
          if(res.success) {
            this.dataSource.data = this.dataSource.data.filter(({ id }) => id !== add.id);
          }
        })
      }
    })
  }

  onEdit(add: Add) {
    const dialogRef = this.dialog.open(EditAddComponent, { data: add });

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.adminService.editAdd(res, this.client.id).subscribe(res => {
          if(res.add){
            this.client.adds[this.client.adds.findIndex(({id}) => id === add.id)] = res.add;
            this.dataSource.data = this.client.adds;
            this.openSnackBar('Commercial edited successfully')
          }
        })
      }
    })
  }

  onAdd(){
    const dialogRef = this.dialog.open(AddComercialComponent);

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.adminService.addCommercial(res, this.client.id).subscribe(res => {
          if(res.commercial){
            this.client.adds.push(res.commercial);
            this.dataSource.data = this.client.adds;
            this.openSnackBar('Commercial added successfully')
          }
        })
      }
    })
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action);
  }
}
