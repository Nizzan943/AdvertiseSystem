import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Add, baseServerUrl, Client} from "../shared/shared";

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getClients(){
    return this.http.get<Client[]>(`${baseServerUrl}/clients`);
  }

  getClient(id: string){
    return this.http.get<Client>(`${baseServerUrl}/clients/${id}`);
  }

  // getAdds(id: string){
  //   return this.http.get<Add[]>(`${baseServerUrl}/clients/${id}/commercials`);
  // }

  deleteAdd(clientId: string, addId: string) {
    return this .http.delete<{ success: boolean }>(`${baseServerUrl}/clients/${clientId}/commercials/${addId}`);
  }

  editAdd(add: Add, clientId: string) {
    return this.http.put<{ add: Add }>(`${baseServerUrl}/clients/${clientId}/commercials/${add.id}`, { add },
      {
        headers: new HttpHeaders({
          'Content-type': 'application/json'
        })
      });
  }

  addCommercial(commercial: Add, clientId: string){
    return this.http.post<{ commercial: Add }>(`${baseServerUrl}/clients/${clientId}/commercials/${commercial.id}`,
      { commercial }
    )
  }

  login(username: string, password: string) {
    return this.http.post<{ isAuth: boolean }>(`${baseServerUrl}/login`, {
      username,
      password
    });
  }

  changePassword(password: string){
    return this.http.patch<{ success: boolean }>(`${baseServerUrl}/password`, { password });
  }


}
