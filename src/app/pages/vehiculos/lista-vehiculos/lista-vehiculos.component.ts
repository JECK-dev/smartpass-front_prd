import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
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
    categoria: '',
    modelo: '',
    color: '',
    marca: '',
    fechaCreacion: '',
    idEstado: 1,
    cliente: { idCliente: 0 }
  };

  constructor(
    private http: HttpClient,
    private categoriaService: CategoriaService,
    private vehiculoService: VehiculoService,

    //private vehiculoApiService: VehiculoApiService
  ) {}

  ngOnInit(): void {

    const idCliente = Number(localStorage.getItem('idCliente'));

    this.nuevoVehiculo.cliente.idCliente = idCliente;

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
      `¿Deseas registrar el vehículo con placa ${this.nuevoVehiculo.placa}, marca ${this.nuevoVehiculo.marca}?`
    );
    if (confirmacion) {
      this.registrarVehiculo();
    }
  }

  registrarVehiculo(): void {
    this.nuevoVehiculo.fechaCreacion = new Date().toISOString();
    console.log("Datos que se enviarán al backend:", this.nuevoVehiculo);

    this.vehiculoService.registrarVehiculo(this.nuevoVehiculo).subscribe({
      next: (res) => {
        if (res.mensaje) {
          alert(res.mensaje);
          this.recargarVehiculos();
          this.resetFormulario();
        }
      },
      error: (err) => {
        if (err.error && err.error.error) {
          alert(err.error.error); // mensaje del SP
        } else {
          alert("Error inesperado al registrar vehículo");
        }
        console.error('Error al registrar vehículo:', err);
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
      categoria: '',
      modelo: '',
      color: '',
      marca: '',
      fechaCreacion: '',
      idEstado: 1,
      cliente: { idCliente: this.nuevoVehiculo.cliente.idCliente }
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


  cargarArchivoExcel(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const data: Uint8Array = new Uint8Array(e.target.result);
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

      // primera hoja
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];

      // Excel → JSON
      const vehiculos: any[] = XLSX.utils.sheet_to_json(hoja, { raw: true });

      // 👇 obtener idCliente del localStorage
      const idCliente = Number(localStorage.getItem('idCliente'));

      // añadir idCliente a cada registro
      const vehiculosConCliente = vehiculos.map(v => ({
        ...v,
        idCliente: idCliente
      }));

      console.log("JSON final:", vehiculosConCliente);

      this.vehiculoService.cargarVehiculos(vehiculosConCliente).subscribe({
        next: (res) => {
          alert('Vehículos cargados correctamente 🚀');
          console.log(res);
        },
        error: (err) => {
          alert('Error al cargar los vehículos ❌');
          console.error(err);
        }
      });
    };

    reader.readAsArrayBuffer(file);
  }



  
}