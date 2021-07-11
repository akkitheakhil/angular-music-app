import { AudioFiles } from '../../models/audiofiles.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare var jsmediatags: any;

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  @Output() back = new EventEmitter();
  @Output() audioFiles = new EventEmitter();
  @Output() playAudio = new EventEmitter<AudioFiles>();

  @Input() libraryAudioFiles: AudioFiles[] = [];

  constructor() { }


  ngOnInit(): void {
  }

  handleBack() {
    this.back.emit();
  }

  fileCapture(files: any) {
    const audioFiles = [...files?.target?.files];
    let audio: AudioFiles;
    const unknown = 'Unknown';
    audioFiles.forEach(async (file: File) => {
      const auidoTags = await this.getTagsFromFile(file);
      const audioSrc = file;
      audio = {
        audioFile: audioSrc,
        filename: file.name,
        album: auidoTags?.album || unknown,
        artist: auidoTags?.artist || unknown,
        genre: auidoTags?.genre || unknown,
        title: auidoTags?.title || file.name,
        picture: auidoTags?.picture || unknown,
        track: auidoTags?.track || unknown,
        year: auidoTags?.yeaar || unknown,
      }
      this.libraryAudioFiles.push(audio);
    });
  }

  handleAudioPlay(file: AudioFiles) {
    this.playAudio.emit(file)
  }


  getTagsFromFile(file: File) {
    return new Promise<any>((resolve, reject) => {
      jsmediatags.read(file, {
        onSuccess: (tag: any) => {
          resolve(tag?.tags);
        },
        onError: (error: any) => {
          reject(error);
        }
      });
    });
  }


}
