import React, { useState, useEffect } from 'react';

interface TimeInputProps {
  value: number;
  onChange: (value: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const [hours, setHours] = useState(Math.floor(value / 3600));
  const [minutes, setMinutes] = useState(Math.floor((value % 3600) / 60));
  const [seconds, setSeconds] = useState(Math.floor(value % 60));
  const [hundredths, setHundredths] = useState(Math.floor((value % 1) * 100));

  useEffect(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + hundredths / 100;
    onChange(totalSeconds);
  }, [hours, minutes, seconds, hundredths, onChange]);

  return (
    <div>
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        placeholder="HH"
        min="0"
        max="23"
        style={{ width: '40px' }}
      />
      <span>:</span>
      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        placeholder="MM"
        min="0"
        max="59"
        style={{ width: '40px' }}
      />
      <span>:</span>
      <input
        type="number"
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
        placeholder="SS"
        min="0"
        max="59"
        style={{ width: '40px' }}
      />
      <span>.</span>
      <input
        type="number"
        value={hundredths}
        onChange={(e) => setHundredths(Number(e.target.value))}
        placeholder="CC"
        min="0"
        max="99"
        style={{ width: '40px' }}
      />
      <span> (HH:MM:SS.CC)</span>
    </div>
  );
};

export default TimeInput;