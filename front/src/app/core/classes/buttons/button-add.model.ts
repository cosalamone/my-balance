import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../models/button-base.model';

export class ButtonAddModel extends ButtonModelBase {
  constructor(
    button: Omit<
      ButtonAddModel,
      'buttonType' | 'iconName' | 'style'
    >
  ) {
    super(button as ButtonAddModel);
    // Use common button component as the renderer. Cast to any to satisfy ButtonModelBase generic.
    this.buttonType = ButtonCommonComponent as any;
    this.label = button.label || 'Agregar';
    this.iconName = 'add';
    this.style = 'filled';
  }
}
