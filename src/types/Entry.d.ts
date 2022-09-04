import { IContent } from "json-as-xlsx";

export interface Entry extends IContent {
  itemID: string;
  title: string;
  imageSrc: string;
}
