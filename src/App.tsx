import {
  useEffect,
  // useEffect,
  useState,
} from "react";
import "./App.css";
import { supabase } from "./supabase-client";

interface Task {
  id?: string;
  title: string;
  description: string;
}

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getTasksList = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("error getting data ******* ", error);
    }

    console.log("checking data ****", data);
    setTasks(data as Task[]);
  };

  // @ts-ignore
  useEffect(() => {
    getTasksList();
  }, []);

  const deleteTaskById = async (id: string | number | undefined) => {
    if (!id) {
      return;
    }

    const { error, data } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log("error deleting task ********** ", error);
    }

    console.log("data ********** ", data);
    getTasksList();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const handleAddOrSave = async () => {
    if (!title.trim()) return;
    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: title.trim(), description: description.trim() }
            : t,
        ),
      );
      resetForm();
    } else {
      const newTask: Task = {
        title: title.trim(),
        description: description.trim(),
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert(newTask)
        .single();

      console.log("chekcing response for adding task****** data: ", data);
      console.log("chekcing response for adding task****** error: ", error);

      if (error) {
        console.log("error while adding task ****** ", error);
      }

      getTasksList();
      // setTasks((prev) => [newTask, ...prev]);
      resetForm();
    }
  };

  const handleEdit = (id: string | undefined) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    setTitle(t.title);
    setDescription(t.description);
    setEditingId(id ? id : null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <div className="space-y-2 mb-6">
        <input
          aria-label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          aria-label="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="w-full border p-2 rounded h-24"
        />

        <div className="flex gap-2">
          <button
            onClick={handleAddOrSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Save" : "Add task"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="border p-3 rounded">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-700">{task.description}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(task?.id)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTaskById(task?.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
