import { Habit } from "../db";

export function exportToJson(fileName: string, habits?: Habit[]) {
  if (!habits?.length) {
    return;
  }
  const json = JSON.stringify(habits, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
export function exportToCsv(fileName: string, habits?: Habit[]) {
  if (!habits?.length) {
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,id,name,order,date\n";

  habits.forEach((habit) => {
    const { id, name, order, dates } = habit;

    if (dates && dates.length > 0) {
      dates.forEach((date) => {
        const formattedDate = date.toISOString().split("T")[0];
        csvContent += `${id || ""},${name},${order},${formattedDate}\n`;
      });
    } else {
      csvContent += `${id || ""},${name},${order},\n`;
    }
  });

  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.href = encodedUri;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}
export function importFromCsvOrJson(file: File): Promise<Habit[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const contents = event.target.result as string;

      if (file.type === "text/csv") {
        const habits = parseCsvData(contents);
        resolve(habits);
      } else if (file.type === "application/json") {
        const habits = parseJsonData(contents);
        resolve(habits);
      } else {
        reject(new Error("Unsupported file type"));
      }
    };

    reader.onerror = (event) => {
      reject(new Error("File read error"));
    };

    reader.readAsText(file);
  });
}

function parseCsvData(csvData: string): Habit[] {
  const lines = csvData.split("\n");
  const habitsMap: { [id: string]: Habit } = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line) {
      const values = line.split(",");
      const id = values[0];
      const name = values[1];
      const order = parseInt(values[2]);
      const date = values[3] ? new Date(values[3].trim()) : null;

      if (habitsMap[id]) {
        if (date) {
          habitsMap[id].dates?.push(date);
        }
      } else {
        habitsMap[id] = {
          id: id ? parseInt(id) : undefined,
          name,
          order,
          dates: date ? [date] : [],
        };
      }
    }
  }

  return Object.values(habitsMap);
}

export function parseJsonData(jsonData: string): Habit[] {
  const data = JSON.parse(jsonData);
  const habits: Habit[] = [];

  for (const item of data) {
    const habit: Habit = {
      id: item.id ? parseInt(item.id) : undefined,
      name: item.name,
      order: parseInt(item.order),
      dates: item.dates
        ? item.dates.map((dateStr: string) => new Date(dateStr))
        : undefined,
    };

    habits.push(habit);
  }

  return habits;
}
