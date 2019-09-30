import {PageWithNavbarPage} from './PageWithNavbar.page';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get entitySelectCreateBtn() {
    return browser.element('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return browser.element('#labelInput');
  }

  public get entitySelectCreateName() {
    return browser.element('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    return browser.element('#importEntitySelectBtn');
  }

  public get entitySelectCreateItemListName() {
    return browser.element('#createEntityItemName');
  }
  public get entitySelectCreateSingleItemBtn() {
    return browser.element('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSingleItemEditBtn() {
    return browser.element('#entitySelectCreateSingleItemEdit');
  }

  public get entitySelectCreateSaveBtn() {
    return browser.element('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    return browser.element('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditName() {
    return browser.element('#editName');
  }

  public get entitySelectEditImportListBtn() {
    return browser.element('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return browser.element('#editEntitySelectCreateItem');
  }

  public get entitySelectEditItemName() {
    return browser.element('#entitySelectItemEditName{id}');
  }

  public get entitySelectEditSaveBtn() {
    return browser.element('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    return browser.element('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    return browser.element('#entityImportTextArea');
  }

  public get entitySelectImportSaveBtn() {
    return browser.element('#entityImportSaveBtn');
  }

  public get  entitySelectImportCancelBtn() {
    return browser.element('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    return browser.element('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return browser.element('#entitySelectDeleteCancelBtn');
  }

  public get entitySelectEditItemNameBox() {
    return browser.element('#entityItemEditNameBox');
  }

  public get entitySelectEditItemSaveBtn() {
    return browser.element('#entityItemSaveBtn');
  }

  public get entitySelectEditItemCancelBtn() {
    return browser.element('#entityItemCancelBtn');
  }
  getFirstRowObject(): SelectableListRowObject {
    return new SelectableListRowObject(1);
  }
  getFirstItemObject(): EntitySelectItemRowObject {
    return new EntitySelectItemRowObject(1);
  }
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }
  public createSelectableList_NoItem(name: string) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
  }
  public createSelectableList_OneItem(name, itemName) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
  }
  public createSelectableList_MultipleItems(name, itemNames) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
  }

  public createSelectableList_NoItem_Cancels(name) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
  }
  public createSelectableList_OneItem_Cancels(name, itemName) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
  }
  public createSelectableList_MultipleItems_Cancels(name, itemNames) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
  }

  public cleanup() {
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      browser.pause(8000);
      deleteObject.deleteBtn.click();
      browser.pause(4000);
      this.entitySelectDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
}
const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectMicrotingUUID')[rowNumber - 1]) {
      this.id = +$$('#entitySelectMicrotingUUID')[rowNumber - 1];
      try {
        this.name = $$('#entitySelectName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectDeleteBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySelectEditBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  id;
  name;
  editBtn;
  deleteBtn;
}
export class EntitySelectItemRowObject {
  constructor(rowNumber) {
    if ($$('#createEntityItemName')[rowNumber - 1]) {
      this.name = $$('#createEntityItemName')[rowNumber - 1];
      try {
        this.editBtn = $$('#entitySelectCreateSingleItemEdit')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectCreateSingleItemDelete')[rowNumber - 1];
      } catch (e) {}
    }
  }
  name;
  editBtn;
  deleteBtn;
}
