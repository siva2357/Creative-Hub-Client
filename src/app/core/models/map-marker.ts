import { KeyValue } from '@angular/common';
import { MapMarkerTypeEnum } from '../enums/map-marker-type.enum';

export class MapMarkerInfo {
	latitude?: number;
	longitude?: number;
	eventType?: MapMarkerTypeEnum;
	eventName?: string;
	eventDate?: string;
	markerInfo?: KeyValue<string, string>[] = [];
	constructor() {
		this.markerInfo = [];
	}
}
