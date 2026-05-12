import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Add Game</h1>
        <a routerLink="/collection">
          <app-button variant="ghost">← Back to Collection</app-button>
        </a>
      </div>

      <form class="form-layout" (submit)="$event.preventDefault()">
        <div class="form-section">
          <h2 class="section-title">Game Information</h2>
          <div class="form-grid">
            <app-input label="Title" placeholder="Super Metroid" [required]="true"></app-input>
            <app-input label="Platform" placeholder="SNES" [required]="true"></app-input>
            <app-input label="Genre" placeholder="Action"></app-input>
            <app-input label="Release Year" type="number" placeholder="1994"></app-input>
            <app-input label="Developer" placeholder="Nintendo"></app-input>
            <app-input label="Publisher" placeholder="Nintendo"></app-input>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Collection Details</h2>
          <div class="form-grid">
            <div class="input-group">
              <label class="input-group__label">Condition</label>
              <select class="form-select">
                <option>Mint</option>
                <option>Near Mint</option>
                <option selected>Very Good</option>
                <option>Good</option>
                <option>Acceptable</option>
                <option>Poor</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-group__label">Region</label>
              <select class="form-select">
                <option selected>NTSC</option>
                <option>PAL</option>
                <option>NTSC-J</option>
                <option>Region Free</option>
              </select>
            </div>
            <app-input label="Estimated Value ($)" type="number" placeholder="0.00" prefix="$"></app-input>
            <app-input label="Personal Rating" type="number" placeholder="1-5"></app-input>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Notes</h2>
          <app-input label="" type="textarea" placeholder="Add personal notes about this game... (how you acquired it, memories, condition details)" [rows]="4"></app-input>
        </div>

        <div class="form-actions">
          <a routerLink="/collection">
            <app-button variant="ghost">Cancel</app-button>
          </a>
          <app-button type="submit" variant="primary">Add to Collection</app-button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent {}
