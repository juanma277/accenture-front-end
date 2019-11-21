import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  login(form: NgForm){
    if (form.invalid){ return; }
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor ...'
    });
    Swal.showLoading();

    this.usuario.email = form.value.email;
    this.usuario.password = form.value.password;

    this.authService.login(this.usuario).subscribe((resp: any) => {
      Swal.close();
      this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        title: 'Error al autenticar',
        text: 'Datos Incorrectos'
      });

    });

  }

}
