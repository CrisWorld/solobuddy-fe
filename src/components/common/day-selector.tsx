"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DaySelectorProps {
  selectedDays: number[]
  onDaysChange: (days: number[]) => void
  disabled?: boolean
}

const daysOfWeek = [
  { id: 1, label: "Thứ Hai", short: "Mon" },
  { id: 2, label: "Thứ Ba", short: "Tue" },
  { id: 3, label: "Thứ Tư", short: "Wed" },
  { id: 4, label: "Thứ Năm", short: "Thu" },
  { id: 5, label: "Thứ Sáu", short: "Fri" },
  { id: 6, label: "Thứ Bảy", short: "Sat" },
  { id: 0, label: "Chủ Nhật", short: "Sun" },
]

export function DaySelector({ selectedDays, onDaysChange, disabled }: DaySelectorProps) {
  const handleDayToggle = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      onDaysChange(selectedDays.filter((id) => id !== dayId))
    } else {
      onDaysChange([...selectedDays, dayId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ngày trong tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {daysOfWeek.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.id}`}
                checked={selectedDays.includes(day.id)}
                onCheckedChange={() => handleDayToggle(day.id)}
                disabled={disabled}
              />
              <label
                htmlFor={`day-${day.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {day.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
