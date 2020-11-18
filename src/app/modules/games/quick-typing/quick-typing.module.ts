import { NgModule } from '@angular/core';
import { QuickTypingRoutingModule } from './quick-typing-routing.module';
import { QuickTypingPreparerComponent } from './quick-typing-preparer/quick-typing-preparer.component';
import { QuickTypingGameComponent } from './quick-typing-game/quick-typing-game.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, QuickTypingRoutingModule],
  declarations: [QuickTypingPreparerComponent, QuickTypingGameComponent],
})
export class QuickTypingModule {}
