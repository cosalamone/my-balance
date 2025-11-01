import { signal, Signal, WritableSignal } from '@angular/core';
import {
  ButtonBaseInterface,
  ButtonStyle,
  PermisoResponse,
} from '../interfaces/button-interface';
import { ButtonBaseComponent } from '../components/buttons/button-base.component';
import { Type } from '@angular/core';

export class ButtonModelBase
  implements ButtonBaseInterface
{
  public style: ButtonStyle;
  public iconName?: string;
  public tooltipMessage?: string;
  public optionDisabled?: boolean;
  public action: (value?: any) => void;
  public buttonType: Type<
    ButtonBaseComponent<ButtonBaseInterface>
  >;
  public permission: Signal<PermisoResponse>;
  public label?: string;
  public iconPosition?: 'left' | 'right';
  public id?: string;
  public tooltipMessageDisabled?: string;
  public $optionDisabled?: WritableSignal<boolean>;
  public styleClass?: string;

  constructor(button: ButtonModelBase) {
    this.action = button.action;
    this.style = button.style;
    this.buttonType = button.buttonType;
    this.tooltipMessage = button.tooltipMessage ?? '';
    this.optionDisabled = button.optionDisabled ?? false;
    this.iconName = button.iconName;
    this.label = button.label ?? '';
    this.permission =
      button.permission ?? signal<PermisoResponse>({ allowed: true });
    this.iconPosition = button.iconPosition ?? 'left';
    this.id = button.id;
    this.tooltipMessageDisabled =
      button.tooltipMessageDisabled ?? '';
    this.$optionDisabled = signal<boolean>(
      button.optionDisabled ?? false
    );
    this.styleClass = button.styleClass;
  }
}
