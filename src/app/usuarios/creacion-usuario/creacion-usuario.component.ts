import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng';
import { UsuarioRequest } from 'projects/tools/src/lib/_api-rest-remate-linea-admin';
import { UsuarioService } from 'projects/tools/src/lib/_api-rest-remate-linea-admin';
import {RegionService} from  'projects/tools/src/lib/_api-rest-remate-linea-admin/api/region.service';
import {ComunaService} from  'projects/tools/src/lib/_api-rest-remate-linea-admin/api/comuna.service';
import { SpinnerObserver } from 'projects/tools/src/lib/spinner-loading/spinner-obeserver';
@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.scss']
})
export class CreacionUsuarioComponent implements OnInit {

  user: UsuarioRequest = {};
  tiposDocs: any[];
  pass1: string;
  pass2: string;
  tipoDoc : any;
  comunas: any []=[{label:"Seleccione Comuna",value:0}];
  regiones:any[]=[];
  disablePass: boolean = false;
  disableuser: boolean = true;
  region:number = 0;
  comuna:any = {};
  listErrores:any[]=[];
  mostrarErrores:boolean = false;
  btnLimpiar:boolean = true;
  constructor(
    private _usuarioService: UsuarioService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private spinnerObserver: SpinnerObserver,
    private _regionService: RegionService,
    private _comunaService : ComunaService
  ) { }

  ngOnInit(): void {
    this.spinnerObserver.mostrarSpinner(true);
    this.tiposDocs = [
      { label: 'RUT', value: 1 },
      { label: 'PASAPORTE', value: 2 },
    ]
    if(this.config.data.cargado == true){
      this.user = this.config.data.rowData;
      console.log('datos user',this.user);
      this.disablePass = true;
      this.disableuser = false;
      this.btnLimpiar = false;
    }
    this._regionService.apiRegionListaRegionesGet().subscribe(
      ok=>{
        var aux = ok;
        aux.push({label:"Seleccione Región",value:0});
        aux = aux.sort((a,b)=>a.value - b.value);
        this.regiones = aux;
          this.spinnerObserver.mostrarSpinner(false);
      }
    );

    if(this.user.comuna!=""){
      this._comunaService.apiComunaObtenerComunaPorIdGet(+this.user.comuna).subscribe(
        ok=>{
          this.region = ok.idRegion;
          this._comunaService.apiComunaListaComunasPorRegionGet(this.region).subscribe(
            ok2=>{
              this.comunas = ok2;
              this.comuna = ok.comuna.value;
            }
          );
        }
      );
    }
    
  }
  close(){
    this.ref.close();
  }

  guardarDatosUsuario() {
    this.listErrores = [];
    this.mostrarErrores = false;
    let comunaAux = this.comuna!=undefined ? this.comuna+"" : "0";
    if (this.user.pe_rut != null) {
      if (this.user.pe_nombres != null) {
        if (this.user.pe_appaterno != null) {
          if (this.user.pe_email != null) {
            let validado = false;
            if(this.config.data.cargado == false){
              if(this.pass1!=null && this.pass2!=null){
                validado = true;
              }else{
                this.listErrores.push('Contraseñas Requeridas' );
              }
            }else{
              if(this.user.us_consuser!=null){
                validado= true;
              }else{
                this.listErrores.push( 'Nombre de Usuario es Requerido');
              }
            }
            if(validado){
              this.user.pe_nombrecompleto = this.user.pe_nombres +" "+this.user.pe_appaterno + " "+this.user.pe_apemanterno;
              this.user.us_password = this.pass1;
              // console.log(' this.tipoDoc', this.tipoDoc)
              // let aux :number = this.tipoDoc.value;
              this.user.pe_tiporut = 1;
              this.user.comuna = comunaAux;
              this._usuarioService.apiUsuarioCrearModificarUsuarioPost(this.user).subscribe(
                ok=>{
                  if(ok.codigo=="OK"){
                    this.ref.close(ok);
                  }else{
                    console.log('error',ok)
                    this.listErrores.push(""+ok.resultado);
                    this.actMostrarErrores();
                   // this.messageService.add({ severity: 'warm', summary: 'Error en el ingreso', detail: ok.mensaje });
                  }
                },
                error=>{
                  console.log(error)
                  this.listErrores.push(error.error.resultado );
                  this.actMostrarErrores();
                }
              );
            }
          } else {
            this.listErrores.push( 'Email es Requerido' );
           // this.messageService.add({ severity: 'warm', summary: 'Error en Formulario', detail: 'Email es Requerido' });
          }
        } else {
          this.listErrores.push( 'Apellido Paterno Requerido' );
          //this.messageService.add({ severity: 'warm', summary: 'Error en Formulario', detail: 'Apellido Paterno Requerido' });
        }
      } else {
        this.listErrores.push( 'Nombre es Requerido');
        //this.messageService.add({ severity: 'warm', summary: 'Error en Formulario', detail: 'Nombre es Requerido' });
      }
    } else {
      this.listErrores.push(  'Numero Documento es Requerido');
      //this.messageService.add({ severity: 'warm', summary: 'Error en Formulario', detail: 'Numero Documento es Requerido' });
    }
    this.actMostrarErrores();
  }

  actMostrarErrores(){
    if(this.listErrores.length > 0){
      this.mostrarErrores = true;
    }
  }

  limpiarForm() {
    this.user = {

    };
    this.comunas = [{label:"Seleccione Comuna",value:0}];
    this.region = 0;
    this.comuna = 0;
    this.pass1 = "";
    this.pass2 = "";
  }


  selectRegion(){
    this.spinnerObserver.mostrarSpinner(true);
    this.region;
    this._comunaService.apiComunaListaComunasPorRegionGet(this.region).subscribe(
      ok=>{
        this.comunas = ok;
        this.spinnerObserver.mostrarSpinner(false);
      }
    );
  }

}
