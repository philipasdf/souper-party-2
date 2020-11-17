import { NgModule } from '@angular/core';
import { QuickTypingRoutingModule } from './quick-typing-routing.module';
import { QuickTypingPreparerComponent } from './quick-typing-preparer/quick-typing-preparer.component';
import { QuickTypingGameComponent } from './quick-typing-game/quick-typing-game.component';

@NgModule({
  imports: [QuickTypingRoutingModule],
  declarations: [QuickTypingPreparerComponent, QuickTypingGameComponent],
})
export class QuickTypingModule {}
