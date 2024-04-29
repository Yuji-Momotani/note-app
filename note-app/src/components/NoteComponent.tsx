import { useEffect, useState } from "react";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { EditNote, Note, ResponseNote } from "../types/Note";
// import uuid from 'react-uuid';
import axios from "axios";
import useError from "../hooks/useError";

const NoteComponent = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [activeNoteId, setActiveNoteId] = useState<string>("");
	const [isUpdateNote, setIsUpdateNote] = useState<EditNote>({isUpdate:false, updateNoteId: activeNoteId});
	const { switchErrorHandling } = useError();

	useEffect(() => {
		const getCsrf = async() => {
			axios.defaults.withCredentials = true;
			const {data} = await axios.get(
				`${process.env.REACT_APP_API_URL}/csrf`
			);
			axios.defaults.headers.common["X-CSRF-Token"] = data.csrf_token;
		};
		getCsrf();
		const getUserByNote = async() => {
			debugger;
			try {
				const res = await axios.get<ResponseNote[]>(
					`${process.env.REACT_APP_API_URL}/note`
				);
				const data: Note[] = res.data.map((note:ResponseNote) => {
					return {
						id: note.id,
						title: note.title,
						content: note.content,
						updated_at: new Date(note.updated_at).valueOf(),
					}
				})
				setNotes(data);
				console.log(notes)
			} catch (err:any) {
				if (err.response.data.message) {
					// csrf,jwtミドルウェア系のエラーはmessageに入る
					switchErrorHandling(err.response.data.message);
				} else {
					switchErrorHandling(err.response.data);
				}
			}
		}
		getUserByNote();
	},[]);

	const onAddNote = async() => {
		debugger;
		try {
			const res = await axios.post<ResponseNote>(
				`${process.env.REACT_APP_API_URL}/note`,
				{
					title: "New Note",
					content: "",
				}
			);
			// setNotes((prev: Note[]) => [{
			// 	id: res.data.id,
			// 	title: res.data.title,
			// 	content: res.data.content,
			// 	updated_at: res.data.updated_at,
			// },...prev]);
			setNotes((prev: Note[]) => [{
				id: res.data.id,
				title: res.data.title,
				content: res.data.content,
				updated_at: new Date(res.data.updated_at).valueOf(),
			}, ...prev])
			console.log(notes)
		} catch (err:any) {
			if (err.response.data.message) {
				// csrf,jwtミドルウェア系のエラーはmessageに入る
				switchErrorHandling(err.response.data.message);
			} else {
				switchErrorHandling(err.response.data);
			}
		}
	}

	const onDeleteNote = async(id: string) => {
		debugger;
		try {
			await axios.delete(
				`${process.env.REACT_APP_API_URL}/note/${id}`,
			);
			const filterNotes = notes.filter((note:Note) => note.id !== id);
			setNotes(filterNotes);
		} catch (err:any) {
			if (err.response.data.message) {
				// csrf,jwtミドルウェア系のエラーはmessageに入る
				switchErrorHandling(err.response.data.message);
			} else {
				switchErrorHandling(err.response.data);
			}
		}
	}

	const getActiveNote = () => {
		return notes.find((note) => note.id === activeNoteId);
	}

	const onUpdateNote = async(updateNote: Note) => {
		const updateNotesArray = notes.map((note) => {
			return note.id === updateNote.id ? updateNote : note
		}).sort((a, b) => b.updated_at - a.updated_at);
		setNotes(updateNotesArray);
		setIsUpdateNote((prev) => ({
			...prev,
			isUpdate: true
		}));
	}

	const changeActiveNote = async(id: string) => {
		debugger;
		try {
			if (!isUpdateNote.updateNoteId) {
				// isUpdateNoteを初期化する
				const changeEditNote: EditNote = {
					isUpdate: false,
					updateNoteId: id
				}
				setIsUpdateNote(changeEditNote);
				setActiveNoteId(id);
				return;
			}

			const updateNote = notes.find((n:Note) => n.id === isUpdateNote.updateNoteId);
			if (!updateNote) throw new Error("予期せぬエラーが発生：更新対象のノートが見つかりません");
			
			if(isUpdateNote.isUpdate) {
				const res = await axios.put<ResponseNote>(
					`${process.env.REACT_APP_API_URL}/note/${updateNote.id}`,
					{
						title: updateNote.title,
						content: updateNote.content,
						//更新時間は多少ズレるが今回は許容する
					}
				);
				console.log(res);
			}
			const updateNotesArray = notes.map((note) => {
				return note.id === updateNote.id ? updateNote : note
			}).sort((a, b) => b.updated_at - a.updated_at);
			setNotes(updateNotesArray);
	
			// isUpdateNoteを初期化する
			const changeEditNote: EditNote = {
				isUpdate: false,
				updateNoteId: id
			}
			setIsUpdateNote(changeEditNote);
	
			setActiveNoteId(id);

		} catch (err:any) {
			if (err.response.data.message) {
				// csrf,jwtミドルウェア系のエラーはmessageに入る
				switchErrorHandling(err.response.data.message);
			} else {
				switchErrorHandling(err.response.data);
			}
		}
	}

  return (
    <div className="App">
			<Sidebar onAddNote={onAddNote} notes={notes} onDeleteNote={onDeleteNote} activeNoteId={activeNoteId} changeActiveNote={changeActiveNote} />
			<Main displayNote={getActiveNote()} onUpdateNote={onUpdateNote} />
		</div>
  );
}

export default NoteComponent