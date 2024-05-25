

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const CalendarTask = () => {
    return (
        <div>
            <Button className="bg-amber-300 text-semibold font-normal justify-start px-2 w-full 
               hover:bg-amber-400 active:bg-amber-500 transition-colors">
                <Calendar className="h-4 w-4 mr-2"/>
                Calendar
            </Button>
        </div>
    )
}