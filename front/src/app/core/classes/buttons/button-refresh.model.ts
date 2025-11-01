import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../models/button-base.model';

export class ButtonRefreshModel extends ButtonModelBase {
  constructor(
    button: Omit<
      ButtonRefreshModel,
      'buttonType' | 'iconName' | 'style'
    >
  ) {
    super(button as ButtonRefreshModel);
    this.buttonType = ButtonCommonComponent as any;
    this.label = button.label || 'Actualizar';
    this.iconName = 'refresh';
    this.style = 'outlined';
  }
}
