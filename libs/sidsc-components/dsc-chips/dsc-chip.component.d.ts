/**
 * Componente de Chip (Tag) customizado para o Design System DSC.
 * Permite adicionar, remover, editar e reorganizar chips, além de suportar autocomplete e drag-and-drop.
 */
import { EventEmitter, QueryList } from '@angular/core';
import { MatChipEditedEvent, MatChipEvent, MatChipGridChange, MatChipListboxChange, MatChipOption, MatChipSelectionChange } from '@angular/material/chips';
import { DscChipItem } from './shared/dsc-chip-item';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Formatos disponíveis para a imagem do chip.
 */
export type DscChipsImageShape = 'rounded' | 'rectangular' | 'square';
/**
 * Tamanho do chips.
 */
export type DscChipsSize = 'standard' | 'small';
/**
 * Variantes do chip.
 */
export type DscChipsVariant = 'simple' | 'select' | 'input' | 'autocomplete' | 'form-control' | 'drag-drop';
export declare class DscChipComponent implements ControlValueAccessor {
    /** Lista de chips exibidos no componente. */
    chipItems: DscChipItem[];
    /** Rótulo do campo de chips. */
    label: string;
    /** Placeholder do campo de entrada para adicionar novos chips. */
    placeholder: string;
    /** Variante do comportamento do chip. */
    variant: DscChipsVariant;
    formControlName?: string;
    private _imageShape;
    private _chipsSize;
    /** Formato da imagem associada ao chip. */
    get shape(): DscChipsImageShape;
    set shape(value: DscChipsImageShape);
    /** tamanho do chip. */
    get size(): DscChipsSize;
    set size(value: DscChipsSize);
    /**
     * Retorna a classe CSS correspondente ao formato da imagem do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClass(chip: DscChipItem): string;
    /**
     * Retorna a classe CSS correspondente ao tamanho do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClassSize(chip: DscChipItem): string;
    /**
     * Retorna a classe CSS correspondente ao tamanho do ícone do chip.
     * @param chip O chip para obter a classe.
     * @returns Classe CSS correspondente.
     */
    getComputedClassIconSize(chip: DscChipItem): string;
    /** Define se múltiplos chips podem ser adicionados. */
    multiple: boolean;
    /** Exibe botão de fechar nos chips. */
    closeButton: boolean;
    /** Evento emitido quando um chip é destruído. */
    destroyed: EventEmitter<MatChipEvent>;
    /** Evento emitido quando um chip é removido. */
    removed: EventEmitter<MatChipEvent>;
    /** Evento emitido quando há mudança de seleção em um chip. */
    selectionChange: EventEmitter<MatChipSelectionChange>;
    /** Evento emitido quando um chip é editado. */
    edited: EventEmitter<MatChipEditedEvent>;
    /** Evento emitido quando há alteração na lista de chips. */
    change: EventEmitter<MatChipListboxChange | MatChipGridChange>;
    chipSelected: EventEmitter<any>;
    chipOptions: QueryList<MatChipOption>;
    chipRemoveFocusIndex: number | null;
    /** Controle do campo de formulário. */
    chipCtrl: FormControl<any>;
    /** Lista de itens filtrados para autocomplete. */
    filteredItems: Observable<DscChipItem[]>;
    /** Permite adicionar chips ao perder o foco. */
    addOnBlur: boolean;
    onChange: (value: any) => void;
    onTouched: () => void;
    writeValue(value: DscChipItem[]): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    onChipClick(index: number): void;
    /**
     * Remove um chip da lista.
     * @param chip O chip a ser removido.
     */
    remove(chip: DscChipItem): void;
    /**
     * Adiciona um chip selecionado no autocomplete.
     * @param event Evento de seleção.
     */
    selected(event: MatAutocompleteSelectedEvent): void;
    /**
     * Filtra os itens disponíveis para autocomplete com base na entrada do usuário.
     */
    filterItems(): void;
    /**
     * Adiciona um novo chip à lista.
     * @param event Evento contendo o valor do novo chip e o campo de entrada associado.
     */
    add(event: {
        value: string;
        input: {
            value: string;
        };
    }): void;
    /**
     * Edita um chip existente.
     * @param chip O chip a ser editado.
     * @param event Evento contendo o novo valor do chip.
     */
    edit(chip: DscChipItem, event: MatChipEditedEvent): void;
    /**
     * Reorganiza os chips por meio de drag-and-drop.
     * @param event Evento de arrastar e soltar.
     */
    drop(event: CdkDragDrop<DscChipItem[]>): void;
    onChipKeydown(event: KeyboardEvent, index: number): void;
    private findNextEnabledIndex;
    onOptionFocusIn(event: FocusEvent, index: number): void;
    onOptionFocusOut(event: FocusEvent, index: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscChipComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscChipComponent, "dsc-chip", never, { "chipItems": { "alias": "chipItems"; "required": false; }; "label": { "alias": "label"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; "formControlName": { "alias": "formControlName"; "required": false; }; "shape": { "alias": "shape"; "required": false; }; "size": { "alias": "size"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "closeButton": { "alias": "closeButton"; "required": false; }; }, { "destroyed": "destroyed"; "removed": "removed"; "selectionChange": "selectionChange"; "edited": "edited"; "change": "change"; "chipSelected": "chipSelected"; }, never, never, true, never>;
}
