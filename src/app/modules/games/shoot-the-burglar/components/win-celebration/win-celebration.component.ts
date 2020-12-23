import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/shared/models/player.model';

@Component({
  selector: 'app-win-celebration',
  templateUrl: './win-celebration.component.html',
  styleUrls: ['./win-celebration.component.css'],
})
export class WinCelebrationComponent implements OnInit {
  @Input()
  winners: Player[];

  constructor() {}

  ngOnInit(): void {}
}
