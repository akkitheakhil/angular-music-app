import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wave-loader',
  templateUrl: './wave-loader.component.html',
  styleUrls: ['./wave-loader.component.scss']
})
export class WaveLoaderComponent implements OnInit {

  constructor() { }

  @Input() canAnimate: boolean = false;

  ngOnInit(): void {
  }

  get needAniamtion() {
    return this.canAnimate ? 'running' : 'paused'
  }


}
