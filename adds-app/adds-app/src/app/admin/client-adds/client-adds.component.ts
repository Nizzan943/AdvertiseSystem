import {Component, OnInit} from '@angular/core';
import {Commercial, Client} from "../../shared/shared";
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
  dataSource = new MatTableDataSource<Commercial>();

  constructor(private adminService: AdminService, private route: ActivatedRoute, private dialog: MatDialog,
              private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.adminService.getClient(id).subscribe(client => {
      console.log(client)
      this.client = client;
      this.dataSource.data = this.client.commercials;
    });
  }

  onDelete(add: Commercial){
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

  onEdit(add: Commercial) {
    const dialogRef = this.dialog.open(EditAddComponent, { data: add });

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.adminService.editAdd(res.add, this.client.id).subscribe(res => {
          if(res.commercial){
            const index = this.client.commercials.findIndex(({id}) => id === add.id);
            this.client.commercials[index] = res.commercial;
            this.dataSource.data = this.client.commercials;
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
          console.log(res)

          if(res.commercial){
            this.client.commercials.push(res.commercial);
            this.dataSource.data = this.client.commercials;
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
