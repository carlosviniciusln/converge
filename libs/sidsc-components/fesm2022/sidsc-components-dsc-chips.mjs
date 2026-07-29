import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Component, ViewEncapsulation, Input, Output, ViewChildren } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@angular/material/chips';
import { MatChipOption, MatChipsModule } from '@angular/material/chips';
import * as i3 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i4 from '@angular/cdk/drag-drop';
import { moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import * as i5 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i6 from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import * as i8 from '@angular/forms';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import * as i7 from '@angular/material/core';

/**
 * Componente de Chip (Tag) customizado para o Design System DSC.
 * Permite adicionar, remover, editar e reorganizar chips, além de suportar autocomplete e drag-and-drop.
 */
class DscChipComponent {
    constructor() {
        /** Lista de chips exibidos no componente. */
        this.chipItems = [];
        /** Rótulo do campo de chips. */
        this.label = 'Chips';
        /** Placeholder do campo de entrada para adicionar novos chips. */
        this.placeholder = 'Adicionar chip...';
        /** Variante do comportamento do chip. */
        this.variant = 'simple';
        this._imageShape = 'square';
        this._chipsSize = 'standard';
        /** Define se múltiplos chips podem ser adicionados. */
        this.multiple = false;
        /** Exibe botão de fechar nos chips. */
        this.closeButton = false;
        /** Evento emitido quando um chip é destruído. */
        this.destroyed = new EventEmitter;
        /** Evento emitido quando um chip é removido. */
        this.removed = new EventEmitter;
        /** Evento emitido quando há mudança de seleção em um chip. */
        this.selectionChange = new EventEmitter;
        /** Evento emitido quando um chip é editado. */
        this.edited = new EventEmitter;
        /** Evento emitido quando há alteração na lista de chips. */
        this.change = new EventEmitter;
        this.chipSelected = new EventEmitter();
        // Índice do chip cujo botão de remover está focado (para aria-hidden)
        this.chipRemoveFocusIndex = null;
        /** Controle do campo de formulário. */
        this.chipCtrl = new FormControl();
        /** Lista de itens filtrados para autocomplete. */
        this.filteredItems = new Observable();
        /** Permite adicionar chips ao perder o foco. */
        this.addOnBlur = true;
        this.onChange = (value) => { };
        this.onTouched = () => { };
    }
    /** Formato da imagem associada ao chip. */
    get shape() {
        return this._imageShape;
    }
    set shape(value) {
        this._imageShape = value || 'square';
    }
    /** tamanho do chip. */
    get size() {
        return this._chipsSize;
    }
    set size(value) {
        this._chipsSize = value || 'standard';
    }
    /**
     * Retorna a classe CSS correspondente ao formato da imagem do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClass(chip) {
        return `chip__size-${chip.size || this._chipsSize}-avatar-${chip.imageShape || this._imageShape}`;
    }
    /**
     * Retorna a classe CSS correspondente ao tamanho do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClassSize(chip) {
        return `chip__size-${chip.size || this._chipsSize}`;
    }
    /**
     * Retorna a classe CSS correspondente ao tamanho do ícone do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClassIconSize(chip) {
        return `chip__size-${chip.size || this._chipsSize}-icon`;
    }
    writeValue(value) {
        if (value) {
            this.chipItems = value;
            this.chipCtrl.setValue(value);
            this.chipItems.forEach((chip, index) => {
                chip.value = index;
            });
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        isDisabled ? this.chipCtrl.disable() : this.chipCtrl.enable();
    }
    onChipClick(index) {
        if (!this.multiple) {
            this.chipItems.forEach(chip => chip.selected = false);
            this.chipItems[index].selected = true;
            this.chipItems[index].value = index;
        }
    }
    /**
     * Remove um chip da lista.
     * @param chip O chip a ser removido.
     */
    remove(chip) {
        const index = this.chipItems.indexOf(chip);
        if (index >= 0) {
            this.chipItems.splice(index, 1);
            this.chipCtrl.setValue(this.chipItems);
            this.onChange(this.chipItems);
            this.removed?.emit();
        }
    }
    /**
     * Adiciona um chip selecionado no autocomplete.
     * @param event Evento de seleção.
     */
    selected(event) {
        const selectedItem = event.option.value;
        this.chipItems.push({
            label: selectedItem.label,
            icon: selectedItem.icon,
            avatar: selectedItem.avatar,
            altAvatar: selectedItem.altAvatar,
            selected: selectedItem.selected
        });
    }
    /**
     * Filtra os itens disponíveis para autocomplete com base na entrada do usuário.
     */
    filterItems() {
        this.filteredItems = new Observable(observer => {
            observer.next(this.chipItems.filter(item => item.label.toLowerCase().includes(this.chipCtrl.value?.toLowerCase() || '')));
        });
    }
    /**
     * Adiciona um novo chip à lista.
     * @param event Evento contendo o valor do novo chip e o campo de entrada associado.
     */
    add(event) {
        if (this.variant != 'autocomplete') {
            const inputValue = event.value.trim();
            if (inputValue) {
                this.chipItems.push({ label: inputValue });
                this.chipCtrl.setValue(this.chipItems);
                this.onChange(this.chipItems);
            }
        }
        event.input.value = '';
    }
    /**
     * Edita um chip existente.
     * @param chip O chip a ser editado.
     * @param event Evento contendo o novo valor do chip.
     */
    edit(chip, event) {
        const value = event.value.trim();
        if (!value) {
            this.remove(chip);
            return;
        }
        const index = this.chipItems.indexOf(chip);
        if (index >= 0) {
            this.chipItems[index].label = value;
        }
    }
    /**
     * Reorganiza os chips por meio de drag-and-drop.
     * @param event Evento de arrastar e soltar.
     */
    drop(event) {
        moveItemInArray(this.chipItems, event.previousIndex, event.currentIndex);
    }
    onChipKeydown(event, index) {
        if (event.key !== 'Tab')
            return;
        const chips = this.chipOptions?.toArray() ?? [];
        const len = chips.length;
        if (len === 0)
            return;
        const backward = event.shiftKey;
        const tentativeIndex = backward ? index - 1 : index + 1;
        if (tentativeIndex < 0 || tentativeIndex >= len) {
            return;
        }
        const target = this.findNextEnabledIndex(chips, tentativeIndex, backward);
        if (target === -1) {
            return;
        }
        event.preventDefault();
        chips[target].focus();
    }
    findNextEnabledIndex(chips, startIndex, backward) {
        const step = backward ? -1 : 1;
        let i = startIndex;
        while (i >= 0 && i < chips.length) {
            if (!chips[i].disabled)
                return i;
            i += step;
        }
        return -1;
    }
    onOptionFocusIn(event, index) {
        const target = event.target;
        if (!target)
            return;
        const removeButton = target.closest('button[matChipRemove]');
        if (removeButton) {
            this.chipRemoveFocusIndex = index;
            return;
        }
        if (this.chipRemoveFocusIndex === index) {
            this.chipRemoveFocusIndex = null;
        }
    }
    onOptionFocusOut(event, index) {
        if (this.chipRemoveFocusIndex === index) {
            this.chipRemoveFocusIndex = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscChipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: DscChipComponent, isStandalone: true, selector: "dsc-chip", inputs: { chipItems: "chipItems", label: "label", placeholder: "placeholder", variant: "variant", formControlName: "formControlName", shape: "shape", size: "size", multiple: "multiple", closeButton: "closeButton" }, outputs: { destroyed: "destroyed", removed: "removed", selectionChange: "selectionChange", edited: "edited", change: "change", chipSelected: "chipSelected" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DscChipComponent),
                multi: true,
            }
        ], viewQueries: [{ propertyName: "chipOptions", predicate: MatChipOption, descendants: true }], ngImport: i0, template: "<div class=\"content\">\n\n  <!--  simple  -->\n  <div *ngIf=\"variant == 'simple'\">\n    <mat-chip-set>\n      <mat-chip *ngFor=\"let chip of chipItems\" class=\"chip chip--option\" [disabled]=\"chip.disabled\"\n        (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n        [ngClass]=\"['chip__size', getComputedClassSize(chip)]\"\n        tabindex=\"0\"\n        role=\"option\">\n        <div class=\"chip__content\">\n          <img *ngIf=\"chip.avatar\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n            [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n          <mat-icon *ngIf=\"chip.icon && !chip.selected\" \n            [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n          <span class=\"chip__label\">{{ chip.label }}</span>\n        </div>\n        <button *ngIf='closeButton' [attr.tabindex]=\"-1\" matChipRemove type=\"button\" [attr.aria-label]=\"'Bot\u00E3o remover'\">\n          <mat-icon class='chip__close-icon'>close</mat-icon>\n        </button>\n      </mat-chip>\n    </mat-chip-set>\n  </div>\n\n  <!--  select  -->\n  <div *ngIf=\"variant == 'select'\">\n    <mat-chip-listbox aria-label=\"Chip selection\" role=\"presentation\" [multiple]='multiple'>\n      <mat-chip-option id=\"chip-option\" name=\"chip-option\"  *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n        (selectionChange)=\"chip.selected = $event.selected; selectionChange.emit($event)\" [selected]=\"chip.selected\"\n        [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n        (click)=\"onChipClick(i)\"\n        [value]=\"chip.value\"\n        [ngClass]=\"['chip__size', getComputedClassSize(chip)]\"\n        role=\"option\"\n        (keydown)=\"onChipKeydown($event, i)\">\n        <div class=\"chip__content\" [attr.aria-hidden]=\"chipRemoveFocusIndex === i ? 'true' : null\">\n          <img *ngIf=\"chip.avatar && !chip.selected\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n            [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n          <mat-icon *ngIf=\"chip.icon && !chip.selected\"\n            [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n          <span class=\"chip__label\">{{ chip.label }}</span>\n        </div>\n        <button \n         *ngIf='closeButton' [attr.tabindex]=\"0\" matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\" >\n          <mat-icon class='chip__close-icon'>close</mat-icon>\n        </button>\n      </mat-chip-option>\n    </mat-chip-listbox>\n  </div>\n\n  <!--  autocomplete  -->\n  <div *ngIf=\"variant == 'autocomplete'\">\n    <form>\n      <mat-form-field class=\"chip--form\">\n        <mat-label>{{ label }}</mat-label>\n        <mat-chip-grid #chipGrid aria-label=\"Chip selection\">\n          <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n            [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n            [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n            <div class='chip__autocomplete-unit'>\n              <mat-icon *ngIf=\"chip.icon\"\n                [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n              <img *ngIf=\"chip.avatar\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n                [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n              <span class=\"chip__label\">{{ chip.label }}</span>\n            </div>\n            <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n              <mat-icon class='chip__close-icon'>close</mat-icon>\n            </button>\n          </mat-chip-row>\n        </mat-chip-grid>\n\n        <input [placeholder]=\"placeholder\" #chipInput [formControl]=\"chipCtrl\" [matChipInputFor]=\"chipGrid\"\n          [matAutocomplete]=\"auto\" [matChipInputSeparatorKeyCodes]=\"[13]\" (matChipInputTokenEnd)=\"add($event)\"\n          (input)=\"filterItems()\" />\n\n        <mat-autocomplete #auto=\"matAutocomplete\" (optionSelected)=\"selected($event)\">\n          <mat-option *ngFor=\"let chip of filteredItems | async\" [value]=\"chip\" class=\"chip chip--option\">\n            <span>{{ chip.label }}</span>\n          </mat-option>\n        </mat-autocomplete>\n      </mat-form-field>\n    </form>\n  </div>\n\n  <!--  input  -->\n  <div *ngIf=\"variant == 'input'\">\n    <mat-form-field class=\"chip--form\">\n      <mat-label>{{ label }}</mat-label>\n      <mat-chip-grid #chipGrid aria-label=\"Chips\">\n        <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n          [editable]=\"true\" [disabled]=\"chip.disabled\" (edited)=\"edit(chip, $event); edited.emit()\"\n          [aria-description]=\"'pressione enter para editar' + chip.label\" class=\"chip chip--option\"\n          [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n          <span class=\"chip__label\">{{ chip.label }}</span>\n          <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n            <mat-icon [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">close</mat-icon>\n          </button>\n        </mat-chip-row>\n        <input placeholder=\"Adicionar chip...\" [matChipInputFor]=\"chipGrid\" [matChipInputSeparatorKeyCodes]=\"[13]\"\n          [matChipInputAddOnBlur]=\"addOnBlur\" (matChipInputTokenEnd)=\"add($event)\" />\n      </mat-chip-grid>\n    </mat-form-field>\n  </div>\n\n  <!--  form control  -->\n  <div *ngIf=\"variant == 'form-control'\">\n    <mat-form-field class=\"chip--form\">\n      <mat-label>{{ label }}</mat-label>\n      <mat-chip-grid #chipGrid [formControl]=\"chipCtrl\" aria-label=\"chips\">\n        <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n          [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n          [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n          <span class=\"chip__label\">{{ chip.label }}</span>\n          <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n            <mat-icon [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">close</mat-icon>\n          </button>\n        </mat-chip-row>\n      </mat-chip-grid>\n      <input placeholder=\"Adicionar chip...\" [matChipInputFor]=\"chipGrid\" (matChipInputTokenEnd)=\"add($event)\" />\n    </mat-form-field>\n  </div>\n\n  <!--  drag and drop  -->\n  <div *ngIf=\"variant == 'drag-drop'\">\n    <mat-chip-set class=\"drag-drop-box\" cdkDropList cdkDropListOrientation=\"horizontal\"\n      (cdkDropListDropped)=\"drop($event)\">\n      <mat-chip class=\"drag-drop-chip\" cdkDrag *ngFor=\"let chip of chipItems; let i = index\" [disabled]=\"chip.disabled\"\n        class=\"chip chip--option\" [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n        <span class=\"chip__label\">{{ chip.label }}</span>\n      </mat-chip>\n    </mat-chip-set>\n  </div>\n</div>\n", styles: ["@media (max-width: 599.98px){.content{padding:var(--dsc-spacing-larger) var(--dsc-spacing-smaller)}}.content .chip{display:flex;align-items:center;border-radius:var(--dsc-border-radius-small);background-color:var(--dsc-color-bg-neutral-1);border:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-4);cursor:pointer;padding-right:8px}.content .chip--option{transition:background .3s}.content .chip--option:hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-hover),transparent 92%)!important}.content .chip--option:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-active),transparent 84%)!important}.content .chip--option.mat-mdc-chip-selected{background-color:var(--dsc-color-bg-highlight-1)!important;border-color:var(--dsc-color-border-highlight-1)}.content .chip--option.mat-mdc-chip-selected .chip__label{color:var(--dsc-color-content-highlight-2);font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\"}.content .chip--form{width:100%}.content .chip__content{display:flex;align-items:center}.content .chip__size-standard{height:32px}.content .chip__size-standard-avatar{margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-highlight-5);display:flex;align-items:center;justify-content:center}.content .chip__size-standard-avatar-square{height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small)}.content .chip__size-standard-avatar-rectangular{height:20px;width:32px;border-radius:var(--dsc-border-radius-quark)}.content .chip__size-standard-avatar-rounded{height:20px;width:20px;border-radius:var(--dsc-border-radius-pill)}.content .chip__size-standard-icon{color:var(--dsc-color-bg-highlight-5);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);display:flex;align-items:center;justify-content:center}.content .chip__size-small{height:24px}.content .chip__size-small-avatar{margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-highlight-5);display:flex;align-items:center;justify-content:center}.content .chip__size-small-avatar-square{height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}.content .chip__size-small-avatar-rectangular{height:16px;width:26px;border-radius:var(--dsc-border-radius-quark)}.content .chip__size-small-avatar-rounded{height:16px;width:16px;border-radius:var(--dsc-border-radius-pill)}.content .chip__size-small-icon{color:var(--dsc-color-bg-highlight-5);height:var(--dsc-icon-size-quark);width:var(--dsc-icon-size-quark);display:flex;align-items:center;justify-content:center;font-size:var(--dsc-icon-size-nano)}.content .chip__close-icon{color:var(--dsc-color-bg-highlight-6)}.content .chip__label{padding:0 var(--dsc-spacing-nano);font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-highlight-1);display:flex;align-items:center}.content .chip__autocomplete-unit{display:flex}.content .chip--option:hover .chip__label,.content .chip--option:active .chip__label{color:var(--dsc-color-content-highlight-2)}.content .chip--option:hover .chip__icon,.content .chip--option:active .chip__icon{color:var(--dsc-color-bg-highlight-6)}.content .drag-drop-box.cdk-drag-animating,.content .drag-drop-chip .cdk-drop-list-dragging{transition:transform .25s cubic-bezier(0,0,.2,1)}.mat-mdc-chip-focus-overlay{background:var(--dsc-color-bg-neutral-1)!important}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--dsc-color-bg-highlight-6)!important}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--dsc-color-bg-neutral-1)!important}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:0!important;padding-right:0!important}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:var(--dsc-spacing-nano)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--dsc-color-state-bg-disabled-1)!important;border-color:var(--dsc-color-state-border-disabled-1)!important;opacity:unset!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__label{color:var(--dsc-color-state-content-disabled-1)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__icon{color:var(--dsc-color-state-bg-disabled-5)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__avatar{opacity:var(--dsc-opacity-40)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--dsc-color-state-bg-disabled-5)!important}.mdc-evolution-chip__action--trailing[role=button]{outline:none!important;box-shadow:none!important;border:2px solid transparent;border-radius:var(--dsc-border-radius-small)}.mat-mdc-chip:focus-within{outline:4px solid black!important;border-radius:var(--dsc-border-radius-small)}.mdc-evolution-chip__action--trailing[role=button]:focus-visible{border-color:#000!important}.mat-mdc-chip:has(.mdc-evolution-chip__action--trailing[role=button]:focus-visible){outline:none!important}.chip.chip__size-small .chip__label{font:var(--dsc-typography-caption-standard-400)}.chip.chip--option.mat-mdc-chip-selected.chip__size-small .chip__label{font:var(--dsc-typography-caption-standard-600)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }, { kind: "ngmodule", type: MatChipsModule }, { kind: "component", type: i2.MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["color", "disabled", "disableRipple", "tabIndex", "role", "id", "aria-label", "aria-description", "value", "removable", "highlighted"], outputs: ["removed", "destroyed"], exportAs: ["matChip"] }, { kind: "component", type: i2.MatChipGrid, selector: "mat-chip-grid", inputs: ["tabIndex", "disabled", "placeholder", "required", "value", "errorStateMatcher"], outputs: ["change", "valueChange"] }, { kind: "directive", type: i2.MatChipInput, selector: "input[matChipInputFor]", inputs: ["matChipInputFor", "matChipInputAddOnBlur", "matChipInputSeparatorKeyCodes", "placeholder", "id", "disabled"], outputs: ["matChipInputTokenEnd"], exportAs: ["matChipInput", "matChipInputFor"] }, { kind: "component", type: i2.MatChipListbox, selector: "mat-chip-listbox", inputs: ["tabIndex", "multiple", "aria-orientation", "selectable", "compareWith", "required", "hideSingleSelectionIndicator", "value"], outputs: ["change"] }, { kind: "component", type: i2.MatChipOption, selector: "mat-basic-chip-option, [mat-basic-chip-option], mat-chip-option, [mat-chip-option]", inputs: ["color", "disabled", "disableRipple", "tabIndex", "selectable", "selected"], outputs: ["selectionChange"] }, { kind: "directive", type: i2.MatChipRemove, selector: "[matChipRemove]" }, { kind: "component", type: i2.MatChipRow, selector: "mat-chip-row, [mat-chip-row], mat-basic-chip-row, [mat-basic-chip-row]", inputs: ["color", "disabled", "disableRipple", "tabIndex", "editable"], outputs: ["edited"] }, { kind: "component", type: i2.MatChipSet, selector: "mat-chip-set", inputs: ["disabled", "role"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i3.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: DragDropModule }, { kind: "directive", type: i4.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i4.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i5.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i5.MatLabel, selector: "mat-label" }, { kind: "ngmodule", type: MatAutocompleteModule }, { kind: "component", type: i6.MatAutocomplete, selector: "mat-autocomplete", inputs: ["disableRipple", "hideSingleSelectionIndicator"], exportAs: ["matAutocomplete"] }, { kind: "component", type: i7.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { kind: "directive", type: i6.MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", exportAs: ["matAutocompleteTrigger"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i8.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i8.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i8.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscChipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'dsc-chip', standalone: true, encapsulation: ViewEncapsulation.None, imports: [CommonModule, MatChipsModule, MatIconModule, DragDropModule, MatFormFieldModule, MatAutocompleteModule, ReactiveFormsModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DscChipComponent),
                            multi: true,
                        }
                    ], template: "<div class=\"content\">\n\n  <!--  simple  -->\n  <div *ngIf=\"variant == 'simple'\">\n    <mat-chip-set>\n      <mat-chip *ngFor=\"let chip of chipItems\" class=\"chip chip--option\" [disabled]=\"chip.disabled\"\n        (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n        [ngClass]=\"['chip__size', getComputedClassSize(chip)]\"\n        tabindex=\"0\"\n        role=\"option\">\n        <div class=\"chip__content\">\n          <img *ngIf=\"chip.avatar\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n            [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n          <mat-icon *ngIf=\"chip.icon && !chip.selected\" \n            [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n          <span class=\"chip__label\">{{ chip.label }}</span>\n        </div>\n        <button *ngIf='closeButton' [attr.tabindex]=\"-1\" matChipRemove type=\"button\" [attr.aria-label]=\"'Bot\u00E3o remover'\">\n          <mat-icon class='chip__close-icon'>close</mat-icon>\n        </button>\n      </mat-chip>\n    </mat-chip-set>\n  </div>\n\n  <!--  select  -->\n  <div *ngIf=\"variant == 'select'\">\n    <mat-chip-listbox aria-label=\"Chip selection\" role=\"presentation\" [multiple]='multiple'>\n      <mat-chip-option id=\"chip-option\" name=\"chip-option\"  *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n        (selectionChange)=\"chip.selected = $event.selected; selectionChange.emit($event)\" [selected]=\"chip.selected\"\n        [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n        (click)=\"onChipClick(i)\"\n        [value]=\"chip.value\"\n        [ngClass]=\"['chip__size', getComputedClassSize(chip)]\"\n        role=\"option\"\n        (keydown)=\"onChipKeydown($event, i)\">\n        <div class=\"chip__content\" [attr.aria-hidden]=\"chipRemoveFocusIndex === i ? 'true' : null\">\n          <img *ngIf=\"chip.avatar && !chip.selected\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n            [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n          <mat-icon *ngIf=\"chip.icon && !chip.selected\"\n            [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n          <span class=\"chip__label\">{{ chip.label }}</span>\n        </div>\n        <button \n         *ngIf='closeButton' [attr.tabindex]=\"0\" matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\" >\n          <mat-icon class='chip__close-icon'>close</mat-icon>\n        </button>\n      </mat-chip-option>\n    </mat-chip-listbox>\n  </div>\n\n  <!--  autocomplete  -->\n  <div *ngIf=\"variant == 'autocomplete'\">\n    <form>\n      <mat-form-field class=\"chip--form\">\n        <mat-label>{{ label }}</mat-label>\n        <mat-chip-grid #chipGrid aria-label=\"Chip selection\">\n          <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n            [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n            [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n            <div class='chip__autocomplete-unit'>\n              <mat-icon *ngIf=\"chip.icon\"\n                [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">{{ chip.icon }}</mat-icon>\n              <img *ngIf=\"chip.avatar\" [src]=\"chip.avatar\" [alt]=\"chip.altAvatar || 'Avatar'\"\n                [ngClass]=\"['chip__size', getComputedClass(chip)]\" />\n              <span class=\"chip__label\">{{ chip.label }}</span>\n            </div>\n            <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n              <mat-icon class='chip__close-icon'>close</mat-icon>\n            </button>\n          </mat-chip-row>\n        </mat-chip-grid>\n\n        <input [placeholder]=\"placeholder\" #chipInput [formControl]=\"chipCtrl\" [matChipInputFor]=\"chipGrid\"\n          [matAutocomplete]=\"auto\" [matChipInputSeparatorKeyCodes]=\"[13]\" (matChipInputTokenEnd)=\"add($event)\"\n          (input)=\"filterItems()\" />\n\n        <mat-autocomplete #auto=\"matAutocomplete\" (optionSelected)=\"selected($event)\">\n          <mat-option *ngFor=\"let chip of filteredItems | async\" [value]=\"chip\" class=\"chip chip--option\">\n            <span>{{ chip.label }}</span>\n          </mat-option>\n        </mat-autocomplete>\n      </mat-form-field>\n    </form>\n  </div>\n\n  <!--  input  -->\n  <div *ngIf=\"variant == 'input'\">\n    <mat-form-field class=\"chip--form\">\n      <mat-label>{{ label }}</mat-label>\n      <mat-chip-grid #chipGrid aria-label=\"Chips\">\n        <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n          [editable]=\"true\" [disabled]=\"chip.disabled\" (edited)=\"edit(chip, $event); edited.emit()\"\n          [aria-description]=\"'pressione enter para editar' + chip.label\" class=\"chip chip--option\"\n          [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n          <span class=\"chip__label\">{{ chip.label }}</span>\n          <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n            <mat-icon [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">close</mat-icon>\n          </button>\n        </mat-chip-row>\n        <input placeholder=\"Adicionar chip...\" [matChipInputFor]=\"chipGrid\" [matChipInputSeparatorKeyCodes]=\"[13]\"\n          [matChipInputAddOnBlur]=\"addOnBlur\" (matChipInputTokenEnd)=\"add($event)\" />\n      </mat-chip-grid>\n    </mat-form-field>\n  </div>\n\n  <!--  form control  -->\n  <div *ngIf=\"variant == 'form-control'\">\n    <mat-form-field class=\"chip--form\">\n      <mat-label>{{ label }}</mat-label>\n      <mat-chip-grid #chipGrid [formControl]=\"chipCtrl\" aria-label=\"chips\">\n        <mat-chip-row *ngFor=\"let chip of chipItems; let i = index\" (removed)=\"remove(chip)\" (destroyed)=\"destroyed.emit()\"\n          [disabled]=\"chip.disabled\" class=\"chip chip--option\"\n          [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n          <span class=\"chip__label\">{{ chip.label }}</span>\n          <button matChipRemove type=\"button\" [attr.aria-label]=\"'remove ' + chip.label\">\n            <mat-icon [ngClass]=\"['chip__size', getComputedClassIconSize(chip)]\">close</mat-icon>\n          </button>\n        </mat-chip-row>\n      </mat-chip-grid>\n      <input placeholder=\"Adicionar chip...\" [matChipInputFor]=\"chipGrid\" (matChipInputTokenEnd)=\"add($event)\" />\n    </mat-form-field>\n  </div>\n\n  <!--  drag and drop  -->\n  <div *ngIf=\"variant == 'drag-drop'\">\n    <mat-chip-set class=\"drag-drop-box\" cdkDropList cdkDropListOrientation=\"horizontal\"\n      (cdkDropListDropped)=\"drop($event)\">\n      <mat-chip class=\"drag-drop-chip\" cdkDrag *ngFor=\"let chip of chipItems; let i = index\" [disabled]=\"chip.disabled\"\n        class=\"chip chip--option\" [ngClass]=\"['chip__size', getComputedClassSize(chip)]\">\n        <span class=\"chip__label\">{{ chip.label }}</span>\n      </mat-chip>\n    </mat-chip-set>\n  </div>\n</div>\n", styles: ["@media (max-width: 599.98px){.content{padding:var(--dsc-spacing-larger) var(--dsc-spacing-smaller)}}.content .chip{display:flex;align-items:center;border-radius:var(--dsc-border-radius-small);background-color:var(--dsc-color-bg-neutral-1);border:var(--dsc-border-width-hairline) solid var(--dsc-color-border-neutral-4);cursor:pointer;padding-right:8px}.content .chip--option{transition:background .3s}.content .chip--option:hover{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-hover),transparent 92%)!important}.content .chip--option:active{background-color:color-mix(in srgb,var(--dsc-color-state-bg-highlight-active),transparent 84%)!important}.content .chip--option.mat-mdc-chip-selected{background-color:var(--dsc-color-bg-highlight-1)!important;border-color:var(--dsc-color-border-highlight-1)}.content .chip--option.mat-mdc-chip-selected .chip__label{color:var(--dsc-color-content-highlight-2);font:var(--dsc-typography-text-small-600);font-feature-settings:\"ss01\"}.content .chip--form{width:100%}.content .chip__content{display:flex;align-items:center}.content .chip__size-standard{height:32px}.content .chip__size-standard-avatar{margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-highlight-5);display:flex;align-items:center;justify-content:center}.content .chip__size-standard-avatar-square{height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small)}.content .chip__size-standard-avatar-rectangular{height:20px;width:32px;border-radius:var(--dsc-border-radius-quark)}.content .chip__size-standard-avatar-rounded{height:20px;width:20px;border-radius:var(--dsc-border-radius-pill)}.content .chip__size-standard-icon{color:var(--dsc-color-bg-highlight-5);height:var(--dsc-icon-size-small);width:var(--dsc-icon-size-small);display:flex;align-items:center;justify-content:center}.content .chip__size-small{height:24px}.content .chip__size-small-avatar{margin-left:var(--dsc-spacing-nano);color:var(--dsc-color-bg-highlight-5);display:flex;align-items:center;justify-content:center}.content .chip__size-small-avatar-square{height:var(--dsc-icon-size-nano);width:var(--dsc-icon-size-nano)}.content .chip__size-small-avatar-rectangular{height:16px;width:26px;border-radius:var(--dsc-border-radius-quark)}.content .chip__size-small-avatar-rounded{height:16px;width:16px;border-radius:var(--dsc-border-radius-pill)}.content .chip__size-small-icon{color:var(--dsc-color-bg-highlight-5);height:var(--dsc-icon-size-quark);width:var(--dsc-icon-size-quark);display:flex;align-items:center;justify-content:center;font-size:var(--dsc-icon-size-nano)}.content .chip__close-icon{color:var(--dsc-color-bg-highlight-6)}.content .chip__label{padding:0 var(--dsc-spacing-nano);font:var(--dsc-typography-text-small-400);font-feature-settings:\"ss01\";color:var(--dsc-color-content-highlight-1);display:flex;align-items:center}.content .chip__autocomplete-unit{display:flex}.content .chip--option:hover .chip__label,.content .chip--option:active .chip__label{color:var(--dsc-color-content-highlight-2)}.content .chip--option:hover .chip__icon,.content .chip--option:active .chip__icon{color:var(--dsc-color-bg-highlight-6)}.content .drag-drop-box.cdk-drag-animating,.content .drag-drop-chip .cdk-drop-list-dragging{transition:transform .25s cubic-bezier(0,0,.2,1)}.mat-mdc-chip-focus-overlay{background:var(--dsc-color-bg-neutral-1)!important}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--dsc-color-bg-highlight-6)!important}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--dsc-color-bg-neutral-1)!important}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:0!important;padding-right:0!important}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:var(--dsc-spacing-nano)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--dsc-color-state-bg-disabled-1)!important;border-color:var(--dsc-color-state-border-disabled-1)!important;opacity:unset!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__label{color:var(--dsc-color-state-content-disabled-1)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__icon{color:var(--dsc-color-state-bg-disabled-5)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .chip__avatar{opacity:var(--dsc-opacity-40)!important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--dsc-color-state-bg-disabled-5)!important}.mdc-evolution-chip__action--trailing[role=button]{outline:none!important;box-shadow:none!important;border:2px solid transparent;border-radius:var(--dsc-border-radius-small)}.mat-mdc-chip:focus-within{outline:4px solid black!important;border-radius:var(--dsc-border-radius-small)}.mdc-evolution-chip__action--trailing[role=button]:focus-visible{border-color:#000!important}.mat-mdc-chip:has(.mdc-evolution-chip__action--trailing[role=button]:focus-visible){outline:none!important}.chip.chip__size-small .chip__label{font:var(--dsc-typography-caption-standard-400)}.chip.chip--option.mat-mdc-chip-selected.chip__size-small .chip__label{font:var(--dsc-typography-caption-standard-600)}\n"] }]
        }], propDecorators: { chipItems: [{
                type: Input
            }], label: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], variant: [{
                type: Input
            }], formControlName: [{
                type: Input
            }], shape: [{
                type: Input
            }], size: [{
                type: Input
            }], multiple: [{
                type: Input
            }], closeButton: [{
                type: Input
            }], destroyed: [{
                type: Output
            }], removed: [{
                type: Output
            }], selectionChange: [{
                type: Output
            }], edited: [{
                type: Output
            }], change: [{
                type: Output
            }], chipSelected: [{
                type: Output
            }], chipOptions: [{
                type: ViewChildren,
                args: [MatChipOption]
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { DscChipComponent };
//# sourceMappingURL=sidsc-components-dsc-chips.mjs.map
