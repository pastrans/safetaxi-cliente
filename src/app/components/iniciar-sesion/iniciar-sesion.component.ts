import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login/login.service';
import Swal from 'sweetalert2';
import { DateValidators } from '../../validadores/date.validators'

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  public form: FormGroup;

  constructor( private router: Router,
    private loginService : LoginService,
    private fb: FormBuilder ) { }


  ngOnInit(): void {
    this.inicializarFormulario();
  }

  iniciar() {
    this.router.navigate(['/index']);
  }

  registrarse() {
    this.router.navigate(['/registrarse']);
  }


  login(){
    let formData = new FormData();
    const headers = new HttpHeaders();

    formData.append('email', this.form.get('email').value);
    formData.append('password', this.form.get('password').value);
    this.loginService.login(formData).subscribe( 
      (resp : any) =>{
        if(resp.status == "success"){
          let data : any = resp.data;
          localStorage.setItem('id', data.id);
          this.router.navigate(['/index']);
          console.log(data);
        }
        if(resp['status'] == "error"){
          Swal.fire({
            title: 'Error!',
            text:   "Inicio de sesión incorrecto.",
            icon: 'error'
          });
        }
      },
      (error) => {
        console.log(error);
      }
    )

  }

  inicializarFormulario(){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required]
    });
  }

}
