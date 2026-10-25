"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  subject: string;
  hours: number;
  priority: "Low" | "Medium" | "High";
  category: string;
  done: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("1");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [timer, setTimer] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("smart-study-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      console.error("Could not load saved tasks.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("smart-study-tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  function addTask() {
    if (!subject.trim()) return;
    setTasks((previous) => [
      ...previous,
      {
        id: Date.now(),
        subject: subject.trim(),
        hours: Number(hours),
        priority,
        category,
        done: false,
      },
    ]);
    setSubject("");
  }

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;
  const plannedHours = tasks.reduce(
    (total, task) => total + task.hours,
    0
  );
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.subject
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.done) ||
      (filter === "Pending" && !task.done);
    return matchesSearch && matchesFilter;
  });

  function formatTime(seconds: number) {
    return `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold tracking-widest text-cyan-400">
              YOUR PERSONAL LEARNING SPACE
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Smart Study Planner 📚
            </h1>
         <p className="mt-2 text-slate-400">
  Your personal space to plan, focus, and learn.
</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <p className="text-sm text-slate-400">Daily motivation</p>
            <p className="mt-1 font-semibold text-cyan-300">
              One step at a time ✨
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total tasks", value: tasks.length, icon: "📋" },
            { label: "Completed", value: completed, icon: "✅" },
            { label: "Remaining", value: pending, icon: "🎯" },
            { label: "Study hours", value: plannedHours, icon: "⏳" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-sm text-slate-400">
                {item.icon} {item.label}
              </p>
              <p className="mt-3 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Your progress</h2>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {tasks.length === 0
              ? "Add your first task to begin your journey."
              : `${completed} of ${tasks.length} tasks completed. Keep going!`}
          </p>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Create a study task</h2>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                addTask();
              }}
            >
              <div>
                <label className="text-sm text-slate-300">
                  Subject or task
                </label>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Mathematics revision"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                >
                  <option>General</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>Languages</option>
                  <option>Technology</option>
                  <option>Exam preparation</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300">
                    Study hours
                  </label>
                  <select
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                  >
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as Task["priority"])
                    }
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-400 p-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                + Add to my plan
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">Focus timer ⏱️</h2>
            <p className="mt-2 text-sm text-slate-400">
              Try a 25-minute focused study session.
            </p>
            <div className="my-7 text-center text-6xl font-bold tabular-nums text-cyan-300">
              {formatTime(timer)}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setTimerRunning((running) => !running)}
                className="rounded-lg bg-cyan-400 px-5 py-3 font-bold text-slate-950"
              >
                {timerRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimer(25 * 60);
                }}
                className="rounded-lg border border-slate-600 px-5 py-3 font-semibold hover:bg-slate-800"
              >
                Reset
              </button>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold">My study tasks</h2>
            <span className="text-sm text-cyan-400">
              {completed}/{tasks.length} completed
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subjects..."
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {visibleTasks.length === 0 ? (
              <p className="rounded-lg bg-slate-800 p-5 text-slate-400">
                {tasks.length === 0
                  ? "No tasks yet. Add your first subject above!"
                  : "No tasks match your search or filter."}
              </p>
            ) : (
              visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-800 p-4"
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() =>
                      setTasks((previous) =>
                        previous.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item
                        )
                      )
                    }
                    className="h-5 w-5 accent-cyan-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        task.done
                          ? "break-words text-slate-500 line-through"
                          : "break-words font-semibold"
                      }
                    >
                      {task.subject}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {task.category} · {task.hours} hour(s)
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      task.priority === "High"
                        ? "bg-rose-950 text-rose-300"
                        : task.priority === "Medium"
                        ? "bg-amber-950 text-amber-300"
                        : "bg-emerald-950 text-emerald-300"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() =>
                      setTasks((previous) =>
                        previous.filter((item) => item.id !== task.id)
                      )
                    }
                    aria-label={`Delete ${task.subject}`}
                    className="rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-950"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="py-8 text-center text-sm text-slate-500">
          Built with Next.js and Tailwind CSS · Small steps lead to big results ✨
        </footer>
      </div>
    </main>
  );
}