import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicaoLista } from './requisicao-lista';

describe('RequisicaoLista', () => {
  let component: RequisicaoLista;
  let fixture: ComponentFixture<RequisicaoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisicaoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(RequisicaoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
