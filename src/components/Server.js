import React, { Component } from 'react';

import { Card, Select, Tabs } from 'antd';

import { ApiGetHeaders } from '../helpers';
import Endpoint from './Endpoint';

const { TabPane } = Tabs;
const { Option } = Select;

class Server extends Component {
    constructor(props) {
        super(props);

        this.state = {
            apiGrouping: 'hour',
            apiEndpoint: 'stats',
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

    onSelectChanged(option, value) {
        let data = {};
        data[option] = value;
        this.setState(data);
    }

    render() {
        return (
            <Card title={ this.props.serverUrl } extra={ <div>
                <Select defaultValue="stats" onChange={ (value) => this.onSelectChanged('apiEndpoint', value) }>
                    <Option value="stats">Response time</Option>
                    <Option value="codes">Response Code</Option>
                </Select>

                <Select defaultValue="hour" onChange={ (value) => this.onSelectChanged('apiGrouping', value) }>
                    <Option value="hour">Hourly</Option>
                    <Option value="day">Daily</Option>
                    <Option value="month">Monthly</Option>
                </Select>
                
                </div> }>
                <Tabs type="card">
                    {
                        this.state.endpoints.map(endpoint => {
                            return (
                                <TabPane tab={ endpoint['url'] } key={ endpoint['key'] }>
                                    <Endpoint key={ endpoint['key'] } apiEndpoint={ this.state.apiEndpoint} apiGrouping={ this.state.apiGrouping } serverId={ this.props['serverId'] } endpointId={ endpoint['id'] } endpointUrl={ endpoint['url'] } />
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
            </Card>
        );
    }
}

export default Server;