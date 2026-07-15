import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function SettingPage() {
  const [notif, setNotif] = useState({
    booking: true,
    cancel: true,
    review: false,
    customer: true,
  });

  return (
    <>
      <Tabs defaultValue="general">
        <TabsList className="bg-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <Label>Company name</Label>
              <Input defaultValue="Wayfare Travel Co." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Contact email</Label>
                <Input type="email" defaultValue="hello@wayfare.co" />
              </div>
              <div>
                <Label>Contact phone</Label>
                <Input defaultValue="+1 (555) 010-2274" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                rows={3}
                defaultValue="221 Harbor St, Portland OR 97205"
              />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="mt-1 flex h-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                <Upload className="mb-1 h-5 w-5" /> Upload logo (mock)
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="bg-teal-deep hover:bg-teal-deep/90"
                onClick={() => toast.success("Settings saved")}
              >
                Save changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="max-w-2xl divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {[
              { key: "booking", label: "Email on new booking" },
              { key: "cancel", label: "Email on cancellation" },
              { key: "review", label: "Email on new review" },
              { key: "customer", label: "Email on new customer registration" },
            ].map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between p-4"
              >
                <span className="text-sm">{n.label}</span>
                <Switch
                  checked={notif[n.key as keyof typeof notif]}
                  onCheckedChange={(v) =>
                    setNotif((p) => ({ ...p, [n.key]: v }))
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-4">
          <div className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <Label>Stripe public key</Label>
              <Input type="password" defaultValue="pk_live_••••••••••••4242" />
            </div>
            <div>
              <Label>PayPal client ID</Label>
              <Input type="password" defaultValue="AT••••••••••8Yx" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                    <SelectItem value="GBP">GBP — British Pound</SelectItem>
                    <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tax (%)</Label>
                <Input type="number" defaultValue="8.5" />
              </div>
            </div>
            <Button
              className="bg-teal-deep hover:bg-teal-deep/90"
              onClick={() => toast.success("Payment settings saved")}
            >
              Save
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <div className="max-w-2xl space-y-2 rounded-xl border border-slate-200 bg-white p-6 text-sm">
            <div>
              <span className="text-slate-500">Version:</span> 1.4.2
            </div>
            <div>
              <span className="text-slate-500">Stack:</span> React 19, TanStack
              Start, Tailwind v4, Recharts, shadcn/ui
            </div>
            <div>
              <a href="#" className="text-teal-deep underline">
                Documentation →
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
