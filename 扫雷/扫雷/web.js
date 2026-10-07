(() => {
    const screen = document.getElementById("terminal-screen");
    const output = document.getElementById("terminal-output");
    const readout = document.getElementById("terminal-readout");
    const boardWrap = document.getElementById("terminal-board-wrap");
    const board = document.getElementById("terminal-board");
    const form = document.getElementById("terminal-form");
    const promptLabel = document.getElementById("terminal-prompt");
    const input = document.getElementById("terminal-input");
    const levels = {
        1: { width: 9, height: 9, mines: 10 },
        2: { width: 16, height: 16, mines: 40 },
        3: { width: 30, height: 16, mines: 99 }
    };
    let lines = [];
    let state = "boot";
    let mode = 0;
    let settings = levels[1];
    let cells = [];
    let generated = false;
    let over = false;
    let debugVisible = false;
    let oneClickOnly = false;
    let flags = 0;
    let opened = 0;
    let seconds = 0;
    let timer = null;

    const rowName = (row) => String.fromCharCode(65 + row);
    const colName = (column) => column < 9 ? String(column + 1) : String.fromCharCode(97 + column - 9);

    function print(text = "") {
        lines.push(text);
        if (lines.length > 900) lines = lines.slice(-700);
        output.textContent = lines.join("\n");
        screen.scrollTop = screen.scrollHeight;
    }

    function clearScreen() {
        lines = [];
        output.textContent = "";
        readout.textContent = "";
        readout.hidden = true;
        boardWrap.hidden = true;
        board.replaceChildren();
    }

    function setPrompt(text) {
        promptLabel.textContent = text;
        input.value = "";
        input.disabled = state === "exit";
        if (!input.disabled) input.focus();
    }

    function drawMenu() {
        clearScreen();
        print("------------------------------");
        print("1.选择模式，显示内部数组");
        print("2.输入一个位置，显示打开区域");
        print("3.内部数组基础版");
        print("4.内部数组完整版(标记、运行时间)");
        print("5.画出框架，显示内部数据");
        print("6.检测鼠标位置和合法性，以及左键点击");
        print("7.鼠标点击一次，显示打开区域");
        print("8.允许连续游戏，支持右键标记，判断游戏结束");
        print("9.完整游戏，标明雷数，空格、结束显示时间");
        print("0.退出游戏");
        print("------------------------------");
        state = "menu";
        setPrompt("[请选择]:");
    }

    function neighbours(row, column) {
        const result = [];
        for (let dr = -1; dr <= 1; dr += 1) {
            for (let dc = -1; dc <= 1; dc += 1) {
                if (!dr && !dc) continue;
                const r = row + dr;
                const c = column + dc;
                if (r >= 0 && r < settings.height && c >= 0 && c < settings.width) result.push(cells[r][c]);
            }
        }
        return result;
    }

    function placeMines(firstRow, firstColumn) {
        const safe = new Set([cells[firstRow][firstColumn], ...neighbours(firstRow, firstColumn)]);
        const available = cells.flat().filter((cell) => !safe.has(cell));
        for (let i = available.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        available.slice(0, settings.mines).forEach((cell) => { cell.mine = true; });
        cells.flat().forEach((cell) => {
            cell.number = neighbours(cell.row, cell.column).filter((other) => other.mine).length;
        });
        generated = true;
    }

    function setReadout() {
        if (mode !== 9 && mode !== 4) return;
        readout.hidden = false;
        readout.textContent = `当前时间：${seconds}秒，剩余雷数：${settings.mines - flags}`;
    }

    function startTimer() {
        if (timer !== null || (mode !== 9 && mode !== 4)) return;
        timer = window.setInterval(() => {
            seconds += 1;
            setReadout();
        }, 1000);
    }

    function stopTimer() {
        if (timer !== null) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    function cellText(cell) {
        if (cell.flagged && !cell.open) return "⚑";
        if (cell.open || debugVisible) {
            if (cell.mine) return "*";
            return cell.number ? String(cell.number) : "·";
        }
        return "X";
    }

    function renderCell(cell) {
        const button = cell.element;
        button.textContent = cellText(cell);
        button.disabled = over || (cell.open && !debugVisible);
        button.classList.toggle("is-open", cell.open || debugVisible);
        button.classList.toggle("is-flagged", cell.flagged && !cell.open);
        button.classList.toggle("is-exploded", Boolean(cell.exploded));
        button.removeAttribute("data-number");
        if ((cell.open || debugVisible) && cell.number > 0 && !cell.mine) button.dataset.number = String(cell.number);
        const coordinate = `${rowName(cell.row)}${colName(cell.column)}`;
        button.setAttribute("aria-label", `${coordinate} ${cell.open ? cell.mine ? "地雷" : `数字 ${cell.number}` : cell.flagged ? "已标记" : "未翻开"}`);
    }

    function updateBoard() {
        cells.flat().forEach(renderCell);
        setReadout();
    }

    function buildBoard() {
        cells = [];
        generated = false;
        over = false;
        flags = 0;
        opened = 0;
        seconds = 0;
        stopTimer();
        board.style.setProperty("--columns", settings.width);
        board.replaceChildren();
        const blank = document.createElement("span");
        blank.className = "terminal-coordinate";
        board.append(blank);
        for (let column = 0; column < settings.width; column += 1) {
            const header = document.createElement("span");
            header.className = "terminal-coordinate";
            header.textContent = colName(column);
            board.append(header);
        }
        for (let row = 0; row < settings.height; row += 1) {
            const rowLabel = document.createElement("span");
            rowLabel.className = "terminal-coordinate terminal-coordinate--row";
            rowLabel.textContent = rowName(row);
            board.append(rowLabel);
            const rowCells = [];
            for (let column = 0; column < settings.width; column += 1) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "terminal-cell";
                button.setAttribute("role", "gridcell");
                const cell = { row, column, element: button, mine: false, number: 0, open: false, flagged: false, exploded: false };
                button.addEventListener("click", () => clickCell(cell, false));
                button.addEventListener("contextmenu", (event) => {
                    event.preventDefault();
                    clickCell(cell, true);
                });
                rowCells.push(cell);
                board.append(button);
            }
            cells.push(rowCells);
        }
        boardWrap.hidden = false;
        readout.hidden = mode !== 9 && mode !== 4;
        updateBoard();
    }

    function openCell(startCell) {
        if (over || startCell.open || startCell.flagged) return;
        if (!generated) {
            placeMines(startCell.row, startCell.column);
            startTimer();
            print(`首击坐标：${rowName(startCell.row)}${colName(startCell.column)}`);
        }
        if (startCell.mine) {
            startCell.open = true;
            startCell.exploded = true;
            cells.flat().forEach((cell) => { if (cell.mine) cell.open = true; });
            updateBoard();
            endGame(false);
            return;
        }
        const queue = [startCell];
        const seen = new Set();
        while (queue.length) {
            const cell = queue.shift();
            if (seen.has(cell) || cell.open || cell.flagged || cell.mine) continue;
            seen.add(cell);
            cell.open = true;
            opened += 1;
            if (cell.number === 0) queue.push(...neighbours(cell.row, cell.column));
        }
        updateBoard();
        if (opened === settings.width * settings.height - settings.mines) endGame(true);
        if (oneClickOnly) {
            oneClickOnly = false;
            print("单次点击模式结束。");
            continuePrompt();
        }
    }

    function toggleFlag(cell) {
        if (over || cell.open) return;
        cell.flagged = !cell.flagged;
        flags += cell.flagged ? 1 : -1;
        renderCell(cell);
        setReadout();
    }

    function clickCell(cell, flagClick) {
        if (mode === 2 && !flagClick) {
            openCell(cell);
            print("按回车键继续...");
            state = "continue";
            setPrompt("");
            return;
        }
        if (mode === 7 && !flagClick) {
            oneClickOnly = true;
            openCell(cell);
            return;
        }
        if (flagClick) toggleFlag(cell);
        else openCell(cell);
    }

    function endGame(isWin) {
        over = true;
        stopTimer();
        updateBoard();
        print(isWin ? "游戏成功！" : "游戏失败：踩到地雷。 ");
        if (mode === 9) print(`用时：${seconds} 秒，标记：${flags} / ${settings.mines}`);
        continuePrompt();
    }

    function continuePrompt() {
        state = "continue";
        print("");
        setPrompt("按回车键继续");
    }

    function coordinateFromText(text) {
        const match = text.trim().toUpperCase().match(/^(?:F\s*)?([A-P])\s*([1-9]|[A-U])$/);
        if (!match) return null;
        const row = match[1].charCodeAt(0) - 65;
        const columnChar = match[2];
        const column = /^[1-9]$/.test(columnChar) ? Number(columnChar) - 1 : columnChar.charCodeAt(0) - 65 + 9;
        if (row >= settings.height || column >= settings.width) return null;
        return { row, column, flagged: /^F/i.test(text.trim()) };
    }

    function beginLevel(level) {
        settings = levels[level];
        debugVisible = [1, 3, 4, 5, 6].includes(mode);
        oneClickOnly = mode === 7;
        if (mode === 2) {
            buildBoard();
            state = "coordinate";
            print("请输入一个位置(例如 A3)，显示打开区域");
            setPrompt("位置:");
            return;
        }
        buildBoard();
        if (debugVisible) {
            placeMines(0, 0);
            updateBoard();
            print("内部数组：");
            print("X 表示未翻开，数字表示周围地雷数，* 表示地雷。");
        }
        if (mode === 1 || mode === 5 || mode === 6) {
            state = "continue";
            print("按回车键继续...");
            setPrompt("");
            return;
        }
        state = "playing";
        const modeNames = {
            3: "内部数组基础版", 4: "内部数组完整版(标记、运行时间)",
            7: "鼠标点击一次，显示打开区域", 8: "连续游戏，支持右键标记",
            9: "完整游戏，标明雷数并计时"
        };
        print(`模式 ${mode}：${modeNames[mode] || "扫雷"}`);
        print("输入坐标如 A3 翻格，输入 F A3 插旗；也可直接点击棋盘。");
        if (mode === 9 || mode === 4) startTimer();
        setPrompt("[坐标]:");
    }

    function acceptInput(value) {
        const text = value.trim();
        print(`${promptLabel.textContent}${text}`);
        if (state === "boot") {
            drawMenu();
            return;
        }
        if (state === "menu") {
            const choice = Number(text);
            if (!/^[0-9]$/.test(text)) {
                setPrompt("[请选择]:");
                return;
            }
            if (choice === 0) {
                print("游戏退出。");
                state = "exit";
                setPrompt("");
                return;
            }
            mode = choice;
            state = "level";
            print("请输入扫雷游戏的等级（数字），初级\中级\高级（1\2\3）");
            setPrompt("[等级]:");
            return;
        }
        if (state === "level") {
            const level = Number(text);
            if (!levels[level]) {
                setPrompt("[等级 1/2/3]:");
                return;
            }
            beginLevel(level);
            return;
        }
        if (state === "coordinate") {
            const parsed = coordinateFromText(text);
            if (!parsed) {
                print("坐标格式错误，请输入 A1 至 P30 范围内的位置。");
                setPrompt("位置:");
                return;
            }
            openCell(cells[parsed.row][parsed.column]);
            if (state !== "continue") continuePrompt();
            return;
        }
        if (state === "playing") {
            if (text.toUpperCase() === "Q") {
                over = true;
                stopTimer();
                updateBoard();
                print("游戏中止。");
                continuePrompt();
                return;
            }
            const parsed = coordinateFromText(text);
            if (!parsed) {
                print("坐标格式错误，请输入 A3 翻格或 F A3 插旗。");
                setPrompt("[坐标]:");
                return;
            }
            if (parsed.flagged) toggleFlag(cells[parsed.row][parsed.column]);
            else openCell(cells[parsed.row][parsed.column]);
            if (state === "playing") setPrompt("[坐标]:");
            return;
        }
        if (state === "continue") drawMenu();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        acceptInput(input.value);
    });
    input.addEventListener("keydown", (event) => {
        if (state === "boot" && event.key.length === 1) {
            event.preventDefault();
            acceptInput(event.key);
        } else if ((state === "menu" || state === "level") && /^[0-9]$/.test(event.key)) {
            event.preventDefault();
            acceptInput(event.key);
        } else if (event.key === "Escape" && state === "playing") {
            event.preventDefault();
            over = true;
            stopTimer();
            updateBoard();
            print("按 ESC 退出游戏。");
            continuePrompt();
        } else if (event.code === "Space" && mode === 9 && state === "playing") {
            event.preventDefault();
            print(`当前时间：${seconds}秒`);
        }
    });
    screen.addEventListener("click", () => input.focus());
    screen.addEventListener("keydown", (event) => {
        if (event.target === input) return;
        if (event.code === "Space" && mode === 9) {
            event.preventDefault();
            print(`当前时间：${seconds}秒`);
        } else if (event.key === "Escape" && state === "playing") {
            over = true;
            stopTimer();
            updateBoard();
            print("按 ESC 退出游戏。");
            continuePrompt();
        }
    });

    print("请输出雪花的大小");
    print("");
    print("╔═══汉诺塔═══╗");
    print("╔═══汉诺塔 ═══╗");
    print("╔═══H汉诺塔 ═══╗");
    print("**╔═╦═╗中");
    print("中║测║试║**");
    print("**╠═╬═╣**");
    print("中║ab║12║中");
    print("**╚═╩═╝中");
    print("");
    print("请禁用快速编辑模式和插入模式");
    print("请确认上面的输出没有乱码/字符相互重叠现象，如果有，说明 cmd_console_tools.cpp 不对");
    state = "boot";
    setPrompt("按回车键继续");
})();
