import { Component, OnInit } from '@angular/core';
import {AdminService} from "../admin.service";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {Client} from "../../shared/shared";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  clients: Client[];
  displayedColumns = ['Name', 'Active'];
  dataSource = new MatTableDataSource<Client>();

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.getClients().subscribe(clients => {
      this.clients = clients;
      this.dataSource.data = this.clients;
    })
  }

  toClient(client: Client){
    this.router.navigate([`dashboard/client/${client.id}`])
  }
}
