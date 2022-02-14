import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Commercial, baseServerUrl, Client} from "../shared/shared";

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
  //   return this.http.get<Add[]>(`${baseServerUrl}/clients/${id}/adds`);
  // }

  deleteAdd(clientId: string, addId: string) {
    return this .http.delete<{ success: boolean }>(`${baseServerUrl}/clients/${clientId}/commercials/${addId}`);
  }

  editAdd(add: Commercial, clientId: string) {
  
    return this.http.put<{ commercial: Commercial }>(`${baseServerUrl}/clients/${clientId}/commercials/${add.id}`, add );
  }

  addCommercial(add: Commercial, clientId: string) {
    return this.http.post<{ commercial: Commercial }>(`${baseServerUrl}/clients/${clientId}/commercials/${add.id}`, add
    )
  }

  login(username: string, password: string) {
    return this.http.post<{ isAuth: boolean }>(`${baseServerUrl}/login`, {
      username,
      password
    });
  }

  changePassword(password: string ){
    return this.http.put<{ success: boolean }>(`${baseServerUrl}/password`, { password });
  }
}
