import React, { Component } from 'react';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';

import { ApiGetHeaders } from '../helpers';

class Endpoint extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.state = {
            stats: [],
        };
    }

    componentDidMount() {
        fetch("https://uptime-api.birkoss.com/api/servers/" + this.props['serverId'] + "/endpoints/" + this.props['endpointId'] + "/pings/" + this.props['apiEndpoint'] + "/?grouping=" + this.props['apiGrouping'], {
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
                        date: stat['grouping'].substr(11, 2) + "h",
                        average: stat['response_time__avg'],
                        min: stat['response_time__min'],
                        max: stat['response_time__max'],
                    });
                });

                this.setState({
                    stats: data,
                });
            })
    }

    render() {
        return (
            <div>
                <ResponsiveContainer width='100%' minHeight='300px'>
                    <LineChart data={this.state.stats} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="min" stroke="#00ff00" />
                        <Line type="monotone" dataKey="max" stroke="#ff0000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default Endpoint;