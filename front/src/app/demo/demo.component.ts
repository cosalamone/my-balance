import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ThemeToggleComponent,
  ],
  templateUrl: './demo.component.html',
  styleUrls: [],
})
export class DemoComponent {}
