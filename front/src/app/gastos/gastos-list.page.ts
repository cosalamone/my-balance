import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gasto, GastosService } from './gastos.service';

@Component({
  selector: 'app-gastos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gastos-list.page.html',
  styleUrls: ['./gastos-list.page.scss'],
})
export class GastosListPage implements OnInit {
  gastos: Gasto[] = [];
  loading = true;
  error = '';

  constructor(private gastosService: GastosService) {}

  ngOnInit() {
    this.gastosService.getAll().subscribe({
      next: data => {
        this.gastos = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar los gastos';
        this.loading = false;
      },
    });
  }
}
