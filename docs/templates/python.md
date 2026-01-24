# python

pip, python, venv, pytest, and common data tools

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `python --version` | Check Python version |
| `python -V` | Check Python version (short) |
| `python3 --version` | Check Python 3 version |
| `python3 -V` | Check Python 3 version (short) |
| `pip list` | List installed packages |
| `pip3 list` | List installed packages (pip3) |
| `pip show` | Show package info |
| `pip3 show` | Show package info (pip3) |
| `pip freeze` | Output installed packages |
| `pip3 freeze` | Output installed packages (pip3) |
| `pip check` | Verify package dependencies |
| `pip3 check` | Verify package dependencies (pip3) |
| `pip search` | Search for packages |
| `pip3 search` | Search for packages (pip3) |
| `uv --version` | Check uv version |
| `uv pip list` | List installed packages (uv) |
| `uv pip show` | Show package info (uv) |
| `uv pip freeze` | Output installed packages (uv) |
| `poetry --version` | Check Poetry version |
| `poetry show` | Show package info (Poetry) |
| `poetry env info` | Show environment info (Poetry) |
| `conda --version` | Check Conda version |
| `conda list` | List installed packages (Conda) |
| `conda info` | Show Conda info |
| `conda env list` | List Conda environments |
| `python -m venv --help` | Venv help |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `python` | Run Python scripts |
| `python3` | Run Python 3 scripts |
| `python -c` | Execute Python code |
| `python3 -c` | Execute Python 3 code |
| `python -m` | Run Python module |
| `python3 -m` | Run Python 3 module |
| `pytest` | Run pytest |
| `python -m pytest` | Run pytest via module |
| `python3 -m pytest` | Run pytest via module (py3) |
| `unittest` | Run unittest |
| `python -m unittest` | Run unittest via module |
| `python3 -m unittest` | Run unittest via module (py3) |
| `ruff` | Run Ruff linter |
| `ruff check` | Run Ruff check |
| `ruff format` | Run Ruff formatter |
| `black` | Run Black formatter |
| `isort` | Run isort |
| `flake8` | Run flake8 linter |
| `pylint` | Run pylint |
| `mypy` | Run mypy type checker |
| `python -m build` | Build package |
| `python3 -m build` | Build package (py3) |
| `python -m venv` | Create virtual environment |
| `python3 -m venv` | Create virtual environment (py3) |
| `uv run` | Run with uv |
| `poetry run` | Run with Poetry |
| `poetry build` | Build with Poetry |
| `conda activate` | Activate Conda environment |
| `conda deactivate` | Deactivate Conda environment |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `pip install` | Install packages |
| `pip3 install` | Install packages (pip3) |
| `pip uninstall` | Uninstall packages |
| `pip3 uninstall` | Uninstall packages (pip3) |
| `pip install -e` | Install in editable mode |
| `pip3 install -e` | Install in editable mode (pip3) |
| `pip install -r` | Install from requirements |
| `pip3 install -r` | Install from requirements (pip3) |
| `uv pip install` | Install packages (uv) |
| `uv pip uninstall` | Uninstall packages (uv) |
| `uv pip sync` | Sync packages (uv) |
| `uv venv` | Create venv with uv |
| `poetry install` | Install with Poetry |
| `poetry add` | Add package with Poetry |
| `poetry remove` | Remove package with Poetry |
| `poetry update` | Update with Poetry |
| `poetry lock` | Lock dependencies with Poetry |
| `poetry publish` | Publish with Poetry |
| `conda install` | Install packages (Conda) |
| `conda create` | Create Conda environment |
| `conda remove` | Remove packages (Conda) |
| `conda update` | Update packages (Conda) |
| `conda env create` | Create env from file (Conda) |
| `conda env remove` | Remove Conda environment |
