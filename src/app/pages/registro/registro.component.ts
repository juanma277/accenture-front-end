import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  edad: number;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  ageCalculator(fecha){
    if (fecha) {
      const convertAge = new Date(fecha);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);  
    } else {
      this.edad = 0;
    }
  }

  registrar(form: NgForm) {
    if (form.invalid){ return; }

    if(this.edad < 18){
      Swal.fire({
        title: 'Opss verifica tu fecha de nacimiento',
        text: 'No tienes 18 años ...'
      });
      return;  
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor ...'
    });
    Swal.showLoading();

    this.usuario.identification = form.value.identification;
    this.usuario.nombres = form.value.nombres;
    this.usuario.apellidos = form.value.apellidos;
    this.usuario.fechaNacimiento = form.value.fechaNacimiento;
    this.usuario.email = form.value.email;
    this.usuario.password = form.value.password;

    this.authService.register(this.usuario).subscribe((resp: any) => {
      if(!resp.error) {
        Swal.close();
        this.router.navigateByUrl('/home');
      } else {
        Swal.fire({
          title: 'Opss verifica la información',
          text: 'Parece que los datos no son correctos'
        });        
      }
    }, (err) => {
      Swal.fire({
        title: 'Error de servidor',
        text: 'Por favor intentalo nuevamente'
      });
    });
    }


}
