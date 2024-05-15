import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "./ui/button";


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";


export const CardCreator = () => {

    return (
        <div className="flex justify-center items-center h-full">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>New order</CardTitle>
            <CardDescription>Write here your new project, it will be added to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Name</Label>
                  <Input id="name" placeholder="Name of the client" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Description</Label>
                  <Textarea id="Description" placeholder="Description of the order" rows={3} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Category</Label>
                  <Input id="name" placeholder="Category" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Types</Label>
                  <Select>
                    <SelectTrigger id="Types">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="groupwork">Group work</SelectItem>
                      <SelectItem value="funtime">Fun time</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-col space-y-1.5">
                  <Label>Assigned to</Label>
                  <Input id="Assigned" placeholder="Select"/>
                </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
        </div>
      )
    }