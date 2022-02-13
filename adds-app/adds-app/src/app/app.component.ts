import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'adds-app';

  // constructor(private webSocketService: WebSocketService) {
  // }

  // ngOnInit(): void {
  //   // this.webSocketService.listen('test event').subscribe(data => {
  //   //   console.log(data);
  //   // })
  // }
}
