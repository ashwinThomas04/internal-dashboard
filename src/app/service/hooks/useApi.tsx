import { useRef } from "react";
import services, { MessageService } from "../../service";

type ApiMethodType = "GET" | "POST" | "PUT" | "DELETE" | "FILE";

class Handler {
	private errorMessages: MessageService;
	constructor() {
		this.errorMessages = services.messageService;
	}

	private parseResponse(ok: boolean, code: number, message: string, body?: any) {
		return { ok, code, message, body };
	}

	private async request(method: ApiMethodType, url: string, body?: string, token?: string) {
		let headers = new Headers();
		if (method != "FILE") headers.append("Content-Type", "application/json");
		if (token) headers.append("X-Api-Token", `${token}`);
		const options = { method: method === "FILE" ? "POST" : method, headers, body };
		try {
			const res = await fetch(url, options);
			if (res.ok) {
				const result = await res.text();
				if (result) {
					const response = JSON.parse(result);
					if (response?.message?.toLowerCase() === "success") return this.parseResponse(true, res.status, response.message, response.body);
					else if (response?.message?.toLowerCase() === "failure" && response.body && typeof response.body === "string") return this.parseResponse(false, res.status, response.body);
					else return this.parseResponse(false, 500, this.errorMessages.getApiErrorMessage(), response.body);
				}
				else return this.parseResponse(false, 500, this.errorMessages.getApiErrorMessage());
			}
			else {
				const raw: any = await res.text().catch(() => null);
				try {
					const errorText = JSON.parse(raw);
					if (errorText && typeof errorText === "object" && errorText?.message?.toLowerCase() === "failure" && errorText?.body && typeof errorText.body === "string") return this.parseResponse(false, res.status, errorText.body);
					else if (errorText && typeof errorText === "string") return this.parseResponse(false, res.status, errorText);
					else return this.parseResponse(false, res.status, this.errorMessages.getApiErrorMessage(res.status));
				} catch (error) {
					return this.parseResponse(false, 500, this.errorMessages.getApiErrorMessage(), error);
				}
			}

		} catch (error) {
			return this.parseResponse(false, 500, this.errorMessages.getApiErrorMessage(), error);
		}
	}

	async get(url: string, token?: string) {
		return await this.request("GET", url, undefined, token);
	}

	async post(url: string, data: string, token?: string) {
		return await this.request("POST", url, data, token);
	}

	async delete(url: string, token?: string) {
		return await this.request("DELETE", url, undefined, token);
	}

	async put(url: string, data: string, token?: string) {
		return await this.request("PUT", url, data, token);
	}

	async fileUpload(url: string, data: string, token: string) {
		return await this.request("FILE", url, data, token);
	}
}

const useApi = () => {
	const api = useRef<Handler>(null);
	if (!api.current) api.current = new Handler();
	return api.current;
}

export default useApi;