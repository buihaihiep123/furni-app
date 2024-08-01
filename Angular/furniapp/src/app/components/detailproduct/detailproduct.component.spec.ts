import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailproductComponent } from './detailproduct.component';

describe('DetailproductComponent', () => {
  let component: DetailproductComponent;
  let fixture: ComponentFixture<DetailproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailproductComponent]
    });
    fixture = TestBed.createComponent(DetailproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
