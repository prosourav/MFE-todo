import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { StatsComponent } from './stats.component';

export default async function bootstrapStatsElement() {
  const app = await createApplication({ providers: [] });

  const StatsElement = createCustomElement(StatsComponent, {
    injector: app.injector,
  });

  if (!customElements.get('angular-stats')) {
    customElements.define('angular-stats', StatsElement);
    console.log('✅ angular-stats custom element registered');
  }
}