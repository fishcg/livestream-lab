const STORAGE_KEY = 'livelab-state-v1';
const initialState = {
  completedStages: [],
  certificateName: '',
  certificateIssuedAt: '',
  certificatePresented: false
};

function readState() {
  try {
    return { ...initialState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...initialState };
  }
}

let state = readState();
const listeners = new Set();

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener(getState()));
}

export function getState() {
  return structuredClone(state);
}

export function updateState(updater) {
  state = updater(getState());
  notify();
}

export function resetState() {
  state = { ...initialState };
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(getState());
  return () => listeners.delete(listener);
}
