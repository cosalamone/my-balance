import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GastoFormPage } from './gasto-form.page';
import { GastosListPage } from './gastos-list.page';
import { Gasto } from './gastos.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, GastosListPage, GastoFormPage],
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage {
  showForm = false;
  editingGasto: Gasto | null = null;
  defaultGasto: Gasto = {
    amount: 0,
    category: '',
    description: '',
    date: '',
    isFixed: false,
    isRecurring: false,
  };

  onAdd() {
    this.editingGasto = null;
    this.showForm = true;
  }

  onEdit(gasto: Gasto) {
    this.editingGasto = { ...gasto };
    this.showForm = true;
  }

  onCancel() {
    this.showForm = false;
    this.editingGasto = null;
  }

  onSave(gasto: Gasto) {
    // Aquí puedes integrar la lógica para crear o actualizar
    this.showForm = false;
    this.editingGasto = null;
  }
}
