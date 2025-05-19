import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorComponentComponent } from './translator-component.component';

describe('TranslatorComponentComponent', () => {
  let component: TranslatorComponentComponent;
  let fixture: ComponentFixture<TranslatorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
