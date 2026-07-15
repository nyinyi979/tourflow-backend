import { useState } from "react";
import { ActivityRow } from "../types";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CATS } from "@/mocks/mocks";
import { Switch } from "@/components/ui/Switch";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ActivityForm({
  value,
  onCancel,
  onSave,
}: {
  value: ActivityRow;
  onCancel: () => void;
  onSave: (v: ActivityRow) => void;
}) {
  const [v, setV] = useState<ActivityRow>(value);
  const set = <K extends keyof ActivityRow>(k: K, val: ActivityRow[K]) =>
    setV((p) => ({ ...p, [k]: val }));
  return (
    <div className="mt-4 space-y-4 pb-6">
      <div>
        <Label>Title</Label>
        <Input value={v.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div>
        <Label>Short description</Label>
        <Textarea
          rows={2}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div>
        <Label>Long description</Label>
        <Textarea
          rows={5}
          placeholder="Full experience details shown on the activity page"
          value={v.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
        />
      </div>
      <div>
        <Label>Meeting point</Label>
        <Input
          value={v.meetingPoint}
          placeholder="Where guests meet the guide"
          onChange={(e) => set("meetingPoint", e.target.value)}
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
          <Label>Duration (hours)</Label>
          <Input
            type="number"
            value={v.duration}
            onChange={(e) => set("duration", +e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={v.category} onValueChange={(x) => set("category", x)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Switch
            checked={v.status === "active"}
            onCheckedChange={(x) => set("status", x ? "active" : "inactive")}
          />
          <Label>Active</Label>
        </div>
      </div>
      <div>
        <Label>Images</Label>
        <div className="mt-1 flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          <Upload className="mb-1 h-5 w-5" />
          Drag & drop or click to upload (mock)
        </div>
      </div>
      <div className="flex justify-end gap-2">
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
