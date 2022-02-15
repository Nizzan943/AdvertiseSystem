import {HttpClient} from "@angular/common/http";
import {baseServerUrl} from "../shared/shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {

   isAuthenticated$ = new BehaviorSubject(localStorage.getItem('isLoggedIn') || 'false');

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    this.http.post<{ isAuth: boolean }>(`${baseServerUrl}/login`, {
      username,
      password
    }).subscribe(({isAuth}) => {
      if(isAuth){
        this.setAuth(true);
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    })
  }

  logout(){
    this.setAuth(false);
    this.router.navigate(['/login']);
  }

  setAuth(isAuth: boolean){
    this.isAuthenticated$.next(`${isAuth}`);
    localStorage.setItem('isLoggedIn', 'true');
  }
}
