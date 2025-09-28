"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CalendarPickerProps {
    selectedDates: string[]
    onDatesChange: (dates: string[]) => void
    disabled?: boolean
}

export function CalendarPicker({ selectedDates, onDatesChange, disabled }: CalendarPickerProps) {
    const [selectedDateObjects, setSelectedDateObjects] = useState<Date[]>(selectedDates.map((date) => new Date(date)))

    const handleDateSelect = (dates: Date[] | undefined) => {
        if (dates) {
            setSelectedDateObjects(dates)
            onDatesChange(dates.map((date) => date.toISOString().split("T")[0]))
        }
    }

    const clearDates = () => {
        setSelectedDateObjects([])
        onDatesChange([])
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Available Dates</CardTitle>
                    {selectedDateObjects.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearDates} disabled={disabled}>
                            Clear All
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="multiple"
                    selected={selectedDateObjects}
                    onSelect={handleDateSelect}
                    disabled={disabled || { before: new Date() }}
                    className="rounded-md border"
                />
                {selectedDateObjects.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Selected dates ({selectedDateObjects.length}):</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedDateObjects.slice(0, 5).map((date, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {date.toLocaleDateString()}
                                </Badge>
                            ))}
                            {selectedDateObjects.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                    +{selectedDateObjects.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
