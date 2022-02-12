import {Component, OnInit} from '@angular/core';
// import {WebSocketService} from "./web-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'adds-app';

  // constructor(private webSocketService: WebSocketService) {
  // }

  // ngOnInit(): void {
  //   // this.webSocketService.listen('test event').subscribe(data => {
  //   //   console.log(data);
  //   // })
  // }
}
