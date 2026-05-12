import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Edit Game</h1>
        <a routerLink="/collection">
          <app-button variant="ghost">← Back to Collection</app-button>
        </a>
      </div>

      <form class="form-layout" (submit)="$event.preventDefault()">
        <div class="form-section">
          <h2 class="section-title">Game Information</h2>
          <div class="form-grid">
            <app-input label="Title" value="Super Metroid" [required]="true"></app-input>
            <app-input label="Platform" value="SNES" [required]="true"></app-input>
            <app-input label="Genre" value="Action"></app-input>
            <app-input label="Release Year" type="number" value="1994"></app-input>
            <app-input label="Developer" value="Nintendo"></app-input>
            <app-input label="Publisher" value="Nintendo"></app-input>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Collection Details</h2>
          <div class="form-grid">
            <div class="input-group">
              <label class="input-group__label">Condition</label>
              <select class="form-select">
                <option selected>Mint</option>
                <option>Near Mint</option>
                <option>Very Good</option>
                <option>Good</option>
                <option>Acceptable</option>
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
            <app-input label="Estimated Value ($)" type="number" value="250" prefix="$"></app-input>
            <app-input label="Personal Rating" type="number" value="5"></app-input>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Notes</h2>
          <app-input label="" type="textarea" value="Complete in box. Cartridge is in perfect condition. Includes manual and original box." [rows]="4"></app-input>
        </div>

        <div class="form-actions">
          <app-button variant="danger">Delete Game</app-button>
          <div class="form-actions__right">
            <a routerLink="/collection">
              <app-button variant="ghost">Cancel</app-button>
            </a>
            <app-button type="submit" variant="primary">Save Changes</app-button>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./edit-game.component.scss'],
})
export class EditGameComponent {}
