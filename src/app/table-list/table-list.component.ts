import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  pagar()
  {
Swal.fire({
    title: '<p>Tienes estos productos adicionales</p>',
    html:
    '<p>PROMOCIÓN ESPECIAL</p><img src="https://www.paris.cl/dw/image/v2/BCHW_PRD/on/demandware.static/-/Sites-cencosud-master-catalog/default/dw44caa9d9/images/imagenes-productos/730/630455-0450-020.jpg" alt="Smiley face" height="100" width="100"><input type="checkbox"><p>Valor: $ 283.750</p>'+ 
    '<hr/><p>Ofertas sólo para tí</p><img src="https://www.paris.cl/dw/image/v2/BCHW_PRD/on/demandware.static/-/Sites-cencosud-master-catalog/default/dw2718ac17/images/imagenes-productos/730/515899-0260-001.jpg" alt="Smiley face" height="80" width="80"><br/><a>Valor: $ 489.688</a><br/>'+
    '<img src="https://falabella.scene7.com/is/image/Falabella/7123523_1?wid=1500&hei=1500&qlt=70" alt="Smiley face" height="80" width="80"><br/><a>Valor: $ 189.688</a>',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
    '<i class="fa fa-thumbs-up"></i> Agregar a la compra',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText:
    '<i class="fa fa-thumbs-down">Cancelar</i>',
    cancelButtonAriaLabel: 'Thumbs down',
});
  }
}
