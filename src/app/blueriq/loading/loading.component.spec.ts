import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingService } from '@blueriq/angular';
import { FormattingModule } from '@blueriq/angular/formatting';
import { BlueriqTestingModule } from '@blueriq/angular/testing';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../material/material.module';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent while not loading', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule, // or NoopAnimationsModule
        BlueriqTestingModule,
        FormsModule,
        FormattingModule.forRoot()
      ],
      providers: [LoadingService]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and have a default state of starting', () => {
    expect(component).toBeTruthy();
    component.state$.subscribe(value => expect(value).toBe('starting'));
  });

  it('function ngOnDestroy should be complete and unsubscribe', () => {
    // Init
    spyOn(BehaviorSubject.prototype, 'complete');
    spyOn(BehaviorSubject.prototype, 'unsubscribe');

    // Sut
    component.ngOnDestroy();

    // Verify
    expect(BehaviorSubject.prototype.complete).toHaveBeenCalled();
    expect(BehaviorSubject.prototype.unsubscribe).toHaveBeenCalled();
  });

  it('function onInitialize should be done starting', () => {
    // Init
    spyOn(BehaviorSubject.prototype, 'next');

    // Sut
    component.onInitialize();

    // Verify
    expect(BehaviorSubject.prototype.next).toHaveBeenCalledWith(false);
  });

  it('function ngOnInit should set state to idle when not starting', () => {
    // Init
    component.starting$ = new BehaviorSubject<boolean>(false);

    // Sut
    component.ngOnInit();

    // Verify
    component.state$.subscribe(value => expect(value).toBe('idle'));
  });

});

class MockLoadingService {
  get loading$(): Observable<boolean> {
    return Observable.of(true);
  }
}

describe('LoadingComponent while loading', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule, // or NoopAnimationsModule
        BlueriqTestingModule,
        FormsModule,
        FormattingModule.forRoot()
      ],
      providers: [{ provide: LoadingService, useClass: MockLoadingService }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and have a default state of starting', () => {
    expect(component).toBeTruthy();
    component.state$.subscribe(value => expect(value).toBe('starting'));
  });

  it('function ngOnInit should set state to loading when starting', () => {
    // Init
    component.starting$ = new BehaviorSubject<boolean>(false);

    // Sut
    component.ngOnInit();

    // Verify
    component.state$.subscribe(value => expect(value).toBe('loading'));
  });

});