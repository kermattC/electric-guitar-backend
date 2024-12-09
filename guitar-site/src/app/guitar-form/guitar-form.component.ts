import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GuitarService } from '../guitar.service';
import { GuitarCardsComponent } from "../guitar-cards/guitar-cards.component";
import { Guitar } from '../guitar';

@Component({
  selector: 'app-guitar-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GuitarCardsComponent],
  templateUrl: './guitar-form.component.html',
  styleUrl: './guitar-form.component.css'
})
export class GuitarFormComponent {
  searchControl = new FormControl('');
  constructor(private guitarService: GuitarService) {}

  guitarsList: Guitar[] = []; 

  // GuitarService guitarService = new GuitarService();
  // look for changes every 300 ms
  // turn string into array of strings so i can pass it into the api later
    // remove leading/trailing whitespace -> turn string into array (comma delimieter) -> remove leading/trailing whitespace for each item -> remove empty strings
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((value: string | null) => {
        const keywords = Array.from(new Set (
          value?.trim()
          .split(",")
          .map(keyword => keyword.trim().replace(/\W/g, ''))  // tbd? added this to remove non alphanuemric characters
          .filter(keyword => keyword.length > 0)
        ).values());

        console.log("Keywords:", keywords);

        this.guitarService.getGuitars(keywords).subscribe( (guitars) => {
          this.guitarsList = guitars
          console.log("data: ", guitars);
        });
      });
  }
}