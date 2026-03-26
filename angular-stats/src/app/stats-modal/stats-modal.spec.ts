import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsModal } from './stats-modal';

describe('StatsModal', () => {
  let component: StatsModal;
  let fixture: ComponentFixture<StatsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
