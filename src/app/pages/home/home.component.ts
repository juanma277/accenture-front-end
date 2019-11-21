import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: UsuarioModel;
  aniosLaborados: number;
  estadoCredito = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();    
  }

  salir(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  calcular(form: NgForm){
    if (form.invalid){ return; }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor ...'
    });
    Swal.showLoading();

    this.usuario.fechaIngreso = form.value.fecha;
    this.usuario.salario = form.value.salario;

    if (this.usuario.fechaIngreso) {
      const convertAge = new Date(this.usuario.fechaIngreso);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.aniosLaborados = Math.floor((timeDiff / (1000 * 3600 * 24))/365);  
    } else {
      this.aniosLaborados = 0;
    }

    if(this.aniosLaborados < 2 || this.usuario.salario < 759900) {
      Swal.fire({
        title: 'Opss verifica la información',
        text: 'Parece que los datos ingresados no aplica para realizar un prestamo'
      });
      return;
    }

    if (this.usuario.salario > 800000 && this.usuario.salario <= 1000000){
      this.showAlert('Credito Aprobado', 'La cantidad aprobada es por $5.000.000', 'warning');
    }

    if (this.usuario.salario > 1000000 && this.usuario.salario <= 3999999){
      this.showAlert('Credito Aprobado', 'La cantidad aprobada es por $20.000.000', 'warning');
    }

    if (this.usuario.salario >= 4000000){
      this.showAlert('Credito Aprobado', 'La cantidad aprobada es por $50.000.000', 'warning');
    }


  }

  showAlert(title: string, text: string, icon: string ){
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si quiero el credito!',
      cancelButtonText: 'No, gracias!'
    }).then((result) => {
      if (result.value) {
        this.estadoCredito = false;
        Swal.fire(
          'Confirmado!',
          'Crédito Registrado',
          'success'
        )
      }
    })
  }

}
