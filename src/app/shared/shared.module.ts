import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribingComponent } from './components/unsubscribing/unsubscribing.component';

@NgModule({
  declarations: [UnsubscribingComponent],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, TranslateModule],
})
export class SharedModule {}
