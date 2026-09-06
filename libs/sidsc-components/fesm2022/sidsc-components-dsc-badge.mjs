import * as i0 from '@angular/core';
import { ANIMATION_MODULE_TYPE, Directive, Inject, Optional, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import * as i1 from '@angular/cdk/a11y';

let nextId = 0;
class DscBadgeDirective {
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

/**
 * Generated bundle index. Do not edit.
 */

export { DscBadgeDirective };
//# sourceMappingURL=sidsc-components-dsc-badge.mjs.map
