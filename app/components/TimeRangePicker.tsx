import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimeRangePickerProps {
  value: {
    start: string
    end: string
  }
  onChange: (value: { start: string; end: string }) => void
}

export default function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const [startTime, setStartTime] = useState(value.start)
  const [endTime, setEndTime] = useState(value.end)

  // 格式化時間為 24 小時制
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  // 處理時間變更
  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    const formattedTime = formatTime(value);
    if (field === 'start') {
      setStartTime(formattedTime);
    } else {
      setEndTime(formattedTime);
    }
  }

  useEffect(() => {
    onChange({ start: startTime, end: endTime })
  }, [startTime, endTime, onChange])

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-gray-500" />
      <input
        type="time"
        value={startTime}
        onChange={(e) => handleTimeChange('start', e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        min="00:00"
        max="23:59"
        step="60"
        lang="zh-TW"
      />
      <span className="text-gray-500">至</span>
      <input
        type="time"
        value={endTime}
        onChange={(e) => handleTimeChange('end', e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        min="00:00"
        max="23:59"
        step="60"
        lang="zh-TW"
      />
    </div>
  )
} 