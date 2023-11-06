import {StyleSheet} from 'react-native';

const createStyle = ({
  itemSize,
  isHorizontal,
}: {
  itemSize: number;
  isHorizontal: boolean;
}) => {
  return StyleSheet.create({
    flatList: {
      flexGrow: 0,
      width: '100%',
    },

    text: {
      fontSize: itemSize * 0.6,
      color: 'gray',
      fontWeight: '900',
      textAlign: 'center',
    },
    item: {
      height: isHorizontal ? '100%' : itemSize,
      width: isHorizontal ? itemSize : '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
export default createStyle;
