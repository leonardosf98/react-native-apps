const EVENT_TYPES = {
  ENTRADA: "ENTRADA",
  SAIDA: "SAIDA",
  VENDA: "VENDA",
};

let eventCounter = 0;

function nextId() {
  eventCounter += 1;
  return `evt-${Date.now()}-${eventCounter}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSaleValue() {
  return randomBetween(15, 350) + Math.random();
}

function peakMultiplier() {
  const hour = new Date().getHours();
  if (hour >= 11 && hour <= 13) return 1.6;
  if (hour >= 17 && hour <= 20) return 1.8;
  if (hour >= 9 && hour <= 21) return 1.2;
  return 0.5;
}

function pickEventType(state) {
  const peak = peakMultiplier();
  const occupancyRatio = state.ocupacao / state.capacidade;

  let entradaWeight = 0.45 * peak;
  let saidaWeight = 0.3;
  let vendaWeight = 0.25 * (state.ocupacao > 0 ? 1 + occupancyRatio : 0);

  if (state.ocupacao <= 0) {
    saidaWeight = 0;
    vendaWeight = 0;
    entradaWeight = 1;
  }

  if (occupancyRatio >= 0.95) {
    entradaWeight *= 0.2;
    saidaWeight *= 1.8;
  }

  if (state.ocupacao >= state.capacidade) {
    entradaWeight = 0;
  }

  const total = entradaWeight + saidaWeight + vendaWeight;
  const roll = Math.random() * total;

  if (roll < entradaWeight) return EVENT_TYPES.ENTRADA;
  if (roll < entradaWeight + saidaWeight) return EVENT_TYPES.SAIDA;
  return EVENT_TYPES.VENDA;
}

function buildEvent(type, state) {
  const base = {
    id: nextId(),
    type,
    timestamp: new Date().toISOString(),
  };

  if (type === EVENT_TYPES.VENDA) {
    return {
      ...base,
      valor: Math.round(randomSaleValue() * 100) / 100,
      itens: randomBetween(1, 5),
    };
  }

  if (type === EVENT_TYPES.ENTRADA) {
    const grupos = Math.random() < 0.15 ? randomBetween(2, 4) : 1;
    return { ...base, pessoas: grupos };
  }

  return base;
}

function applyEvent(state, event) {
  const next = { ...state };

  if (event.type === EVENT_TYPES.ENTRADA) {
    const pessoas = event.pessoas ?? 1;
    const espaco = next.capacidade - next.ocupacao;
    const admitidas = Math.min(pessoas, espaco);
    next.ocupacao += admitidas;
    next.entradas += admitidas;
    return { state: next, event: { ...event, pessoas: admitidas } };
  }

  if (event.type === EVENT_TYPES.SAIDA) {
    if (next.ocupacao <= 0) {
      return { state: next, event: null };
    }
    next.ocupacao -= 1;
    next.saidas += 1;
    return { state: next, event };
  }

  if (event.type === EVENT_TYPES.VENDA) {
    if (next.ocupacao <= 0) {
      return { state: next, event: null };
    }
    next.vendas += 1;
    next.faturamento = Math.round((next.faturamento + event.valor) * 100) / 100;
    return { state: next, event };
  }

  return { state: next, event };
}

export function createInitialState(capacidade = 50) {
  const ocupacaoInicial = randomBetween(8, 22);
  return {
    capacidade,
    ocupacao: ocupacaoInicial,
    entradas: ocupacaoInicial,
    saidas: 0,
    vendas: randomBetween(3, 12),
    faturamento: randomBetween(400, 1800),
    historico: [{ hora: new Date().getHours(), ocupacao: ocupacaoInicial }],
  };
}

export function createMockBackend(initialState) {
  let state = { ...initialState };
  const listeners = new Set();
  let timer = null;
  let running = false;

  function notify(event) {
    listeners.forEach((listener) => listener({ event, state: { ...state } }));
  }

  function tick() {
    const type = pickEventType(state);
    const draft = buildEvent(type, state);
    const result = applyEvent(state, draft);

    if (!result.event) {
      scheduleNext();
      return;
    }

    state = result.state;
    state.historico = appendHistorico(state.historico, state.ocupacao);
    notify(result.event);
    scheduleNext();
  }

  function scheduleNext() {
    if (!running) return;
    const delay = randomBetween(1200, 4000) / peakMultiplier();
    timer = setTimeout(tick, delay);
  }

  return {
    getState() {
      return { ...state };
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start() {
      if (running) return;
      running = true;
      scheduleNext();
    },
    stop() {
      running = false;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
    simulateEntrada(pessoas = 1) {
      const event = buildEvent(EVENT_TYPES.ENTRADA, state);
      event.pessoas = pessoas;
      const result = applyEvent(state, event);
      if (!result.event) return;
      state = result.state;
      state.historico = appendHistorico(state.historico, state.ocupacao);
      notify(result.event);
    },
    simulateSaida() {
      const event = buildEvent(EVENT_TYPES.SAIDA, state);
      const result = applyEvent(state, event);
      if (!result.event) return;
      state = result.state;
      state.historico = appendHistorico(state.historico, state.ocupacao);
      notify(result.event);
    },
  };
}

function appendHistorico(historico, ocupacao) {
  const hora = new Date().getHours();
  const ultimo = historico[historico.length - 1];
  if (ultimo && ultimo.hora === hora) {
    return [...historico.slice(0, -1), { hora, ocupacao }];
  }
  return [...historico.slice(-11), { hora, ocupacao }];
}

export { EVENT_TYPES };
