import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaksList } from './taks-list';

describe('TaksList', () => {
  let component: TaksList;
  let fixture: ComponentFixture<TaksList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaksList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaksList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
