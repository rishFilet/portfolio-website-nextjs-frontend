'use client';

import { useEffect, useState } from 'react';
import SplitFlapDisplay from 'react-split-flap-display';
import * as CharacterSetConstants from 'react-split-flap-display/constants';

import styles from './SplitFlapDisplay.module.css';
type SplitFlapDisplayComponentProps = {
  background?: string,
  borderColor?: string,
  borderWidth?: string,
  characterSet?: string[],
  characterWidth?: string,
  fontSize?: string,
  listOfValues?: string[],
  padDirection?: 'left' | 'right',
  step?: number,
  switchStringDelayMs?: number,
  textColor?: string,
  value?: string,
  withSound?: boolean,
};

const SplitFlapDisplayComponent = (props: SplitFlapDisplayComponentProps) => {
  const {
    value = "Don't Panic!",
    switchStringDelayMs = 15000,
    background = '#000',
    borderColor,
    borderWidth = '1px',
    fontSize = '1em',
    characterSet = [
      ...CharacterSetConstants.ALPHA,
      ...CharacterSetConstants.NUMERIC,
      ...CharacterSetConstants.PUNCTUATION,
    ],
    listOfValues,
    characterWidth = '2em',
    padDirection = 'right',
    step,
    textColor,
    withSound,
  } = props;

  const [currentValue, setCurrentValue] = useState(
    listOfValues && listOfValues.length > 0 ? listOfValues[0] : value,
  );

  /* Function to create a timer with a certain set of seconds */
  const [seconds, setSeconds] = useState(switchStringDelayMs / 1000);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) =>
        prevSeconds != 0 ? prevSeconds - 1 : switchStringDelayMs / 1000,
      );
      if (seconds === 0) {
        rotateString();
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount or when isActive changes
  }, [seconds]);

  const rotateString = () => {
    if (listOfValues && listOfValues.length > 0) {
      const nextIndex = (currentIndex + 1) % listOfValues.length;
      setCurrentIndex(nextIndex);
      setCurrentValue(listOfValues[nextIndex] || value);
    } else {
      setCurrentValue(value);
    }
  };

  return (
    <div
      className={styles.splitFlapDisplayContainer}
      style={{ gap: borderWidth, background: borderColor }}
    >
      <div className={styles.splitFlapDisplay}>
        <SplitFlapDisplay
          characterSet={
            value &&
            CharacterSetConstants.PUNCTUATION.some((char) =>
              value.includes(char),
            )
              ? characterSet
              : CharacterSetConstants.PUNCTUATION
          }
          minLength={currentValue?.length || 0}
          value={currentValue?.toUpperCase() || ''}
          background={background}
          borderColor={borderColor}
          fontSize={fontSize}
          borderWidth={borderWidth}
          characterWidth={characterWidth}
          padDirection={padDirection}
          step={step}
          textColor={textColor}
          withSound={withSound}
        />
      </div>
    </div>
  );
};

export default SplitFlapDisplayComponent;