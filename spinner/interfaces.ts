import {ViewStyle} from 'react-native';

type SpinnerProps = {
  data: any[];
  height: number;
  isHorizontal: boolean;
  outputRangeOpacity?: number[];
  outputRangeScale?: number[];
  itemVerticalRotationDegreeRange?: string[];
  itemHorizontalRotationDegreeRange?: string[];
  flatListProps?: {};
  itemStyle?: ViewStyle;
  itemHeightPrecentageFromHeight?: number;
  itemwidthPrecentageFromWidth?: number;

  ItemView: (props: any) => JSX.Element;
};
export default SpinnerProps;
