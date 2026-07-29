import * as i0 from '@angular/core';
import { EventEmitter, Component, ViewEncapsulation, ViewChild, ContentChild, Input, Output } from '@angular/core';
import * as i1 from '@angular/material/table';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as i2 from '@angular/cdk/table';
import { CdkTableModule } from '@angular/cdk/table';
import { NgIf, NgTemplateOutlet, NgForOf, NgSwitch, NgSwitchCase, NgClass, AsyncPipe } from '@angular/common';
import * as i3 from '@angular/material/sort';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import * as i4 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i5 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { DscPaginatorComponent } from 'sidsc-components/dsc-paginator';
import { DscCheckboxComponent } from 'sidsc-components/dsc-checkbox';
import { DscRadioButtonComponent } from 'sidsc-components/dsc-radio-button';
import { DscButtonComponent } from 'sidsc-components/dsc-button';
import * as i6 from 'sidsc-components/dsc-tooltip';
import { DscTooltipModule } from 'sidsc-components/dsc-tooltip';

class DscTableComponent {
    constructor() {
        this.columns = [];
        this.data = [];
        this.paginatorPageIndex = 0;
        this.paginatorLength = 0;
        this.paginatorPageSize = 10;
        this.pageSizeOptions = [5, 10, 25];
        this.selectedItems = [];
        this.showUnsortedIcon = true;
        this.footerFixed = false;
        this._emptyMessageData = 'Sem dados';
        this._paginator = true;
        this._backendPagination = false;
        this._emitPageEventAfterView = false;
        this._expandable = false;
        this._hidePaginatorRangeLabel = false;
        this._showFirstLastButtons = true;
        this._hidePageSize = false;
        this._showPageSizeOptions = true;
        this._disabledPaginator = false;
        this._expandMultiple = false;
        this.tooltipId = `tt-${cryptoRandom()}`;
        this.page = new EventEmitter();
        this.selectionChange = new EventEmitter();
        this.checkboxChange = new EventEmitter();
        this.radioButtonChange = new EventEmitter();
        this.sortChange = new EventEmitter();
        this.rowExpanded = new EventEmitter();
        this.selection = new SelectionModel(true, []);
        this.displayedColumns = [];
        this.labelHintTooltip = true;
        this.expandedElements = [];
        this.currentDirection = '';
        this.checkboxAllLabel = 'Selecionar todos os registros';
    }
    get emptyMessageData() {
        return this._emptyMessageData;
    }
    set emptyMessageData(value) {
        this._emptyMessageData = value;
    }
    get paginator() {
        return this._paginator;
    }
    set paginator(value) {
        this._paginator = coerceBooleanProperty(value);
    }
    get backendPagination() {
        return this._backendPagination;
    }
    set backendPagination(value) {
        this._backendPagination = coerceBooleanProperty(value);
    }
    get emitPageEventAfterView() {
        return this._emitPageEventAfterView;
    }
    set emitPageEventAfterView(value) {
        this._emitPageEventAfterView = coerceBooleanProperty(value);
    }
    get expandable() {
        return this._expandable;
    }
    set expandable(value) {
        this._expandable = coerceBooleanProperty(value);
    }
    get showFirstLastButtons() {
        return this._showFirstLastButtons;
    }
    set showFirstLastButtons(value) {
        this._showFirstLastButtons = coerceBooleanProperty(value);
    }
    get hidePageSize() {
        return this._hidePageSize;
    }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    get showPageSizeOptions() {
        return this._showPageSizeOptions;
    }
    set showPageSizeOptions(value) {
        this._showPageSizeOptions = coerceBooleanProperty(value);
    }
    get hidePaginatorRangeLabel() {
        return this._hidePaginatorRangeLabel;
    }
    set hidePaginatorRangeLabel(value) {
        this._hidePaginatorRangeLabel = coerceBooleanProperty(value);
    }
    get disabledPaginator() {
        return this._disabledPaginator;
    }
    set disabledPaginator(value) {
        this._disabledPaginator = coerceBooleanProperty(value);
    }
    get expandMultiple() {
        return this._expandMultiple;
    }
    set expandMultiple(value) {
        this._expandMultiple = coerceBooleanProperty(value);
    }
    ngAfterViewInit() {
        if (this.paginator && this.dataSource && !this.backendPagination)
            this.dataSource.paginator = this.dscPaginator;
        if (this.dataSource)
            this.dataSource.sort = this.matSort;
        this.dataSource.sortingDataAccessor = (item, property) => {
            const value = item[property];
            if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                const [day, month, year] = value.split('/').map(Number);
                return new Date(year, month - 1, day);
            }
            if (this.isNumeric(value)) {
                return Number(value);
            }
            return value;
        };
        setTimeout(() => {
            if (this.paginator && this.backendPagination && this.emitPageEventAfterView) {
                this.onPage({
                    pageSize: this.paginatorPageSize,
                    pageIndex: 0,
                    length: 0,
                    previousPageIndex: 0
                });
            }
        });
        this.sortChange.subscribe((sort) => {
            this.onSortChange(sort);
        });
    }
    ngOnChanges(changes) {
        if (changes['data'])
            this._tableInit();
        if (changes['selectedItems'])
            this._setInitialSelection();
    }
    _setInitialSelection() {
        if (this.selectorType === 'checkbox' && this.selectedItems?.length) {
            this.selection.clear();
            this.selectedItems.forEach(item => this.selection.select(item));
        }
    }
    isNumeric(value) {
        return value !== null && value !== '' && !isNaN(value) && !isNaN(parseFloat(value));
    }
    _tableInit() {
        this._createDataSource();
        this._setColumns();
    }
    _createDataSource() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.matSort;
        if (this.paginator && !this.backendPagination)
            this.dataSource.paginator = this.dscPaginator;
    }
    _setColumns() {
        this.displayedColumns = this.columns.map((tableColumn) => tableColumn.property);
        switch (this.selectorType) {
            case 'checkbox':
                this.displayedColumns = ['checkbox', ...this.displayedColumns];
                break;
            case 'radio-button':
                this.displayedColumns = ['radio-button', ...this.displayedColumns];
                break;
        }
        if (this.expandable)
            this.displayedColumns = [...this.displayedColumns, 'expand'];
    }
    _getCurrentPageData() {
        if (!this.dscPaginator || !this.dataSource)
            return [];
        const startIndex = this.dscPaginator?.pageIndex * this.dscPaginator?.pageSize;
        const endIndex = startIndex + this.dscPaginator?.pageSize;
        return this.dataSource.data
            .slice(startIndex, endIndex)
            .filter((value) => !value['disabled']);
    }
    onPage(pageEvent) {
        this.page.emit(pageEvent);
    }
    onSortChange(sort) {
        this.columns.forEach(column => {
            if (column.property === sort.active) {
                column.sortableActive = true;
                column.currentDirection = sort.direction;
            }
            else {
                column.sortableActive = false;
                column.currentDirection = '';
            }
        });
        if (!this.lastSort
            || this.lastSort.active !== sort.active
            || this.lastSort.direction !== sort.direction) {
            this.lastSort = sort;
            this.sortChange.emit(sort);
        }
    }
    getSortIcon(column) {
        if (!column.sortable)
            return '';
        if (column.sortableActive) {
            switch (column.currentDirection) {
                case 'asc':
                    return 'arrow_upward';
                case 'desc':
                    return 'arrow_downward';
                case '':
                    return column.showUnsortedIcon ? 'swap_vert' : '';
            }
        }
        return column.showUnsortedIcon ? 'swap_vert' : '';
    }
    getFooterValue(col) {
        if (col.footerCalc && typeof col.footerCalc === 'function') {
            return col.footerCalc(this.data);
        }
        return '';
    }
    get hasFooter() {
        return this.columns?.some(c => c.footerTitle || c.footerCalc);
    }
    isExpanded(row) {
        return this.expandMultiple ? this.expandedElements.includes(row) : this.expandedElement === row;
    }
    isAllSelected() {
        if (this.paginator) {
            const pageData = this._getCurrentPageData();
            return pageData.every(row => this.selection.isSelected(row));
        }
        else {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.filter((value) => !value['disabled'] && !value['disabledSelection']).length;
            return numSelected === numRows;
        }
    }
    toggleAllRows() {
        if (this.paginator) {
            this.toggleAllRowsWithPaginator();
        }
        else {
            this.toggleAllRowsNoPaginator();
        }
    }
    toggleAllRowsWithPaginator() {
        const pageData = this._getCurrentPageData();
        const allSelected = pageData.every(row => this.selection.isSelected(row));
        if (allSelected) {
            pageData.forEach(row => this.selection.deselect(row));
        }
        else {
            pageData.forEach(row => this.selection.select(row));
        }
        this.onSelectionChange();
        this.checkboxChange.emit(this.selection.selected);
    }
    toggleAllRowsNoPaginator() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.selection.select(...this.dataSource.data.filter((value) => !value['disabled'] && !value['disabledSelection']));
        this.onSelectionChange();
        this.checkboxChange.emit(this.selection.selected);
    }
    checkboxLabel(row) {
        return row
            ? `${this.isAllSelected() ? 'Desselecionar' : 'Selecionar'} todos os registros`
            : this.checkboxAllLabel;
    }
    onSelectionChange() {
        this.selectionChange.emit(Array.from(this.selection.selected));
    }
    onSelectChange($event, row) {
        if ($event)
            this.selection.toggle(row);
        this.onSelectionChange();
        this.checkboxChange.emit(this.selection.selected);
    }
    onRadioButtonChange(row) {
        this.radioButtonChange.emit(row);
    }
    onClick(row, $event) {
        $event.stopPropagation();
        this.rowExpanded.emit(row);
        if (!row.disabled) {
            if (this.expandMultiple) {
                const index = this.expandedElements.findIndex(r => r === row);
                if (index >= 0) {
                    this.expandedElements.splice(index, 1);
                }
                else {
                    this.expandedElements.push(row);
                }
            }
            else {
                this.expandedElement = this.expandedElement === row ? null : row;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscTableComponent, isStandalone: true, selector: "dsc-table", inputs: { columns: "columns", data: "data", paginatorPageIndex: "paginatorPageIndex", paginatorLength: "paginatorLength", paginatorPageSize: "paginatorPageSize", pageSizeOptions: "pageSizeOptions", selectorType: "selectorType", expandedDetailTemplate: "expandedDetailTemplate", tableMaxHeight: "tableMaxHeight", tableRowHeight: "tableRowHeight", selectedItems: "selectedItems", showUnsortedIcon: "showUnsortedIcon", footerFixed: "footerFixed", emptyMessageData: "emptyMessageData", paginator: "paginator", backendPagination: "backendPagination", emitPageEventAfterView: "emitPageEventAfterView", expandable: "expandable", showFirstLastButtons: "showFirstLastButtons", hidePageSize: "hidePageSize", showPageSizeOptions: "showPageSizeOptions", hidePaginatorRangeLabel: "hidePaginatorRangeLabel", disabledPaginator: "disabledPaginator", expandMultiple: "expandMultiple" }, outputs: { page: "page", selectionChange: "selectionChange", checkboxChange: "checkboxChange", radioButtonChange: "radioButtonChange", sortChange: "sortChange", rowExpanded: "rowExpanded" }, queries: [{ propertyName: "customActionButtons", first: true, predicate: ["customActionButtons"], descendants: true, static: true }], viewQueries: [{ propertyName: "matSort", first: true, predicate: MatSort, descendants: true, static: true }, { propertyName: "dscPaginator", first: true, predicate: DscPaginatorComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div [style.height.px]=\"tableMaxHeight\">\n\n  <!-- Tabela Angular Material -->\n  <table mat-table\n         matSort\n         aria-label=\"tabela\"\n         (matSortChange)=\"onSortChange($event)\"\n         [multiTemplateDataRows]=\"expandable\"\n         [dataSource]=\"dataSource\">\n         \n    <!-- Loop para gerar dinamicamente as colunas da tablea -->\n    <ng-container *ngFor=\"let column of columns\"\n                  [cdkColumnDef]=\"column.property\"\n                  [sticky]=\"column.fixed === 'columnLeft'\"\n                  [stickyEnd]=\"column.fixed === 'columnRight'\">\n\n      <!-- Cabe\u00E7alho de coluna sem ordena\u00E7\u00E3o -->\n      <ng-container *ngIf=\"!column.sortable\">\n        <th mat-header-cell *cdkHeaderCellDef\n            [style.width.px]=\"column.width\"\n            [class.text-align__left]=\"column.headerAlign === 'left'\"\n            [class.text-align__center]=\"column.headerAlign === 'center'\"\n            [class.text-align__right]=\"column.headerAlign === 'right'\"\n            [class.fixed__header]=\"column.headerFixed\"\n            [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n            [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n          <!-- Cabe\u00E7alho com tooltip opcional -->  \n          <div [class.info__header]=\"column.headerTooltip\">\n            {{ column.title }}\n            <mat-icon\n              *ngIf='column.title && column.headerTooltip'\n              [dscTooltip]='column.headerTooltip'\n              [dscTooltipVariant]=\"column.headerTooltipVariant ? 'highlight' : 'neutral'\"\n              fontSet=\"material-icons-outlined\"\n              tabindex=\"0\"\n              aria-label='column.headerTooltip'>\n              info\n            </mat-icon>\n          </div>\n        </th>\n      </ng-container>\n\n      <!-- Cabe\u00E7alho de coluna com ordena\u00E7\u00E3o -->\n      <ng-container *ngIf=\"column.sortable\">\n        <th mat-header-cell *cdkHeaderCellDef\n            [style.width.px]=\"column.width\"\n            [class.text-align__left]=\"column.headerAlign === 'left'\"\n            [class.text-align__center]=\"column.headerAlign === 'center'\"\n            [class.text-align__right]=\"column.headerAlign === 'right'\"\n            [class.fixed__header]=\"column.headerFixed\"\n            [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n            [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n          <!-- Cabe\u00E7alho com tooltip e \u00EDcone de ordena\u00E7\u00E3o -->\n          <div [class.info__header]=\"column.headerTooltip\">\n            <div class=\"info__header-section\" mat-sort-header=\"{{column.sortID}}\">\n              {{ column.title }}\n\n              <div class=\"header-sort\">\n                <mat-icon *ngIf=\"getSortIcon(column)\">{{ getSortIcon(column) }}</mat-icon>\n              </div>\n\n            </div>\n\n            <!-- \u00CDcone de informa\u00E7\u00E3o com tooltip -->\n            <div class=\"header-tooltip\">\n              <mat-icon\n              *ngIf=\"column.title && column.headerTooltip\"\n              [dscTooltip]=\"column.headerTooltip\"\n              [dscTooltipVariant]=\"column.headerTooltipVariant ? 'highlight' : 'neutral'\"\n              fontSet=\"material-icons-outlined\"\n              tabindex=\"0\">\n              info\n            </mat-icon>\n            </div>\n          </div>\n        </th>\n      </ng-container>\n\n      <!-- Corpo da c\u00E9lula da coluna -->\n      <td mat-cell *matCellDef=\"let row\"\n          lang=\"pt-BR\"\n          [style.width.px]=\"column.width\"\n          [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n          [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n          [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n          [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n          [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n        <!-- Se a coluna possui fun\u00E7\u00E3o value, renderiza o valor -->  \n        <ng-container *ngIf=\"column.value; else template\">\n          <span [innerHTML]=\"column.value(row)\"></span>\n        </ng-container>\n\n        <!-- Caso contr\u00E1tio, renderiza template customizado -->\n        <ng-template #template>\n          <ng-container *ngIf=\"column.template\"\n                        [ngTemplateOutlet]=\"column.template\"\n                        [ngTemplateOutletContext]=\"{$implicit: row}\">\n          </ng-container>\n        </ng-template>\n      </td>\n\n      <td mat-footer-cell *matFooterCellDef\n        [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n        [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n        [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n        [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n        [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n        <ng-container *ngIf=\"column.property\">\n          <span>{{ column.footerTitle }}</span>\n          <span>{{ getFooterValue(column) }}</span>\n        </ng-container>\n      </td>\n\n    </ng-container>\n\n    <!-- Coluna de sele\u00E7\u00E3o via checkbox -->\n    <ng-container matColumnDef=\"checkbox\"\n                  *ngIf=\"selectorType === 'checkbox'\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\">\n        <dsc-checkbox (change)=\"$event ? toggleAllRows() : null\"\n                      [checked]=\"selection.hasValue() && isAllSelected()\"\n                      [indeterminate]=\"selection.hasValue() && !isAllSelected()\"\n                      [attr.aria-label]=\"checkboxAllLabel\">\n        </dsc-checkbox>\n      </th>\n      <td mat-cell\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-checkbox (click)=\"$event.stopPropagation()\"\n                      (change)=\"onSelectChange($event, row)\"\n                      [checked]=\"selection.isSelected(row)\"\n                      [disabled]=\"row.disabled || row.disabledSelection\"\n                      [attr.aria-label]=\"checkboxAllLabel\">\n        </dsc-checkbox>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef>\n          <ng-container *ngIf=\"column.property\"></ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Coluna de sele\u00E7\u00E3o via radio button -->\n    <ng-container matColumnDef=\"radio-button\"\n                  *ngIf=\"selectorType === 'radio-button'\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.width.px]=\"80\">\n        &nbsp;\n      </th>\n      <td mat-cell\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-radio-button (change)=\"onRadioButtonChange(row)\"\n                          [value]=\"row\"\n                          [disabled]=\"row.disabled || row.disabledSelection\"\n                          [(ngModel)]=\"radioButtonSelected\"\n                          name=\"radio-button-cell\">\n        </dsc-radio-button>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef>\n          <ng-container *ngIf=\"column.property\"></ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Coluna para bot\u00E3o de expandir linha -->\n    <ng-container matColumnDef=\"expand\"\n                  *ngIf=\"expandable\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.width.px]=\"80\">\n        &nbsp;\n      </th>\n      <td mat-cell\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-button iconButton=\"true\"\n                    [icon]=\"isExpanded(row) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'\"\n                    variant=\"secondary-text\"\n                    [disabled]=\"row.disabled\"\n                    (click)=\"onClick(row, $event)\"\n                    [ariaExpanded]=\"isExpanded(row)\"\n                    [ariaControls]=\"'row-detail-' + row.id\">\n        </dsc-button>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef\n          [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n          [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n          [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n          [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n          [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n          <ng-container *ngIf=\"column.property\">\n            <span>{{ column.footerTitle }}</span>\n            <span>{{ getFooterValue(column) }}</span>\n          </ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Linha de detalhe expandido -->\n    <ng-container matColumnDef=\"expand-detail\">\n      <td mat-cell\n          lang=\"pt-BR\"\n          *matCellDef=\"let row\"\n          [attr.colspan]=\"displayedColumns.length\"\n          [class.mdc-data-table__row__expand-detail-cell--expanded]=\"isExpanded(row)\"\n          class=\"mdc-data-table__row__expand-detail-cell\"\n          id=\"row-detail-{{row.id}}\"\n          role=\"region\"\n          aria-label=\"Detalhes da linha\">\n        <div class=\"mdc-data-table__row__expand-detail-cell__container\"\n             [@detailExpand]=\"isExpanded(row) ? 'expanded' : 'collapsed'\">\n          <ng-container *ngIf=\"expandedDetailTemplate\"\n                        [ngTemplateOutlet]=\"expandedDetailTemplate\"\n                        [ngTemplateOutletContext]=\"{$implicit: row}\">\n          </ng-container>\n        </div>\n      </td>\n    </ng-container>\n\n    <!-- Linha de cabe\u00E7alho da tabela -->\n    <tr mat-header-row\n        *matHeaderRowDef=\"displayedColumns\">\n    </tr>\n\n    <!-- Linhas da tabela -->\n    <tr mat-row\n        [class.mdc-data-table__row__radio-button--selected]=\"radioButtonSelected === row\"\n        [class.mdc-data-table__row__checkbox--selected]=\"selection.isSelected(row)\"\n        [class.mdc-data-table__row--striped]=\"!expandable\"\n        [class.mdc-data-table__row__expanded--striped]=\"expandable\"\n        [class.mdc-data-table__row--disabled]=\"row.disabled\"\n        [class.fixed__row-top]=\"row.fixed === 'rowTop'\"\n        [class.fixed__row-bottom]=\"row.fixed === 'rowBottom'\"\n        [class.mdc-data-table__row--expanded]=\"expandedElement === row\"\n        *matRowDef=\"let row; let i = index; columns: displayedColumns;\">\n    </tr>\n\n    <ng-container *ngIf=\"hasFooter\">\n      <tr \n        mat-footer-row \n        *matFooterRowDef=\"displayedColumns; sticky: footerFixed\"\n        [class.fixed__row-bottom]=\"footerFixed\">\n      </tr>\n    </ng-container>\n\n    <!-- Linha exibida quando b\u00E3o h\u00E1 dados -->\n    <tr class=\"mat-row mdc-data-table__row__empty\" *matNoDataRow>\n      <td class=\"mat-cell mdc-data-table__row__empty-cell\"\n          [attr.colspan]=\"displayedColumns.length\">\n        <span>{{emptyMessageData}}</span>\n      </td>\n    </tr>\n\n    <!-- Linha de detalhe expandido, vis\u00EDvel apenas se expandido -->\n    <ng-container *ngIf=\"expandable\">\n      <tr mat-row\n          *matRowDef=\"let row; columns: ['expand-detail']\"\n          class=\"mdc-data-table__row-expand-detail\">\n      </tr>\n    </ng-container>\n  </table>\n\n  <!-- Paginador da tabela -->\n  <ng-container *ngIf=\"paginator\">\n\n    <!-- Paginador para backend -->\n    <dsc-paginator *ngIf=\"backendPagination\"\n                   (page)=\"onPage($event)\"\n                   [length]=\"paginatorLength\"\n                   [pageSize]=\"paginatorPageSize\"\n                   [pageIndex]=paginatorPageIndex\n                   [showFirstLastButtons]=\"showFirstLastButtons\"\n                   [pageSizeOptions]=\"showPageSizeOptions ? pageSizeOptions : []\"\n                   [hidePageSize]=\"hidePageSize\"\n                   [hidePaginatorRangeLabel]=\"hidePaginatorRangeLabel\"\n                   [disabled]=\"disabledPaginator\">\n    </dsc-paginator>\n\n    <!-- Paginador para frontend -->\n    <dsc-paginator *ngIf=\"!backendPagination\"\n                   (page)=\"onPage($event)\"\n                   [pageSize]=\"paginatorPageSize\"\n                   [pageSizeOptions]=\"pageSizeOptions\"\n                   [pageIndex]=paginatorPageIndex\n                   [showFirstLastButtons]=\"showFirstLastButtons\"\n                   [pageSizeOptions]=\"showPageSizeOptions ? pageSizeOptions : []\"\n                   [hidePageSize]=\"hidePageSize\"\n                   [hidePaginatorRangeLabel]=\"hidePaginatorRangeLabel\"\n                   [disabled]=\"disabledPaginator\">\n    </dsc-paginator>\n  </ng-container>\n</div>\n", styles: ["dsc-table{overflow-x:auto!important;display:grid!important}dsc-table .mat-mdc-table{--mat-table-header-container-height: 72px;--mat-table-background-color: var(--dsc-color-bg-neutral-1);--mat-table-header-headline-color: var(--dsc-color-content-neutral-5);--mat-table-row-item-container-height: 56px;--mat-table-row-item-label-text-color: var(--dsc-color-content-neutral-5);--mat-table-row-item-outline-color: var(--dsc-color-border-neutral-3);--mat-table-row-item-outline-width: var(--dsc-border-width-hairline)}dsc-table .mdc-data-table__header-row{box-sizing:border-box}dsc-table .mdc-data-table__header-cell{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";padding:var(--dsc-spacing-smaller) var(--dsc-spacing-tiny);background-color:var(--dsc-color-bg-neutral-3)!important}dsc-table .mdc-data-table__header-cell .mat-sort-header-container .mat-sort-header-arrow{display:none!important}dsc-table .mdc-data-table__header-cell .mat-sort-header-container .mat-sort-header-content .header-sort .mat-icon{margin-left:var(--dsc-spacing-nano)!important;align-self:center;display:flex;justify-content:center;min-height:var(--dsc-icon-size-small);min-width:var(--dsc-icon-size-medium)}dsc-table .mdc-data-table__header-cell.mat-sort-header.cdk-keyboard-focused .mat-sort-header-container{border:none;outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);border-radius:var(--dsc-border-radius-nano)}dsc-table .mdc-data-table__header-cell.mat-column-select,dsc-table .mdc-data-table__header-cell.mat-column-radio-button{text-align:center}dsc-table .mdc-data-table__cell{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";background-color:var(--dsc-color-bg-neutral-1)}dsc-table .mdc-data-table__cell.mat-column-select,dsc-table .mdc-data-table__cell.mat-column-radio-button{text-align:center}dsc-table .text-align__left.mdc-data-table__header-cell{text-align:left!important}dsc-table .text-align__left .mat-mdc-header-cell-container{justify-content:left!important}dsc-table .text-align__left .mat-sort-header-container{justify-content:left!important}dsc-table .text-align__left .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__left.mdc-data-table__cell{text-align:left!important}dsc-table .text-align__right.mdc-data-table__header-cell{text-align:right!important}dsc-table .text-align__right .mat-mdc-header-cell-container{justify-content:right!important}dsc-table .text-align__right .mat-sort-header-container{justify-content:right!important}dsc-table .text-align__right .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__right.mdc-data-table__cell{text-align:right!important}dsc-table .text-align__center.mdc-data-table__header-cell{text-align:center!important}dsc-table .text-align__center .mat-mdc-header-cell-container{justify-content:center!important}dsc-table .text-align__center .mat-sort-header-container{justify-content:center!important}dsc-table .text-align__center .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__center.mdc-data-table__cell{text-align:center!important}dsc-table .fixed__header{position:sticky;z-index:4;top:-22px;border-bottom:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__row-top{position:sticky;z-index:2;top:0}dsc-table .fixed__row-top .mdc-data-table__cell{border-bottom:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__row-bottom{position:sticky;z-index:2;bottom:0}dsc-table .fixed__row-bottom .mdc-data-table__cell{border-top:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__column-left{min-width:100px;border-right:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__header.fixed__column-left{z-index:6!important;min-width:100px}dsc-table .fixed__column-right{min-width:100px;border-left:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__header.fixed__column-right{z-index:6!important;min-width:100px}dsc-table .info__header{display:flex}dsc-table .info__header .mat-icon{display:flex;align-self:center;margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-neutral-7);min-height:var(--dsc-icon-size-small);min-width:var(--dsc-icon-size-medium)}dsc-table .info__header-section{display:flex}dsc-table .info__header-section.cdk-keyboard-focused{outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);border-radius:var(--dsc-border-radius-nano);outline-offset:2px}dsc-table .info__header-sort{align-content:center}dsc-table tr.mdc-data-table__row__expanded--striped:not(.mdc-data-table__row--disabled):nth-child(4n-1) .mdc-data-table__cell,dsc-table tr.mdc-data-table__row__expanded--striped:not(.mdc-data-table__row--disabled):nth-child(4n) .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-neutral-3),transparent 36%)}dsc-table tr.mdc-data-table__row__empty{height:56px}dsc-table tr.mdc-data-table__row__empty .mdc-data-table__row__empty-cell{text-align:center;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";background-color:var(--dsc-color-bg-neutral-1);padding:var(--dsc-spacing-quark) var(--dsc-spacing-tiny) var(--dsc-spacing-quark) var(--dsc-spacing-tiny);border-bottom-color:var(--dsc-color-border-neutral-3);border-bottom-width:var(--dsc-border-width-hairline);border-bottom-style:solid}dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-neutral-3),transparent 36%)}dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .fixed__column-left,dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .fixed__column-right{background-color:#f2f7f8}dsc-table tr.mdc-data-table__row__checkbox--selected .mdc-data-table__cell,dsc-table tr.mdc-data-table__row__radio-button--selected .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-highlight-5),transparent 84%)!important}dsc-table tr.mdc-data-table__row--disabled{position:relative}dsc-table tr.mdc-data-table__row--disabled:after{content:\"\";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:var(--dsc-color-bg-neutral-2);opacity:var(--dsc-opacity-64);z-index:1;width:100%;height:100%}dsc-table tr.mdc-data-table__row-expand-detail{height:0}dsc-table tr.mdc-data-table__row-expand-detail .mdc-data-table__row__expand-detail-cell{padding:0 var(--dsc-spacing-tiny) 0 var(--dsc-spacing-tiny)}dsc-table tr.mdc-data-table__row-expand-detail .mdc-data-table__row__expand-detail-cell--expanded{padding:var(--dsc-spacing-tiny) var(--dsc-spacing-tiny) var(--dsc-spacing-small) var(--dsc-spacing-tiny)!important}dsc-table tr.mdc-data-table__row:not(.mdc-data-table__row-expand-detail) .mdc-data-table__cell{padding:var(--dsc-spacing-nano) var(--dsc-spacing-tiny)}dsc-table .mat-mdc-footer-cell{border-top:var(--dsc-border-width-hairline) solid;border-color:var(--dsc-color-border-neutral-6)}dsc-table .mat-mdc-footer-cell span{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}.cdk-visually-hidden{border:0!important;clip:rect(0 0 0 0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}\n"], dependencies: [{ kind: "ngmodule", type: MatTableModule }, { kind: "component", type: i1.MatTable, selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: i1.MatHeaderCellDef, selector: "[matHeaderCellDef]" }, { kind: "directive", type: i1.MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "directive", type: i1.MatColumnDef, selector: "[matColumnDef]", inputs: ["sticky", "matColumnDef"] }, { kind: "directive", type: i1.MatCellDef, selector: "[matCellDef]" }, { kind: "directive", type: i1.MatRowDef, selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "directive", type: i1.MatFooterCellDef, selector: "[matFooterCellDef]" }, { kind: "directive", type: i1.MatFooterRowDef, selector: "[matFooterRowDef]", inputs: ["matFooterRowDef", "matFooterRowDefSticky"] }, { kind: "directive", type: i1.MatHeaderCell, selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "directive", type: i1.MatCell, selector: "mat-cell, td[mat-cell]" }, { kind: "directive", type: i1.MatFooterCell, selector: "mat-footer-cell, td[mat-footer-cell]" }, { kind: "component", type: i1.MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "component", type: i1.MatRow, selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "component", type: i1.MatFooterRow, selector: "mat-footer-row, tr[mat-footer-row]", exportAs: ["matFooterRow"] }, { kind: "directive", type: i1.MatNoDataRow, selector: "ng-template[matNoDataRow]" }, { kind: "ngmodule", type: CdkTableModule }, { kind: "directive", type: i2.CdkHeaderCellDef, selector: "[cdkHeaderCellDef]" }, { kind: "directive", type: i2.CdkColumnDef, selector: "[cdkColumnDef]", inputs: ["sticky", "cdkColumnDef", "stickyEnd"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: DscPaginatorComponent, selector: "dsc-paginator", inputs: ["disabled", "hidePaginatorRangeLabel"] }, { kind: "ngmodule", type: MatSortModule }, { kind: "directive", type: i3.MatSort, selector: "[matSort]", inputs: ["matSortDisabled", "matSortActive", "matSortStart", "matSortDirection", "matSortDisableClear"], outputs: ["matSortChange"], exportAs: ["matSort"] }, { kind: "component", type: i3.MatSortHeader, selector: "[mat-sort-header]", inputs: ["disabled", "mat-sort-header", "arrowPosition", "start", "sortActionDescription", "disableClear"], exportAs: ["matSortHeader"] }, { kind: "directive", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: DscCheckboxComponent, selector: "dsc-checkbox", inputs: ["labelPosition", "name", "label", "aria-describedby", "aria-label", "aria-labelledby", "indeterminate", "checked", "required", "size", "variant", "disabled"], outputs: ["change", "indeterminateChange"] }, { kind: "component", type: DscRadioButtonComponent, selector: "dsc-radio-button", inputs: ["name", "label", "aria-describedby", "aria-label", "aria-labelledby", "value", "labelPosition", "required", "size", "variant"], outputs: ["change", "focus"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: DscButtonComponent, selector: "dsc-button", inputs: ["type", "label", "iconSuffix", "iconPrefix", "icon", "tabIndex", "dscTooltip", "ariaLabel", "ariaExpanded", "ariaControls", "iconStyle", "variant", "size", "disabled", "iconButton"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i5.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: DscTooltipModule }, { kind: "directive", type: i6.DscTooltipDirective, selector: "[dscTooltip]", inputs: ["dscTooltipPosition", "dscTooltipVariant", "dscTooltipPositionAtOrigin", "dscTooltipDisabled", "dscTooltipShowDelay", "dscTooltipHideDelay", "dscTooltip"] }], animations: [
            trigger('detailExpand', [
                state('collapsed, void', style({ height: '0px', minHeight: '0' })),
                state('expanded', style({ height: '*' })),
                transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
            ]),
        ], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscTableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-table', standalone: true, encapsulation: ViewEncapsulation.None, imports: [
                        MatTableModule,
                        CdkTableModule,
                        NgIf,
                        NgTemplateOutlet,
                        DscPaginatorComponent,
                        MatSortModule,
                        NgForOf,
                        DscCheckboxComponent,
                        NgSwitch,
                        NgSwitchCase,
                        DscRadioButtonComponent,
                        FormsModule,
                        DscButtonComponent,
                        MatIconModule,
                        DscTooltipModule,
                        NgClass,
                        AsyncPipe
                    ], animations: [
                        trigger('detailExpand', [
                            state('collapsed, void', style({ height: '0px', minHeight: '0' })),
                            state('expanded', style({ height: '*' })),
                            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                        ]),
                    ], template: "<div [style.height.px]=\"tableMaxHeight\">\n\n  <!-- Tabela Angular Material -->\n  <table mat-table\n         matSort\n         aria-label=\"tabela\"\n         (matSortChange)=\"onSortChange($event)\"\n         [multiTemplateDataRows]=\"expandable\"\n         [dataSource]=\"dataSource\">\n         \n    <!-- Loop para gerar dinamicamente as colunas da tablea -->\n    <ng-container *ngFor=\"let column of columns\"\n                  [cdkColumnDef]=\"column.property\"\n                  [sticky]=\"column.fixed === 'columnLeft'\"\n                  [stickyEnd]=\"column.fixed === 'columnRight'\">\n\n      <!-- Cabe\u00E7alho de coluna sem ordena\u00E7\u00E3o -->\n      <ng-container *ngIf=\"!column.sortable\">\n        <th mat-header-cell *cdkHeaderCellDef\n            [style.width.px]=\"column.width\"\n            [class.text-align__left]=\"column.headerAlign === 'left'\"\n            [class.text-align__center]=\"column.headerAlign === 'center'\"\n            [class.text-align__right]=\"column.headerAlign === 'right'\"\n            [class.fixed__header]=\"column.headerFixed\"\n            [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n            [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n          <!-- Cabe\u00E7alho com tooltip opcional -->  \n          <div [class.info__header]=\"column.headerTooltip\">\n            {{ column.title }}\n            <mat-icon\n              *ngIf='column.title && column.headerTooltip'\n              [dscTooltip]='column.headerTooltip'\n              [dscTooltipVariant]=\"column.headerTooltipVariant ? 'highlight' : 'neutral'\"\n              fontSet=\"material-icons-outlined\"\n              tabindex=\"0\"\n              aria-label='column.headerTooltip'>\n              info\n            </mat-icon>\n          </div>\n        </th>\n      </ng-container>\n\n      <!-- Cabe\u00E7alho de coluna com ordena\u00E7\u00E3o -->\n      <ng-container *ngIf=\"column.sortable\">\n        <th mat-header-cell *cdkHeaderCellDef\n            [style.width.px]=\"column.width\"\n            [class.text-align__left]=\"column.headerAlign === 'left'\"\n            [class.text-align__center]=\"column.headerAlign === 'center'\"\n            [class.text-align__right]=\"column.headerAlign === 'right'\"\n            [class.fixed__header]=\"column.headerFixed\"\n            [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n            [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n          <!-- Cabe\u00E7alho com tooltip e \u00EDcone de ordena\u00E7\u00E3o -->\n          <div [class.info__header]=\"column.headerTooltip\">\n            <div class=\"info__header-section\" mat-sort-header=\"{{column.sortID}}\">\n              {{ column.title }}\n\n              <div class=\"header-sort\">\n                <mat-icon *ngIf=\"getSortIcon(column)\">{{ getSortIcon(column) }}</mat-icon>\n              </div>\n\n            </div>\n\n            <!-- \u00CDcone de informa\u00E7\u00E3o com tooltip -->\n            <div class=\"header-tooltip\">\n              <mat-icon\n              *ngIf=\"column.title && column.headerTooltip\"\n              [dscTooltip]=\"column.headerTooltip\"\n              [dscTooltipVariant]=\"column.headerTooltipVariant ? 'highlight' : 'neutral'\"\n              fontSet=\"material-icons-outlined\"\n              tabindex=\"0\">\n              info\n            </mat-icon>\n            </div>\n          </div>\n        </th>\n      </ng-container>\n\n      <!-- Corpo da c\u00E9lula da coluna -->\n      <td mat-cell *matCellDef=\"let row\"\n          lang=\"pt-BR\"\n          [style.width.px]=\"column.width\"\n          [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n          [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n          [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n          [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n          [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n\n        <!-- Se a coluna possui fun\u00E7\u00E3o value, renderiza o valor -->  \n        <ng-container *ngIf=\"column.value; else template\">\n          <span [innerHTML]=\"column.value(row)\"></span>\n        </ng-container>\n\n        <!-- Caso contr\u00E1tio, renderiza template customizado -->\n        <ng-template #template>\n          <ng-container *ngIf=\"column.template\"\n                        [ngTemplateOutlet]=\"column.template\"\n                        [ngTemplateOutletContext]=\"{$implicit: row}\">\n          </ng-container>\n        </ng-template>\n      </td>\n\n      <td mat-footer-cell *matFooterCellDef\n        [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n        [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n        [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n        [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n        [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n        <ng-container *ngIf=\"column.property\">\n          <span>{{ column.footerTitle }}</span>\n          <span>{{ getFooterValue(column) }}</span>\n        </ng-container>\n      </td>\n\n    </ng-container>\n\n    <!-- Coluna de sele\u00E7\u00E3o via checkbox -->\n    <ng-container matColumnDef=\"checkbox\"\n                  *ngIf=\"selectorType === 'checkbox'\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\">\n        <dsc-checkbox (change)=\"$event ? toggleAllRows() : null\"\n                      [checked]=\"selection.hasValue() && isAllSelected()\"\n                      [indeterminate]=\"selection.hasValue() && !isAllSelected()\"\n                      [attr.aria-label]=\"checkboxAllLabel\">\n        </dsc-checkbox>\n      </th>\n      <td mat-cell\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-checkbox (click)=\"$event.stopPropagation()\"\n                      (change)=\"onSelectChange($event, row)\"\n                      [checked]=\"selection.isSelected(row)\"\n                      [disabled]=\"row.disabled || row.disabledSelection\"\n                      [attr.aria-label]=\"checkboxAllLabel\">\n        </dsc-checkbox>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef>\n          <ng-container *ngIf=\"column.property\"></ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Coluna de sele\u00E7\u00E3o via radio button -->\n    <ng-container matColumnDef=\"radio-button\"\n                  *ngIf=\"selectorType === 'radio-button'\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.width.px]=\"80\">\n        &nbsp;\n      </th>\n      <td mat-cell\n          [style.text-align]=\"'center'\"\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-radio-button (change)=\"onRadioButtonChange(row)\"\n                          [value]=\"row\"\n                          [disabled]=\"row.disabled || row.disabledSelection\"\n                          [(ngModel)]=\"radioButtonSelected\"\n                          name=\"radio-button-cell\">\n        </dsc-radio-button>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef>\n          <ng-container *ngIf=\"column.property\"></ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Coluna para bot\u00E3o de expandir linha -->\n    <ng-container matColumnDef=\"expand\"\n                  *ngIf=\"expandable\">\n      <th mat-header-cell\n          *matHeaderCellDef\n          [style.width.px]=\"80\">\n        &nbsp;\n      </th>\n      <td mat-cell\n          [style.width.px]=\"80\"\n          *matCellDef=\"let row\">\n        <dsc-button iconButton=\"true\"\n                    [icon]=\"isExpanded(row) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'\"\n                    variant=\"secondary-text\"\n                    [disabled]=\"row.disabled\"\n                    (click)=\"onClick(row, $event)\"\n                    [ariaExpanded]=\"isExpanded(row)\"\n                    [ariaControls]=\"'row-detail-' + row.id\">\n        </dsc-button>\n      </td>\n\n      <ng-container *ngFor=\"let column of columns\">\n        <td mat-footer-cell *matFooterCellDef\n          [class.text-align__left]=\"column.bodyCellAlign === 'left'\"\n          [class.text-align__center]=\"column.bodyCellAlign === 'center'\"\n          [class.text-align__right]=\"column.bodyCellAlign === 'right'\"\n          [class.fixed__column-left]=\"column.fixed === 'columnLeft'\"\n          [class.fixed__column-right]=\"column.fixed === 'columnRight'\">\n          <ng-container *ngIf=\"column.property\">\n            <span>{{ column.footerTitle }}</span>\n            <span>{{ getFooterValue(column) }}</span>\n          </ng-container>\n        </td>\n      </ng-container>\n    </ng-container>\n\n    <!-- Linha de detalhe expandido -->\n    <ng-container matColumnDef=\"expand-detail\">\n      <td mat-cell\n          lang=\"pt-BR\"\n          *matCellDef=\"let row\"\n          [attr.colspan]=\"displayedColumns.length\"\n          [class.mdc-data-table__row__expand-detail-cell--expanded]=\"isExpanded(row)\"\n          class=\"mdc-data-table__row__expand-detail-cell\"\n          id=\"row-detail-{{row.id}}\"\n          role=\"region\"\n          aria-label=\"Detalhes da linha\">\n        <div class=\"mdc-data-table__row__expand-detail-cell__container\"\n             [@detailExpand]=\"isExpanded(row) ? 'expanded' : 'collapsed'\">\n          <ng-container *ngIf=\"expandedDetailTemplate\"\n                        [ngTemplateOutlet]=\"expandedDetailTemplate\"\n                        [ngTemplateOutletContext]=\"{$implicit: row}\">\n          </ng-container>\n        </div>\n      </td>\n    </ng-container>\n\n    <!-- Linha de cabe\u00E7alho da tabela -->\n    <tr mat-header-row\n        *matHeaderRowDef=\"displayedColumns\">\n    </tr>\n\n    <!-- Linhas da tabela -->\n    <tr mat-row\n        [class.mdc-data-table__row__radio-button--selected]=\"radioButtonSelected === row\"\n        [class.mdc-data-table__row__checkbox--selected]=\"selection.isSelected(row)\"\n        [class.mdc-data-table__row--striped]=\"!expandable\"\n        [class.mdc-data-table__row__expanded--striped]=\"expandable\"\n        [class.mdc-data-table__row--disabled]=\"row.disabled\"\n        [class.fixed__row-top]=\"row.fixed === 'rowTop'\"\n        [class.fixed__row-bottom]=\"row.fixed === 'rowBottom'\"\n        [class.mdc-data-table__row--expanded]=\"expandedElement === row\"\n        *matRowDef=\"let row; let i = index; columns: displayedColumns;\">\n    </tr>\n\n    <ng-container *ngIf=\"hasFooter\">\n      <tr \n        mat-footer-row \n        *matFooterRowDef=\"displayedColumns; sticky: footerFixed\"\n        [class.fixed__row-bottom]=\"footerFixed\">\n      </tr>\n    </ng-container>\n\n    <!-- Linha exibida quando b\u00E3o h\u00E1 dados -->\n    <tr class=\"mat-row mdc-data-table__row__empty\" *matNoDataRow>\n      <td class=\"mat-cell mdc-data-table__row__empty-cell\"\n          [attr.colspan]=\"displayedColumns.length\">\n        <span>{{emptyMessageData}}</span>\n      </td>\n    </tr>\n\n    <!-- Linha de detalhe expandido, vis\u00EDvel apenas se expandido -->\n    <ng-container *ngIf=\"expandable\">\n      <tr mat-row\n          *matRowDef=\"let row; columns: ['expand-detail']\"\n          class=\"mdc-data-table__row-expand-detail\">\n      </tr>\n    </ng-container>\n  </table>\n\n  <!-- Paginador da tabela -->\n  <ng-container *ngIf=\"paginator\">\n\n    <!-- Paginador para backend -->\n    <dsc-paginator *ngIf=\"backendPagination\"\n                   (page)=\"onPage($event)\"\n                   [length]=\"paginatorLength\"\n                   [pageSize]=\"paginatorPageSize\"\n                   [pageIndex]=paginatorPageIndex\n                   [showFirstLastButtons]=\"showFirstLastButtons\"\n                   [pageSizeOptions]=\"showPageSizeOptions ? pageSizeOptions : []\"\n                   [hidePageSize]=\"hidePageSize\"\n                   [hidePaginatorRangeLabel]=\"hidePaginatorRangeLabel\"\n                   [disabled]=\"disabledPaginator\">\n    </dsc-paginator>\n\n    <!-- Paginador para frontend -->\n    <dsc-paginator *ngIf=\"!backendPagination\"\n                   (page)=\"onPage($event)\"\n                   [pageSize]=\"paginatorPageSize\"\n                   [pageSizeOptions]=\"pageSizeOptions\"\n                   [pageIndex]=paginatorPageIndex\n                   [showFirstLastButtons]=\"showFirstLastButtons\"\n                   [pageSizeOptions]=\"showPageSizeOptions ? pageSizeOptions : []\"\n                   [hidePageSize]=\"hidePageSize\"\n                   [hidePaginatorRangeLabel]=\"hidePaginatorRangeLabel\"\n                   [disabled]=\"disabledPaginator\">\n    </dsc-paginator>\n  </ng-container>\n</div>\n", styles: ["dsc-table{overflow-x:auto!important;display:grid!important}dsc-table .mat-mdc-table{--mat-table-header-container-height: 72px;--mat-table-background-color: var(--dsc-color-bg-neutral-1);--mat-table-header-headline-color: var(--dsc-color-content-neutral-5);--mat-table-row-item-container-height: 56px;--mat-table-row-item-label-text-color: var(--dsc-color-content-neutral-5);--mat-table-row-item-outline-color: var(--dsc-color-border-neutral-3);--mat-table-row-item-outline-width: var(--dsc-border-width-hairline)}dsc-table .mdc-data-table__header-row{box-sizing:border-box}dsc-table .mdc-data-table__header-cell{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";padding:var(--dsc-spacing-smaller) var(--dsc-spacing-tiny);background-color:var(--dsc-color-bg-neutral-3)!important}dsc-table .mdc-data-table__header-cell .mat-sort-header-container .mat-sort-header-arrow{display:none!important}dsc-table .mdc-data-table__header-cell .mat-sort-header-container .mat-sort-header-content .header-sort .mat-icon{margin-left:var(--dsc-spacing-nano)!important;align-self:center;display:flex;justify-content:center;min-height:var(--dsc-icon-size-small);min-width:var(--dsc-icon-size-medium)}dsc-table .mdc-data-table__header-cell.mat-sort-header.cdk-keyboard-focused .mat-sort-header-container{border:none;outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);border-radius:var(--dsc-border-radius-nano)}dsc-table .mdc-data-table__header-cell.mat-column-select,dsc-table .mdc-data-table__header-cell.mat-column-radio-button{text-align:center}dsc-table .mdc-data-table__cell{font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";background-color:var(--dsc-color-bg-neutral-1)}dsc-table .mdc-data-table__cell.mat-column-select,dsc-table .mdc-data-table__cell.mat-column-radio-button{text-align:center}dsc-table .text-align__left.mdc-data-table__header-cell{text-align:left!important}dsc-table .text-align__left .mat-mdc-header-cell-container{justify-content:left!important}dsc-table .text-align__left .mat-sort-header-container{justify-content:left!important}dsc-table .text-align__left .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__left.mdc-data-table__cell{text-align:left!important}dsc-table .text-align__right.mdc-data-table__header-cell{text-align:right!important}dsc-table .text-align__right .mat-mdc-header-cell-container{justify-content:right!important}dsc-table .text-align__right .mat-sort-header-container{justify-content:right!important}dsc-table .text-align__right .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__right.mdc-data-table__cell{text-align:right!important}dsc-table .text-align__center.mdc-data-table__header-cell{text-align:center!important}dsc-table .text-align__center .mat-mdc-header-cell-container{justify-content:center!important}dsc-table .text-align__center .mat-sort-header-container{justify-content:center!important}dsc-table .text-align__center .mat-sort-header-container .mat-sort-header-content .mat-icon{margin-left:var(--dsc-spacing-nano)!important;color:var(--dsc-color-bg-neutral-7)!important}dsc-table .text-align__center.mdc-data-table__cell{text-align:center!important}dsc-table .fixed__header{position:sticky;z-index:4;top:-22px;border-bottom:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__row-top{position:sticky;z-index:2;top:0}dsc-table .fixed__row-top .mdc-data-table__cell{border-bottom:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__row-bottom{position:sticky;z-index:2;bottom:0}dsc-table .fixed__row-bottom .mdc-data-table__cell{border-top:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__column-left{min-width:100px;border-right:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__header.fixed__column-left{z-index:6!important;min-width:100px}dsc-table .fixed__column-right{min-width:100px;border-left:var(--dsc-border-width-thick) solid var(--dsc-color-border-neutral-6)!important}dsc-table .fixed__header.fixed__column-right{z-index:6!important;min-width:100px}dsc-table .info__header{display:flex}dsc-table .info__header .mat-icon{display:flex;align-self:center;margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-neutral-7);min-height:var(--dsc-icon-size-small);min-width:var(--dsc-icon-size-medium)}dsc-table .info__header-section{display:flex}dsc-table .info__header-section.cdk-keyboard-focused{outline:var(--dsc-border-width-thick) solid var(--dsc-color-state-border-focus-dark);border-radius:var(--dsc-border-radius-nano);outline-offset:2px}dsc-table .info__header-sort{align-content:center}dsc-table tr.mdc-data-table__row__expanded--striped:not(.mdc-data-table__row--disabled):nth-child(4n-1) .mdc-data-table__cell,dsc-table tr.mdc-data-table__row__expanded--striped:not(.mdc-data-table__row--disabled):nth-child(4n) .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-neutral-3),transparent 36%)}dsc-table tr.mdc-data-table__row__empty{height:56px}dsc-table tr.mdc-data-table__row__empty .mdc-data-table__row__empty-cell{text-align:center;font:var(--dsc-typography-text-standard-400);font-feature-settings:\"ss01\";background-color:var(--dsc-color-bg-neutral-1);padding:var(--dsc-spacing-quark) var(--dsc-spacing-tiny) var(--dsc-spacing-quark) var(--dsc-spacing-tiny);border-bottom-color:var(--dsc-color-border-neutral-3);border-bottom-width:var(--dsc-border-width-hairline);border-bottom-style:solid}dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-neutral-3),transparent 36%)}dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .fixed__column-left,dsc-table tr.mdc-data-table__row--striped:not(.mdc-data-table__row--disabled):nth-child(2n) .fixed__column-right{background-color:#f2f7f8}dsc-table tr.mdc-data-table__row__checkbox--selected .mdc-data-table__cell,dsc-table tr.mdc-data-table__row__radio-button--selected .mdc-data-table__cell{background-color:color-mix(in srgb,var(--dsc-color-bg-highlight-5),transparent 84%)!important}dsc-table tr.mdc-data-table__row--disabled{position:relative}dsc-table tr.mdc-data-table__row--disabled:after{content:\"\";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:var(--dsc-color-bg-neutral-2);opacity:var(--dsc-opacity-64);z-index:1;width:100%;height:100%}dsc-table tr.mdc-data-table__row-expand-detail{height:0}dsc-table tr.mdc-data-table__row-expand-detail .mdc-data-table__row__expand-detail-cell{padding:0 var(--dsc-spacing-tiny) 0 var(--dsc-spacing-tiny)}dsc-table tr.mdc-data-table__row-expand-detail .mdc-data-table__row__expand-detail-cell--expanded{padding:var(--dsc-spacing-tiny) var(--dsc-spacing-tiny) var(--dsc-spacing-small) var(--dsc-spacing-tiny)!important}dsc-table tr.mdc-data-table__row:not(.mdc-data-table__row-expand-detail) .mdc-data-table__cell{padding:var(--dsc-spacing-nano) var(--dsc-spacing-tiny)}dsc-table .mat-mdc-footer-cell{border-top:var(--dsc-border-width-hairline) solid;border-color:var(--dsc-color-border-neutral-6)}dsc-table .mat-mdc-footer-cell span{font:var(--dsc-typography-text-standard-600);font-feature-settings:\"ss01\";color:var(--dsc-color-content-neutral-5)}.cdk-visually-hidden{border:0!important;clip:rect(0 0 0 0)!important;height:1px!important;margin:-1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}\n"] }]
        }], propDecorators: { matSort: [{
                type: ViewChild,
                args: [MatSort, { static: true }]
            }], dscPaginator: [{
                type: ViewChild,
                args: [DscPaginatorComponent]
            }], customActionButtons: [{
                type: ContentChild,
                args: ['customActionButtons', { static: true }]
            }], columns: [{
                type: Input
            }], data: [{
                type: Input
            }], paginatorPageIndex: [{
                type: Input
            }], paginatorLength: [{
                type: Input
            }], paginatorPageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], selectorType: [{
                type: Input
            }], expandedDetailTemplate: [{
                type: Input
            }], tableMaxHeight: [{
                type: Input
            }], tableRowHeight: [{
                type: Input
            }], selectedItems: [{
                type: Input
            }], showUnsortedIcon: [{
                type: Input
            }], footerFixed: [{
                type: Input
            }], emptyMessageData: [{
                type: Input
            }], paginator: [{
                type: Input
            }], backendPagination: [{
                type: Input
            }], emitPageEventAfterView: [{
                type: Input
            }], expandable: [{
                type: Input
            }], showFirstLastButtons: [{
                type: Input
            }], hidePageSize: [{
                type: Input
            }], showPageSizeOptions: [{
                type: Input
            }], hidePaginatorRangeLabel: [{
                type: Input
            }], disabledPaginator: [{
                type: Input
            }], expandMultiple: [{
                type: Input
            }], page: [{
                type: Output
            }], selectionChange: [{
                type: Output
            }], checkboxChange: [{
                type: Output
            }], radioButtonChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], rowExpanded: [{
                type: Output
            }] } });
function cryptoRandom() {
    return Math.random().toString(36).slice(2);
}

class DscTableColumn {
    constructor(title, property, value, width, headerAlign, bodyCellAlign, sortable, sortID, sortableActive, showUnsortedIcon, currentDirection, footerTitle, footerCalc, fixed, headerFixed, headerTooltip, headerTooltipVariant, template) {
        this.title = title;
        this.property = property;
        this.value = value;
        this.width = width;
        this.headerAlign = headerAlign;
        this.bodyCellAlign = bodyCellAlign;
        this.sortable = sortable;
        this.sortID = sortID;
        this.sortableActive = sortableActive;
        this.showUnsortedIcon = showUnsortedIcon;
        this.currentDirection = currentDirection;
        this.footerTitle = footerTitle;
        this.footerCalc = footerCalc;
        this.fixed = fixed;
        this.headerFixed = headerFixed;
        this.headerTooltip = headerTooltip;
        this.headerTooltipVariant = headerTooltipVariant;
        this.template = template;
        this._sortable = false;
        this._sortableActive = false;
        this._showUnsortedIcon = true;
        this._currentDirection = '';
        this._title = title;
        this._property = property;
        this._value = value;
        this._width = width;
        this._headerAlign = headerAlign;
        this._bodyCellAlign = bodyCellAlign;
        this._sortable = sortable;
        this._sortID = sortID;
        this._sortableActive = sortableActive;
        this._showUnsortedIcon = showUnsortedIcon;
        this._currentDirection = currentDirection;
        this._footerTitle = footerTitle;
        this._footerCalc = footerCalc;
        this._fixed = fixed;
        this._headerFixed = headerFixed;
        this._headerTooltip = headerTooltip;
        this._headerTooltipVariant = headerTooltipVariant;
        this._template = template;
    }
}

class DscTableColumnBuilder {
    constructor() {
        this._headerAlign = 'left';
        this._bodyCellAlign = 'left';
        this._sortable = false;
        this._sortableActive = false;
        this._showUnsortedIcon = true;
        this._currentDirection = '';
        this._headerFixed = false;
    }
    static instance() {
        return new DscTableColumnBuilder();
    }
    title(title) {
        this._title = title;
        return this;
    }
    property(property) {
        this._property = property;
        return this;
    }
    value(value) {
        this._value = value;
        return this;
    }
    width(width) {
        this._width = coerceNumberProperty(width);
        return this;
    }
    headerAlign(headerAlign) {
        this._headerAlign = headerAlign;
        return this;
    }
    bodyCellAlign(bodyCellAlign) {
        this._bodyCellAlign = bodyCellAlign;
        return this;
    }
    sortable(sortable) {
        this._sortable = sortable;
        return this;
    }
    sortID(sortID) {
        this._sortID = sortID;
        return this;
    }
    sortableActive(sortableActive) {
        this._sortableActive = sortableActive;
        return this;
    }
    showUnsortedIcon(showUnsortedIcon) {
        this._showUnsortedIcon = showUnsortedIcon;
        return this;
    }
    currentDirection(currentDirection) {
        this._currentDirection = currentDirection;
        return this;
    }
    footerTitle(footerTitle) {
        this._footerTitle = footerTitle;
        return this;
    }
    footerCalc(footerCalc) {
        this._footerCalc = footerCalc;
        return this;
    }
    fixed(fixed) {
        this._fixed = fixed;
        return this;
    }
    headerFixed(headerFixed) {
        this._headerFixed = headerFixed;
        return this;
    }
    headerTooltip(headerTooltip) {
        this._headerTooltip = headerTooltip;
        return this;
    }
    headerTooltipVariant(headerTooltipVariant) {
        this._headerTooltipVariant = headerTooltipVariant;
        return this;
    }
    template(template) {
        this._template = template;
        return this;
    }
    build() {
        return new DscTableColumn(this._title, this._property, this._value, this._width, this._headerAlign, this._bodyCellAlign, this._sortable, this._sortID, this._sortableActive, this._showUnsortedIcon, this._currentDirection, this._footerTitle, this._footerCalc, this._fixed, this._headerFixed, this._headerTooltip, this._headerTooltipVariant, this._template);
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { DscTableColumn, DscTableColumnBuilder, DscTableComponent };
//# sourceMappingURL=sidsc-components-dsc-table.mjs.map
