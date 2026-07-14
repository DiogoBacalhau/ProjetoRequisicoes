import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursoLista } from './recurso-lista';

describe('RecursoLista', () => {
  let component: RecursoLista;
  let fixture: ComponentFixture<RecursoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecursoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
