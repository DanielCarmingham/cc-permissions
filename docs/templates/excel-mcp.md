# excel-mcp

Excel MCP Server tools for spreadsheet operations

**Category:** MCP Servers

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `mcp__excel__read_data_from_excel` | Read data from Excel file |
| `mcp__excel__get_workbook_metadata` | Get workbook metadata |
| `mcp__excel__validate_excel_range` | Validate an Excel range reference |
| `mcp__excel__validate_formula_syntax` | Validate formula syntax |
| `mcp__excel__get_data_validation_info` | Get data validation info |
| `mcp__excel__get_merged_cells` | Get merged cells info |
| `mcp__excel-mcp-server__excel_describe_sheets` | Describe sheets in workbook |
| `mcp__excel-mcp-server__excel_read_sheet` | Read data from sheet |
| `mcp__excel-mcp-server__excel_screen_capture` | Capture sheet screenshot |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `mcp__excel__write_data_to_excel` | Write data to Excel file |
| `mcp__excel__create_workbook` | Create a new workbook |
| `mcp__excel__create_worksheet` | Create a new worksheet |
| `mcp__excel__apply_formula` | Apply formula to cells |
| `mcp__excel__format_range` | Format a cell range |
| `mcp__excel__merge_cells` | Merge cells |
| `mcp__excel__unmerge_cells` | Unmerge cells |
| `mcp__excel__create_table` | Create a table |
| `mcp__excel__create_chart` | Create a chart |
| `mcp__excel__insert_rows` | Insert rows |
| `mcp__excel__insert_columns` | Insert columns |
| `mcp__excel__copy_range` | Copy a cell range |
| `mcp__excel__copy_worksheet` | Copy a worksheet |
| `mcp__excel__rename_worksheet` | Rename a worksheet |
| `mcp__excel-mcp-server__excel_write_to_sheet` | Write data to sheet |
| `mcp__excel-mcp-server__excel_create_table` | Create a table in sheet |
| `mcp__excel-mcp-server__excel_copy_sheet` | Copy a sheet |
| `mcp__excel-mcp-server__excel_format_range` | Format a cell range |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `mcp__excel__create_pivot_table` | Create a pivot table |
| `mcp__excel__delete_worksheet` | Delete a worksheet |
| `mcp__excel__delete_range` | Delete a cell range |
| `mcp__excel__delete_sheet_rows` | Delete rows from sheet |
| `mcp__excel__delete_sheet_columns` | Delete columns from sheet |
