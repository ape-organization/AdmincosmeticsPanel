import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubCategory } from './all-sub-category';

describe('AllSubCategory', () => {
  let component: AllSubCategory;
  let fixture: ComponentFixture<AllSubCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSubCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSubCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
