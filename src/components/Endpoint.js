import React, { Component } from 'react';

import {
    BarChart, LineChart, Bar, Legend, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';

import { ApiGetHeaders } from '../helpers';

class Endpoint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codes: [],
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
                let codes = [];

                if (this.props['apiEndpoint'] === "stats") {
                        res.forEach(stat => {
                            let dateLabel = stat['grouping'].substr(11, 2) + "h";
                            if (this.props['apiGrouping'] === "day") {
                                dateLabel = stat['grouping'].substr(8, 2);
                            } else if (this.props['apiGrouping'] === "month") {
                                dateLabel = stat['grouping'].substr(5, 2);
                            }
                            data.push({
                                date: dateLabel,
                                average: stat['response_time__avg'],
                                min: stat['response_time__min'],
                                max: stat['response_time__max'],
                            });
                    });
                } else {
                    for (let key in res) {
                        for (let code in res[key]['codes']) {
                            if (codes.indexOf(code) === -1) {
                                codes.push(code);
                            }
                        }
                        let s = res[key]['codes'];
                        s['date'] = key;

                        data.push(s);
                    }
                }

                this.setState({
                    stats: data.reverse(),
                    codes: codes,
                });
            })
    }

    render() {
        let colors = ["#8884d8", "#82ca9d", "#82ca9d", "#82ca9d", "#82ca9d", "#82ca9d"];

        return (
            <div>
                <ResponsiveContainer width='100%' minHeight='300px'>
                    { this.props['apiEndpoint'] === 'stats' ? (
                    <LineChart data={this.state.stats} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="min" stroke="#00ff00" />
                        <Line type="monotone" dataKey="max" stroke="#ff0000" />
                    </LineChart>) : (
      <BarChart
      data={this.state.stats}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {
          this.state.codes.map((code, index) => {
            return (
                <Bar key={ code } dataKey={ code } fill={ colors[index] } />
            );
          })
      }
    </BarChart>
                    )
                }
                </ResponsiveContainer>
            </div>
        );
    }
}

export default Endpoint;