import React, { Component } from 'react';

import { Card } from 'antd';

import { ApiGetHeaders } from '../helpers';
import Endpoint from './Endpoint';

class Server extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endpoints: [],
        };
    }

    componentDidMount() {
        fetch("https://uptime-api.birkoss.com/api/servers/" + this.props['serverId'] + "/endpoints/", {
            method: "GET",
            headers: ApiGetHeaders(),
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
                res.forEach(endpoint => {
                    data.push({
                        id: endpoint['id'],
                        key: 'endpoint-' + endpoint['id'],
                        url: endpoint['url'],
                        stats: []
                    });
                });
                this.setState({
                    endpoints: data,
                });
            });
    }

    render() {
        return (
            <Card title={ this.props.serverUrl } extra={<a href="#">More</a>}>
                {
                    this.state.endpoints.map(endpoint => {
                        return (
                            <Endpoint serverId={ this.props['serverId'] } endpointId={ endpoint['id'] } endpointUrl={ endpoint['url'] } />
                        );
                    })
                }
            </Card>
        );
    }
}

export default Server;