import React from 'react';
import "./Sidebar.css";
import { Note } from "../types/Note";

type SidebarProps = {
	onAddNote: () => void;
	onDeleteNote: (id: string) => void;
	notes : Note[];
	activeNoteId: string;
	changeActiveNote: (id: string) => void;
}

const Sidebar = ({onAddNote, notes, onDeleteNote, activeNoteId, changeActiveNote}: SidebarProps) => {
	return (
		<div className="app-sidebar">
			<div className="app-sidebar-header">
				<h1>ノート</h1>
				<button onClick={onAddNote}>追加</button>
			</div>
			<div className="app-sidebar-notes">
				{notes.map((note: Note) => (
					<div className={`app-sidebar-note ${note.id === activeNoteId && "active"}`} key={note.id} onClick={() => changeActiveNote(note.id)}>
						<div className="sidebar-note-title">
							<strong>{note.title}</strong>
							<button onClick={() => onDeleteNote(note.id)}>削除</button>
						</div>
					<p>{note.content}</p>
					<small>最後の修正日:{new Date(note.updated_at).toLocaleString("ja-JP", {
						hour: "2-digit",
						minute: "2-digit",
					})}</small>
				</div>
				))}
			</div>

		</div>
	)
}

export default Sidebar;