import { useState } from "react";
import styles from "./App.module.less";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { Button, Input } from "@douyinfe/semi-ui";
import HabitItem from "./components/HabitItem";
function TimeScale() {
  const [name, setName] = useState("");
  const habits = useLiveQuery(() => db.habits?.toArray());

  async function addHabit() {
    try {
      // Add the new friend!
      await db.habits.add({
        name,
      });
      setName("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${styles.home} `}>
      <div className="flex sticky top-0 py-4 bg-white z-30">
        <Input
          className="mr-2"
          type="text"
          value={name}
          onEnterPress={addHabit}
          onChange={(e) => setName(e)}
        />
        <Button onClick={addHabit} theme="solid" type="primary">
          Add
        </Button>
      </div>
      <div>
        {habits?.map((habit) => (
          <HabitItem key={habit.id} data={habit} />
        ))}
      </div>
    </div>
  );
}

export default TimeScale;
