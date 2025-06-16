import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() icon = '';
  @Input() color = '';
  @Input() ruta ='';

}
