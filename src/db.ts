import Dexie, { Table } from "dexie";

export interface Habit {
  id?: number;
  name: string;
  order: number;
  dates?: Date[];
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  habits!: Table<Habit>;

  constructor() {
    super("Butter");
    this.version(1).stores({
      habits: "++id, name, order", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();

db.on("populate", function () {
  db.habits.bulkAdd([
    { name: "Work out", order: 1 },
    { name: "Reading", order: 2 },
  ]);
});
