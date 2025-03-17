import { BaseItem } from './base-item.model';

export interface Efficiency {
  tasksWithoutSprint: BaseItem;
  efficiency: BaseItem;
  member?: BaseItem;
  teamEfficiency?: Efficiency[];
  doneOrClosed?: BaseItem;
}
