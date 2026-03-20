# fBanner Control Workflow

**Description**: A standard workflow to automate file processing and exporting in the fBanner macOS application via its REST API.

## Requirements
- Ensure the fBanner application is actively running on the macOS machine.
- Verify that the API server is explicitly enabled in the fBanner application settings.
- The `fbanner-api` skill should be installed or accessible by Gemini CLI.

## Workflow Steps

1. **Verify App Availability**
   - Execute a health check using the API to ensure fBanner is running and responsive.
   - Run: `curl -s http://localhost:3011/`

2. **Check Current State**
   - Check if any file is already loaded and what the current split configuration is.
   - Run: `curl -s http://localhost:3011/api/status`

3. **Load Target File**
   - Send the target file to the app. (Ensure the path is absolute).
   - Run: `curl -X POST http://localhost:3011/api/load -H "Content-Type: application/json" -d '{"filePath":"/absolute/path/to/target_file"}'`

4. **Execute Split or Configure**
   - Review `/api/config` and `/api/status` again to verify the correct loaded state.
   - If required, trigger a manual split step.
   - Run: `curl -X POST http://localhost:3011/api/split`

5. **Start Export Process**
   - Direct the app to save the split outputs into the desired output directory.
   - Run: `curl -X POST http://localhost:3011/api/export -H "Content-Type: application/json" -d '{"outputDir":"/absolute/path/to/output_directory"}'`

6. **Monitor Export Progress**
   - Repeatedly poll the status API to verify if the exporting process has completed successfully.
   - Run: `curl -s http://localhost:3011/api/status` and verify the `exportProgress` or success message.