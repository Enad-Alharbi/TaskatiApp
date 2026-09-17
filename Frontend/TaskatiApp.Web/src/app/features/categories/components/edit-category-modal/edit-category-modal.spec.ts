import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCategoryModal } from './edit-category-modal';

describe('EditCategoryModal', () => {
  let component: EditCategoryModal;
  let fixture: ComponentFixture<EditCategoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategoryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
