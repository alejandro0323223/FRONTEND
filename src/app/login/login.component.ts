import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;


  constructor(public router: Router) {}

  login() {
    console.log(this.email);
    console.log(this.password);
    localStorage.setItem("Nombre","Alejandro");
    if (this.email!= null && this.password != null)
    {
    this.router.navigateByUrl('/listadoproductos');
    }
    else
    {
      Swal.fire("","Debes ingresar las credenciales para ingresar!!!","error");
    }
  }


  ngOnInit() {
  }
}
