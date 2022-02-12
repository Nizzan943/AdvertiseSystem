import {HttpClient} from "@angular/common/http";
import {baseServerUrl} from "../shared/shared";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class AuthService {

  private isAuthenticated = new BehaviorSubject(false);
  isAuth = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ isAuth: boolean }>(`${baseServerUrl}/login`, {
      username,
      password
    });
  }

  setAuth(isAuth: boolean){
    this.isAuthenticated.next(isAuth);
  }
}
