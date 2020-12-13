import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribingComponent } from './components/unsubscribing/unsubscribing.component';
import { AvatarComponent } from './images/components/avatar/avatar.component';

@NgModule({
  declarations: [UnsubscribingComponent, AvatarComponent],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, TranslateModule, AvatarComponent],
})
export class SharedModule {}
