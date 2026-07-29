import { ANIMATION_MODULE_TYPE, Directive, Inject, Input, Optional } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
let nextId = 0;
export class DscBadgeDirective {
    get variantDark() {
        return this._variantDark;
    }
    set variantDark(val) {
        this._variantDark = coerceBooleanProperty(val);
    }
    get overlap() {
        return this._overlap;
    }
    set overlap(val) {
        this._overlap = coerceBooleanProperty(val);
    }
    get content() {
        return this._content;
    }
    set content(newContent) {
        this._updateRenderedContent(newContent);
    }
    get description() {
        return this._description;
    }
    set description(newDescription) {
        this._updateDescription(newDescription);
    }
    get hidden() {
        return this._hidden;
    }
    set hidden(val) {
        this._hidden = coerceBooleanProperty(val);
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    constructor(_document, _elementRef, _renderer, _ariaDescriber, _interactivityChecker, _ngZone, _animationMode) {
        this._document = _document;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ariaDescriber = _ariaDescriber;
        this._interactivityChecker = _interactivityChecker;
        this._ngZone = _ngZone;
        this._animationMode = _animationMode;
        this._isInitialized = false;
        this._id = nextId++;
        this.size = 'standard';
        this.variant = 'danger';
        this._variantDark = false;
        this._overlap = true;
        this.position = 'above after';
        this._disabled = false;
    }
    ngOnInit() {
        this._clearExistingBadges();
        if (this.content && !this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
            this._updateRenderedContent(this.content);
        }
        this._isInitialized = true;
    }
    isAbove() {
        return this.position.indexOf('below') === -1;
    }
    isAfter() {
        return this.position.indexOf('before') === -1;
    }
    _updateRenderedContent(newContent) {
        const newContentNormalized = `${newContent ?? ''}`.trim();
        if (this._isInitialized && newContentNormalized && !this._badgeElement)
            this._badgeElement = this._createBadgeElement();
        if (this._badgeElement && this.size !== 'small')
            this._badgeElement.textContent = newContentNormalized;
        this._content = newContentNormalized;
    }
    _createBadgeElement() {
        const badgeElement = this._renderer.createElement('span');
        badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
        badgeElement.setAttribute('aria-hidden', 'true');
        badgeElement.classList.add('mat-badge-content');
        if (this._animationMode === 'NoopAnimations')
            badgeElement.classList.add('_mat-animation-noopable');
        this._elementRef.nativeElement.appendChild(badgeElement);
        if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
            this._ngZone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    badgeElement.classList.add('mat-badge-active');
                });
            });
        }
        else {
            badgeElement.classList.add('mat-badge-active');
        }
        return badgeElement;
    }
    _clearExistingBadges() {
        const badges = this._elementRef.nativeElement.querySelectorAll(':scope > .badge-content');
        for (const badgeElement of Array.from(badges))
            if (badgeElement !== this._badgeElement)
                badgeElement.remove();
    }
    _updateDescription(newDescription) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
        if (!newDescription || this._isHostInteractive())
            this._removeInlineDescription();
        this._description = newDescription;
        if (this._isHostInteractive()) {
            this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
        }
        else {
            this._updateInlineDescription();
        }
    }
    _isHostInteractive() {
        return this._interactivityChecker.isFocusable(this._elementRef.nativeElement, { ignoreVisibility: true });
    }
    _removeInlineDescription() {
        this._inlineBadgeDescription?.remove();
        this._inlineBadgeDescription = undefined;
    }
    _updateInlineDescription() {
        if (!this._inlineBadgeDescription) {
            this._inlineBadgeDescription = this._document.createElement('span');
            this._inlineBadgeDescription.classList.add('cdk-visually-hidden');
        }
        this._inlineBadgeDescription.textContent = this.description;
        this._badgeElement?.appendChild(this._inlineBadgeDescription);
    }
    ngOnDestroy() {
        if (this._renderer.destroyNode) {
            this._renderer.destroyNode(this._badgeElement);
            this._inlineBadgeDescription?.remove();
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscBadgeDirective, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.AriaDescriber }, { token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: DscBadgeDirective, isStandalone: true, selector: "[dscBadge]", inputs: { disabled: ["dscBadgeDisabled", "disabled"], size: ["dscBadgeSize", "size"], variant: ["dscBadgeVariant", "variant"], variantDark: ["dscBadgeVariantDark", "variantDark"], overlap: ["dscBadgeOverlap", "overlap"], position: ["dscBadgePosition", "position"], content: ["dscBadge", "content"], description: ["dscBadgeDescription", "description"], hidden: ["dscBadgeHidden", "hidden"] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-variantDark": "variantDark", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"standard\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge--accent": "variant === \"accent\"", "class.mat-badge--danger": "variant === \"danger\"", "class.mat-badge--highlight": "variant === \"highlight\"", "class.mat-badge--information": "variant === \"information\"", "class.mat-badge--success": "variant === \"success\"", "class.mat-badge--warning": "variant === \"warning\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: DscBadgeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dscBadge]',
                    standalone: true,
                    inputs: ['disabled: dscBadgeDisabled'],
                    host: {
                        'class': 'mat-badge',
                        '[class.mat-badge-overlap]': 'overlap',
                        '[class.mat-badge-variantDark]': 'variantDark',
                        '[class.mat-badge-above]': 'isAbove()',
                        '[class.mat-badge-below]': '!isAbove()',
                        '[class.mat-badge-before]': '!isAfter()',
                        '[class.mat-badge-after]': 'isAfter()',
                        '[class.mat-badge-small]': 'size === "small"',
                        '[class.mat-badge-medium]': 'size === "standard"',
                        '[class.mat-badge-large]': 'size === "large"',
                        '[class.mat-badge--accent]': 'variant === "accent"',
                        '[class.mat-badge--danger]': 'variant === "danger"',
                        '[class.mat-badge--highlight]': 'variant === "highlight"',
                        '[class.mat-badge--information]': 'variant === "information"',
                        '[class.mat-badge--success]': 'variant === "success"',
                        '[class.mat-badge--warning]': 'variant === "warning"',
                        '[class.mat-badge-hidden]': 'hidden || !content',
                        '[class.mat-badge-disabled]': 'disabled',
                    },
                }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.AriaDescriber }, { type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { size: [{
                type: Input,
                args: ['dscBadgeSize']
            }], variant: [{
                type: Input,
                args: ['dscBadgeVariant']
            }], variantDark: [{
                type: Input,
                args: ['dscBadgeVariantDark']
            }], overlap: [{
                type: Input,
                args: ['dscBadgeOverlap']
            }], position: [{
                type: Input,
                args: ['dscBadgePosition']
            }], content: [{
                type: Input,
                args: ['dscBadge']
            }], description: [{
                type: Input,
                args: ['dscBadgeDescription']
            }], hidden: [{
                type: Input,
                args: ['dscBadgeHidden']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNjLWJhZGdlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3NpZHNjLWNvbXBvbmVudHMvZHNjLWJhZGdlL2RzYy1iYWRnZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixTQUFTLEVBRVQsTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBRVQsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTVFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBRTNDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQTBDZixNQUFNLE9BQU8saUJBQWlCO0lBYzVCLElBQ0ksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBQ0QsSUFBSSxXQUFXLENBQUMsR0FBaUI7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBR0QsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxHQUFpQjtRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFLRCxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLFVBQThDO1FBQ3hELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBSUQsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxjQUFzQjtRQUNwQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUlELElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsR0FBaUI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBSUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFVO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUlELFlBQzRCLFNBQW1CLEVBQ3JDLFdBQW9DLEVBQ3BDLFNBQW9CLEVBQ3BCLGNBQTZCLEVBQzdCLHFCQUEyQyxFQUMzQyxPQUFlLEVBQzRCLGNBQXVCO1FBTmhELGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDckMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFzQjtRQUMzQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQzRCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBakZwRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQU12QixRQUFHLEdBQVcsTUFBTSxFQUFFLENBQUM7UUFFUixTQUFJLEdBQWlCLFVBQVUsQ0FBQztRQUU3QixZQUFPLEdBQW9CLFFBQVEsQ0FBQztRQVN0RCxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQVM5QixhQUFRLEdBQVksSUFBSSxDQUFDO1FBRU4sYUFBUSxHQUFxQixhQUFhLENBQUM7UUEwQzlELGNBQVMsR0FBWSxLQUFLLENBQUM7SUFVL0IsQ0FBQztJQUVMLFFBQVE7UUFDTixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLHNCQUFzQixDQUFDLFVBQThDO1FBQzNFLE1BQU0sb0JBQW9CLEdBQVcsR0FBRyxVQUFVLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEUsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFBRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ3hILElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU87WUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztRQUN2RyxJQUFJLENBQUMsUUFBUSxHQUFHLG9CQUFvQixDQUFDO0lBQ3ZDLENBQUM7SUFFTyxtQkFBbUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUscUJBQXFCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pFLFlBQVksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGdCQUFnQjtZQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELElBQUksT0FBTyxxQkFBcUIsS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtZQUMzRixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDbEMscUJBQXFCLENBQUMsR0FBRyxFQUFFO29CQUN6QixZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNqRCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFFLENBQUM7UUFDM0YsS0FBSyxNQUFNLFlBQVksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUFFLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxhQUFhO2dCQUFFLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoSCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsY0FBc0I7UUFDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFBRSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNsRixJQUFJLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQztRQUVuQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzlFO2FBQU07WUFDTCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFTyxrQkFBa0I7UUFDeEIsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RyxDQUFDO0lBRU8sd0JBQXdCO1FBQzlCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsU0FBUyxDQUFDO0lBQzNDLENBQUM7SUFFTyx3QkFBd0I7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUNqQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzFGLENBQUM7K0dBOUtVLGlCQUFpQixrQkE2RWxCLFFBQVEsdUpBTUkscUJBQXFCO21HQW5GaEMsaUJBQWlCOzs0RkFBakIsaUJBQWlCO2tCQTFCN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE1BQU0sRUFBRSxDQUFDLDRCQUE0QixDQUFDO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLDJCQUEyQixFQUFFLFNBQVM7d0JBQ3RDLCtCQUErQixFQUFFLGFBQWE7d0JBQzlDLHlCQUF5QixFQUFFLFdBQVc7d0JBQ3RDLHlCQUF5QixFQUFFLFlBQVk7d0JBQ3ZDLDBCQUEwQixFQUFFLFlBQVk7d0JBQ3hDLHlCQUF5QixFQUFFLFdBQVc7d0JBQ3RDLHlCQUF5QixFQUFFLGtCQUFrQjt3QkFDN0MsMEJBQTBCLEVBQUUscUJBQXFCO3dCQUNqRCx5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLDJCQUEyQixFQUFFLHNCQUFzQjt3QkFDbkQsMkJBQTJCLEVBQUUsc0JBQXNCO3dCQUNuRCw4QkFBOEIsRUFBRSx5QkFBeUI7d0JBQ3pELGdDQUFnQyxFQUFFLDJCQUEyQjt3QkFDN0QsNEJBQTRCLEVBQUUsdUJBQXVCO3dCQUNyRCw0QkFBNEIsRUFBRSx1QkFBdUI7d0JBQ3JELDBCQUEwQixFQUFFLG9CQUFvQjt3QkFDaEQsNEJBQTRCLEVBQUUsVUFBVTtxQkFDekM7aUJBRUY7OzBCQThFSSxNQUFNOzJCQUFDLFFBQVE7OzBCQU1mLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQXpFcEIsSUFBSTtzQkFBMUIsS0FBSzt1QkFBQyxjQUFjO2dCQUVLLE9BQU87c0JBQWhDLEtBQUs7dUJBQUMsaUJBQWlCO2dCQUdwQixXQUFXO3NCQURkLEtBQUs7dUJBQUMscUJBQXFCO2dCQVV4QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsaUJBQWlCO2dCQVNHLFFBQVE7c0JBQWxDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUdyQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsVUFBVTtnQkFZYixXQUFXO3NCQURkLEtBQUs7dUJBQUMscUJBQXFCO2dCQVd4QixNQUFNO3NCQURULEtBQUs7dUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBBcmlhRGVzY3JpYmVyLCBJbnRlcmFjdGl2aXR5Q2hlY2tlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxubGV0IG5leHRJZCA9IDA7XG5cbmV4cG9ydCB0eXBlIERzY0JhZGdlUG9zaXRpb24gPVxuICB8ICdhYm92ZSBhZnRlcidcbiAgfCAnYWJvdmUgYmVmb3JlJ1xuICB8ICdiZWxvdyBiZWZvcmUnXG4gIHwgJ2JlbG93IGFmdGVyJ1xuICB8ICdiZWZvcmUnXG4gIHwgJ2FmdGVyJ1xuICB8ICdhYm92ZSdcbiAgfCAnYmVsb3cnO1xuXG5leHBvcnQgdHlwZSBEc2NCYWRnZVNpemUgPSAnc21hbGwnIHwgJ3N0YW5kYXJkJyB8ICdsYXJnZSc7XG5cbmV4cG9ydCB0eXBlIERzY0JhZGdlVmFyaWFudCA9ICdhY2NlbnQnIHwgJ2RhbmdlcicgfCAnaGlnaGxpZ2h0JyB8ICdpbmZvcm1hdGlvbicgfCAnc3VjY2VzcycgfCAnd2FybmluZyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tkc2NCYWRnZV0nLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IGRzY0JhZGdlRGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYmFkZ2UnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW92ZXJsYXBdJzogJ292ZXJsYXAnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLXZhcmlhbnREYXJrXSc6ICd2YXJpYW50RGFyaycsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWJvdmVdJzogJ2lzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVsb3ddJzogJyFpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlZm9yZV0nOiAnIWlzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWZ0ZXJdJzogJ2lzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utc21hbGxdJzogJ3NpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbWVkaXVtXSc6ICdzaXplID09PSBcInN0YW5kYXJkXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWxhcmdlXSc6ICdzaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLS1hY2NlbnRdJzogJ3ZhcmlhbnQgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLS1kYW5nZXJdJzogJ3ZhcmlhbnQgPT09IFwiZGFuZ2VyXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLS1oaWdobGlnaHRdJzogJ3ZhcmlhbnQgPT09IFwiaGlnaGxpZ2h0XCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLS1pbmZvcm1hdGlvbl0nOiAndmFyaWFudCA9PT0gXCJpbmZvcm1hdGlvblwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS0tc3VjY2Vzc10nOiAndmFyaWFudCA9PT0gXCJzdWNjZXNzXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLS13YXJuaW5nXSc6ICd2YXJpYW50ID09PSBcIndhcm5pbmdcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtaGlkZGVuXSc6ICdoaWRkZW4gfHwgIWNvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG5cbn0pXG5leHBvcnQgY2xhc3MgRHNjQmFkZ2VEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBfaW5saW5lQmFkZ2VEZXNjcmlwdGlvbjogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2VTaXplJykgc2l6ZTogRHNjQmFkZ2VTaXplID0gJ3N0YW5kYXJkJztcblxuICBASW5wdXQoJ2RzY0JhZGdlVmFyaWFudCcpIHZhcmlhbnQ6IERzY0JhZGdlVmFyaWFudCA9ICdkYW5nZXInO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2VWYXJpYW50RGFyaycpXG4gIGdldCB2YXJpYW50RGFyaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmFyaWFudERhcms7XG4gIH1cbiAgc2V0IHZhcmlhbnREYXJrKHZhbDogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fdmFyaWFudERhcmsgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF92YXJpYW50RGFyazogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2VPdmVybGFwJylcbiAgZ2V0IG92ZXJsYXAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXA7XG4gIH1cbiAgc2V0IG92ZXJsYXAodmFsOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0KCdkc2NCYWRnZVBvc2l0aW9uJykgcG9zaXRpb246IERzY0JhZGdlUG9zaXRpb24gPSAnYWJvdmUgYWZ0ZXInO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2UnKVxuICBnZXQgY29udGVudCgpOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIHNldCBjb250ZW50KG5ld0NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJlZENvbnRlbnQobmV3Q29udGVudCk7XG4gIH1cblxuICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgfVxuICBzZXQgZGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIHRoaXMuX3VwZGF0ZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uITogc3RyaW5nO1xuXG4gIEBJbnB1dCgnZHNjQmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW47XG4gIH1cblxuICBzZXQgaGlkZGVuKHZhbDogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5faGlkZGVuID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cblxuICBwcml2YXRlIF9oaWRkZW4hOiBib29sZWFuO1xuXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9pbnRlcmFjdGl2aXR5Q2hlY2tlcjogSW50ZXJhY3Rpdml0eUNoZWNrZXIsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmdcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50ICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRDb250ZW50KHRoaXMuY29udGVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgaXNBZnRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWZvcmUnKSA9PT0gLTE7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSZW5kZXJlZENvbnRlbnQobmV3Q29udGVudDogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IG5ld0NvbnRlbnROb3JtYWxpemVkOiBzdHJpbmcgPSBgJHtuZXdDb250ZW50ID8/ICcnfWAudHJpbSgpO1xuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkICYmIG5ld0NvbnRlbnROb3JtYWxpemVkICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIGlmICh0aGlzLl9iYWRnZUVsZW1lbnQgJiYgdGhpcy5zaXplICE9PSAnc21hbGwnKSB0aGlzLl9iYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBuZXdDb250ZW50Tm9ybWFsaXplZDtcbiAgICB0aGlzLl9jb250ZW50ID0gbmV3Q29udGVudE5vcm1hbGl6ZWQ7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWJhZGdlLWNvbnRlbnQnKTtcbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tYXQtYW5pbWF0aW9uLW5vb3BhYmxlJyk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWJhZGdlLWFjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWJhZGdlLWFjdGl2ZScpO1xuICAgIH1cbiAgICByZXR1cm4gYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcygpIHtcbiAgICBjb25zdCBiYWRnZXMgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnOnNjb3BlID4gLmJhZGdlLWNvbnRlbnQnLCk7XG4gICAgZm9yIChjb25zdCBiYWRnZUVsZW1lbnQgb2YgQXJyYXkuZnJvbShiYWRnZXMpKSBpZiAoYmFkZ2VFbGVtZW50ICE9PSB0aGlzLl9iYWRnZUVsZW1lbnQpIGJhZGdlRWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgaWYgKCFuZXdEZXNjcmlwdGlvbiB8fCB0aGlzLl9pc0hvc3RJbnRlcmFjdGl2ZSgpKSB0aGlzLl9yZW1vdmVJbmxpbmVEZXNjcmlwdGlvbigpO1xuICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICBpZiAodGhpcy5faXNIb3N0SW50ZXJhY3RpdmUoKSkge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5kZXNjcmliZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlSW5saW5lRGVzY3JpcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pc0hvc3RJbnRlcmFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7IGlnbm9yZVZpc2liaWxpdHk6IHRydWUgfSk7XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVJbmxpbmVEZXNjcmlwdGlvbigpIHtcbiAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uPy5yZW1vdmUoKTtcbiAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlSW5saW5lRGVzY3JpcHRpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCdjZGstdmlzdWFsbHktaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5fYmFkZ2VFbGVtZW50Py5hcHBlbmRDaGlsZCh0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZSkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUodGhpcy5fYmFkZ2VFbGVtZW50KTtcbiAgICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24/LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgfVxufVxuIl19