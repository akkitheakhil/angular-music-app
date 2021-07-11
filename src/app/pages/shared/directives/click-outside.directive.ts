import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef?.nativeElement?.contains(target);
    if (!clickedInside) {
      setTimeout(() => {
        this.clickOutside.emit();
      }, 1000);
    }
  }
}
