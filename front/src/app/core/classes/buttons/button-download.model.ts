import { ButtonCommonComponent } from '../../components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../models/button-base.model';

export class ButtonDownloadFileModel extends ButtonModelBase {
  constructor(
    button: Omit<
      ButtonDownloadFileModel,
      'buttonType' | 'iconName' | 'style'
    >
  ) {
    super(button as ButtonDownloadFileModel);
    // ButtonCommonComponent is a ButtonBaseComponent specialized for ButtonModelBase.
    // Cast to any to satisfy the broader Type<> declared in ButtonModelBase.
    this.buttonType = ButtonCommonComponent as any;
    this.label = button.label || 'Descargar archivo';
    // Use Material icon name (mat-icon)
    this.iconName = 'download';
    this.style = 'filled';
  }
}
