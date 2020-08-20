import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";


class App extends React.Component
{
	constructor(props)
	{
		super();
		this.state = {data: "null"};
	}

	async componentDidMount()
	{
		let d = await Axios.get("http://localhost:3333/users");
		this.setState({data: "nigga"});
	}

	render()
	{
		return this.state.data;
	}
};

export default App;