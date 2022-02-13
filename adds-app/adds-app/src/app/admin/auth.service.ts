import {HttpClient} from "@angular/common/http";
import {baseServerUrl} from "../shared/shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {

  private isAuthenticated = new BehaviorSubject(false);
  isAuth = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ isAuth: boolean }>(`${baseServerUrl}/login`, {
      username,
      password
    });
  }

  logout(){
    this.isAuthenticated.next(false);
    this.router.navigate(['/'])
  }

  setAuth(isAuth: boolean){
    this.isAuthenticated.next(isAuth);
  }
}
