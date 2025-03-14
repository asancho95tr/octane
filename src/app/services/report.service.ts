import { Injectable, Inject } from '@angular/core';
import { HEADERS, HeadersToCheck, REPORT_HEADERS, ReportHeaders, TEAM_EFICIENCY_HEADERS } from '../models/report-headers.enum';
import { CEREMONIES, EFICIENCY, ENDED_PHASES, MIN_ESTIMATION_VS_INVESTED, NAME_BUG_TYPE, NAME_MAIN_TYPE, RATIO_BUGS } from '../models/config.const';
import { PercentPipe } from '@angular/common';
import { Eficiency } from '../models/project-eficiency.model';
import { Utils } from '../utils/utils';

@Injectable({
	providedIn: 'root'
})
export class ReportService {

	reportImported?: any;
	fileDataImported?: any;

	constructor(@Inject(PercentPipe) private _percentPipe: PercentPipe) { }

	async getData(event: any) {
		const data: any = await Utils.uploadFileToJson(event);
		this.fileDataImported = data;
		this.refreshData();
	}

	refreshData() {
		let table: any = { headers: [], data: []};
		const data: any = this.fileDataImported;
		const sprints: string[] = this._getSprints(data);
		sprints.sort((a: string, b: string) => Number(a.replace(HeadersToCheck.SPRINT, "").replace(HeadersToCheck.BACKLOG_ITEM, "")) - Number(b.replace(HeadersToCheck.SPRINT, "").replace(HeadersToCheck.BACKLOG_ITEM, "")));
		if(data.length > 0) {
			table.headers = HEADERS;
			table.reportHeaders = REPORT_HEADERS;
			table.data = data;
			table.reportData = this._getReportData(data, sprints);
			table.eficiencyHeaders = TEAM_EFICIENCY_HEADERS;
			table.eficiency = this._getProjectEficiency(data, sprints);
		}
		this.reportImported = table;
	}

	private _getSprints(data: any) {
		return [...new Set(
				data.filter((i: any) => this.#getSprintValue(i) !== undefined)
					.map((item: any) =>  this.#getSprintValue(item)) as string[])]
	}

	#getSprintValue(item: any) {
		return this._getValueByProperty(item, HeadersToCheck.SPRINT) ?? this._getValueByProperty(item, HeadersToCheck.BACKLOG_ITEM + HeadersToCheck.SPRINT);
	}

	private _getReportData(data: any, sprints: string[]): any[] {
		return sprints.map((sprint: string) => {
			const itemsSprint: any[] = data.filter((element: any) => this._getValueByProperty(element, HeadersToCheck.SPRINT) === sprint).map((element: any) => {
				return {
					...element,
					"Estimado vs incurrido": this._getEficiency([element], true).eficiency
				}
			});
			//Cálculos
			const estimatedSum: number = itemsSprint.map((element: any) => this._getValueByProperty(element, HeadersToCheck.ESTIMATED)).reduce((sum: number, current: number) => sum + current, 0);
			const remainingSum: number = itemsSprint.map((element: any) => this._getValueByProperty(element, HeadersToCheck.REMAINING)).reduce((sum: number, current: number) => sum + current, 0);
			const investedSum: number = itemsSprint.map((element: any) => this._getValueByProperty(element, HeadersToCheck.INVESTED)).reduce((sum: number, current: number) => sum + current, 0);
			const eficiency: number = ((estimatedSum + remainingSum > 0) ? estimatedSum/(remainingSum + investedSum) : 0);

			//Data
			const noEstimatedData: any[] = itemsSprint.filter((element: any) => this._getValueByProperty(element, HeadersToCheck.ESTIMATED) === 0);
			const withRemainingHoursData: any[] = itemsSprint.filter((element: any) => this._getValueByProperty(element, HeadersToCheck.REMAINING) !== 0);
			const noInvestedData: any[] = itemsSprint.filter((element: any) => this._getValueByProperty(element, HeadersToCheck.INVESTED) === 0);
			const openedData: any[] = itemsSprint.filter((element: any) => !ENDED_PHASES.includes(this._getValueByProperty(element, HeadersToCheck.PHASE)) && !ENDED_PHASES.includes(this._getValueByProperty(element, HeadersToCheck.STATUS)));
			const noAsignedData: any[] = itemsSprint.filter((element: any) => !this._propertyExists(element, HeadersToCheck.OWNER) && !this._propertyExists(element, HeadersToCheck.ASSIGNED));
			const estimatedVsInvested: any[] = itemsSprint.filter((element: any) => {
				const estimated = this._getValueByProperty(element, HeadersToCheck.ESTIMATED);
				const invested = this._getValueByProperty(element, HeadersToCheck.INVESTED);
				return estimated === invested && estimated >= MIN_ESTIMATION_VS_INVESTED
			});
			const bugs: any[] = itemsSprint.filter((element: any) => this._getValueByProperty(element, HeadersToCheck.TYPE, true) === NAME_BUG_TYPE);
			const detectedDefects: any[] = itemsSprint.filter((element: any) => this._propertyExists(element, HeadersToCheck.DETECTED_DEFECTS));
			const detectedDefectsCount: number = detectedDefects.map((value: any) => value[HeadersToCheck.DETECTED_DEFECTS]).reduce((sum: number, current: number) => sum + current, 0);
			const ceremonies: any[] = itemsSprint.filter((element: any) => CEREMONIES.includes(this._getValueByProperty(element, HeadersToCheck.NAME, true)));

			return {
				Ciclo: { value: itemsSprint[0][HeadersToCheck.CICLO] ?? '-' },
				Sprint: { value: sprint },
				"Sin estimar": { value: noEstimatedData.length, class: this._getClass(noEstimatedData.length, ReportHeaders.NO_ESTIMATED)},
				"Sin estimar_data": noEstimatedData,
				"Con ETC": { value: withRemainingHoursData.length, class: this._getClass(withRemainingHoursData.length, ReportHeaders.WITH_REMAINING_HOURS)},
				"Con ETC_data": withRemainingHoursData,
				"Sin incurrir": { value: noInvestedData.length, class: this._getClass(noInvestedData.length, ReportHeaders.NO_INVESTED)},
				"Sin incurrir_data": noInvestedData,
				Abiertas: { value: openedData.length, class: this._getClass(openedData.length, ReportHeaders.OPENED)},
				Abiertas_data: openedData,
				"Sin asignado": { value: noAsignedData.length, class: this._getClass(noAsignedData.length, ReportHeaders.NO_ASIGNED)},
				"Sin asignado_data": noAsignedData,
				"Estimado=Incurrido": { value: estimatedVsInvested.length, class: this._getClass(estimatedVsInvested.length, ReportHeaders.ESTIMATED_VS_INVESTED)}, 
				"Estimado=Incurrido_data": estimatedVsInvested, 
				Bugs: { value: bugs.length, class: this._getClass(bugs.length, ReportHeaders.BUGS)}, 
				Bugs_data: bugs,
				"Número defectos encontrados": { value: detectedDefectsCount, class: this._getClass(detectedDefectsCount, ReportHeaders.DETECTED_DEFECTS) },
				"Número defectos encontrados_data": detectedDefects,
				Ceremonias: { value: ceremonies.length, class: this._getClass(ceremonies.length, ReportHeaders.CEREMONIES)},
				Ceremonias_data: ceremonies,
				"Estimado vs incurrido": { value: this._percentPipe.transform(eficiency, '1.2-2'), class: this._getClass(eficiency * 100, ReportHeaders.EFICIENCY)}
			}
		});
	}

	private _getProjectEficiency(data: any, sprints: string[]): Eficiency {
		const teamMembers: string[] = [...new Set(data.map((element: any) => this._getOwner(element)) as string[])];
		let eficiency: Eficiency = this._getEficiency(data);
		eficiency.teamEficiency = [];
		teamMembers.forEach((member: string) => {
			const memberName: string = (member && member !== '') ? member : 'Sin asignar'
			const dataOfMember: any[] = data.filter((element: any) => this._getOwner(element) === member);
			eficiency.teamEficiency?.push({member: { value: memberName}, ...this._getEficiency(dataOfMember)});
		});
		return eficiency;
	}

	private _getEficiency(data: any, allowInProgress: boolean = false): Eficiency {
		const itemsToCheck = (allowInProgress) ? data :data.filter((element: any) => /*element[HeadersToCheck.TYPE] === NAME_MAIN_TYPE &&*/ (ENDED_PHASES.includes(element[HeadersToCheck.PHASE]) || ENDED_PHASES.includes(element[HeadersToCheck.STATUS])));
		const estimated: number = itemsToCheck.map((element: any) => element[HeadersToCheck.ESTIMATED]).reduce((sum: number, current: number) => sum + current, 0);
		const invested: number = itemsToCheck.map((element: any) => element[HeadersToCheck.INVESTED]).reduce((sum: number, current: number) => sum + current, 0);
		const remaining: number = itemsToCheck.map((element: any) => element[HeadersToCheck.REMAINING]).reduce((sum: number, current: number) => sum + current, 0);
		const eficiency: number = ((estimated > 0 && invested > 0) ? estimated/(allowInProgress? invested + remaining : invested) : 0);
		const tasksWithoutSprint: any[] = data.filter((i: any) => !this._getValueByProperty(i, HeadersToCheck.SPRINT) || this._getValueByProperty(i, HeadersToCheck.SPRINT) === '');
		const countWithoutSprint:number = tasksWithoutSprint.length;
		return {
			eficiency: { value: this._percentPipe.transform(eficiency, '1.2-2') ?? '-', class: this._getClass(eficiency * 100, ReportHeaders.EFICIENCY)},
			doneOrClosed_data: itemsToCheck,
			doneOrClosed: { value: itemsToCheck.length, class: 'right' },
			tasksWithoutSprint: { value: countWithoutSprint, class: 'right' },
			tasksWithoutSprint_data: tasksWithoutSprint
		}
	}

	private _getClass(value: number, column: string) {
		let classes: string = '';
		switch(column) {
			case ReportHeaders.NO_ESTIMATED:
			case ReportHeaders.WITH_REMAINING_HOURS:
			case ReportHeaders.NO_INVESTED:
			case ReportHeaders.OPENED:
			case ReportHeaders.NO_ASIGNED:
			case ReportHeaders.ESTIMATED_VS_INVESTED:
				classes = (value > 0) ? 'need_work' : '';
				break;
			case ReportHeaders.BUGS:
				classes = (value > RATIO_BUGS) ? 'need_work' : '';
				break;
			case ReportHeaders.CEREMONIES:
				classes = (value < CEREMONIES.length) ? 'need_work' : '';
				break;
			case ReportHeaders.EFICIENCY:
				classes = (value < (100 - EFICIENCY) || value > (100 + EFICIENCY)) ? 'need_work' : 'done';
				break;
			case ReportHeaders.DETECTED_DEFECTS:
				classes = (value === 0) ? 'need_work' : 'done';
		}
		return `right ${classes}`
	}

	private _propertyExists(element: any, property: string) {
		const value = this._getValueByProperty(element, property)
		return  value && value !== '';
	}

	private _getOwner(element: any) {
		if(this._propertyExists(element, HeadersToCheck.OWNER)) {
			return this._getValueByProperty(element, HeadersToCheck.OWNER);
		} else {
			return this._getValueByProperty(element, HeadersToCheck.ASSIGNED);
		}
	}

	private _getValueByProperty(item: any, property: string, forceParent: boolean = false) {
		if(forceParent) {
			return item[`${HeadersToCheck.BACKLOG_ITEM}${property}`] ?? item[property];
		}
		return item[property] ?? item[`${HeadersToCheck.BACKLOG_ITEM}${property}`];
	}
}
