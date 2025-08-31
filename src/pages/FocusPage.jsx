import { useState, useRef } from 'react';
import Button from '../components/atoms/Button';
import Toast from '../components/atoms/Toast';
import useTimer from '../hooks/useTimer';
// import { instance } from '../utils/api/axiosInstance';
import NavigationButton from '../components/atoms/NavigationButton';
import styles from '../styles/pages/FocusPage.module.css';

export default function FocusPage() {
  // useTimer 훅 사용 - 모든 타이머 로직 포함
  const timer = useTimer();

  // 토스트 상태
  const [toast, setToast] = useState(null);

  const minutesInputRef = useRef(null);
  const secondsInputRef = useRef(null);

  // 타이머 완료 체크
  // useEffect(() => {
  //   if (timer.isCompleted) {
  //     showToast('success', '🎉 집중 시간이 완료되었습니다!');
  //   }
  // }, [timer.isCompleted]);

  // 시작 버튼 클릭
  const handleStart = () => {
    timer.start();
  };

  // 일시정지 버튼 클릭
  const handlePause = () => {
    timer.pause();
    showToast('error', '🚨 집중이 중단되었습니다.');
  };

  // 다시하기 버튼 클릭
  const handleRestart = () => {
    timer.reset();
  };

  // 완료 버튼 클릭 (포인트 획득)
  const handleStop = async () => {
    const totalTimeInMinutes = timer.minutes + timer.seconds / 60; // 총 시간(분), 초는 60초에 1분
    const basePoints = 3; // 기본 3포인트
    const additionalPoints = Math.floor(totalTimeInMinutes / 10); // 추가 포인트 : 10분당 1포인트, 소수점은 버림
    const totalPoints = basePoints + additionalPoints; // 기본 포인트 + 추가 포인트

    try {
      // 서버에 포인트 전송
      // await instance.post('/api/focus/complete', {
      //   focusTime: totalTimeInMinutes,
      //   points: totalPoints,
      // });

      showToast('point', `🎉 ${totalPoints}포인트를 획득했습니다!`);
    } catch (error) {
      console.error('포인트 전송 실패:', error);
      showToast('error', `🚨 포인트 획득 실패하였습니다.`);
    }

    // Stop 버튼 클릭 시 초기화
    handleRestart();
  };

  // 분 변경
  const handleMinutesChange = e => {
    const value = parseInt(e.target.value) || 0;
    timer.setTimerMinutes(value);
  };

  // 초 변경
  const handleSecondsChange = e => {
    const value = parseInt(e.target.value) || 0;
    timer.setTimerSeconds(value);
  };

  // 분 편집 완료
  const handleMinutesBlur = () => {
    timer.validateTime();
  };

  // 초 편집 완료
  const handleSecondsBlur = () => {
    timer.validateTime();
  };

  // 엔터키로 분 편집 완료
  const handleMinutesKeyDown = e => {
    if (e.key === 'Enter') {
      handleMinutesBlur();
    }
  };

  // 엔터키로 초 편집 완료
  const handleSecondsKeyDown = e => {
    if (e.key === 'Enter') {
      handleSecondsBlur();
    }
  };

  // 토스트 표시
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 1800);
  };

  return (
    <main className={styles.focusPage}>
      <div className={styles.container}>
        <div className={styles.focusHeader}>
          <h1 className={styles.title}>연우의 개발공장</h1>
          <div className={styles.nav}>
            <NavigationButton to="/today-habits">오늘의 습관</NavigationButton>
            <NavigationButton to="/">홈</NavigationButton>
          </div>
        </div>

        <div className={styles.pointContainer}>
          <p className={styles.pointBadgeText}>현재까지 획득한 포인트</p>
          <div className={styles.pointBadge}>
            <span className={styles.pointIcon}>🌿</span>
            <span className={styles.pointText}>310P 획득</span>
          </div>
        </div>

        <div className={styles.timerContainer}>
          <h2 className={styles.timerTitle}>오늘의 집중</h2>

          <div className={styles.timeDisplay}>
            <div className={styles.mainTime}>
              <input
                ref={minutesInputRef}
                type="number"
                value={
                  timer.isRunning || timer.isPaused
                    ? timer.displaySeconds < 0
                      ? `-${Math.abs(timer.displayMinutes).toString().padStart(2, '0')}`
                      : timer.displayMinutes.toString().padStart(2, '0')
                    : timer.minutes.toString().padStart(2, '0')
                }
                onChange={handleMinutesChange}
                onBlur={handleMinutesBlur}
                onKeyDown={handleMinutesKeyDown}
                className={`${styles.timeInput} ${timer.displayMinutes <= 1 && timer.displayMinutes >= 0 && timer.displaySeconds <= 59 && timer.displaySeconds >= 0 ? styles.warningTime : ''}`}
                min="0"
                max={timer.displaySeconds < 0 ? '999' : '99'}
                readOnly={timer.isRunning || timer.isPaused}
              />
              <span className={styles.timeSeparator}>:</span>
              <input
                ref={secondsInputRef}
                type="number"
                value={
                  timer.isRunning || timer.isPaused
                    ? timer.displaySeconds < 0
                      ? `${Math.abs(timer.displaySeconds).toString().padStart(2, '0')}`
                      : timer.displaySeconds.toString().padStart(2, '0')
                    : timer.seconds.toString().padStart(2, '0')
                }
                onChange={handleSecondsChange}
                onBlur={handleSecondsBlur}
                onKeyDown={handleSecondsKeyDown}
                className={`${styles.timeInput} ${timer.displayMinutes <= 1 && timer.displayMinutes >= 0 && timer.displaySeconds <= 59 && timer.displaySeconds >= 0 ? styles.warningTime : ''}`}
                min="0"
                max="59"
                readOnly={timer.isRunning || timer.isPaused}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            {/* 타이머 상태에 따른 버튼 렌더링 */}
            <>
              {/* 일시정지 버튼 */}
              {timer.isRunning && !timer.isCompleted && (
                <Button
                  variant="control"
                  size="circle-lg"
                  shape="circle"
                  onClick={handlePause}
                  className={styles.pauseButton}
                >
                  <img src={'/assets/icons/pause-btn.svg'} alt="pause" />
                </Button>
              )}

              {/* 중앙 메인 버튼 */}
              <Button
                variant="control"
                shape="rect"
                size="ctrl-lg"
                onClick={timer.isCompleted ? handleStop : handleStart}
                className={
                  timer.isCompleted ? styles.stopButton : styles.startButton
                }
                disabled={timer.isRunning && !timer.isCompleted}
              >
                <img
                  src={
                    timer.isCompleted
                      ? '/assets/icons/stop-btn.svg'
                      : '/assets/icons/play-btn.svg'
                  }
                  alt={timer.isCompleted ? 'stop' : 'play'}
                />
                {timer.isCompleted ? 'Stop!' : 'Start!'}
              </Button>

              {/* 다시하기 버튼 */}
              {timer.isRunning && !timer.isCompleted && (
                <Button
                  variant="control"
                  shape="circle"
                  size="circle-lg"
                  onClick={handleRestart}
                  className={styles.restartButton}
                >
                  <img src={'/assets/icons/restart-btn.svg'} alt="restart" />
                </Button>
              )}
            </>
          </div>
        </div>
      </div>

      {toast && (
        <div className={styles.toastContainer}>
          <Toast
            type={toast.type}
            message={toast.message}
            className={styles.toast}
          />
        </div>
      )}
    </main>
  );
}
