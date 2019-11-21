import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { URL_SERVICIOS } from '../config/config';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken: string;

  constructor(private http: HttpClient, private router: Router) {
    this.readToken();
   }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    let url = URL_SERVICIOS + 'auth/login';
    return this.http.post(url,{email: usuario.email, password: usuario.password })
    .pipe(map(resp => {
        this.saveToken(resp['access_token']);
        return resp;
      })
    );
  }

  register(usuario: UsuarioModel) {
    let url = URL_SERVICIOS + 'auth/register';
    return this.http.post(url,{nombres: usuario.nombres, apellidos: usuario.apellidos, fechaNacimiento: usuario.fechaNacimiento, identification: usuario.identification, email: usuario.email, password: usuario.password })
        .pipe(map(resp => {
          this.saveToken(resp['access_token']);
          return resp;
        })
      );
  }

  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  readToken() {
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  verificaAuth(): boolean {
    return this.userToken.length > 2;
  }
}
