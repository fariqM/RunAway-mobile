export default class StartButton extends Component {
  render() {
    return (
      <TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <MaterialCommunityIcons
            name="pause"
            size={50}
            style={{paddingTop: 0}}
            color={'#5018D9'}
          />
        </View>
        <View>
          <MaterialCommunityIcons
            name="play"
            size={50}
            style={{paddingTop: 0}}
            color={'#5018D9'}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
