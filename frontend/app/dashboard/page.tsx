"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiFetch("/api/notes", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch notes");
          return;
        }

        setNotes(data.notes);
      } catch (error) {
        console.error("Fetch notes error:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const openCreateForm = () => {
    setCreateError("");
    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    if (creating) {
      return;
    }

    setShowCreateForm(false);
    setTitle("");
    setContent("");
    setCreateError("");
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiFetch("/api/auth/me", {
          method: "GET",
        });
        const data = await response.json();

        if (!response.ok) {
          return;
        }

        setCurrentUser(data.user);
      } catch (error) {
        console.error("Fetch current user error:", error);
      }
    };

    fetchCurrentUser();
  }, []);
  const handleCreateNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreateError("");
    setCreating(true);

    try {
      const response = await apiFetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(data.message || "Failed to create note");
        return;
      }

      setNotes((currentNotes) => [data.note, ...currentNotes]);

      setTitle("");
      setContent("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Create note error:", error);
      setCreateError("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const openEditForm = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setUpdateError("");
  };

  const closeEditForm = () => {
    if (updating) {
      return;
    }

    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
    setUpdateError("");
  };

  const handleUpdateNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingNote) {
      return;
    }

    setUpdateError("");
    setUpdating(true);

    try {
      const response = await apiFetch(`/api/notes/${editingNote._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setUpdateError(data.message || "Failed to update note");
        return;
      }

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note._id === editingNote._id ? data.note : note,
        ),
      );

      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error("Update note error:", error);
      setUpdateError("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setDeletingId(noteId);

    try {
      const response = await apiFetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.message || "Failed to delete note");
        return;
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== noteId),
      );

      if (editingNote?._id === noteId) {
        setEditingNote(null);
        setEditTitle("");
        setEditContent("");
      }
    } catch (error) {
      console.error("Delete note error:", error);
      setDeleteError("Something went wrong");
    } finally {
      setDeletingId("");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Logout failed");
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-blue-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[clamp(240px,20vw,290px)] flex-col border-r border-slate-800 bg-slate-900/95 p-6 shadow-[0_0_50px_rgba(30,64,175,0.18)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(79,70,229,0.3)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-white"
                >
                  <path
                    d="M6 3.75h9.75L19 7v13.25H6V3.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 3.75V7h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11h6M9 14.5h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <h1 className="font-bold tracking-tight">Personal Notes</h1>

                <p className="text-xs text-slate-500">Private workspace</p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-slate-500 transition-all duration-300 hover:bg-white hover:text-slate-950 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-10">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Workspace
            </p>

            <nav>
              <Link
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white shadow-[0_0_25px_rgba(79,70,229,0.2)] transition-all duration-300 hover:from-white hover:to-white hover:text-slate-950"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M4 13h6V4H4v9ZM14 20h6v-9h-6v9ZM4 20h6v-3H4v3ZM14 8h6V4h-6v4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                Dashboard
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold">
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-200">
                  {currentUser?.name || "Loading..."}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {currentUser?.email || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M10 17l5-5-5-5M15 12H4M20 4v16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <section className="min-h-screen lg:pl-[clamp(240px,20vw,290px)]">
        <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 px-6 py-5 backdrop-blur-xl sm:px-8 bg-transparent">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-300 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950 lg:hidden"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div>
                <p className="text-sm font-medium text-blue-400">
                  Your workspace
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  My Notes
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(79,70,229,0.2)] transition-all duration-300 hover:from-white hover:to-white hover:text-slate-950 sm:px-5 sm:py-3 sm:text-base"
            >
              + New Note
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(79,70,229,0.08)]">
              <p className="text-sm font-medium text-slate-500">Total Notes</p>

              <p className="mt-3 text-4xl font-bold">{notes.length}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(79,70,229,0.08)]">
              <p className="text-sm font-medium text-slate-500">Recent Notes</p>

              <p className="mt-3 text-4xl font-bold">
                {Math.min(notes.length, 5)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_30px_rgba(79,70,229,0.08)]">
              <p className="text-sm font-medium text-slate-500">Workspace</p>

              <p className="mt-3 text-2xl font-bold text-blue-400">Private</p>
            </div>
          </div>

          {showCreateForm && (
            <section className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(79,70,229,0.08)] sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  New Note
                </p>

                <h2 className="mt-2 text-2xl font-bold">Create a new note</h2>

                <p className="mt-2 text-sm text-slate-500">
                  Write down your thoughts, ideas, or anything you want to
                  remember.
                </p>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-5">
                <div>
                  <label
                    htmlFor="note-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Title
                  </label>

                  <input
                    id="note-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter note title"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="note-content"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Content
                  </label>

                  <textarea
                    id="note-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write your note..."
                    rows={7}
                    required
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {createError && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400">
                    {createError}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCreateForm}
                    disabled={creating}
                    className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {editingNote && (
            <section className="mb-10 rounded-3xl border border-blue-500/20 bg-slate-900/70 p-6 shadow-[0_0_40px_rgba(79,70,229,0.1)] sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Edit Note
                </p>

                <h2 className="mt-2 text-2xl font-bold">Update your note</h2>

                <p className="mt-2 text-sm text-slate-500">
                  Make your changes and save the updated note.
                </p>
              </div>

              <form onSubmit={handleUpdateNote} className="space-y-5">
                <div>
                  <label
                    htmlFor="edit-note-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Title
                  </label>

                  <input
                    id="edit-note-title"
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    placeholder="Enter note title"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-note-content"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Content
                  </label>

                  <textarea
                    id="edit-note-content"
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    placeholder="Write your note..."
                    rows={7}
                    required
                    className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {updateError && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400">
                    {updateError}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeEditForm}
                    disabled={updating}
                    className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <div className="mt-8">
            {deleteError && (
              <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400">
                {deleteError}
              </p>
            )}
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-52 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <p className="text-sm font-semibold text-red-400">{error}</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
                    <path
                      d="M6 3.75h9.75L19 7v13.25H6V3.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 3.75V7h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11h6M9 14.5h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2 className="mt-6 text-xl font-bold text-white">
                  No notes yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Your personal notes will appear here once you create your
                  first one.
                </p>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-950"
                >
                  Create Your First Note
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {notes.map((note) => (
                  <article
                    key={note._id}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900"
                  >
                    <h2 className="line-clamp-2 text-xl font-bold text-white">
                      {note.title}
                    </h2>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-400">
                      {note.content}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                      <span className="text-xs text-slate-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => openEditForm(note)}
                          className="text-sm font-semibold text-blue-400 transition-all duration-300 hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note._id)}
                          disabled={deletingId === note._id}
                          className="text-sm font-semibold text-red-400 transition-all duration-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === note._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </section>
    </main>
  );
}
