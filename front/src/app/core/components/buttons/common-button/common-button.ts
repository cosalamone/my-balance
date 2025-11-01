import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModelBase } from '../../../models/button-base.model';
import { ButtonBaseComponent } from '../button-base.component';

@Component({
  selector: 'mb-common-button',
  templateUrl: './common-button.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class ButtonCommonComponent extends ButtonBaseComponent<ButtonModelBase> {
  getTooltip(): string {
    const bm = this.buttonModel?.();
    if (!bm) return '';
    const perm = bm.permission
      ? bm.permission()
      : undefined;
    if (perm?.allowed && bm.optionDisabled)
      return bm.tooltipMessageDisabled ?? '';
    return perm?.message ?? bm.tooltipMessage ?? '';
  }

  isDisabled(): boolean {
    const bm = this.buttonModel?.();
    if (!bm) return true;
    return (
      !!bm.optionDisabled ||
      !(bm.permission
        ? (bm.permission().allowed ?? true)
        : true)
    );
  }

  handleClick(): void {
    const bm = this.buttonModel?.();
    if (!bm) return;
    if (this.isDisabled()) return;
    const tid = this.targetId ? this.targetId() : undefined;
    bm.action(tid);
  }
}
