import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  OnDestroy,
} from '@angular/core';
import { ButtonBaseInterface } from '../../interfaces/button-interface';

@Component({
  selector: 'mb-button',
  templateUrl: './button-base.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class ButtonBaseComponent<
  T extends ButtonBaseInterface,
> implements OnDestroy
{
  //#region Injection
  private readonly _changeDetector: ChangeDetectorRef =
    inject(ChangeDetectorRef);
  public readonly tableName = input<string>();
  //#endregion

  public readonly targetId: InputSignal<any | undefined> =
    input<any | undefined>();
  public readonly buttonModel: InputSignal<T | undefined> =
    input<T | undefined>();
  private _stopOptionEffect: any = effect(() => {
    const bm = this.buttonModel?.();
    const optSig = bm?.$optionDisabled;
    const val = optSig ? optSig() : undefined;
    if (val !== undefined && bm) {
      bm.optionDisabled = val;
      this._changeDetector.detectChanges();
    }
  });
  public dataCy = computed(() => this.generateDataCY());

  public ngOnDestroy(): void {
    if (this._stopOptionEffect) {
      // EffectRef has .destroy() in Angular signals API
      if (
        typeof this._stopOptionEffect.destroy === 'function'
      ) {
        this._stopOptionEffect.destroy();
      }
      this._stopOptionEffect = null;
    }
  }

  public generateDataCY(): string | undefined {
    const bm = this.buttonModel?.();
    if (!bm?.id) return;

    let dataCy: string = '';
    if (this.targetId?.()?.id) {
      dataCy =
        (this.tableName() ?? '') +
        '__' +
        bm.id +
        '-' +
        this.targetId()?.id +
        '--action';
    } else {
      dataCy = bm.id + '--action';
    }

    return dataCy;
  }
}
