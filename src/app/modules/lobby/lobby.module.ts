import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';
import { LobbyGameGuideComponent } from './lobby-game-guide/lobby-game-guide.component';
import { LobbyParentComponent } from './lobby-parent/lobby-parent.component';
import { LobbyAvatarCreatorComponent } from './lobby-avatar-creator/lobby-avatar-creator.component';

@NgModule({
  declarations: [LobbyHomeComponent, LobbyGameGuideComponent, LobbyParentComponent, LobbyAvatarCreatorComponent],
  imports: [SharedModule, LobbyRoutingModule],
})
export class LobbyModule {}
