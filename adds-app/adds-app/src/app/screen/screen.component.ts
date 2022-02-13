import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {Commercial, baseServerUrl} from "../shared/shared";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit {
  adds: Commercial[];
  activeAdd: Commercial;
  screen: string;
  isLoading = true;

  addsSub: Subscription;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.http.get<Commercial[]>(`${baseServerUrl}/screen/${id}`,).subscribe(adds => {
      this.adds = adds;
      this.isLoading = false;
      let i = 0;

      setInterval(() => {
        if(i < adds.length){
          i++;
        }
        this.activeAdd = adds[i];
      }, adds[i].duration)
    })
  }
}
