import { useEffect, useRef, useState, type CSSProperties } from "react";

const SRC = "/nightcore-umbrella.mp3";

const fill = (value: number, max: number) => ({ "--fill": `${max ? (value / max) * 100 : 0}%` }) as CSSProperties;

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const ss = String(whole % 60).padStart(2, "0");
  return `${minutes}:${ss}`;
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(60);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.preload = "metadata";
    audioRef.current = audio;
    const syncTime = () => {
      setTime(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncTime);
    audio.addEventListener("ended", () => setPaused(true));
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume / 100;
    audio.muted = muted;
  }, [volume, muted]);

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (paused) {
      audio.play().catch(() => setPaused(true));
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
    setPlaying(true);
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setTime(seconds);
  };

  const silent = muted || volume === 0;

  const toggleMute = () => {
    if (!silent) return setMuted(true);
    if (volume === 0) setVolume(60);
    setMuted(false);
  };

  return (
    <div className="music" data-open="true">
      <div className="music__panel" role="dialog" aria-label="Music">
        <div className="music__controls">
          <div className="music__now">
            <b>Nightcore - Umbrella (Rock Version)</b>
            <i>Nightcore cover</i>
          </div>

          <input
            className="music__range"
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={Math.min(time, duration || 1)}
            style={fill(time, duration)}
            aria-label="Seek"
            onChange={(event) => seek(Number(event.target.value))}
          />
          <div className="music__time">
            <span>{formatTime(time)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="music__row">
            <div className="music__transport">
              <button type="button" className="music__icon music__icon--main" aria-label={paused ? "Play" : "Pause"} onClick={togglePause}>
                {paused ? (
                  <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M8 5.5v13M16 5.5v13" /></svg>
                )}
              </button>
            </div>

            <div className="music__volume">
              <button type="button" className="music__icon" aria-label={silent ? "Unmute" : "Mute"} onClick={toggleMute}>
                <svg viewBox="0 0 24 24">
                  <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
                  {silent ? (
                    <path d="M16 9.5l5 5M21 9.5l-5 5" />
                  ) : (
                    <path d={volume > 50 ? "M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" : "M15.5 9a4 4 0 0 1 0 6"} />
                  )}
                </svg>
              </button>
              <input
                className="music__range music__range--volume"
                type="range"
                min={0}
                max={100}
                step={1}
                value={silent ? 0 : volume}
                style={fill(silent ? 0 : volume, 100)}
                aria-label="Volume"
                onChange={(event) => {
                  setVolume(Number(event.target.value));
                  setMuted(false);
                }}
              />
              <span className="music__level">{silent ? 0 : volume}</span>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="music__toggle" aria-label="Music player" onClick={togglePause}>
        <span className="music__bars" data-playing={!paused} aria-hidden="true">
          <i /><i /><i />
        </span>
        <span>{paused ? "Play music" : "Nightcore - Umbrella"}</span>
      </button>
    </div>
  );
}
