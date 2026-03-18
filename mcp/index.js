#!/usr/bin/env node

/**
 * fBanner MCP Server
 *
 * Usage:
 *   node index.js [--server=<url>]
 *
 * Arguments:
 *   --server=<url> : (옵션) fBanner REST API 서버 주소 (기본값: http://localhost:3011)
 *
 * Environment:
 *   FBANNER_SERVER : fBanner REST API 서버 주소 (--server 옵션보다 우선순위 낮음)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 서버 주소 결정: CLI 인자 > 환경변수 > 기본값
function getServerUrl() {
  const arg = process.argv.find((a) => a.startsWith("--server="));
  if (arg) return arg.split("=").slice(1).join("=");
  return process.env.FBANNER_SERVER || "http://localhost:3011";
}

const SERVER_URL = getServerUrl();

const server = new McpServer({
  name: "fbanner-mcp",
  version: "1.0.0",
});

// Tool: health_check
server.tool(
  "health_check",
  "fBanner 서버 상태를 확인합니다",
  {},
  async () => {
    try {
      const res = await fetch(SERVER_URL);
      const json = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `서버 연결 실패: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: get_status
server.tool(
  "get_status",
  "fBanner 앱 상태를 조회합니다 (로드된 파일, 설정, 내보내기 진행률 등)",
  {},
  async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/status`);
      const json = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `상태 조회 실패: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: get_config
server.tool(
  "get_config",
  "현재 그리드 분리 설정을 조회합니다 (rows, cols, ratio, exportFormat 등)",
  {},
  async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/config`);
      const json = await res.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `설정 조회 실패: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: update_config
server.tool(
  "update_config",
  "그리드 분리 설정을 변경합니다. 제공된 필드만 업데이트되며 나머지는 유지됩니다.",
  {
    rows: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("세로 분할 수 (1~100)"),
    cols: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("가로 분할 수 (1~100)"),
    ratioW: z
      .number()
      .min(0.1)
      .max(10.0)
      .optional()
      .describe("가로 비율 (0.1~10.0)"),
    ratioH: z
      .number()
      .min(0.1)
      .max(10.0)
      .optional()
      .describe("세로 비율 (0.1~10.0)"),
    exportFormat: z
      .enum(["bitmap", "jpg", "svg", "pdf"])
      .optional()
      .describe("출력 파일 형식"),
    jpgQuality: z
      .number()
      .min(0.1)
      .max(1.0)
      .optional()
      .describe("JPEG 품질 (0.1~1.0, exportFormat이 bitmap일 때만 적용)"),
    pdfExportMode: z
      .enum(["firstPage", "allPages", "selectedPage"])
      .optional()
      .describe("PDF 내보내기 모드 (PDF 입력 시에만 적용)"),
    selectedPdfPage: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe("선택된 PDF 페이지 번호 (pdfExportMode가 selectedPage일 때)"),
    exportNameTemplate: z
      .string()
      .optional()
      .describe("출력 파일명 템플릿 ({name}=원본파일명, {rr}=행, {cc}=열)"),
  },
  async (params) => {
    try {
      // 제공된 파라미터만 body에 포함
      const body = {};
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) body[key] = value;
      }

      const res = await fetch(`${SERVER_URL}/api/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `설정 변경 실패 (${res.status}): ${JSON.stringify(json, null, 2)}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `설정 변경 오류: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: load_file
server.tool(
  "load_file",
  "이미지, PDF, SVG 파일을 로드합니다. 지원 형식: PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG",
  {
    path: z
      .string()
      .describe("로드할 파일의 절대 경로"),
  },
  async ({ path }) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `파일 로드 실패 (${res.status}): ${JSON.stringify(json, null, 2)}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `파일 로드 오류: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: export_files
server.tool(
  "export_files",
  "현재 로드된 파일을 그리드 분리하여 내보냅니다. 먼저 load_file로 파일을 로드해야 합니다.",
  {
    outputDir: z
      .string()
      .describe("출력 디렉토리의 절대 경로"),
  },
  async ({ outputDir }) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputDir }),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `내보내기 실패 (${res.status}): ${JSON.stringify(json, null, 2)}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `내보내기 오류: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// Tool: split_one_step
server.tool(
  "split_one_step",
  "파일 로드 + 설정 변경 + 내보내기를 한 번에 수행합니다. 자동화에 권장되는 엔드포인트입니다.",
  {
    path: z
      .string()
      .describe("입력 파일의 절대 경로"),
    outputDir: z
      .string()
      .describe("출력 디렉토리의 절대 경로"),
    rows: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("세로 분할 수 (기본값: 2)"),
    cols: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("가로 분할 수 (기본값: 2)"),
    ratioW: z
      .number()
      .min(0.1)
      .max(10.0)
      .optional()
      .describe("가로 비율 (기본값: 1.0)"),
    ratioH: z
      .number()
      .min(0.1)
      .max(10.0)
      .optional()
      .describe("세로 비율 (기본값: 1.0)"),
    exportFormat: z
      .enum(["bitmap", "jpg", "svg", "pdf"])
      .optional()
      .describe("출력 파일 형식 (기본값: bitmap)"),
    jpgQuality: z
      .number()
      .min(0.1)
      .max(1.0)
      .optional()
      .describe("JPEG 품질 (기본값: 0.8)"),
    exportNameTemplate: z
      .string()
      .optional()
      .describe("출력 파일명 템플릿 (기본값: {name}_{rr}-{cc})"),
  },
  async (params) => {
    try {
      const body = { path: params.path, outputDir: params.outputDir };
      const optionalKeys = [
        "rows",
        "cols",
        "ratioW",
        "ratioH",
        "exportFormat",
        "jpgQuality",
        "exportNameTemplate",
      ];
      for (const key of optionalKeys) {
        if (params[key] !== undefined) body[key] = params[key];
      }

      const res = await fetch(`${SERVER_URL}/api/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `분리 실패 (${res.status}): ${JSON.stringify(json, null, 2)}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `분리 오류: ${err.message}\n서버 주소: ${SERVER_URL}`,
          },
        ],
      };
    }
  }
);

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("MCP 서버 시작 실패:", err);
  process.exit(1);
});
