import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DETAIL_HEADERS, ReportHeaders } from '../../models/report-headers.enum';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
	@Input() title: string = "Detalle";
	@Input() element?: any;

	get headers(): string[] {
		return DETAIL_HEADERS;
	}

	ReportHeaders = ReportHeaders;

	get dataSource() {
		return new MatTableDataSource(this.element);
	}
}
