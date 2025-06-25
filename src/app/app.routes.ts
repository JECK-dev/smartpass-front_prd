
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroEmpresaComponent } from './pages/registro-empresa/registro-empresa.component';
import { SeleccionRegistroComponent } from './pages/seleccion-registro/seleccion-registro.component';
import { ListaContratosComponent } from './pages/contratos/lista-contratos/lista-contratos.component';
import { CrearContratoComponent } from './pages/contratos/crear-contrato/crear-contrato.component';
import { LayoutComponent } from './layout/layout.component';
import { ListaVehiculosComponent } from './pages/vehiculos/lista-vehiculos/lista-vehiculos.component';
import { RecargaComponent } from './pages/billetera/recarga/recarga.component';
import { HisCrucespeajeComponent } from './pages/historial/his-crucespeaje/his-crucespeaje.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { TagComponent } from './pages/tag/tag.component';
import { DesafiliacionComponent } from './pages/desafiliacion/desafiliacion.component';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena.component';
import { ModuloConsultasComponent } from './pages/modulo-consultas/modulo-consultas.component';
import { ListaFacturasComponent } from './pages/facturas/lista-facturas/lista-facturas.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full' // muy importante
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'registrar', component: RegistroComponent
    },
    {
        path:'registrar-empresa', component: RegistroEmpresaComponent
    },
    {
        path:'seleccion-registro', component: SeleccionRegistroComponent
    },
    {
        path:'recuperar-contrasena', component: RecuperarContrasenaComponent
    },
    {
        path:'',
        component:LayoutComponent,
        children: [
            {path:'home', component: HomeComponent},
            {path: 'listar-contrato', component: ListaContratosComponent},
            {path: 'crear-contrato', component: CrearContratoComponent},
            {path: 'listar-vehiculos', component: ListaVehiculosComponent},
            {path: 'recarga', component: RecargaComponent},
            {path: 'his-cruces', component: HisCrucespeajeComponent},
            {path: 'perfil', component: PerfilComponent},
            {path: 'configuracion', component: ConfiguracionComponent},
            {path: 'tag', component: TagComponent},
            {path: 'desafiliacion', component: DesafiliacionComponent},
            {path: 'modulo-consultas', component: ModuloConsultasComponent},
            {path: 'facturas', component: ListaFacturasComponent},

        ]
    },
    { path: '**', redirectTo: 'login' },
];
