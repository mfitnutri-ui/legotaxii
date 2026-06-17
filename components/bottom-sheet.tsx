import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, PanResponder, GestureResponderEvent, LayoutChangeEvent } from 'react-native';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // Percentage of screen height
  initialSnap?: number; // Index of initial snap point
  enablePanDownToClose?: boolean;
  containerClassName?: string;
  contentClassName?: string;
}

export function BottomSheet({
  isVisible,
  onClose,
  children,
  snapPoints = [50, 75, 100],
  initialSnap = 0,
  enablePanDownToClose = true,
  containerClassName = '',
  contentClassName = '',
}: BottomSheetProps) {
  const [screenHeight, setScreenHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [currentSnap, setCurrentSnap] = useState(initialSnap);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt: GestureResponderEvent, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
        const currentY = gestureState.dy;
        const currentSnapPoint = snapPoints[currentSnap];
        const snapThreshold = (screenHeight * currentSnapPoint) / 100;

        // Determine which snap point to go to
        let targetSnap = currentSnap;
        if (currentY > snapThreshold * 0.1) {
          // Swiped down
          if (enablePanDownToClose && currentSnap === 0) {
            onClose();
            return;
          }
          targetSnap = Math.max(0, currentSnap - 1);
        } else if (currentY < -snapThreshold * 0.1) {
          // Swiped up
          targetSnap = Math.min(snapPoints.length - 1, currentSnap + 1);
        }

        animateToSnap(targetSnap);
      },
    })
  ).current;

  const animateToSnap = (snapIndex: number) => {
    const snapPoint = snapPoints[snapIndex];
    const targetY = -(screenHeight * snapPoint) / 100;

    Animated.spring(translateY, {
      toValue: targetY,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();

    setCurrentSnap(snapIndex);
  };

  useEffect(() => {
    if (isVisible) {
      animateToSnap(initialSnap);
    } else {
      translateY.setValue(screenHeight);
    }
  }, [isVisible]);

  const handleScreenLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScreenHeight(height);
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View
      onLayout={handleScreenLayout}
      className={`absolute inset-0 ${containerClassName}`}
      pointerEvents="box-none"
    >
      {/* Backdrop */}
      <View className="absolute inset-0 bg-black bg-opacity-30" onTouchEnd={onClose} />

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
        {...panResponder.panHandlers}
        className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl border-t border-border shadow-lg"
      >
        {/* Drag Handle */}
        <View className="items-center pt-4 pb-2">
          <View className="w-12 h-1 bg-border rounded-full" />
        </View>

        {/* Content */}
        <View
          onLayout={handleContentLayout}
          className={`px-6 pb-6 ${contentClassName}`}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

export default BottomSheet;
