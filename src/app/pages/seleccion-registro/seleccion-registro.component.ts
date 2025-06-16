import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion-registro',
  imports: [],
  templateUrl: './seleccion-registro.component.html',
  styleUrl: './seleccion-registro.component.css'
})
export class SeleccionRegistroComponent {

  constructor(private router: Router) {}

  goTo(tipo: string) {
    if (tipo === 'individual') {
      this.router.navigate(['/registrar']);
    } else if (tipo === 'empresa') {
      this.router.navigate(['/registrar-empresa']);
    }
  }

}
