import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { tr } from "date-fns/locale"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
}

export function Calendar({ value, onChange, disabled }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date())

  const days = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const weekDays = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">
          {format(currentMonth, "MMMM yyyy", { locale: tr })}
        </div>
        <button
          onClick={nextMonth}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const isSelected = value ? isSameDay(day, value) : false
          const isDisabled = disabled?.(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onChange?.(day)}
              disabled={isDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
} 