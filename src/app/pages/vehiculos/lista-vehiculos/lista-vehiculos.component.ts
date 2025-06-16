import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { HttpClient } from '@angular/common/http';
//import { VehiculoApiService } from '../../../services/vehiculo-api.service';

@Component({
  selector: 'app-lista-vehiculos',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './lista-vehiculos.component.html',
  styleUrls: ['./lista-vehiculos.component.css']
})
export class ListaVehiculosComponent implements OnInit {
  vehiculos: any[] = [];
  tagsDisponibles: any[] = [];
  contratos: any[] = [];
  categorias: any[] = [];
  marcas: string[] = [];
  modelos: string[] = [];
  mostrarFormulario: boolean = false;

  nuevoVehiculo = {
    idContrato: '',
    placa: '',
    numTag: '',
    categoria: '',
    modelo: '',
    color: '',
    marca: '',
    fechaCreacion: '',
    idEstado: 1,
    idCliente: Number(localStorage.getItem('idCliente'))
  };

  constructor(
    private http: HttpClient,
    private categoriaService: CategoriaService,
    private vehiculoService: VehiculoService,

    //private vehiculoApiService: VehiculoApiService
  ) {}

  ngOnInit(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));

    this.nuevoVehiculo.idCliente = idCliente;

    this.vehiculoService.getVehiculosPorCliente(idCliente).subscribe(data => {
      this.vehiculos = data;
    });

    this.vehiculoService.getTagsDisponibles().subscribe(data => {
      this.tagsDisponibles = data.filter(tag => tag.disponible === true || tag.disponible === 1);
    });

    this.vehiculoService.getContratosPorCliente(idCliente).subscribe(data => {
      this.contratos = data;
    });

    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
    /*this.vehiculoApiService.getMarcas().subscribe(data => {
      this.marcas = data;
    });*/
  }

  confirmarRegistroVehiculo(): void {
    const confirmacion = confirm(
      `¿Deseas registrar el vehículo con placa ${this.nuevoVehiculo.placa}, marca ${this.nuevoVehiculo.marca}, y TAG ${this.nuevoVehiculo.numTag}?`
    );
    if (confirmacion) {
      this.registrarVehiculo();
    }
  }

  registrarVehiculo(): void {
    this.nuevoVehiculo.fechaCreacion = new Date().toISOString();
    const tagSeleccionado = this.nuevoVehiculo.numTag;

    this.vehiculoService.registrarVehiculo(this.nuevoVehiculo).subscribe({
      next: () => {
        const fechaAsignacion = new Date().toISOString();
        this.vehiculoService.actualizarTagComoUsado(tagSeleccionado, fechaAsignacion).subscribe();
        this.recargarVehiculos();
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al registrar vehículo:', err);
        alert('Error al registrar vehículo');
      }
    });
  }

  recargarVehiculos(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));
    this.vehiculoService.getVehiculosPorCliente(idCliente).subscribe(data => {
      this.vehiculos = data;
    });
  }

  resetFormulario(): void {
    this.nuevoVehiculo = {
      idContrato: '',
      placa: '',
      numTag: '',
      categoria: '',
      modelo: '',
      color: '',
      marca: '',
      fechaCreacion: '',
      idEstado: 1,
      idCliente: Number(localStorage.getItem('idCliente'))
    };
  }

  vehiculoSeleccionado: any = null;

  abrirModalActualizar(vehiculo: any): void {
    // Clonar el objeto para evitar modificarlo directamente en la tabla
    this.vehiculoSeleccionado = { ...vehiculo };
  }

  cerrarModal(): void {
    this.vehiculoSeleccionado = null;
  }

  guardarActualizacion(): void {
    this.vehiculoService.actualizarVehiculo(this.vehiculoSeleccionado).subscribe({
      next: () => {
        // Reemplaza el vehículo actualizado en la lista
        const index = this.vehiculos.findIndex(v => v.idVehiculo === this.vehiculoSeleccionado.idVehiculo);
        if (index !== -1) {
          this.vehiculos[index] = { ...this.vehiculoSeleccionado };
        }
        this.cerrarModal();
      },
      error: err => {
        console.error('Error al actualizar el vehículo', err);
      }
    });
  }



  
}