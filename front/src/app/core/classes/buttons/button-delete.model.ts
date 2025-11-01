import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../models/button-base.model';

export class ButtonDeleteModel extends ButtonModelBase {
  constructor(
    button: Omit<
      ButtonDeleteModel,
      'buttonType' | 'iconName' | 'style'
    >
  ) {
    super(button as ButtonDeleteModel);
    this.buttonType = ButtonCommonComponent as any;
    this.label = button.label || 'Eliminar';
    this.iconName = 'delete';
    // Use an allowed ButtonStyle
    this.style = 'outlined';
  }
}
