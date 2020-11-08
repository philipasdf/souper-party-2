import { NgModule } from '@angular/core';
import { QuickTypingRoutingModule } from './quick-typing-routing.module';
import { QuickTypingPreparerComponent } from './quick-typing-preparer/quick-typing-preparer.component';

@NgModule({
    imports: [
        QuickTypingRoutingModule
    ],
    declarations: [QuickTypingPreparerComponent]
})
export class QuickTypingModule {}