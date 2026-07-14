import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicaoForm } from './requisicao-form';

describe('RequisicaoForm', () => {
  let component: RequisicaoForm;
  let fixture: ComponentFixture<RequisicaoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisicaoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RequisicaoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
