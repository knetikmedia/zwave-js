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

		console.log(this.payload);
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: { "priority route": this.payload.toString() },
		};
	}
}
