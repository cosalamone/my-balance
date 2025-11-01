import { IconType } from '../utils/icon-type.enum';

export class IconModel {
  public name: string;
  public iconType: IconType;
  public size: string | null;
  public color: string | null;
  constructor(iconConfig: {
    iconType: IconType;
    name: string;
    size?: string;
    color?: string;
  }) {
    this.name = iconConfig.name;
    this.iconType = iconConfig.iconType;
    this.size = iconConfig.size ?? null;
    this.color = iconConfig.color ?? null;
  }
}
