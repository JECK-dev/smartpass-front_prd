import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HomeCardComponent } from '../../home-card/home-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cards: any[] = [];

  private allCards = [
    { title: 'Contrato', value: '4', icon: 'bx bx-edit', color: '#4e73df', ruta: '/listar-contrato', roles: [1, 2] },
    { title: 'Saldo', value: 'S/.1,000', icon: 'bx bx-dollar-circle', color: '#1cc88a', ruta: '/recarga', roles: [1, 2] },
    { title: 'Vehículos', value: '50', icon: 'bx bx-clipboard', color: '#36b9cc', ruta: '/listar-vehiculos', roles: [1, 2] },
    { title: 'Cruces de Peaje', value: '18', icon: 'bx bx-car', color: '#f6c23e', ruta: '/his-cruces', roles: [1, 2] },
    { title: 'TAG', value: '100', icon: 'bx bx-chip', color: '#f6c23e', ruta: '/tag', roles: [1, 3] },
    { title: 'Desafiliación', value: '100', icon: 'bx bx-chevron-down', color: '#f6c23e', ruta: '/desafiliacion', roles: [1, 3] },
    { title: 'Módulo Consultas', value: '100', icon: 'bx bx-question-mark', color: '#f6c23e', ruta: '/modulo-consultas', roles: [1] }
  ];

  ngOnInit(): void {
    const idRol = Number(localStorage.getItem('idrol') || 0);
    this.cards = this.allCards.filter(card => card.roles.includes(idRol));
  }





  /*cards = [
    { title: 'Contrato', value: '4', icon: 'bx bx-edit', color: '#4e73df', ruta:'/listar-contrato' },
    { title: 'Saldo', value: 'S/.1,000', icon: 'bx bx-dollar-circle', color: '#1cc88a', ruta:'/recarga'  },
    { title: 'Vehículos', value: '50', icon: 'bx bx-clipboard', color: '#36b9cc', ruta:'/listar-vehiculos'  },
    { title: 'Cruces de Peaje', value: '18', icon: 'bx bx-car', color: '#f6c23e', ruta:'/his-cruces'  },
    { title: 'TAG', value:'100', icon: 'bx bx-chip', color: '#f6c23e', ruta:'/tag'},
    { title: 'Desafiliación', value:'100', icon: 'bx bx-chevron-down', color: '#f6c23e', ruta:'/desafiliacion'},
    { title: 'Módulo Consultas', value:'100', icon: 'bx bx-question-mark', color: '#f6c23e', ruta:'/modulo-consultas'},
  ];
  */
}
