# playwright-mcp

Playwright MCP Server tools for browser automation (microsoft/playwright-mcp)

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__playwright__browser_snapshot` | Capture accessibility snapshot of page |
| `mcp__playwright__browser_take_screenshot` | Take screenshot of page |
| `mcp__playwright__browser_console_messages` | Get console messages |
| `mcp__playwright__browser_network_requests` | Get network requests |
| `mcp__playwright__browser_tabs` | List/create/close/select tabs |
| `mcp__playwright__browser_verify_element_visible` | Verify element is visible |
| `mcp__playwright__browser_verify_list_visible` | Verify list is visible |
| `mcp__playwright__browser_verify_text_visible` | Verify text is visible |
| `mcp__playwright__browser_verify_value` | Verify element value |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__playwright__browser_navigate` | Navigate to URL |
| `mcp__playwright__browser_navigate_back` | Go back in history |
| `mcp__playwright__browser_click` | Click on element |
| `mcp__playwright__browser_hover` | Hover over element |
| `mcp__playwright__browser_drag` | Drag and drop between elements |
| `mcp__playwright__browser_type` | Type text into element |
| `mcp__playwright__browser_fill_form` | Fill multiple form fields |
| `mcp__playwright__browser_select_option` | Select dropdown option |
| `mcp__playwright__browser_press_key` | Press keyboard key |
| `mcp__playwright__browser_handle_dialog` | Handle browser dialog |
| `mcp__playwright__browser_wait_for` | Wait for condition |
| `mcp__playwright__browser_resize` | Resize browser viewport |
| `mcp__playwright__browser_evaluate` | Execute JavaScript on page |
| `mcp__playwright__browser_run_code` | Run Playwright code snippet |
| `mcp__playwright__browser_mouse_click_xy` | Click at coordinates |
| `mcp__playwright__browser_mouse_move_xy` | Move mouse to coordinates |
| `mcp__playwright__browser_mouse_drag_xy` | Drag mouse to coordinates |
| `mcp__playwright__browser_generate_locator` | Generate test locator |
| `mcp__playwright__browser_start_tracing` | Start trace recording |
| `mcp__playwright__browser_stop_tracing` | Stop trace recording |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__playwright__browser_install` | Install browser |
| `mcp__playwright__browser_file_upload` | Upload files |
| `mcp__playwright__browser_pdf_save` | Save page as PDF |
| `mcp__playwright__browser_close` | Close browser page |
