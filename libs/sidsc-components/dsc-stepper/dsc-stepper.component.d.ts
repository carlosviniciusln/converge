import { EventEmitter, OnInit, ChangeDetectorRef, Renderer2, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { DscStepperModel } from './shared/dsc-stepper.model';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as i0 from "@angular/core";
/**
 * Componente DSC Stepper baseado no Angular Material.
 * Permite a navegação entre etapas e integração com rotas.
 */
export declare class DscStepperComponent implements OnInit, AfterViewInit {
    private router;
    private route;
    private breakpointObserver;
    private renderer;
    private cdRef;
    private elRef;
    /** Indica se o tooltip deve ser exibido com base no tamanho da tela */
    showTooltip$: Observable<boolean>;
    /** Modelo do stepper que contém os passos e configurações */
    stepper: DscStepperModel;
    /** Evento emitido quando há uma mudança na seleção do step */
    selectionChange: EventEmitter<StepperSelectionEvent>;
    /** Evento emitido quando o índice do step selecionado muda */
    selectedIndexChange: EventEmitter<number>;
    stepperModelChange: EventEmitter<DscStepperModel>;
    matSteps: QueryList<MatStep>;
    constructor(router: Router, route: ActivatedRoute, breakpointObserver: BreakpointObserver, renderer: Renderer2, cdRef: ChangeDetectorRef, elRef: ElementRef);
    /** Inicializa o componente e escuta mudanças na rota */
    ngOnInit(): void;
    ngAfterViewInit(): void;
    notifyStepperModelChange(newValue: DscStepperModel): void;
    /** Escuta eventos de navegação para atualizar o índice selecionado */
    private listenToRouteChanges;
    private skipValidSteps;
    /** Atualiza o índice do step selecionado com base na rota ativa */
    private updateSelectedIndex;
    /**
     * Manipula a mudança de etapa.
     * @param event Evento de seleção do stepper
     */
    onStepChange(event: StepperSelectionEvent): void;
    /**
     * Navega para a rota correspondente ao step selecionado.
     * @param index Índice do step selecionado
     */
    private navigateToStep;
    /**
     * Aplica personalizações ao stepper, como ocultar linhas e labels.
     * @param selectedIndex Índice do step selecionado
     */
    private applyStepCustomizations;
    /**
     * Controla a visibilidade de elementos do DOM com base no índice do step selecionado.
     * Esconde a linha horizontal do stepper apenas se `noHorizontalLine` for `true`
     * e se a etapa anterior (`selectedIndex - 1`) for não editável (`editable = false`).
     *
     * @param selector Seletor CSS dos elementos a serem modificados (exemplo: '.mat-stepper-horizontal-line')
     * @param selectedIndex Índice do step atualmente selecionado
     */
    private toggleElementsVisibility;
    /**
     * Obtém o elemento DOM correspondente ao stepper atual.
     */
    private getStepperElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<DscStepperComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DscStepperComponent, "dsc-stepper", never, { "stepper": { "alias": "stepper"; "required": false; }; }, { "selectionChange": "selectionChange"; "selectedIndexChange": "selectedIndexChange"; "stepperModelChange": "stepperModelChange"; }, never, never, true, never>;
}
