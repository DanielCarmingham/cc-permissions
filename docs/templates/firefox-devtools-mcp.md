# firefox-devtools-mcp

Firefox DevTools MCP Server tools for browser inspection and debugging

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__firefox-devtools__list_pages` | List open browser pages |
| `mcp__firefox-devtools__list_network_requests` | List network requests |
| `mcp__firefox-devtools__get_network_request` | Get network request details |
| `mcp__firefox-devtools__list_console_messages` | List console messages |
| `mcp__firefox-devtools__take_snapshot` | Take accessibility snapshot |
| `mcp__firefox-devtools__get_firefox_info` | Get Firefox browser information |
| `mcp__firefox-devtools__get_firefox_output` | Get Firefox process output |
| `mcp__firefox__url_get_current` | Get current page URL |
| `mcp__firefox__html_extract` | Extract page HTML |
| `mcp__firefox__text_extract` | Extract page text content |
| `mcp__firefox__page_screenshot` | Take page screenshot |
| `mcp__firefox__session_list` | List browser sessions |
| `mcp__firefox__debug_console_logs` | Get console log messages |
| `mcp__firefox__debug_javascript_errors` | Get JavaScript errors |
| `mcp__firefox__debug_network_activity` | Get network activity |
| `mcp__firefox__debug_websocket_messages` | Get WebSocket messages |
| `mcp__firefox__debug_performance_metrics` | Get performance metrics |
| `mcp__firefox__debug_activity_all` | Get all debug activity |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__firefox-devtools__click_by_uid` | Click element by UID |
| `mcp__firefox-devtools__fill_by_uid` | Fill input by UID |
| `mcp__firefox-devtools__fill_form_by_uid` | Fill form by UID |
| `mcp__firefox-devtools__hover_by_uid` | Hover element by UID |
| `mcp__firefox-devtools__drag_by_uid_to_uid` | Drag between elements |
| `mcp__firefox-devtools__upload_file_by_uid` | Upload file by UID |
| `mcp__firefox-devtools__navigate_page` | Navigate to URL |
| `mcp__firefox-devtools__new_page` | Open new page |
| `mcp__firefox-devtools__select_page` | Select a page/tab |
| `mcp__firefox-devtools__close_page` | Close a page/tab |
| `mcp__firefox-devtools__navigate_history` | Navigate browser history |
| `mcp__firefox-devtools__set_viewport_size` | Set viewport size |
| `mcp__firefox-devtools__evaluate_script` | Evaluate JavaScript on page |
| `mcp__firefox-devtools__resolve_uid_to_selector` | Resolve UID to CSS selector |
| `mcp__firefox-devtools__screenshot_page` | Take full page screenshot |
| `mcp__firefox-devtools__screenshot_by_uid` | Take element screenshot |
| `mcp__firefox-devtools__accept_dialog` | Accept browser dialog |
| `mcp__firefox-devtools__dismiss_dialog` | Dismiss browser dialog |
| `mcp__firefox__browser_launch` | Launch Firefox browser |
| `mcp__firefox__session_create` | Create browser session |
| `mcp__firefox__session_set_active` | Set active session |
| `mcp__firefox__page_navigate` | Navigate to URL |
| `mcp__firefox__page_reload` | Reload current page |
| `mcp__firefox__history_back` | Navigate back in history |
| `mcp__firefox__history_forward` | Navigate forward in history |
| `mcp__firefox__element_click` | Click on element |
| `mcp__firefox__element_drag` | Drag element |
| `mcp__firefox__input_type` | Type text into input |
| `mcp__firefox__keyboard_press` | Press keyboard key |
| `mcp__firefox__element_wait` | Wait for element |
| `mcp__firefox__javascript_execute` | Execute JavaScript on page |
| `mcp__firefox__debug_monitoring_start` | Start debug monitoring |
| `mcp__firefox__debug_helpers_inject` | Inject debug helpers |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__firefox-devtools__clear_console` | Clear console messages |
| `mcp__firefox-devtools__restart_firefox` | Restart Firefox browser |
| `mcp__firefox-devtools__list_chrome_contexts` | List Firefox chrome contexts |
| `mcp__firefox-devtools__select_chrome_context` | Select Firefox chrome context |
| `mcp__firefox-devtools__evaluate_chrome_script` | Evaluate script in chrome context |
| `mcp__firefox__browser_close` | Close Firefox browser |
| `mcp__firefox__session_close` | Close browser session |
| `mcp__firefox__debug_buffers_clear` | Clear debug buffers |
