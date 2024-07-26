import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    // const player = new Plyr('#player');
  }
}
