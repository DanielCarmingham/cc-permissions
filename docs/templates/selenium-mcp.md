# selenium-mcp

Selenium MCP Server tools for browser automation

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__selenium__find_element` | Find element on page |
| `mcp__selenium__get_element_text` | Get element text content |
| `mcp__selenium__take_screenshot` | Capture page screenshot |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__selenium__navigate` | Navigate to URL |
| `mcp__selenium__click_element` | Click on element |
| `mcp__selenium__double_click` | Double-click element |
| `mcp__selenium__right_click` | Right-click element |
| `mcp__selenium__send_keys` | Type text into element |
| `mcp__selenium__press_key` | Press keyboard key |
| `mcp__selenium__hover` | Hover over element |
| `mcp__selenium__drag_and_drop` | Drag and drop between elements |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__selenium__start_browser` | Launch browser session |
| `mcp__selenium__close_session` | Close browser session |
| `mcp__selenium__upload_file` | Upload file via input element |
