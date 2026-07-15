import { useState } from "react";
import { Label } from "../../../components/ui/Label";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "../../../components/ui/Switch";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { TourRow } from "../types";

export default function TourForm({
  value,
  onSave,
  onCancel,
}: {
  value: TourRow;
  onSave: (v: TourRow) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<TourRow>(value);
  const set = <K extends keyof TourRow>(k: K, val: TourRow[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  return (
    <div className="mt-4 space-y-4 pb-6">
      <div>
        <Label>Title</Label>
        <Input value={v.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          rows={3}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price ($)</Label>
          <Input
            type="number"
            value={v.price}
            onChange={(e) => set("price", +e.target.value)}
          />
        </div>
        <div>
          <Label>Duration (days)</Label>
          <Input
            type="number"
            value={v.duration}
            onChange={(e) => set("duration", +e.target.value)}
          />
        </div>
        <div>
          <Label>Difficulty</Label>
          <Select
            value={v.difficulty}
            onValueChange={(x) => set("difficulty", x as TourRow["difficulty"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Challenging">Challenging</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={v.category}
            onValueChange={(x) => set("category", x as TourRow["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adventure">Adventure</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Capacity</Label>
          <Input
            type="number"
            value={v.capacity}
            onChange={(e) => set("capacity", +e.target.value)}
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={v.status === "active"}
              onCheckedChange={(x) => set("status", x ? "active" : "inactive")}
            />
            <Label>Active</Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Images</Label>
        <div className="mt-1 flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          <Upload className="mb-1 h-5 w-5" />
          Drag & drop or click to upload (mock)
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Itinerary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("itinerary", [
                ...v.itinerary,
                { day: v.itinerary.length + 1, title: "", description: "" },
              ])
            }
          >
            <Plus className="h-3 w-3" /> Add day
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {v.itinerary.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input
                className="w-16"
                type="number"
                value={d.day}
                onChange={(e) => {
                  const arr = [...v.itinerary];
                  arr[i] = { ...d, day: +e.target.value };
                  set("itinerary", arr);
                }}
              />
              <Input
                placeholder="Description"
                value={d.description}
                onChange={(e) => {
                  const arr = [...v.itinerary];
                  arr[i] = { ...d, description: e.target.value };
                  set("itinerary", arr);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set(
                    "itinerary",
                    v.itinerary.filter((_, j) => j !== i),
                  )
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => set("highlights", [...v.highlights, ""])}
          >
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        <div className="mt-2 space-y-2">
          {v.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={h}
                onChange={(e) => {
                  const arr = [...v.highlights];
                  arr[i] = e.target.value;
                  set("highlights", arr);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  set(
                    "highlights",
                    v.highlights.filter((_, j) => j !== i),
                  )
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-teal-deep hover:bg-teal-deep/90"
          onClick={() => onSave(v)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
