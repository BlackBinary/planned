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
    Picker,
    ActivityIndicator,
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
        loaded: false
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
                    classes: classes,
                    loaded: true
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return this.renderMainView();
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text style={styles.subTitle}>
                    Connecting to the classes database, please stand by.
                </Text>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
            </View>
        );
    }

    renderMainView() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Welcome to Planned!
                </Text>
                <Text style={styles.subTitle}>
                    To get started, select your class below:
                </Text>
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.selected}
                    onValueChange={(value, label) => navigate('Schedule', {
                        classSelected: value,
                        classDescription: label
                    })}
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

    state = {
        loaded: false
    };

    fetchSchedule() {
        const {params} = this.props.navigation.state;
        fetch('http://ueseine.gluweb.nl/mytimetable/timetables/' + params.classSelected)
            .then((response) => response.json())
            .then((responseJson) => {
                let schedule = {};
                for (let key in responseJson) {
                    let keyValue = responseJson[key];
                    let date = new Date(keyValue.startDate).toDateString();

                    if (typeof schedule[date] == 'undefined') {
                        schedule[date] = [];
                    }

                    schedule[date].push(keyValue);
                }
                // console.log(schedule);
                this.scheduleToView(schedule);
            }).done();
    };

    scheduleToView(data) {
        let desc;
        for (let date in data) {
            desc = <div>{date[0].activityDescription}</div>;
            console.log(desc);
        }
        this.setState({
            schedule: desc,
            loaded: true
        });
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return this.renderMainView();
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text style={styles.subTitle}>
                    Connecting to the schedule database, please stand by.
                </Text>
                <ActivityIndicator
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large"
                />
            </View>
        );
    }

    renderMainView() {
        return (
            <View>
                {this.state.schedule}
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
    title: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333333',
        marginBottom: 10,
    },
    picker: {
        width: 200,
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const PlannedApp = StackNavigator({
    Main: {screen: MainScreen},
    Schedule: {screen: ScheduleScreen}
});

AppRegistry.registerComponent('Planned', () => PlannedApp);
