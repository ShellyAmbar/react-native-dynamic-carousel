import {Animated, Dimensions} from "react-native";
import React, {memo, useCallback, useEffect, useRef} from "react";
import createStyle from "./spinner.styles";
import SpinnerProps from "./interfaces";

const spinner = ({
  data,
  height,
  isHorizontal = false,
  outputRangeOpacity = [0.4, 1, 0.4],
  outputRangeScale = [0.8, 1, 0.8],
  flatListProps = {},
  itemStyle = {},
  itemHeightPrecentageFromHeight = 0.4,
  itemwidthPrecentageFromWidth = 0.4,
  itemVerticalRotationDegreeRange = ["-40deg", "0deg", "40deg"],
  itemHorizontalRotationDegreeRange = ["60deg", "0deg", "-60deg"],
  ItemView,
  onSelectItem,
  initialIndex = 0,
  startWithHalfSlide = false,
}: SpinnerProps) => {
  const {width} = Dimensions.get("window");
  const itemSize = isHorizontal
    ? width * itemwidthPrecentageFromWidth
    : height * itemHeightPrecentageFromHeight;
  const itemSpacing = isHorizontal
    ? (width - itemSize) / 2
    : (height - itemSize) / 2;
  const styles = createStyle({
    itemSize: itemSize,
    isHorizontal,
  });
  const scrollRefY = useRef(new Animated.Value(0)).current;
  const scrollRefX = useRef(new Animated.Value(0)).current;
  const currentSelectedIndex = useRef(0);
  const flatlistRef = useRef(null);

  const halfSlide = (forward = true) => {
    const nextOffset = itemSize * (forward ? 0.8 : 0);
    return Animated.timing(scrollRefX, {
      toValue: nextOffset,
      duration: 500,
      useNativeDriver: true, // Native driver doesn't support scroll events
    });
  };

  const rotateExample = useCallback(() => {
    halfSlide(true).start(() => {
      // First half-slide forward completed
      const time1 = setTimeout(() => {
        halfSlide(false).start(() => {});
        clearTimeout(time1);
      }, 100); // Delay before first backward slide
    });
  }, []);

  useEffect(() => {
    if (data.length > 1 && startWithHalfSlide) {
      rotateExample();
    }
  }, []);

  return (
    <Animated.FlatList
      ref={flatlistRef}
      initialScrollIndex={initialIndex}
      horizontal={isHorizontal}
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollRefY, x: scrollRefX}}}],
        {useNativeDriver: true}
      )}
      decelerationRate={"fast"}
      scrollEventThrottle={16}
      snapToInterval={itemSize}
      onScrollEndDrag={(e) => {}}
      style={styles.flatList}
      contentContainerStyle={[
        isHorizontal
          ? {paddingHorizontal: itemSpacing}
          : {paddingVertical: itemSpacing},
      ]}
      data={data}
      keyExtractor={(item) => JSON.stringify(item)}
      onMomentumScrollEnd={(event) => {
        const {x, y} = event.nativeEvent.contentOffset;
        const index = isHorizontal
          ? Math.round(x / itemSize)
          : Math.round(y / itemSize);
        if (currentSelectedIndex.current !== index) {
          currentSelectedIndex.current = index;

          onSelectItem && onSelectItem(data[index]);
        }
      }}
      renderItem={({item, index}) => {
        const inputRange = [
          (index - 1) * itemSize,
          index * itemSize,
          (index + 1) * itemSize,
        ];

        const opacityY = scrollRefY.interpolate({
          inputRange,
          outputRange: outputRangeOpacity,
        });
        const scaleY = scrollRefY.interpolate({
          inputRange,
          outputRange: outputRangeScale,
        });

        const opacityX = scrollRefX.interpolate({
          inputRange,
          outputRange: outputRangeOpacity,
        });
        const scaleX = scrollRefX.interpolate({
          inputRange,
          outputRange: outputRangeScale,
        });

        const rotateX = scrollRefY.interpolate({
          inputRange,
          outputRange: itemVerticalRotationDegreeRange,
        });
        const rotateY = scrollRefX.interpolate({
          inputRange,
          outputRange: itemHorizontalRotationDegreeRange,
        });

        return (
          <Animated.View
            key={index.toString()}
            style={[
              styles.item,
              {
                ...{...itemStyle},
              },
              {
                opacity: isHorizontal ? opacityX : opacityY,
                transform: [
                  {scale: isHorizontal ? scaleX : scaleY},
                  isHorizontal ? {rotateY} : {rotateX},
                ],
              },
            ]}
          >
            <ItemView {...item} />
          </Animated.View>
        );
      }}
      bounces={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...flatListProps}
    />
  );
};

export default memo(spinner);
