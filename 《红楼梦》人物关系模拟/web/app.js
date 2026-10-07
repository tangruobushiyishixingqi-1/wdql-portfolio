(() => {
  const characters = ['宝玉', '黛玉', '宝钗', '贾母', '王熙凤', '探春'];
  const events = [
    ['共读西厢', .6], ['黛玉葬花', .7], ['赠送手帕', .5], ['诗社题诗', .4],
    ['宝黛争吵', -.6], ['宝钗劝学', -.2], ['金玉良缘传闻', -.8], ['病中探望', .5],
    ['元妃省亲', .2], ['宝玉挨打', .3], ['抄检大观园', -.4], ['黛玉病重', -.7]
  ];
  const descriptions = {
    '共读西厢': '宝玉与黛玉在大观园共读《西厢记》，暗生情愫，感情升温。',
    '黛玉葬花': '黛玉葬花吟诗，宝玉听后深感共鸣，二人心灵相通。',
    '赠送手帕': '宝玉赠黛玉旧手帕，传递深情，黛玉题诗其上，定情之物。',
    '诗社题诗': '众人在诗社题诗，宝黛诗词唱和，展现才情与默契。',
    '宝黛争吵': '二人因误会争吵，黛玉伤心落泪，关系出现裂痕。',
    '宝钗劝学': '宝钗劝宝玉读书上进，黛玉心生醋意，感情受考验。',
    '金玉良缘传闻': '贾府流传金玉良缘之说，黛玉深感不安，爱情面临危机。',
    '病中探望': '黛玉病中，宝玉悉心探望，关怀备至，感情加深。',
    '元妃省亲': '元妃省亲大典，贾府繁华，宝黛相见机会增多。',
    '宝玉挨打': '宝玉因金钏之事挨打，黛玉心疼探望，二人感情深化。',
    '抄检大观园': '贾府抄检大观园，众人心寒，宝黛感情受环境影响。',
    '黛玉病重': '黛玉病情加重，身体衰弱，爱情面临生死考验。'
  };
  const excerpts = {
    '共读西厢': ['第二十三回 西厢记妙词通戏语', '黛玉把花具且都放下，接书来瞧，从头看去，越看越爱看，不到一顿饭工夫，将十六出俱已看完，自觉词藻警人，余香满口。', '宝玉笑道：“妹妹，你说好不好？”黛玉笑道：“果然有趣。”'],
    '黛玉葬花': ['第二十七回 滴翠亭杨妃戏彩蝶 埋香冢飞燕泣残红', '黛玉道：“撂在水里不好。你看这里的水干净，只一流出去，有人家的地方脏的臭的混倒，仍旧把花遭蹋了。那畸角上我有一个花冢，如今把他扫了，装在这绢袋里，拿土埋上，日久不过随土化了，岂不干净。”'],
    '赠送手帕': ['第三十四回 情中情因情感妹妹 错里错以错劝哥哥', '这里林黛玉体贴出手帕子的意思来，不觉神魂驰荡：宝玉这番苦心，能领会我这番苦意，又令我可喜；我这番苦意，不知将来如何，又令我可悲。', '尺幅鲛绡劳解赠，叫人焉得不伤悲！'],
    '诗社题诗': ['第三十七回 秋爽斋偶结海棠社 蘅芜苑夜拟菊花题', '半卷湘帘半掩门，碾冰为土玉为盆。\n偷来梨蕊三分白，借得梅花一缕魂。\n月窟仙人缝缟袂，秋闺怨女拭啼痕。\n娇羞默默同谁诉，倦倚西风夜已昏。'],
    '宝黛争吵': ['第二十九回 享福人福深还祷福 痴情女情重愈斟情', '如此看来，却都是求近之心，反弄成疏远之意。', '宝玉道：“你也不用说，我知道你的心意了。我为你也弄了一身的病在这里，又不敢告诉人，只好掩着。只等你的病好了，只怕我的病才得好呢。睡里梦里也忘不了你！”'],
    '宝钗劝学': ['第三十二回 诉肺腑心迷活宝玉 含耻辱情烈死金钏', '宝钗素习看去，豁达大度，随分从时，不比黛玉孤高自许，目无下尘，故比黛玉大得下人之心。', '宝玉会过雨村回来，听了宝钗一番劝学的话，心中不大受用，便赌气回到房中，躺在床上，只是闷闷的。'],
    '金玉良缘传闻': ['第二十八回 蒋玉菡情赠茜香罗 薛宝钗羞笼红麝串', '宝钗因往日母亲对王夫人等曾提过“金锁是个和尚给的，等日后有玉的方可结为婚姻”等语，所以总远着宝玉。昨儿见元春所赐的东西，独他与宝玉一样，心里越发没意思起来。'],
    '病中探望': ['第三十四回 情中情因情感妹妹 错里错以错劝哥哥', '宝玉因金钏之事挨打，卧床养伤。黛玉心中又气又疼，气的是宝玉不肖，疼的是宝玉受苦。这日傍晚，黛玉悄悄来至怡红院，见宝玉正躺着，便坐在床边，只是哭泣，半晌，方抽抽噎噎的说道：“你从此可都改了罢！”'],
    '元妃省亲': ['第十八回 皇恩重元妃省父母 天伦乐宝玉呈才藻', '元妃入室，更衣毕复出，上舆进园。只见园中香烟缭绕，花彩缤纷，处处灯光相映，时时细乐声喧，说不尽这太平气象，富贵风流。', '黛玉笑道：“你只管作，我替你改。”宝玉听了，喜不自禁，便忙忙的构思起来。'],
    '宝玉挨打': ['第三十三回 手足耽耽小动唇舌 不肖种种大承笞挞', '贾政听了，那泪珠更似滚瓜一般滚了下来，又问道：“还有呢？”宝玉听说，便低了头，不敢再说。贾政便命人：“拿大棍来，着实打死！”众小厮们不敢违拗，只得将宝玉按在凳上，举起大棍，打了十来下。'],
    '抄检大观园': ['第七十四回 惑奸谗抄检大观园 矢孤介杜绝宁国府', '黛玉在房中，听得园中吵嚷，不知何事，正自猜疑，只见紫鹃进来，悄悄的说道：“姑娘，不好了，园里抄检起来了。”黛玉听了，心中一惊，不觉落下泪来，道：“这园子也住不得了，大家散了吧。”'],
    '黛玉病重': ['第九十七回 林黛玉焚稿断痴情 薛宝钗出闺成大礼', '黛玉听了，竟是痴了。两手仍旧紧紧攥着，狠命的往死里攥，那汗愈多，痰愈涌，喘愈急。', '黛玉自料万无生理，遂挣扎着向紫鹃说道：“妹妹，你是我最知心的，虽是老太太派你服侍我这几年，我拿你就当我的亲妹妹。”']
  };

  const $ = (id) => document.getElementById(id);
  let relation;
  let previous;
  let initialRelation = .6;
  let step = 0;
  let currentEvent = null;
  let bestSequence = null;
  const paramsUsed = [0, 0, 0, 0];

  function randomMatrix() {
    const matrix = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => Math.random() * .2 - .1));
    const pairs = { '0,1': .6, '0,2': .2, '1,2': -.2 };
    Object.entries(pairs).forEach(([key, value]) => {
      const [a, b] = key.split(',').map(Number); matrix[a][b] = matrix[b][a] = value;
    });
    return matrix;
  }
  function clone(matrix) { return matrix.map((row) => row.slice()); }
  function resetModel() {
    relation = randomMatrix(); previous = clone(relation); step = 0; currentEvent = null; bestSequence = null;
  }
  function baodai(matrix = relation) { return matrix[0][1]; }
  function neighbors(matrix, a, b) {
    const list = [];
    for (let k = 0; k < 6; k++) if (k !== a && k !== b) list.push(matrix[a][k], matrix[b][k]);
    return list;
  }
  function update(eventValue, params, matrix = relation, randomEmotion = true) {
    const old = clone(matrix); const next = clone(matrix);
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) {
      const neighborValues = neighbors(old, i, j);
      const neighborMean = neighborValues.reduce((sum, value) => sum + value, 0) / neighborValues.length;
      const emotion = randomEmotion ? Math.random() * .4 - .2 : 0;
      const value = params[2] * old[i][j] + params[0] * neighborMean + 1.5 * params[1] * eventValue + params[3] * emotion;
      next[i][j] = next[j][i] = .999 * Math.tanh(value);
    }
    return next;
  }
  function randParams() { return Array.from({ length: 4 }, () => Math.random()); }
  function predictProbability(baseMatrix, params) {
    let success = 0;
    for (let run = 0; run < 50; run++) {
      let test = clone(baseMatrix);
      for (let i = 0; i < 10; i++) test = update(events[Math.floor(Math.random() * events.length)][1], params, test);
      if (baodai(test) > .6) success++;
    }
    return success / 50;
  }
  function logLine(text = '') {
    const log = $('log'); log.textContent += `${text}\n`; log.scrollTop = log.scrollHeight;
  }
  function relationTable(matrix) {
    logLine('人物关系值（范围 −1 ~ 1）');
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) logLine(`${characters[i]} 与 ${characters[j]}：${matrix[i][j].toFixed(3)}`);
  }
  function renderDashboard(change = null) {
    const value = baodai();
    $('initial-value').textContent = initialRelation.toFixed(3);
    $('current-value').textContent = value.toFixed(3);
    $('meter-fill').style.width = `${Math.max(0, Math.min(100, (value + 1) * 50))}%`;
    $('meter-fill').style.background = value > .5 ? '#6b8e6b' : value > 0 ? '#d4a574' : '#c85a5a';
    $('meter-label').textContent = `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
    const indicator = $('change-label');
    if (change === null) { indicator.textContent = step ? '—' : '→ 等待选择事件'; indicator.style.color = ''; }
    else { indicator.textContent = `${change > 0 ? '↑' : change < 0 ? '↓' : '→'} ${change >= 0 ? '+' : ''}${change.toFixed(3)}`; indicator.style.color = change > 0 ? '#477653' : change < 0 ? '#b23d45' : ''; }
  }
  const positions = [[108, 170], [300, 83], [500, 166], [420, 292], [185, 292], [310, 212]];
  function renderNetwork() {
    const svg = $('network'); const edges = [];
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) {
      const [x1, y1] = positions[i], [x2, y2] = positions[j], value = relation[i][j];
      const color = i === 0 && j === 1 ? '#c85a5a' : value > .3 ? '#e74c3c' : value < -.3 ? '#3498db' : '#a7a29b';
      const width = i === 0 && j === 1 ? 5 : Math.max(1, Math.abs(value) * 5);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      edges.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" opacity=".65"/><text x="${mx}" y="${my - 4}" class="edge-label">${value.toFixed(2)}</text>`);
    }
    const nodes = positions.map(([x, y], i) => {
      const radius = i < 2 ? 31 : 25; const fill = i === 0 ? '#ffe4e1' : i === 1 ? '#e6e6fa' : '#f0f8ff';
      return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="#786858" stroke-width="1.5"/><text x="${x}" y="${y + 5}" class="node-label">${characters[i]}</text>`;
    }).join('');
    svg.innerHTML = `<g>${edges.join('')}</g><g>${nodes}</g>`;
    if (!$('show-viz').checked) svg.closest('.visualization-panel').hidden = true;
    else svg.closest('.visualization-panel').hidden = false;
  }
  function drawParamCharts(params, eventValue) {
    const names = ['α 邻居效应', 'β 事件效应', 'γ 惯性', 'δ 情绪']; const container = $('parameter-charts'); container.innerHTML = '';
    names.forEach((name, index) => {
      const wrap = document.createElement('div'); wrap.className = 'mini-chart';
      const title = document.createElement('h3'); title.textContent = name; const canvas = document.createElement('canvas'); canvas.width = 300; canvas.height = 110;
      wrap.append(title, canvas); container.append(wrap);
      const ctx = canvas.getContext('2d'); const original = relation;
      const samples = Array.from({ length: 20 }, (_, i) => {
        const p = params.slice(); p[index] = i / 19;
        return baodai(update(eventValue, p, original, false));
      });
      const min = Math.min(-1, ...samples), max = Math.max(1, ...samples), pad = 9;
      ctx.strokeStyle = '#ddd5ca'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, 55); ctx.lineTo(291, 55); ctx.stroke();
      ctx.strokeStyle = '#617f9b'; ctx.lineWidth = 2; ctx.beginPath();
      samples.forEach((value, i) => { const x = pad + i * (282 / 19); const y = 100 - ((value - min) / (max - min)) * 90; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    });
    $('parameter-panel').hidden = !$('show-param').checked;
  }
  function renderEvent(eventIndex, before, change, params, probability) {
    const [name, eventValue] = events[eventIndex]; currentEvent = eventIndex;
    document.querySelectorAll('.event-button').forEach((button) => button.classList.toggle('active', Number(button.dataset.index) === eventIndex));
    const impactColor = change > 0 ? '#477653' : change < 0 ? '#b23d45' : '#6b5344';
    $('event-info').innerHTML = `<small>第 ${step} 步 · 基础影响 ${eventValue > 0 ? '+' : ''}${eventValue.toFixed(1)}</small><h3>${name}</h3><span class="event-impact" style="color:${impactColor}">实际影响 ${change > 0 ? '+' : ''}${change.toFixed(3)}</span><p>${descriptions[name]}</p><p>木石前盟模拟概率：${(probability * 100).toFixed(2)}%</p>`;
    $('excerpt').innerHTML = `<h3>【${name}】</h3>${excerpts[name].map((part) => `<p>${part.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>`).join('')}`;
    renderDashboard(change); renderNetwork(); drawParamCharts(params, eventValue);
    $('status').textContent = `✓ 第 ${step} 步完成：${name}（变化 ${change >= 0 ? '+' : ''}${change.toFixed(3)}）`;
  }
  function runEvent(eventIndex) {
    const [name, eventValue] = events[eventIndex]; const before = baodai(); step++;
    logLine(`\n${'='.repeat(45)}\n第 ${step} 步 - ${name}\n${'='.repeat(45)}`);
    logLine(`事件发生前宝玉-黛玉关系值：${before.toFixed(3)}`);
    logLine(`事件基础影响参数：${eventValue >= 0 ? '+' : ''}${eventValue.toFixed(1)}`);
    const params = randParams(); paramsUsed.splice(0, 4, ...params);
    previous = clone(relation); relation = update(eventValue, params);
    const after = baodai(); const change = after - before;
    logLine(`\n事件发生后关系值：${after.toFixed(3)}\n本次实际变化：${change >= 0 ? '+' : ''}${change.toFixed(3)}\n与初始值对比：${(after - initialRelation) >= 0 ? '+' : ''}${(after - initialRelation).toFixed(3)}`);
    logLine(`\n影响因素：基础值 ${eventValue >= 0 ? '+' : ''}${eventValue.toFixed(1)} · 当前状态 ${before.toFixed(3)} · 邻居关系效应 · 随机情绪 ±0.2`);
    logLine(`参数优化结果：α=${params[0].toFixed(2)}, β=${params[1].toFixed(2)}, γ=${params[2].toFixed(2)}, δ=${params[3].toFixed(2)}`);
    relationTable(relation);
    const probability = predictProbability(relation, params);
    logLine(`\n木石前盟发生概率：${(probability * 100).toFixed(2)}%`);
    renderEvent(eventIndex, before, change, params, probability);
  }
  function setBusy(busy) { document.querySelectorAll('.event-button').forEach((button) => { button.disabled = busy; }); $('optimize').disabled = busy; }
  function buildEventButtons() {
    const box = $('events');
    events.forEach(([name, value], index) => {
      const button = document.createElement('button'); button.className = 'event-button'; button.dataset.index = index;
      button.textContent = `${index + 1}. ${name}`;
      button.title = `事件基础影响：${value > 0 ? '+' : ''}${value.toFixed(1)}`;
      button.addEventListener('click', () => runEvent(index)); box.append(button);
    });
  }
  function searchBestSequence() {
    setBusy(true); $('status').textContent = '正在搜索最优事件顺序…'; logLine('\n开始搜索最优事件顺序（30 轮，每轮随机抽取 4 个不同事件）');
    let best = null; let bestProbability = 0;
    for (let iteration = 0; iteration < 30; iteration++) {
      const pool = events.map((_, i) => i);
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const shuffled = pool.slice(0, 4);
      let test = clone(relation);
      shuffled.forEach((index) => { test = update(events[index][1], randParams(), test); });
      const score = Math.max(0, Math.min(1, (test[0][1] + 1) / 2));
      if (score > bestProbability) { bestProbability = score; best = shuffled; }
    }
    bestSequence = best || [];
    const names = bestSequence.map((index) => events[index][0]);
    logLine(`搜索完成。最优顺序：${names.join(' → ')}`); logLine(`木石前盟概率：${(bestProbability * 100).toFixed(2)}%`);
    const card = $('optimizer-result'); card.hidden = false;
    card.innerHTML = `<div class="panel-title"><span>搜索结果</span><h2>✦ 最优剧情顺序</h2></div><p class="sequence">${names.join(' → ') || '未找到有效序列'}</p><p>按模型关系值换算的概率：${(bestProbability * 100).toFixed(2)}%</p><button id="apply-sequence">应用此顺序</button><button id="dismiss-sequence">暂不应用</button>`;
    $('apply-sequence').addEventListener('click', () => { bestSequence.forEach((index, i) => setTimeout(() => runEvent(index), i * 350)); card.hidden = true; });
    $('dismiss-sequence').addEventListener('click', () => { card.hidden = true; $('status').textContent = '就绪 · 最优顺序已找到但未应用'; });
    $('status').textContent = `最优顺序完成 · 概率 ${(bestProbability * 100).toFixed(1)}%`;
    setBusy(false);
  }
  function resetSimulation() {
    if (!window.confirm('确定要重置所有关系数据吗？当前进度将清空。')) return;
    resetModel(); $('log').textContent = ''; $('event-info').innerHTML = '<h3>请选择事件</h3><p>从左侧选择一个剧情事件，查看它对宝黛关系的实际影响。</p>';
    $('excerpt').innerHTML = '<h3>原著节选</h3><p>请从左侧选择一个事件，此处将显示该事件在《红楼梦》原著中的经典片段。</p><p>通过阅读原著，理解事件对宝黛关系的影响，感受曹雪芹笔下的细腻情感。</p>';
    $('optimizer-result').hidden = true; document.querySelectorAll('.event-button').forEach((button) => button.classList.remove('active'));
    logLine('🏮 红楼梦人物关系模拟系统已启动'); logLine(`初始宝玉-黛玉关系值：${initialRelation.toFixed(3)}（固定参考基准）`);
    logLine('提示：同一事件在不同状态下效果不同，事件顺序、其他人物关系和随机情绪都会产生影响。');
    renderDashboard(); renderNetwork(); $('status').textContent = '已重置 · 请选择事件开始模拟';
  }

  buildEventButtons(); resetModel(); renderDashboard(); renderNetwork();
  logLine('🏮 红楼梦人物关系模拟系统已启动'); logLine(`初始宝玉-黛玉关系值：${initialRelation.toFixed(3)}（固定参考基准）`);
  logLine('提示：同一事件在不同状态下效果不同，事件顺序、其他人物关系和随机情绪都会产生影响。');
  $('optimize').addEventListener('click', searchBestSequence);
  $('reset').addEventListener('click', resetSimulation);
  $('clear-log').addEventListener('click', () => { $('log').textContent = ''; });
  $('show-viz').addEventListener('change', renderNetwork);
  $('show-param').addEventListener('change', () => { $('parameter-panel').hidden = !$('show-param').checked; });
})();
