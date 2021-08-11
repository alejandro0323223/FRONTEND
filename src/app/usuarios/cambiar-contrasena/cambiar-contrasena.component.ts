import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng';
import { UsuarioRequest, UsuarioService } from 'projects/tools/src/lib/_api-rest-remate-linea-admin';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss']
})
export class CambiarContrasenaComponent implements OnInit {

  pass1: string = "";
  pass2: string = "";
  mostrarErrores: boolean = false;
  listErrores: any[]=[];
  dataRow: any;
  constructor(private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private _usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.dataRow = this.config.data.rowData;
    console.log(this.dataRow)
  }


  cambiarContrasenaModal() {
    if (this.pass1 == this.pass2) {
      this.dataRow.us_password = this.pass1;
      let data: UsuarioRequest = {
        pe_email:"",
        pe_fechaingreso: [],
        pe_nombrecompleto: "",
        pe_rut: "",
        us_consuser: this.dataRow.us_consuser,
        us_esvigente: "",
        us_intentosfallidos: 0,
        us_password: this.pass1
      }
      this._usuarioService.apiUsuarioCambiarContrasenaPost(data).subscribe(
        ok => {
          if(ok.codigo=="ERROR"){
            this.listErrores.push(ok.mensaje);
            this.mostrarErrores = true;
            setTimeout(()=>{ 
              this.listErrores = [];
              this.mostrarErrores = false;
            },4000);
          }else{
            this.ref.close(ok);
          }
        },
        error => {
          console.log(error);
          
          this.listErrores.push(error.error.resultado);
            this.mostrarErrores = true;
            setTimeout(()=>{ 
              this.listErrores = [];
              this.mostrarErrores = false;
            },4000);
        });
    } else {
      this.listErrores.push("Las contraseñas no son identicas");
      this.mostrarErrores = true;
      setTimeout(()=>{ 
        this.listErrores = [];
        this.mostrarErrores = false;
      },4000);
  
     // this.messageService.add({ severity: 'warm', summary: 'Error en Cambio Password', detail: '' });
    }
  }


}
