import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteCategoryModal } from './delete-category-modal';

describe('DeleteCategoryModal', () => {
  let component: DeleteCategoryModal;
  let fixture: ComponentFixture<DeleteCategoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCategoryModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCategoryModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
