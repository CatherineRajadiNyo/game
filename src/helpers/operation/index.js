const ALLOWED_KEYS = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
}

const operation = {
  [ALLOWED_KEYS.ArrowLeft]: { x: 0, y: -1 },
  [ALLOWED_KEYS.ArrowRight]: { x: 0, y: 1 },
  [ALLOWED_KEYS.ArrowUp]: { x: -1, y: 0 },
  [ALLOWED_KEYS.ArrowDown]: { x: 1, y: 0 },
}

export default operation
