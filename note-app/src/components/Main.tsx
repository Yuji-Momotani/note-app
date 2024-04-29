import React from 'react';
import "./Main.css";
import { Note } from "../types/Note";
import Markdown from 'react-markdown';

type MainProps = {
	displayNote: Note | undefined;
	onUpdateNote: (updateNote: Note) => void
}

const Main = ({displayNote, onUpdateNote}:MainProps) => {
	type EditKey = "title" | "content";
	
	
	const onEditeNote = (key: EditKey, value: string, editNote: Note) => {
		onUpdateNote({
			...editNote,
			[key]: value,
			updated_at: Date.now()
		})
	}

	if (!displayNote) {
		return (
			<div className="no-active-note">ノートが選択されていません</div>
		)
	}
	return (
		<div className="app-main">
			<div className="app-main-note-edit">
				<input id="title" type="text" value={displayNote.title}
					onChange={(e) => onEditeNote("title", e.target.value, displayNote)}
				/>
				<textarea id="content" placeholder="ノート内容を記入"
					onChange={(e) => onEditeNote("content", e.target.value, displayNote)}
					value={displayNote.content}
				>
				</textarea>
			</div>
			<div className="app-main-note-preview">
				<h1 className="preview-title">{displayNote.title}</h1>
				<Markdown className="markdown-preview">
					{displayNote.content}
				</Markdown>
			</div>
		</div>
	)
}

export default Main;