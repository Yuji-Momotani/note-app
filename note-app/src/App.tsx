
import './App.css';
import NoteComponent from "./components/NoteComponent";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios'
import { useEffect } from "react";
import Auth from "./components/Auth";

const App = () => {
	useEffect(() => {
		const getCsrf = async() => {
			axios.defaults.withCredentials = true;
			const {data} = await axios.get(
				`${process.env.REACT_APP_API_URL}/csrf`
			);
			axios.defaults.headers.common["X-CSRF-Token"] = data.csrf_token;
		};
		getCsrf();
	});
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Auth/>} />
				<Route path="/note" element={<NoteComponent/>} />
			</Routes>
		</Router>
	)
}

export default App;
