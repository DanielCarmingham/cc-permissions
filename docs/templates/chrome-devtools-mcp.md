# chrome-devtools-mcp

Chrome DevTools MCP Server tools for browser inspection and debugging

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__chrome-devtools__list_pages` | List open browser pages |
| `mcp__chrome-devtools__list_network_requests` | List network requests |
| `mcp__chrome-devtools__get_network_request` | Get network request details |
| `mcp__chrome-devtools__list_console_messages` | List console messages |
| `mcp__chrome-devtools__get_console_message` | Get console message by ID |
| `mcp__chrome-devtools__take_screenshot` | Take page screenshot |
| `mcp__chrome-devtools__take_snapshot` | Take accessibility snapshot |
| `mcp__chrome-devtools__get_connection_status` | Get browser connection status |
| `mcp__chrome-devtools__get_page_info` | Get current page information |
| `mcp__chrome-devtools__get_console_logs` | Get console log messages |
| `mcp__chrome-devtools__get_console_error_summary` | Get console error summary |
| `mcp__chrome-devtools__get_network_requests` | Get network requests |
| `mcp__chrome-devtools__get_network_response` | Get network response body |
| `mcp__chrome-devtools__get_performance_metrics` | Get performance metrics |
| `mcp__chrome-devtools__get_document` | Get document tree |
| `mcp__chrome-devtools__query_selector` | Query single DOM element |
| `mcp__chrome-devtools__query_selector_all` | Query multiple DOM elements |
| `mcp__chrome-devtools__get_element_attributes` | Get element attributes |
| `mcp__chrome-devtools__get_element_outer_html` | Get element outer HTML |
| `mcp__chrome-devtools__get_element_box_model` | Get element box model |
| `mcp__chrome-devtools__describe_element` | Describe DOM element |
| `mcp__chrome-devtools__get_element_at_position` | Get element at coordinates |
| `mcp__chrome-devtools__search_elements` | Search DOM elements |
| `mcp__chrome-devtools__get_computed_styles` | Get computed styles |
| `mcp__chrome-devtools__get_matched_styles` | Get matched CSS styles |
| `mcp__chrome-devtools__get_inline_styles` | Get inline styles |
| `mcp__chrome-devtools__get_stylesheet_text` | Get stylesheet text |
| `mcp__chrome-devtools__get_background_colors` | Get background colors |
| `mcp__chrome-devtools__get_platform_fonts` | Get platform fonts |
| `mcp__chrome-devtools__get_media_queries` | Get media queries |
| `mcp__chrome-devtools__collect_css_class_names` | Collect CSS class names |
| `mcp__chrome-devtools__get_all_cookies` | Get all browser cookies |
| `mcp__chrome-devtools__get_cookies` | Get cookies for URL |
| `mcp__chrome-devtools__get_storage_usage_and_quota` | Get storage usage and quota |
| `mcp__chrome-devtools__get_storage_key_for_frame` | Get storage key for frame |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__chrome-devtools__click` | Click on element |
| `mcp__chrome-devtools__drag` | Drag element |
| `mcp__chrome-devtools__fill` | Fill input field |
| `mcp__chrome-devtools__fill_form` | Fill multiple form fields |
| `mcp__chrome-devtools__hover` | Hover over element |
| `mcp__chrome-devtools__press_key` | Press keyboard key |
| `mcp__chrome-devtools__handle_dialog` | Handle browser dialog |
| `mcp__chrome-devtools__upload_file` | Upload file to input |
| `mcp__chrome-devtools__navigate_page` | Navigate to URL |
| `mcp__chrome-devtools__new_page` | Open new page |
| `mcp__chrome-devtools__select_page` | Select a page/tab |
| `mcp__chrome-devtools__close_page` | Close a page/tab |
| `mcp__chrome-devtools__wait_for` | Wait for condition |
| `mcp__chrome-devtools__evaluate_script` | Evaluate JavaScript on page |
| `mcp__chrome-devtools__resize_page` | Resize browser viewport |
| `mcp__chrome-devtools__start_chrome` | Start Chrome browser |
| `mcp__chrome-devtools__start_chrome_and_connect` | Start Chrome and connect |
| `mcp__chrome-devtools__connect_to_browser` | Connect to running browser |
| `mcp__chrome-devtools__disconnect_from_browser` | Disconnect from browser |
| `mcp__chrome-devtools__navigate_to_url` | Navigate to URL |
| `mcp__chrome-devtools__execute_javascript` | Execute JavaScript on page |
| `mcp__chrome-devtools__evaluate_in_all_frames` | Evaluate script in all frames |
| `mcp__chrome-devtools__inspect_console_object` | Inspect console object |
| `mcp__chrome-devtools__monitor_console_live` | Monitor console live |
| `mcp__chrome-devtools__focus_element` | Focus DOM element |
| `mcp__chrome-devtools__set_cookie` | Set a browser cookie |
| `mcp__chrome-devtools__start_css_coverage_tracking` | Start CSS coverage tracking |
| `mcp__chrome-devtools__stop_css_coverage_tracking` | Stop CSS coverage tracking |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__chrome-devtools__emulate` | Emulate device conditions (CPU, network, viewport, geolocation) |
| `mcp__chrome-devtools__performance_start_trace` | Start performance trace |
| `mcp__chrome-devtools__performance_stop_trace` | Stop performance trace |
| `mcp__chrome-devtools__performance_analyze_insight` | Analyze performance insight |
| `mcp__chrome-devtools__clear_console` | Clear console messages |
| `mcp__chrome-devtools__clear_all_cookies` | Clear all browser cookies |
| `mcp__chrome-devtools__clear_storage_for_origin` | Clear storage for origin |
| `mcp__chrome-devtools__track_cache_storage` | Track cache storage events |
| `mcp__chrome-devtools__track_indexeddb` | Track IndexedDB events |
| `mcp__chrome-devtools__override_storage_quota` | Override storage quota |
