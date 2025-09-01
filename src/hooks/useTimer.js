import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 완전한 타이머 커스텀 훅
 * @param {number} initialMinutes - 초기 시간(분)
 * @returns {Object} - 타이머 상태 및 함수
 */
export default function useTimer(initialMinutes = 25) {
  // 타이머 설정 상태
  const [minutes, setMinutes] = useState(Math.floor(initialMinutes));
  const [seconds, setSeconds] = useState(Math.floor((initialMinutes % 1) * 60));

  // 초기 설정 시간을 기억하기 위한 상태
  const [initialSetMinutes, setInitialSetMinutes] = useState(
    Math.floor(initialMinutes),
  );
  const [initialSetSeconds, setInitialSetSeconds] = useState(
    Math.floor((initialMinutes % 1) * 60),
  );

  // 타이머 실행 상태
  const [remainingTime, setRemainingTime] = useState(
    initialMinutes * 60 * 1000,
  ); // ms 단위
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);

  // initialMinutes가 변경되면 remainingTime과 설정값 업데이트 (타이머가 실행 중이 아닐 때만)
  useEffect(() => {
    if (!isRunning && !isPaused) {
      const newMinutes = Math.floor(initialMinutes);
      const newSeconds = Math.floor((initialMinutes % 1) * 60);
      setMinutes(newMinutes);
      setSeconds(newSeconds);
      setInitialSetMinutes(newMinutes); // 초기 설정 시간도 업데이트
      setInitialSetSeconds(newSeconds); // 초기 설정 시간도 업데이트
      setRemainingTime(initialMinutes * 60 * 1000);
    }
  }, [initialMinutes, isRunning, isPaused]);

  // 타이머 완료 체크 (0초에 도달하면 완료 상태로 변경하지만 계속 실행)
  useEffect(() => {
    if (remainingTime <= 0 && isRunning && !isCompleted) {
      setIsCompleted(true);
      // 타이머는 계속 실행되어 음수로 진행
    }
  }, [remainingTime, isRunning, isCompleted]);

  const tick = useCallback(time => {
    if (previousTimeRef.current != null) {
      const delta = time - previousTimeRef.current;
      setRemainingTime(prev => prev - delta); // 음수 시간도 허용
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(tick);
  }, []);

  const start = () => {
    if (!isRunning) {
      // 타이머 시작 시 현재 설정된 시간을 초기 설정 시간으로 저장
      setInitialSetMinutes(minutes);
      setInitialSetSeconds(seconds);
      setIsRunning(true);
      setIsCompleted(false);
      setIsPaused(false);
      requestRef.current = requestAnimationFrame(tick);
    }
  };

  const pause = () => {
    setIsRunning(false);
    setIsPaused(true);
    cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
    previousTimeRef.current = null;
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    // 초기 설정 시간으로 복원
    setRemainingTime(initialSetMinutes * 60 * 1000 + initialSetSeconds * 1000);
    setMinutes(initialSetMinutes);
    setSeconds(initialSetSeconds);
    cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
    previousTimeRef.current = null;
  };

  // 시간 설정 함수들
  const setTimerMinutes = value => {
    if (!isRunning && !isPaused) {
      const newMinutes = Math.max(0, Math.min(99, value));
      setMinutes(newMinutes);
      setInitialSetMinutes(newMinutes); // 초기 설정 시간도 업데이트
      setRemainingTime(newMinutes * 60 * 1000 + seconds * 1000);
    }
  };

  const setTimerSeconds = value => {
    if (!isRunning && !isPaused) {
      const newSeconds = Math.max(0, Math.min(59, value));
      setSeconds(newSeconds);
      setInitialSetSeconds(newSeconds); // 초기 설정 시간도 업데이트
      setRemainingTime(minutes * 60 * 1000 + newSeconds * 1000);
    }
  };

  const validateTime = () => {
    if (minutes === 0 && seconds === 0) {
      setSeconds(1);
      setInitialSetSeconds(1); // 초기 설정 시간도 업데이트
      setRemainingTime(1000);
    }
  };

  const updateTime = minutes => {
    if (!isRunning) {
      setRemainingTime(minutes * 60 * 1000);
    }
  };

  // 표시용 시간 계산 (음수 시간도 고려)
  const totalSeconds = Math.floor(remainingTime / 1000);
  const displayMinutes =
    Math.floor(Math.abs(totalSeconds) / 60) * (totalSeconds < 0 ? -1 : 1);
  const displaySeconds =
    (Math.abs(totalSeconds) % 60) * (totalSeconds < 0 ? -1 : 1);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, tick]);

  return {
    // 상태값
    remainingTime,
    isRunning,
    isCompleted,
    isPaused,

    // 설정값 (입력용)
    minutes,
    seconds,

    // 표시값 (화면 출력용)
    displayMinutes,
    displaySeconds,

    // 제어 함수들
    start,
    pause,
    reset,

    // 시간 설정 함수들
    setTimerMinutes,
    setTimerSeconds,
    validateTime,
    updateTime,
  };
}
