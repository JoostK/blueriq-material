import { OverlayContainer } from '@angular/cdk/overlay';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NumericOperator } from '@blueriq/angular/lists';
import { TableFilterModule } from '../table.filter.module';
import { FilterCandidate } from '../types';

import { ListNumericFilterComponent } from './list-numeric-filter.component';

describe('ListNumericFilterComponent', () => {
  let component: ListNumericFilterComponent;
  let fixture: ComponentFixture<ListNumericFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TableFilterModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNumericFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('default filter is equals and show unknown', () => {
    component.candidate = new FilterCandidate();
    fixture.detectChanges();

    const operation = fixture.nativeElement.querySelector('.mat-select-value-text').innerText;
    expect(operation).toBe('Equal to');
    const showUnknown = fixture.nativeElement.querySelector('.mat-checkbox-input').getAttribute('aria-checked');
    expect(showUnknown).toBe('true');
  });

  it('select greater than or equals operator', fakeAsync(() => {
    component.candidate = new FilterCandidate();
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const selectOptions = getMatOptionsFromOverlay();
    expect(selectOptions).toBeTruthy();
    selectOptions[2].click();
    // Verify
    expect(component.operator).toBe(NumericOperator.GreaterThanEquals);
  }));

  function getMatOptionsFromOverlay(): HTMLElement[] {
    const _containerElement = TestBed.get(OverlayContainer).getContainerElement();
    return Array.from(_containerElement.querySelectorAll('mat-option'));
  }
});
