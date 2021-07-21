import type { MessageOrCCLogEntry } from "@zwave-js/core";
import type { Driver } from "../../driver/Driver";
import {
	FunctionType,
	MessagePriority,
	MessageType,
	RouteSpeeds,
	RouteTypes,
} from "../../message/Constants";
import {
	expectedResponse,
	Message,
	MessageBaseOptions,
	MessageDeserializationOptions,
	messageTypes,
	priority,
} from "../../message/Message";

export interface GetPriorityRouteRequestOptions extends MessageBaseOptions {
	nodeId: number;
}

@messageTypes(MessageType.Request, FunctionType.GetPriorityRoute)
@priority(MessagePriority.Controller)
@expectedResponse(FunctionType.GetPriorityRoute)
export class GetPriorityRouteRequest extends Message {
	public constructor(
		driver: Driver,
		options: GetPriorityRouteRequestOptions,
	) {
		super(driver, options);
		this.sourceNodeId = options.nodeId;
	}

	public sourceNodeId: number;

	public serialize(): Buffer {
		this.payload = Buffer.from([this.sourceNodeId]);

		return super.serialize();
	}
}

@messageTypes(MessageType.Response, FunctionType.GetPriorityRoute)
export class GetPriorityRouteResponse extends Message {
	public constructor(driver: Driver, options: MessageDeserializationOptions) {
		super(driver, options);

		if (this.payload.length !== 7) return;

		const data = [...this.payload];

		this._retVal = data[1];
		this._repeaters = data.slice(2, 6);
		this._routeSpeed = data[6];
	}

	private _repeaters: number[] = [];
	public get repeaters(): number[] {
		return this._repeaters;
	}

	public get repeatersString(): string {
		return this._repeaters.join(",");
	}

	private _routeSpeed: number = 0;
	public get routeSpeed(): string {
		return RouteSpeeds[this._routeSpeed];
	}

	private _retVal: number = 0;
	public get retVal(): string {
		return RouteTypes[this._retVal];
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: {
				"ret val": this.retVal,
				"priority route": this.repeaters.join(","),
				"route speed": this.routeSpeed,
			},
		};
	}
}
