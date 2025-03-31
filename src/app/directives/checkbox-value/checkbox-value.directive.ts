import { Directive, effect, ElementRef, inject, input } from '@angular/core';

// Forces the checkbox to be fully controlled by a value, rather than letting it control its own state.
@Directive({
  selector: 'input[type=checkbox][appCheckboxValue]',
  host: {
    '(change)': 'this.elementRef.nativeElement.checked = this.checked()', // Ignore the change event
  },
})
export class CheckboxValueDirective {
  protected readonly elementRef = inject<ElementRef>(ElementRef);

  checked = input.required<boolean>({
    alias: 'appCheckboxValue',
  });

  #markChecked = effect(() => {
    this.elementRef.nativeElement.checked = this.checked();
  });
}
