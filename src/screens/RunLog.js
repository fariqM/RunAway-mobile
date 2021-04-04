import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { connect } from 'react-redux';
import firebaseConfig from '../config/firebaseConfig'
import MapView, {Polyline} from 'react-native-maps';
import { deleteRunAction } from '../actions/RunLogAction';

export class RunLog extends Component {

  state = {
        tableHead: ['Date', 'Distance', 'Time', 'Pace'],
        tableData: [],
        modalVisible: false,
        modalData: [],
        date: null,
        route: [],
        lat: 0,
        long: 0,
        selectedRun: null,
        ascendingSort: true,
    };

  //takes seconds and converts to HH:MM:SS format
  formatTime(time) {
    var hours = Math.trunc(time / 3600);
    time %= 3600;
    var minutes = Math.trunc(time / 60);
    var seconds = (time % 60).toFixed();
    if (hours   < 10) hours   = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return hours + ":" + minutes + ":" + seconds;
  }  

  //takes pace and converts to MM:SS format
  formatPace(time) {
    var seconds = Math.trunc(time * 60 % 60);
    var minutes = Math.trunc(time);
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
  }

  //takes date object and formats to MM/DD/YYYY
  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const day = date.getDate().toString();

    return (date.getMonth() + 1) + "/" + day + "/" + year;
  }

  formatStats(rowData) {
    var formattedData = [];
    for (var i = 0; i < 4; i++) {
      switch (i) {
        case 0:
          formattedData.push(this.formatDate(new Date(rowData[0]).toString()));
          break;
        case 1:
          formattedData.push(this.props.metric ? ((rowData[1] * 1.609).toFixed(2) + " km") : (rowData[1].toFixed(2) + " mi"));
          break;
        case 2:
          formattedData.push(this.formatTime(rowData[2]));
          break;
        case 3:
          formattedData.push(this.props.metric ? (this.formatPace((rowData[3] * .621).toFixed(2)) + " min/km") : this.formatPace(rowData[3]) + " min/mi");
          break; 
      }
    }
    return formattedData;
  }


  //sorts data in table based on column selected
  sortTable(field, ascending) {
    const sortedTableData = this.state.tableData.sort(function(a,b) {
      if (a[field] === b[field]) {
        return 0;
      }
      else if (ascending) {
        return (a[field] < b[field]) ? -1 : 1;
      }
      else return (a[field] > b[field]) ? -1 : 1;
    });
      this.setState({
        tableData: sortedTableData,
        ascendingSort: !this.state.ascendingSort
      });
  }
  




  async componentDidMount() {
    const tableData = [];
    this.props.runs.forEach(run => {
      const rowData = [];
      rowData.push(Date.parse(run.start_time));
      rowData.push(run.distance);
      rowData.push(run.time);
      rowData.push(run.pace);
      rowData.push(run.id);
      tableData.push(rowData);
    });

    await this.setState({
      tableData : tableData,
    });

    //sort by date by default
    this.sortTable(0, false);
  
  }

  async componentDidUpdate(prevProps, prevState) {

    //if amount of runs has changed after delete/add, update table
    if (prevProps.runs.length !== this.props.runs.length) {

      const tableData = [];
      this.props.runs.forEach(run => {
      const rowData = [];
      rowData.push(Date.parse(run.start_time));
      rowData.push(run.distance);
      rowData.push(run.time);
      rowData.push(run.pace);
      rowData.push(run.id);
      tableData.push(rowData);
      });

      this.state.tableData = tableData;

      //sort by date by default
      this.sortTable(0, true);
    }
  
  }


  //fetches run details and displays modal
  async setModalVisible(visible, id) {
     await this.RunDetails(id);
     this.setState({modalVisible: visible});
  }


  ConfirmDeleteRun() {
    Alert.alert(
      'Delete Run',
      'Would you like to delete this run?',
      [
          {
          text: 'No',
          style: 'cancel'
          },
          { text: 'Yes', onPress: () => {
             firebaseConfig.firestore().collection("users").doc(firebaseConfig.auth().currentUser.uid)
                                       .collection("RunLog").doc(this.state.selectedRun.id).delete();

            this.props.dispatch(deleteRunAction(this.state.selectedRun.id))
            alert('Run deleted');
            this.componentDidMount();
            this.setState({modalVisible: !this.state.modalVisible});

            }
          }
          
      ],
      { cancelable: false },
  );
  }


  //gets info for selected run
  RunDetails(id) {

    this.props.runs.forEach(run => {
      if (run.id === id) {
        this.setState({selectedRun: run}, () => {
          if (this.state.selectedRun === null) {
            Alert.alert("Unable to load run details.")
            return;
          }
          const modalData = [];
          modalData.push("Time: " + this.formatTime(this.state.selectedRun.time) + "\n");
          modalData.push("Distance: " + (this.props.metric ? ((this.state.selectedRun.distance * 1.609).toFixed(2) + " km\n") : (this.state.selectedRun.distance.toFixed(2)  + " miles\n")));
          modalData.push("Pace: " + (this.props.metric ? (this.formatPace(this.state.selectedRun.pace * .621) + " min/km\n") : (this.formatPace(this.state.selectedRun.pace) + " min/mi\n")));
          modalData.push("Calories: " + this.state.selectedRun.calories.toFixed() + "\n");
          modalData.push("Notes: " + this.state.selectedRun.note + "\n");
          const date = this.formatDate(this.state.selectedRun.start_time);
          const lat = this.state.selectedRun.lat;
          const long = this.state.selectedRun.long;
          const route = this.state.selectedRun.route;

          this.setState({
            modalData : modalData,
            date: date,
            route: route,
            lat: lat,
            long: long
          });
        });
      }
    });
    
    
  }


  render() {
    return (
      <ScrollView >
        <View>
          <Text style = {styles.title}> Run Log </Text>
          <Text style = {styles.totals}> Total Time: {this.formatTime(this.props.total_time)} </Text>
          <Text style = {styles.totals}> Total Distance: {this.props.total_distance > 0 ? (this.props.metric ? (this.props.total_distance * 1.609).toFixed(2) + " km" : this.props.total_distance.toFixed(2) + " miles") : "0.00" + (this.props.metric ? " km" : " miles")}</Text>
          <Text style = {styles.totals}> Average Pace: {this.props.total_distance > 0 ? (this.props.metric ? this.formatPace((this.props.total_time / 60) / (this.props.total_distance * 1.609)) + " min/km" : this.formatPace((this.props.total_time / 60) / this.props.total_distance) + " min/mi") : "0:00" + (this.props.metric ? " min/km" : " min/mi")}</Text>
          <Text style = {styles.totals}> Total Calories: {this.props.total_calories ? this.props.total_calories.toFixed() : "0"} </Text>

        <Table borderStyle={{borderWidth: 0}}>
        <TableWrapper style={styles.head}>
            {this.state.tableHead.map((title, index) => (
                    <Cell key={index}
                      data={title}
                      style={styles.head} 
                      textStyle={styles.tableTitles}
                      onPress={() => this.sortTable(index, this.state.ascendingSort)}
                    />
            ))}
            </TableWrapper>
            
            {this.state.tableData.map((rowData, index) => (
                <TouchableHighlight key={index} underlayColor='#AAAAAA' style={[index%2 && {backgroundColor: '#DDDDDD'}]} onPress={() => this.setModalVisible(!this.state.modalVisible, rowData[rowData.length - 1])}>
                    <Row
                      data={this.formatStats(rowData.slice(0, rowData.length - 1))} 
                      style={styles.table}
                      textStyle={styles.text}
                    />
                </TouchableHighlight>    
                  ))}
          </Table>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={{marginTop: 22}}>
            <View>
              <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor='#AAAAAA'
             style={styles.backbutton}
                onPress={() => {
                  this.setState({
                    modalVisible: !this.state.modalVisible
                  });
                }}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableHighlight>

            <TouchableHighlight
              underlayColor='#AAAAAA'
              style={styles.deletebutton}
                onPress={() => {
                  this.ConfirmDeleteRun();
                }}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableHighlight>
            </View>

              <Text style={styles.title}>Run Details</Text>
              <MapView style={styles.map}
                    region={{
                      latitude: this.state.lat,
                      longitude: 	this.state.long,
                      latitudeDelta: 0.03,
                      longitudeDelta: 0.03,
                    }}>
                  
                  <Polyline coordinates = {this.state.route.length > 0 ? this.state.route : []}
                      strokeColor="#000"
                      strokeColors={[
                        '#7F0000',
                        '#00000000',
                        '#B24112',
                        '#E5845C',
                        '#238C23',
                        '#7F0000'
                      ]}
                      strokeWidth={6}
                      />
                </MapView>
              <Text style={styles.date}>{this.state.date}</Text>                   
              <Text style={styles.totals}>{this.state.modalData}</Text>
            </View>
          </View>
        </Modal>
        </View>
      </ScrollView>
    );
  }
}



const mapStateToProps = state => {
  return {
      user: state.user,
      metric: state.SettingsReducer.metric,
      runs: state.RunLogReducer.runs,
      total_time: state.RunLogReducer.total_time,
      total_distance: state.RunLogReducer.total_distance,
      total_calories: state.RunLogReducer.total_calories
  }
}

//Connecting the react components to the store in App.js 
export default connect(mapStateToProps)(RunLog);

const styles = StyleSheet.create({

  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, flex: 1, flexDirection: 'row', backgroundColor: '#A44CA0' },
  table: {height: 40},
  text: { margin: 6 },

  title: {
    fontSize: 26,
    textAlign: "center",
    padding: 5
},
totals: {
  textAlign: "center",
  fontSize: 16,
  padding: 2
},
date: {
  fontSize: 20,
  textAlign: "center",
  padding: 5
},
tableTitles: {
  textAlign: "center",
  padding: 2,
  fontSize: 18
},
text: {
    textAlign: "center",
    padding: 2
},
button: {
    marginLeft: 120,
    marginRight: 120,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#BBBBBB',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  backbutton: {
    marginLeft: 15,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#BBBBBB',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  deletebutton: {
    marginRight: 15,
    marginLeft: 200,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#c5050c',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#fff'
  },
buttonText: {
    color:'#fff',
    textAlign:'center',
    paddingLeft : 25,
    paddingRight : 25
  },
  map: {
    position: 'relative',
    alignItems: "center",
    height: 300,
  },

})