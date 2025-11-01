import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../models/button-base.model';

export class ButtonEditModel extends ButtonModelBase {
  constructor(
    button: Omit<
      ButtonEditModel,
      'buttonType' | 'iconName' | 'style'
    >
  ) {
    super(button as ButtonEditModel);
    this.buttonType = ButtonCommonComponent as any;
    this.label = button.label || 'Editar';
    this.iconName = 'edit';
    this.style = 'outlined';
  }
}
