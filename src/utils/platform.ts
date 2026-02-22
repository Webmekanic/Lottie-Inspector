export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPad/.test(navigator.platform);
}

export function getModifierKey(): string {
  return isMacOS() ? '⌘' : 'Ctrl';
}

export function getShiftKey(): string {
  return isMacOS() ? '⇧' : 'Shift';
}
