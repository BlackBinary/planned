/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StackNavigator} from "react-navigation";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Picker,
} from 'react-native';

class MainScreen extends Component {

    static navigationOptions = {
        title: 'Planned',
    };

    constructor(props) {
        super(props);
        this.fetchClasses();
    }

    state = {
        selected: 'key',
        mode: Picker.MODE_DIALOG,
    };

    fetchClasses() {
        fetch('http://ueseine.gluweb.nl/mytimetable/timetables?type=class')
            .then((response) => response.json())
            .then((responseJson) => {
                let classes = [];
                for (let key in responseJson.timetable) {
                    let pickerClass = responseJson.timetable[key];
                    classes.push(<Picker.Item label={pickerClass.description} value={pickerClass.value}/>);
                }
                this.setState({
                    classes: classes
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to Planned!
                </Text>
                <Text style={styles.instructions}>
                    To get started, select your class below:
                </Text>
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.selected}
                    onValueChange={(value, label) => navigate('Schedule', {classSelected: value, classDescription: label})}
                >
                    {this.state.classes}
                </Picker>
            </View>
        );
    }
}

class ScheduleScreen extends Component {

    constructor(props) {
        super(props);
        this.fetchSchedule();
    }

    fetchSchedule() {
        const {params} = this.props.navigation.state;
        fetch('http://ueseine.gluweb.nl/mytimetable/timetables/' + params.classSelected)
            .then((response) => response.json())
            .then((responseJson) => {
                let schedule = [];
                for (let key in responseJson) {
                    console.log(key);
                    let dayValue = responseJson[key];
                    console.log(dayValue);
                    schedule.push(dayValue);
                }
                this.setState({
                    dataSource: schedule
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData}</Text>}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333333',
        marginBottom: 10,
    },
    picker: {
        width: 200,
    },
});

const PlannedApp = StackNavigator({
    Main: {screen: MainScreen},
    Schedule: {screen: ScheduleScreen}
});

AppRegistry.registerComponent('Planned', () => PlannedApp);
