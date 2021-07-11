import { AudioFiles } from './models/audiofiles.model';
import { AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        top: '0',
        bottom: '0'
      })),
      state('closed', style({
        top: '100%',
        bottom: '100%'
      })),
      transition('open => closed', [
        animate('200ms')
      ]),
      transition('closed => open', [
        animate('300ms')
      ]),
    ]),
  ],
})


export class PlayerComponent implements OnInit, AfterViewInit {

  isPlaying: boolean = false;
  audioFiles: AudioFiles[] = [];
  loopMode: string = 'repeat';
  isLibraryView: boolean = false;
  currentAudio!: AudioFiles;
  audioTimes: { currentTime: string, endTime: string } = { currentTime: '0:00', endTime: '0:00' };
  progressWidth: number = 0;
  volume: number = 100;
  showVolume: boolean = false;

  @ViewChild('audio', { static: false }) audioPlayer!: ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

  }


  handlePlayPause() {
    if (!this.currentAudio) {
      return;
    }
    this.isPlaying ? this.pauseAudio() : this.playAudio();
  }

  handleLibraryView() {
    this.isLibraryView = !this.isLibraryView;
  }

  handleAudioFiles(files: AudioFiles[]) {
    this.audioFiles = files;
  }

  handleAudioPlay(file: AudioFiles) {
    this.currentAudio = file;
    this.convertFileToAudioBlob(file.audioFile);
  }

  convertFileToAudioBlob(file: File) {
    let blobReader = new FileReader();
    blobReader.readAsArrayBuffer(file);

    blobReader.onload = () => {
      let blob: Blob = new Blob([new Uint8Array((blobReader.result as ArrayBuffer))]);
      let blobURL: string = URL.createObjectURL(blob);
      this.audioPlayer.nativeElement.src = blobURL;
      this.playAudio();
      this.isPlaying = true;
    };

    blobReader.onerror = (error) => {
      return error;
    };
  }

  playAudio() {
    if (!this.currentAudio) {
      return;
    }
    this.isPlaying = true;
    this.audioPlayer.nativeElement.play();
  }

  pauseAudio() {
    if (!this.currentAudio) {
      return;
    }
    this.isPlaying = false;
    this.audioPlayer.nativeElement.pause();
  }

  get audioDuration() {
    return this.audioPlayer.nativeElement.duration
  }

  set audioTime(time: any) {
    this.audioPlayer.nativeElement.currentTime = time;
  }

  handlePrev() {
    const index = this.audioFiles.findIndex(item => item === this.currentAudio);
    if (index >= 1) {
      this.handleAudioPlay(this.audioFiles[index - 1]);
    } else if (index === 0) {
      this.handleAudioPlay(this.audioFiles[this.audioFiles.length - 1]);
    }
  }

  handleNext() {
    const index = this.audioFiles.findIndex(item => item === this.currentAudio);
    if (index < this.audioFiles.length - 1) {
      this.handleAudioPlay(this.audioFiles[index + 1]);
    } else if (index === (this.audioFiles.length - 1)) {
      this.handleAudioPlay(this.audioFiles[0]);
    }
  }

  get artist() {
    return this.currentAudio?.artist || 'None';
  }

  get title() {
    return this.currentAudio?.title || 'None';
  }

  get album() {
    return this.currentAudio?.album || 'None';
  }


  timeUpdate(e: any) {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    this.progressWidth = (currentTime / duration) * 100;


    let totalMin = Math.floor(duration / 60);
    let totalSec: any = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    let currentMin = Math.floor(currentTime / 60);
    let currentSec: any = Math.floor(currentTime % 60);
    if (currentSec < 10) {
      currentSec = `0${currentSec}`;
    }
    this.audioTimes = { currentTime: `${currentMin}:${currentSec}`, endTime: `${totalMin}:${totalSec}` };
  }

  handleLoopMode() {
    switch (this.loopMode) {
      case 'repeat':
        this.loopMode = 'repeat_one';
        break;
      case 'repeat_one':
        this.loopMode = 'shuffle';
        break;
      case 'shuffle':
        this.loopMode = 'repeat';
        break;
      default:
        break;
    }
  }

  onAudioEnded(e: any) {
    switch (this.loopMode) {
      case 'repeat':
        this.handleNext();
        break;
      case 'repeat_one':
        this.audioTime = 0;
        this.playAudio();
        break;
      case 'shuffle':
        let randIndex = Math.floor((Math.random() * this.audioFiles?.length) + 1);
        let musicIndex = this.audioFiles.findIndex(item => item === this.currentAudio);
        do {
          randIndex = Math.floor((Math.random() * this.audioFiles?.length) + 1);
        } while (musicIndex == randIndex);
        this.loadAudioByIndex(randIndex);
        break;
      default:
        break;
    }
  }


  loadAudioByIndex(index: number) {
    if (index === this.audioFiles.length - 1 || index < 0) {
      index = 0;
    }
    this.handleAudioPlay(this.audioFiles[index]);
  }

  onProgressChange(progressbar: any, e: any) {
    if (!this.currentAudio) {
      return;
    }

    let progressWidth = progressbar?.clientWidth;
    let clickedOffsetX = e?.offsetX;
    let time = (clickedOffsetX / progressWidth) * this.audioDuration;
    this.audioTime = time;
    this.progressWidth = (time / this.audioDuration) * 100;
    this.playAudio();
  }




  getCoverImage() {
    if (!this.currentAudio || !this.currentAudio?.picture || this.currentAudio?.picture === 'Unknown') {
      return 'assets/images/music_disk.png';
    }
    const picture = this.currentAudio.picture; // create reference to track art
    let base64String = "";
    for (var i = 0; i < picture?.data?.length; i++) {
      base64String += String.fromCharCode(picture?.data[i]);
    }
    const imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
    return imageUri;
  }

  handleVolumeView() {
    this.showVolume = !this.showVolume;
  }

  handleVolumeClose() {
    this.showVolume = false;
  }

  handleVolumeLevels() {
    this.audioPlayer.nativeElement.volume  = this.volume / 100;
  }


  handleClickOutSide() {
    this.showVolume = false;
  }
}
