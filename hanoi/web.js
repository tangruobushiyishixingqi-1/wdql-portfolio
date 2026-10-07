(() => {
    const output = document.getElementById("terminal-output");
    const boardOutput = document.getElementById("board-output");
    const form = document.getElementById("terminal-form");
    const promptLabel = document.getElementById("terminal-prompt");
    const input = document.getElementById("terminal-input");
    const colors = ["", "#3b78ff", "#13a10e", "#16c60c", "#3a96dd", "#0037da", "#767676", "#c19c00", "#cccccc", "#c50f1f", "#881798"];
    let lines = [];
    let state = "boot";
    let mode = 0;
    let count = 0;
    let source = 0;
    let destination = 2;
    let spare = 1;
    let towers = [[], [], []];
    let steps = 0;
    let animationTimer = null;
    let cancelled = false;

    const peg = (index) => String.fromCharCode(65 + index);
    const trimHistory = () => { if (lines.length > 1500) lines = lines.slice(-1200); };

    function print(text = "") {
        lines.push(text);
        trimHistory();
        output.textContent = lines.join("\n");
    }

    function clearScreen() {
        lines = [];
        output.textContent = "";
        boardOutput.replaceChildren();
        boardOutput.hidden = true;
    }

    function setPrompt(text) {
        promptLabel.textContent = text;
        input.value = "";
        input.focus();
    }

    function drawMenu() {
        clearScreen();
        print("---------------------------------");
        print("1.基本解");
        print("2.基本解(步数记录)");
        print("3.内部数组显示(横向)");
        print("4.内部数组显示(纵向+横向)");
        print("5.图形解-预备-画三个圆柱");
        print("6.图形解-预备-在起始柱上画n个盘子");
        print("7.图形解-预备-第一次移动");
        print("8.图形解-自动移动版本");
        print("9.图形解-游戏版");
        print("0.退出");
        print("---------------------------------");
        state = "menu";
        setPrompt("[请选择:]");
    }

    function renderBoard() {
        const rows = [];
        const cellWidth = Math.max(7, count * 2 + 3);
        for (let row = count - 1; row >= 0; row -= 1) {
            const fragments = [];
            for (let column = 0; column < 3; column += 1) {
                const disk = towers[column][row];
                const bar = disk ? "█".repeat(disk * 2 + 1) : "│";
                const padding = Math.max(0, Math.floor((cellWidth - bar.length) / 2));
                const content = `${" ".repeat(padding)}${bar}${" ".repeat(Math.max(0, cellWidth - padding - bar.length))}`;
                fragments.push(disk ? `<span style="color:${colors[disk]}">${content}</span>` : `<span style="color:#d6d6d6">${content}</span>`);
            }
            rows.push(fragments.join("  "));
        }
        const base = Array.from({ length: 3 }, () => "─".repeat(cellWidth)).join("  ");
        const labels = Array.from({ length: 3 }, (_, index) => `${" ".repeat(Math.floor((cellWidth - 1) / 2))}${peg(index)}`).join("  ");
        boardOutput.innerHTML = `<pre class="terminal-board">${rows.join("\n")}\n${base}\n${labels}</pre>`;
        boardOutput.hidden = false;
    }

    function newTower() {
        towers = [[], [], []];
        towers[source] = Array.from({ length: count }, (_, index) => count - index);
        steps = 0;
        renderBoard();
    }

    function hanoiMoves(n, from, to, auxiliary, result = []) {
        if (n <= 0) return result;
        hanoiMoves(n - 1, from, auxiliary, to, result);
        result.push([from, to, n]);
        hanoiMoves(n - 1, auxiliary, to, from, result);
        return result;
    }

    function moveDisk(from, to) {
        if (from === to) {
            print(`目标柱(${peg(from)})不能与起始柱(${peg(from)})相同`);
            return false;
        }
        const sourceTower = towers[from];
        const targetTower = towers[to];
        if (!sourceTower.length) {
            print("源柱为空！");
            return false;
        }
        const disk = sourceTower[sourceTower.length - 1];
        const targetTop = targetTower[targetTower.length - 1] || 0;
        if (disk > targetTop && targetTop !== 0) {
            print("大盘压小盘，非法移动！");
            return false;
        }
        sourceTower.pop();
        targetTower.push(disk);
        steps += 1;
        renderBoard();
        return disk;
    }

    function outputSolution() {
        const moves = hanoiMoves(count, source, destination, spare);
        towers = [[], [], []];
        towers[source] = Array.from({ length: count }, (_, index) => count - index);
        if (mode === 4) renderBoard();
        moves.forEach(([from, to, disk], index) => {
            if (mode === 1) print(`${disk}# ${peg(from)}---->${peg(to)}`);
            if (mode === 2) print(`第${String(index + 1).padStart(4, " ")} 步 ( ${disk}#: ${peg(from)}-->${peg(to)})`);
            moveDisk(from, to);
            if (mode === 3) print(`第${String(index + 1).padStart(4, " ")} 步 ( ${disk}#: ${peg(from)}-->${peg(to)})   ${peg(from)} → ${peg(to)}`);
            if (mode === 4) print(`第${String(index + 1).padStart(4, " ")} 步 ( ${disk}#: ${peg(from)}-->${peg(to)})`);
        });
        if (mode === 3 || mode === 4) print("内部数组 / 圆盘移动状态已按步骤更新。");
        print(`共 ${moves.length} 步`);
        continuePrompt();
    }

    function continuePrompt() {
        state = "continue";
        print("");
        setPrompt("按回车键继续");
    }

    function runAutomatic() {
        const moves = hanoiMoves(count, source, destination, spare);
        let index = 0;
        cancelled = false;
        print(`图形解开始：${count} 层，${peg(source)} → ${peg(destination)}，共 ${moves.length} 步`);
        print("输入 Q 可停止自动移动。");
        animationTimer = window.setInterval(() => {
            if (cancelled || index >= moves.length) {
                window.clearInterval(animationTimer);
                animationTimer = null;
                if (!cancelled) print("自动移动完成。");
                continuePrompt();
                return;
            }
            const [from, to, disk] = moves[index];
            moveDisk(from, to);
            print(`${disk}# ${peg(from)}---->${peg(to)}`);
            index += 1;
        }, 480);
        state = "auto";
        setPrompt("自动移动中:");
    }

    function beginGame() {
        newTower();
        print(`从 ${peg(source)} 移动到 ${peg(destination)} ，共 ${count} 层`);
        print("请输入移动的柱号(命令形式：AC=A顶端的盘子移动到C，Q=退出)");
        state = "game";
        setPrompt("命令:");
    }

    function beginSelectedMode() {
        spare = 3 - source - destination;
        if (mode <= 4) {
            outputSolution();
            return;
        }
        if (mode === 6) {
            newTower();
            print(`从 ${peg(source)} 移动到 ${peg(destination)} ，共 ${count} 层`);
            print("图形解-预备-在起始柱上画 n 个盘子");
            continuePrompt();
            return;
        }
        if (mode === 7) {
            newTower();
            print(`从 ${peg(source)} 移动到 ${peg(destination)} ，共 ${count} 层`);
            const disk = moveDisk(source, destination);
            if (disk) print(`${disk}# ${peg(source)}---->${peg(destination)}`);
            continuePrompt();
            return;
        }
        if (mode === 8) {
            newTower();
            runAutomatic();
            return;
        }
        beginGame();
    }

    function acceptInput(value) {
        const raw = value.trim();
        const command = raw.toUpperCase();
        print(`${promptLabel.textContent}${raw}`);
        if (state === "boot") {
            if (command === "Q") {
                print("程序已退出。");
                state = "exit";
                setPrompt("");
            } else if (command === "C") {
                drawMenu();
            } else {
                print("按 C 继续，Q 退出。");
                setPrompt("[C/Q]:");
            }
            return;
        }
        if (state === "menu") {
            const choice = Number(command);
            if (!/^[0-9]$/.test(command)) {
                setPrompt("[请选择:]");
                return;
            }
            if (choice === 0) {
                print("程序已退出。");
                state = "exit";
                setPrompt("");
                return;
            }
            mode = choice;
            if (mode === 5) {
                count = 0;
                towers = [[], [], []];
                renderBoard();
                print("图形解-预备-画三个圆柱");
                continuePrompt();
                return;
            }
            state = "layer";
            setPrompt("请输入汉诺塔的层数(1-10):");
            return;
        }
        if (state === "layer") {
            const valueNum = Number(command);
            if (!Number.isInteger(valueNum) || valueNum < 1 || valueNum > 10) {
                setPrompt("请输入汉诺塔的层数(1-10):");
                return;
            }
            count = valueNum;
            state = "source";
            setPrompt("请输入起始柱(A-C):");
            return;
        }
        if (state === "source") {
            const index = "ABC".indexOf(command);
            if (index < 0) {
                setPrompt("请输入起始柱(A-C):");
                return;
            }
            source = index;
            state = "destination";
            setPrompt("请输入目标柱(A-C):");
            return;
        }
        if (state === "destination") {
            const index = "ABC".indexOf(command);
            if (index < 0 || index === source) {
                if (index === source) print(`目标柱(${peg(index)})不能与起始柱(${peg(source)})相同`);
                setPrompt("请输入目标柱(A-C):");
                return;
            }
            destination = index;
            beginSelectedMode();
            return;
        }
        if (state === "game") {
            if (command === "Q") {
                print("游戏中止!!!!!");
                continuePrompt();
                return;
            }
            if (!/^[ABC][ABC]$/.test(command)) {
                print("请输入两位柱号，例如 AC；Q 退出。");
                setPrompt("命令:");
                return;
            }
            const from = command.charCodeAt(0) - 65;
            const to = command.charCodeAt(1) - 65;
            const moved = moveDisk(from, to);
            if (moved) print(`${moved}# ${peg(from)}---->${peg(to)}`);
            if (towers[destination].length === count) {
                print("恭喜，游戏完成！");
                continuePrompt();
            } else {
                setPrompt("命令:");
            }
            return;
        }
        if (state === "auto") {
            if (command === "Q" && animationTimer !== null) {
                cancelled = true;
                print("正在停止自动移动……");
            }
            return;
        }
        if (state === "continue") drawMenu();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        acceptInput(input.value);
    });
    input.addEventListener("keydown", (event) => {
        if ((state === "boot" && /^[CQcq]$/.test(event.key)) || (state === "menu" && /^[0-9]$/.test(event.key))) {
            event.preventDefault();
            acceptInput(event.key);
        }
    });
    document.getElementById("terminal-screen").addEventListener("click", () => input.focus());

    print("请确认当前cmd窗口的大小为40行*120列以上，字体为新宋体/16，按C继续，Q退出");
    state = "boot";
    setPrompt("[C/Q]:");
})();
