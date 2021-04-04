import React, { Component } from 'react';
import { TextInput, Text, View, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import firebase from 'firebase';
import {months, days, years} from '../constants/Date';
import firebaseConfig from '../config/firebaseConfig';
import { connect } from 'react-redux';
import {updateAllPersonalInfoAction} from '../actions/PersonalInfoAction';
import {updateAllSettingsAction} from '../actions/SettingsAction';
import {convertInchesToCentimeters, convertPoundsToKilograms, convertCentimetersToInches, 
    convertKilogramsToPounds} from '../constants/ConversionFunctions';

//References to the root of the firestore database
const firestore = firebase.firestore();
//Firebase initialzation 
firebaseConfig

export class EditSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            email: this.props.email,
            ftm: "",
            incm: "",
            weight: "",
            sex: this.props.sex,
            month: "",
            day: "",
            year: "",
            display_time_switch: this.props.display_time,
            display_pace_switch: this.props.display_pace,
            display_distance_switch: this.props.display_distance,
            display_calories_switch: this.props.display_calories,
            metric: this.props.metric,
            update_frequency: this.props.update_frequency
        };
    }

    componentDidMount() {
        // get milliseconds for date to convert into day/month/year
        var date = new Date((this.props.birthday)*1000);
        var big = "";
        var little = "";
        var w = "";
        // determine ftm/incm and weight based on imperial/metric
        if(this.props.metric) {
            var h = convertInchesToCentimeters(this.props.height);
            big = Math.floor(h / 100).toString();
            little = Math.floor(h % 100).toString();
            w = convertPoundsToKilograms(this.props.weight).toString();
        } else {
            big = Math.floor(this.props.height / 12).toString();
            little = Math.floor(this.props.height % 12).toString();
            w = Math.round(this.props.weight).toString();
        }

        this.setState({
            ftm: big,
            incm: little,
            weight: w,
            year: date.getFullYear().toString(),
            month: months[date.getMonth()].label, 
            day: date.getDate().toString()
        })
    }
    
    convertMeasurementsToHeight = (ftm, incm) => {
        if (this.state.metric) {
            // User chose metric
            return (+(100 * ftm) + +incm)

        } else {
            // User chose imperial
            return (+(12*ftm) + +incm)
        }
    }

    sendToFirebase = () => {
        // ensure fields aren't left blank
        if (this.state.name === null || this.state.name === "") {
            console.log("InputPersonalInfo: name is null or blank")
            Alert.alert("Please provide a name.")
            return
        }
        if (this.state.ftm === null || this.state.ftm === "" || this.state.incm === null || this.state.incm === "") {
            console.log("InputPersonalInfo: ftm and/or incm are/is null or blank")
            Alert.alert("Please provide a height.")
            return
        }
        if (this.state.weight === null || this.state.weight === "") {
            console.log("InputPersonalInfo: ftm and/or incm are/is null or blank")
            Alert.alert("Please provide a weight.")
            return
        }
        if (this.state.month === null || this.state.day === null || this.state.year === null ||
                this.state.month === "" || this.state.day === "" || this.state.year === "") {
            console.log("InputPersonalInfo: month and/or day and/or year are/is null or blank")
            Alert.alert("Please provide a full birth date.")
            return
        }

        // put into proper format for sending to firebase
        let user = firebase.auth().currentUser;
        let personal = {
            name: this.state.name,
            email: this.state.email,
            sex: this.state.sex,
            // height is always stored in inches in firebase, converted locally if user has metric selected
            height: ((this.state.metric) ? convertCentimetersToInches(this.convertMeasurementsToHeight(this.state.ftm, this.state.incm))
                : this.convertMeasurementsToHeight(this.state.ftm, this.state.incm)),
            // same for weight as height, always stored in pounds in firebase and converted if needed later
            weight: ((this.state.metric) ? convertKilogramsToPounds(this.state.weight) : this.state.weight),
            birthday: (new Date(this.state.month + " " + this.state.day + ", " + this.state.year)),
        }
        let settings = {
            metric: this.state.metric,
            update_frequency: this.state.update_frequency,
            display_time: this.state.display_time_switch,
            display_distance: this.state.display_distance_switch,
            display_pace: this.state.display_pace_switch,
            display_calories: this.state.display_calories_switch,
        }

        // update firebase, then update redux
        firestore.collection('users').doc(user.uid)
        .update({ personal, settings})
        .then(() => {
            console.log("Successfully updated settings")

            // put it into different to make redux happy
            personal.birthday = {
                seconds: personal.birthday.getTime() / 1000
            }

            // Update all personal info in store
            this.props.dispatch(updateAllPersonalInfoAction(personal))
            // Update all settings info in store 
            this.props.dispatch(updateAllSettingsAction(settings))
            // navigate back to default settings screen
            this.props.navigation.navigate('SETTINGS');
        }).catch(function(error) {
            console.log("InputPersonalInfo:", error.message)
            Alert.alert(error.message);
        })
    }

    render() {
        return (
            <ScrollView>
                {/* Textinput for user's name */}
                <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                <Text>Name:</Text>
                    <TextInput
                        style={{ height: 31, width: '25%', borderColor: 'gray', borderWidth: 1, margin: 2}}
                        textAlign={'center'}
                        value={this.state.name}
                        onChangeText={(text) => this.setState({name:text})}
                        placeholder = "Name"
                    />
                </View>

                <View>
                    {/*Buttons for choosing Metric vs Imperial Measurements*/}
                    <View style={{ minHeight:25, flexDirection:'row', justifyContent:'center',alignItems:'center', paddingTop:10}}>
                            <Text style={{flex:1, alignContent:'center', justifyContent:'center'}}>Preferred Meaurement System:</Text>
                        </View>
                        <View style={{ minHeight:50, flexDirection:'row'}}>
                            {/*Metric Button*/}
                            <View style={{flex:1}}>
                                <TouchableOpacity 
                                    onPress={() => {
                                        if(!this.state.metric) {
                                            var inches = +(this.state.ftm * 12) + +this.state.incm;
                                            var cm = convertInchesToCentimeters(inches);
                                            this.setState({
                                                ftm: Math.floor(cm / 100).toString(),
                                                incm: Math.round(cm % 100).toString(),
                                                weight: convertPoundsToKilograms(this.state.weight).toString()
                                            })
                                        }
                                        this.setState({metric:true});
                                    }}
                                    disabled={(this.state.metric ? true : false)}>
                                    <View style={{
                                            backgroundColor:(this.state.metric ? 'lightgreen': 'lightgray'),
                                            height:50,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            paddingHorizontal:15}}>
                                        <Text value={true} style={{fontSize:20,color:(this.state.metric ? 'black': 'darkgray')}}>Metric</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/*Imperial Button*/}
                            <View style={{flex:1}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if(this.state.metric) {
                                            var cm = +(this.state.ftm * 100) + +this.state.incm;
                                            var inches = convertCentimetersToInches(cm);
                                            this.setState({
                                                ftm: Math.floor(inches / 12).toString(),
                                                incm: Math.round(inches % 12).toString(),
                                                weight: convertKilogramsToPounds(this.state.weight).toString()
                                            })
                                        }
                                        this.setState({metric:false})
                                    }}
                                    disabled={(this.state.metric ? false : true)}>
                                    <View style={{
                                            backgroundColor:(this.state.metric ? 'lightgray': 'lightgreen'),
                                            height:50,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            paddingHorizontal:15}}>
                                        <Text value={false} style={{fontSize:20,color:(this.state.metric ? 'darkgray': 'black')}}>Imperial</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>


                        {/*TextInput for inputing user's birthday (used for calculating age)*/}
                        <View style={{ minHeight:25, flexDirection:'row', justifyContent:'center',alignItems:'center', paddingTop:10}}>
                            <Text style={{flex:1, alignContent:'center', justifyContent:'center'}}>Birth Date:</Text>
                        </View>
                        <View style={{ minHeight:50, flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
                            <View style={styles.pickerStyle}>
                                <RNPickerSelect
                                    items={months}
                                    placeholder={{label: "Month",value:null}}
                                    value={this.state.month}
                                    onValueChange={(value, index) => this.setState({month:value})}/>
                            </View>
                            <View style={styles.pickerStyle}>
                                <RNPickerSelect
                                    items={days}
                                    placeholder={{label: "Day",value:null}}
                                    value={this.state.day}
                                    onValueChange={(value, index) => this.setState({day:value})}/>
                            </View>
                            <View style={styles.pickerStyle}>
                                <RNPickerSelect
                                    items={years}
                                    placeholder={{label: "Year",value:null}}
                                    value={this.state.year}
                                    onValueChange={(value, index) => this.setState({year:value})}/>
                            </View>
                        </View>


                        {/*TextInputs for inputing user's height and weight*/}
                        <View style={{ minHeight:25, flexDirection:'row', justifyContent:'center',alignItems:'center', paddingTop:10}}>
                            <Text style={{flex:4, alignContent:'center', justifyContent:'center'}}>Height:</Text>
                            <Text style={{flex:2, alignContent:'center', justifyContent:'center', paddingLeft:10}}>Weight:</Text>
                        </View>
                        <View style={{flexDirection:'row', minHeight:50, justifyContent:'center', alignItems:'center'}}>
                            {/*TextInput for feet or meters*/}
                            <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                                <TextInput
                                    value={this.state.ftm}
                                    onChangeText={(text) => this.setState({ftm:text})}
                                    keyboardType='number-pad'
                                    style={styles.inputNumber}
                                />
                                <Text>{(this.state.metric ? "m" : "ft")}</Text>
                            </View>
                            {/*TextInput for inches or centimeters*/}
                            <View style={{flex:1, flexDirection:'row', alignItems:'center', paddingRight:20}}>
                                <TextInput
                                    value={this.state.incm}
                                    onChangeText={(text) => this.setState({incm:text})}
                                    keyboardType='number-pad'
                                    style={styles.inputNumber}
                                />
                                <Text>{(this.state.metric ? "cm" : "in")}</Text>
                            </View>
                            {/*TextInput for kilograms or pounds*/}
                            <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                                <TextInput
                                    value={this.state.weight}
                                    onChangeText={(text) => this.setState({weight:text})}
                                    keyboardType='number-pad'
                                    style={styles.inputNumber}
                                />
                                <Text>{(this.state.metric ? "kg" : "lb")}</Text>
                            </View>
                        </View>


                        {/*Buttons for inputing user's sex*/}
                        <View style={{ minHeight:25, flexDirection:'row', justifyContent:'center',alignItems:'center', paddingTop:10}}>
                            <Text style={{flex:1, alignContent:'center', justifyContent:'center'}}>Sex:</Text>
                        </View>
                        <View style={{ minHeight:50, flexDirection:'row'}}>
                            {/*Male Button*/}
                            <View style={{flex:1}}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({sex:"male"})}
                                    disabled={(this.state.sex === "male" ? true : false)}>
                                    <View style={{
                                            backgroundColor:(this.state.sex === "male" ? 'lightgreen': 'lightgray'),
                                            height:50,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            paddingHorizontal:15}}>
                                        <Text value={true} style={{fontSize:20,color:(this.state.sex === "male" ? 'black': 'darkgray')}}>Male</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/*Female Button*/}
                            <View style={{flex:1}}>
                                <TouchableOpacity
                                    onPress={() => this.setState({sex:"female"})}
                                    disabled={(this.state.sex ? false : true)}>
                                    <View style={{
                                            backgroundColor:(this.state.sex === "male" ? 'lightgray': 'lightgreen'),
                                            height:50,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            paddingHorizontal:15}}>
                                        <Text value={false} style={{fontSize:20,color:(this.state.sex === 'male' ? 'darkgray': 'black')}}>Female</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    {/* Switch for whether or not to output audio feedback every mile/km */}
                    {/* <View style={styles.row}>
                        <Text>Audio updates every mile/km: </Text> 
                        <Switch  
                            value={this.state.update_frequency}  
                            onValueChange ={(value) => {
                                this.setState({update_frequency: value})
                            }}/>
                    </View> */}
                    <Text>Stats to Display on Run Screen:</Text>
                    {/* Switches for what stats the user wants displayed on the run screen */}
                    <View style={styles.row}>
                        <Text>Time: </Text>
                        <Switch  
                            value={this.state.display_time_switch}  
                            onValueChange ={(value) => {
                                this.setState({display_time_switch: value})
                            }}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Distance: </Text>
                        <Switch  
                            value={this.state.display_distance_switch}  
                            onValueChange ={(value) => {
                                this.setState({display_distance_switch: value})
                            }}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Pace: </Text>
                        <Switch  
                            value={this.state.display_pace_switch}  
                            onValueChange ={(value) => {
                                this.setState({display_pace_switch: value})
                            }}/>
                    </View>
                    <View style={styles.row}>
                        <Text>Calories: </Text>
                        <Switch  
                            value={this.state.display_calories_switch}  
                            onValueChange ={(value) => {
                                this.setState({display_calories_switch: value})
                            }}/>
                    </View>
                    <View style={styles.row}>
                        {/* Save changes, then navigate back to settings page (called in the send function) */}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                this.sendToFirebase();
                                }
                            }>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        {/* Cancel changes and navigate back to settings */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                this.props.navigation.navigate('SETTINGS');
                                }
                            }>
                            <Text style={styles.buttonText}>Cancel Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        name: state.PersonalInfoReducer.name,
        email: state.PersonalInfoReducer.email,
        birthday: state.PersonalInfoReducer.birthday,
        height: state.PersonalInfoReducer.height,
        weight: state.PersonalInfoReducer.weight,
        sex: state.PersonalInfoReducer.sex,

        display_calories: state.SettingsReducer.display_calories,
        display_distance: state.SettingsReducer.display_distance,
        display_pace: state.SettingsReducer.display_pace,
        display_time: state.SettingsReducer.display_time,
        metric: state.SettingsReducer.metric,
        update_frequency: state.SettingsReducer.update_frequency,
    }
}

export default connect(mapStateToProps)(EditSettings);

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row"
      },
    saveButton: {
        marginRight:20,
        marginLeft:40,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#1E6738',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
      },
    cancelButton: {
        marginRight:40,
        marginLeft:20,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'#F05353',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff' 
      },
    buttonText: {
        color:'#fff',
        textAlign:'center',
        paddingLeft : 25,
        paddingRight : 25
      },
    inputNumber: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        minHeight:50,
        maxHeight:50,
        width:85,
        justifyContent:'center',
    },
    pickerStyle: {
        fontSize:18,
        flex:1,
        borderColor:'lightgray',
        borderWidth:1, height:50,
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        paddingHorizontal:10,
    }
});