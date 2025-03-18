import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HomeBaseComponent } from '../base.component';
import { DataPipe } from '@pipes/data.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  imports: [NgFor, NgClass, MatTooltip, MatTableModule, DataPipe],
})
export class HomeProjectComponent extends HomeBaseComponent {}
