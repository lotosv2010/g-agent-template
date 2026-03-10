import { groupBy, uniqBy } from 'es-toolkit';

export interface NamedEntity {
  id: string | number;
  name: string;
}

export function dedupeById<T extends { id: string | number }>(items: T[]): T[] {
  return uniqBy(items, (item) => item.id);
}

export function groupByFirstLetter<T extends { name: string }>(items: T[]): Record<string, T[]> {
  return groupBy(items, (item) => {
    const first = item.name.trim().slice(0, 1).toUpperCase();
    return first || '#';
  });
}