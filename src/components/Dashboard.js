import React, { Component } from 'react';

import Server from './Server';

import { ApiGetHeaders } from '../helpers';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            servers: [],
        };
    }

    componentDidMount() {
        //fetch("https://uptime-api.birkoss.com/api/servers/2/endpoints/1/pings/stats/?year=2020&month=05&day=19&grouping=hour", {
        fetch("https://uptime-api.birkoss.com/api/servers/", {
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

                res.forEach(server => {
                    data.push({
                        id: server['id'],
                        key: 'server-' + server['id'],
                        url: server['protocol']['slug'] + "://" + server['hostname'],
                        endpoints: []
                    });
                });

                this.setState({
                    servers: data,
                });
            })
    }

	render() {
		return (
            <div>
            {
                this.state.servers.map(server => {
                    return (
                        <Server key={ server['key'] } serverId={ server['id'] } serverUrl={ server['url'] } />
                    )   
                })
            }
            </div>
		)
	}
}

export default Dashboard;