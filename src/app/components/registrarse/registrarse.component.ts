import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuarios/usuario.service';

import {DateValidators} from '../../validadores/date.validators'
import { UsuarioModel } from 'src/app/clases/usuario.model';
// import { DateValidators } from 'app/validadores/date.validators';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit {
  public form: FormGroup;
  maxDate:string;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.generarFechaMaxima();
  }

  get nombreNoValido(){
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }

  get apellidoNoValido(){
    return this.form.get('apellido').invalid && this.form.get('apellido').touched;
  }

  get correoNoValido(){
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
  get contraNoValido(){
    return this.form.get('password').invalid && this.form.get('password').touched;
  }

  get fechaNoValido(){
    return this.form.get('fechaNacimiento').invalid && this.form.get('fechaNacimiento').touched
     && this.form.get('fechaNacimiento').errors.greaterThanToday;
  }

  iniciar() {
    this.router.navigate(['/index']);
  }

  guardar(){
    if( this.form.invalid){       
      return Object.values(this.form.controls).forEach( control =>{
        if( control instanceof  FormGroup){
         Object.values(control.controls).forEach( control=> control.markAsTouched())
        }else {
         control.markAsTouched();
        }
     })
   }
    let usuario = this.valoresForm();
    console.log(usuario);
    this.usuarioService.registrarUsuario(usuario).subscribe((response) => {
      this.router.navigate(['/inicio']);
      // debe ir la lógica para redireccionar
    });
  }

  crearFormulario(){
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento:['',[Validators.required,DateValidators.greaterThanToday]]
    });
  }

  generarFechaMaxima(): void{
  const fechaMax = new Date();
    this.maxDate = `${fechaMax.getFullYear()}-${fechaMax.getMonth() + 1}-${fechaMax.getDate()}`;
  }

  valoresForm(): UsuarioModel {
    let usuario : UsuarioModel= new UsuarioModel();
    usuario.nombre = this.form.get('nombre').value;
    usuario.apellido = this.form.get('apellido').value;
    usuario.email = this.form.get('email').value;
    usuario.password = this.form.get('password').value;
    usuario.sexo = this.form.get('sexo').value;
    usuario.fechaNacimiento = this.form.get('fechaNacimiento').value;
    usuario.tipoUsuario = 'U';
    return usuario;
  }

}
