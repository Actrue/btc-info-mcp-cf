import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";
import { generateMessage } from "./message";
// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "币种行情信息工具",
		version: "1.0.0",
	});

	async init() {
		// 币种行情信息工具
		this.server.tool(
			"cryptoInfo",
			"这个工具的作用是可以获取加密货币的行情信息，接受一个参数coinType，币种信息（例如BTC-USDT）,然后返回币种的现价，5日均价，100日最高价，100日最低价，前一日交易量相对于5日平均的偏移百分比",
			{ coinType: z.string() },
			async ({ coinType }) => {
				const message = await generateMessage(coinType);
				return { content: [{ type: "text", text: message }] };
			}
		);
		
	}
}

const app = new Hono()

app.mount('/sse', MyMCP.serveSSE('/sse').fetch, { replaceRequest: false })
app.mount('/mcp', MyMCP.serve('/mcp').fetch, { replaceRequest: false })

export default app
