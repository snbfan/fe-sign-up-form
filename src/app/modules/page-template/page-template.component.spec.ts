import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageTemplateComponent } from './page-template.component';

describe('PageTemplateComponent', () => {
  let fixture: ComponentFixture<any>;
  let component: PageTemplateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PageTemplateComponent
      ],
    }).overrideComponent(PageTemplateComponent, {
      set: {
        template: '<h1>Test PageTemplateComponent</h1>',
      },
    });

    fixture = TestBed.createComponent(PageTemplateComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have properties set up correctly', () => {
    expect(component.sign).toEqual('Sign');
    expect(component.up).toEqual('Up');
  });
});
