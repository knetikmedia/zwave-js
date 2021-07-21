import type { MessageOrCCLogEntry } from "@zwave-js/core";
import type { Driver } from "../../driver/Driver";
import {
	FunctionType,
	MessagePriority,
	MessageType,
} from "../../message/Constants";
import {
	expectedResponse,
	Message,
	MessageBaseOptions,
	MessageDeserializationOptions,
	messageTypes,
	priority,
} from "../../message/Message";

export interface SetPriorityRouteRequestOptions extends MessageBaseOptions {
	nodeId: number;
	repeaters: number[];
	routeSpeed: number;
}

@messageTypes(MessageType.Request, FunctionType.SetPriorityRoute)
@priority(MessagePriority.Controller)
@expectedResponse(FunctionType.SetPriorityRoute)
export class SetPriorityRouteRequest extends Message {
	public constructor(
		driver: Driver,
		options: SetPriorityRouteRequestOptions,
	) {
		super(driver, options);

		this.sourceNodeId = options.nodeId;
		this.sourceRepeaters = options.repeaters;
		this.sourceRouteSpeed = options.routeSpeed;
	}

	public sourceNodeId: number;
	public sourceRepeaters: number[];
	public sourceRouteSpeed: number;

	public serialize(): Buffer {
		this.payload = Buffer.from([
			this.sourceNodeId,
			...this.sourceRepeaters,
			this.sourceRouteSpeed,
		]);

		return super.serialize();
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: {
				"node id": this.sourceNodeId,
				"repeater ids": this.sourceRepeaters.join(","),
				"route speed": this.sourceRouteSpeed,
			},
		};
	}
}

@messageTypes(MessageType.Response, FunctionType.SetPriorityRoute)
export class SetPriorityRouteResponse extends Message {
	public constructor(driver: Driver, options: MessageDeserializationOptions) {
		super(driver, options);

		const data = [...this.payload];
		this._retVal = data[1];
	}

	private _retVal: number = 0;
	public get retVal(): boolean {
		return !!this._retVal;
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: { "was successful": this.retVal },
		};
	}
}
