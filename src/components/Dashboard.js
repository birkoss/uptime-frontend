import React, { Component } from 'react';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';

import { ApiGetHeaders } from '../helpers';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        fetch("https://uptime.birkoss.com/api/servers/2/endpoints/1/pings/stats/?year=2020&month=05&day=19&grouping=hour", {
            method: 'GET',
            headers: ApiGetHeaders()
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    this.setState({
                        error: "Impossible de communiquer avec le serveur",
                    });
                }
            })
            .then(res => {
                let data = [];
                res.forEach(stat => {
                    data.push({
                        date: stat['grouping'].substr(0, 13).replace("T", " ") + ":00",
                        average: stat['response_time__avg'],
                        min: stat['response_time__min'],
                        max: stat['response_time__max'],
                    })
                });

                this.setState({
                    data
                });
            }).catch(error => {
                console.log("error #2", error);
            });
        }

	render() {
		return (
			<ResponsiveContainer width='100%' minHeight='300px'>
                <LineChart data={this.state.data} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="min" stroke="#00ff00" />
                    <Line type="monotone" dataKey="max" stroke="#ff0000" />
                </LineChart>
			</ResponsiveContainer>
		)
	}
}

export default Dashboard;