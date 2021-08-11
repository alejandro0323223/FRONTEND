import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ConfirmationService, ContextMenu, DialogService, MessageService, Paginator } from 'primeng';
import { UsuarioRequest, UsuarioService, UsuarioRequestPaginacion } from 'projects/tools/src/lib/_api-rest-remate-linea-admin';
import { RespuestaDTO } from 'projects/tools/src/lib/_api-rest-remate-linea-admin/model/respuestaDTO';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';
import { CreacionUsuarioComponent } from './creacion-usuario/creacion-usuario.component';
import {SpinnerObserver} from 'projects/tools/src/lib/spinner-loading/spinner-obeserver';
import {BooleanoToStringPipe} from 'projects/tools/src/lib/pipes/booleano-to-string.pipe';
import {FormatrutPipe} from 'projects/tools/src/lib/pipes/formatrut.pipe';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [UsuarioService, ConfirmationService,DatePipe,BooleanoToStringPipe,FormatrutPipe ]
})
export class UsuariosComponent implements OnInit {

  @ViewChild('pag', { static: false }) paginador: Paginator;
  



  busqueda: any = {};
  totalResultados: number = 0;
  primerResultado: number = 1;
  maximoResultado: number = 10;
  paginaLista: number = 0;
  cols: any[] = [];
  lista: any[] = [];
  paginacionDedeInit: boolean = false;
  acciones = [
    { label: 'Modificar', command: (event) => this.modificarUsuario() },
    { label: 'Cambiar Contraseña', command: (event) => this.cambiarContrasena() },
    { label: 'Des/Activar', command: (event) => this.desactivarUsuario() },
    { label: 'Des/Bloqueo', command: (event) => this.desBloqueoUsuario() },
  ];
  rowData: any;
  
  constructor(
    private _usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private spinnerObserver: SpinnerObserver,
    private datePipe: DatePipe,
    private booleanoToStringPipe: BooleanoToStringPipe,
    private formatrutPipe : FormatrutPipe
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'pe_rut', header: 'Rut', tipo: 'txt', type: this.formatrutPipe},
      { field: 'pe_nombrecompleto', header: 'Nombre Completo', tipo: 'txt' },
      { field: 'us_consuser', header: 'Nombre Usuario', tipo: 'txt' },
      { field: 'pe_email', header: 'Email', tipo: 'txt' },
      { field: 'pe_fechaingreso', header: 'Fecha Creacion', tipo: 'date',type: this.datePipe, arg1: 'dd/MM/yyyy HH:mm', arg2: 'GMT'  },
      { field: 'us_intentosfallidos', header: 'Intentos Fallidos', tipo: 'txt' },
      { field: 'us_esvigente', header: 'Vigente', tipo: 'bool',type:  this.booleanoToStringPipe },
      { field: 'us_bloqueado', header: 'Bloqueado', tipo: 'bool',type:  this.booleanoToStringPipe  }
    ];
    this.buscarResultados();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      if (this.paginaLista > 0) {
        //this.paginador.onPageLinkClick
        this.paginacionDedeInit = true;
        this.paginador.changePage(this.paginaLista);
      }
    });

  }

  limpiarBusqueda() {
    this.busqueda = {};
  }
  buscarResultados() {
    this.spinnerObserver.mostrarSpinner(true);
    let vigente = "NO";
    if (this.busqueda.us_esvigente != undefined) {
      if (this.busqueda.us_esvigente != null) {
        vigente = this.busqueda.us_esvigente + "";
      }
    }
    let bloqueado = "NO";
    if (this.busqueda.us_bloqueado != undefined) {
      if (this.busqueda.us_bloqueado != null) {
        bloqueado = this.busqueda.us_bloqueado + "";
      }
    }
    let email = this.busqueda.pe_email != null ? this.busqueda.pe_email : "";
    let nombre = this.busqueda.pe_nombrecompleto != null ? this.busqueda.pe_nombrecompleto : "";
    let fechas = this.busqueda.pe_fechaingreso != null ? this.busqueda.pe_fechaingreso : [];
    let user = this.busqueda.us_consuser != null ? this.busqueda.us_consuser : "";
    let intentos: number = this.busqueda.us_intentosfallidos != null ? this.busqueda.us_intentosfallidos : 0;
    let rut = this.busqueda.pe_rut != null ? this.busqueda.pe_rut : "";
    let usuarioReq: UsuarioRequest = {
      pe_email: email,
      pe_fechaingreso: fechas,
      pe_nombrecompleto: nombre,
      pe_rut: rut,
      us_consuser: user,
      us_esvigente: vigente,
      us_intentosfallidos: intentos,
      us_password: "",
      us_bloqueado: bloqueado
    }
    console.log('dato',usuarioReq)
    let usuarioRequestPaginacion: UsuarioRequestPaginacion = {
      order: 'ASC',
      field: 1,
      pagina: this.paginaLista,
      cantidad: this.maximoResultado,
      consulta: usuarioReq,
      codigo: "",
      numero: 0,
      mensaje: "",
      total: 0
    }
    this._usuarioService.apiUsuarioUsuarioSistemaPost(usuarioRequestPaginacion).subscribe(
      ok => {
        this.spinnerObserver.mostrarSpinner(false);
        this.maximoResultado = ok.cantidad;
        this.paginaLista = ok.pagina;
        this.totalResultados = ok.total;
        this.primerResultado = 1
        this.lista = ok.resultado;
      },
      erro => {
        console.log("ERROR ", erro)
      }
    );
  }


  paginate(event) {

    this.primerResultado = event.first;
    this.maximoResultado = event.rows;
    this.paginaLista = event.page + 1;
    this.buscarResultados();

  }

  seleccionarRow(rowData) {
    this.rowData = rowData;
  }


  agregarUsuario() {
    const ref = this.dialogService.open(CreacionUsuarioComponent, {
      data: {
        cargado: false
      },
      baseZIndex: 10000,
      dismissableMask: true,
      header: 'Crear Usuario ',
      width: '60%',
      contentStyle: { "height":"500px","max-height": "800px", "overflow": "auto" }
    });

    ref.onClose.subscribe((resp: RespuestaDTO) => {
      if (resp.codigo == "OK") {
        this.messageService.add({ severity: 'info', summary: 'Usuario Creado', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
        this.buscarResultados();
      }
    });
  }

  modificarUsuario() {
    this._usuarioService.apiUsuarioObtenerUsuarioConUserGet(this.rowData.us_consuser).subscribe(
      ok => {
        if (ok.codigo == "OK") {
          const ref = this.dialogService.open(CreacionUsuarioComponent, {
            data: {
              cargado: true,
              rowData: ok.resultado
            },
            baseZIndex: 10000,
            dismissableMask: true,
            header: 'Modificar Usuario ' + this.rowData.pe_nombrecompleto,
            width: '60%',
            contentStyle: { "height":"500px","max-height": "800px", "overflow": "auto" }
          });

          ref.onClose.subscribe((resp: RespuestaDTO) => {
            if(resp!=undefined){
              if (resp.codigo == "OK") {
                this.messageService.add({ severity: 'info', summary: 'Usuario Editada', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
                this.buscarResultados();
              }
            }
            
          });
        }
      }
    );

  }
  cambiarContrasena() {
    const ref = this.dialogService.open(CambiarContrasenaComponent, {
      data: {
        rowData: this.rowData
      },
      dismissableMask: false,
      header: 'Cambio de Contraseña Usuario ' + this.rowData.pe_nombrecompleto,
      width: '500px',
      contentStyle: { "max-height": "350px", "overflow": "auto" }
    });

    ref.onClose.subscribe((resp: RespuestaDTO) => {
      if (resp.codigo == "OK") {
        this.messageService.add({ severity: 'info', summary: 'Contraseña Editada', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
        this.buscarResultados();
      }
    });
  }

  guardarContrasena() {
    console.log('guardar pass');
  }

  desactivarUsuario() {
    let mensaje = "";
    if (this.rowData.us_esvigente=='true') {
      mensaje = "Desea desactivar el usuario " + this.rowData.pe_nombrecompleto;
    } else {
      mensaje = "Desea activar el usuario " + this.rowData.pe_nombrecompleto;
    }
    this.confirmationService.confirm({
      message: mensaje,
      accept: () => {
        let data: UsuarioRequest = {
          pe_email: "",
          pe_fechaingreso: [],
          pe_nombrecompleto: "",
          pe_rut: "",
          us_consuser: this.rowData.us_consuser,
          us_esvigente: "" + !this.rowData.us_esvigente,
          us_intentosfallidos: 0,
          us_password: " ",
        }
        this._usuarioService.apiUsuarioDesactivarPost(data).subscribe(
          ok => {
            if (ok.codigo == "OK") {
              if (data.us_esvigente == 'true') {
                this.messageService.add({ severity: 'info', summary: 'Activación Usuario', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
              } else {
                this.messageService.add({ severity: 'info', summary: 'Desactivación Usuario', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
              }
            }
            this.buscarResultados();
          }
        );
      }
    });
  }

  desBloqueoUsuario() {
    let mensaje = "";
    let bloqueado = "false";
    if (""+this.rowData.us_bloqueado=='true') {
      mensaje = "Desea desbloquear el usuario " + this.rowData.pe_nombrecompleto;
      bloqueado = 'false';
    } else {
      mensaje = "Desea bloquear el usuario " + this.rowData.pe_nombrecompleto;
      bloqueado = 'true';
    }
    this.confirmationService.confirm({
      message: mensaje,
      accept: () => {
        let data: UsuarioRequest = {
          pe_email: "",
          pe_fechaingreso: [],
          pe_nombrecompleto: "",
          pe_rut: "",
          us_consuser: this.rowData.us_consuser,
          us_esvigente: "" + !this.rowData.us_esvigente,
          us_intentosfallidos: 0,
          us_password: " ",
          us_bloqueado: bloqueado
        }
        this._usuarioService.apiUsuarioDesBloqueoPost(data).subscribe(
          ok => {
            if (ok.codigo == "OK") {
              if (data.us_bloqueado == 'true') {
                this.messageService.add({ severity: 'info', summary: 'Bloqueo Usuario', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
              } else {
                this.messageService.add({ severity: 'info', summary: 'Desbloqueo Usuario', detail: 'Usuario ' + this.rowData.pe_nombrecompleto });
              }
            }
            this.buscarResultados();
          }
        );
      }
    });
  }



}
