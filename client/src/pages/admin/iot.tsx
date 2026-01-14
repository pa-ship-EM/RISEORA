import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Cpu, Search, MoreVertical, Trash2, Loader2, AlertTriangle, Plus, Edit, Wifi, WifiOff, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface IotDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  ownerDepartment: string;
  location: string;
  macAddress: string | null;
  ipAddress: string | null;
  firmwareVersion: string | null;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  status: string;
  networkSegment: string | null;
  lastSeenAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const DEVICE_TYPES = [
  { value: "SENSOR", label: "Sensor" },
  { value: "CAMERA", label: "Camera" },
  { value: "GATEWAY", label: "Gateway" },
  { value: "CONTROLLER", label: "Controller" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-700" },
  { value: "INACTIVE", label: "Inactive", color: "bg-gray-100 text-gray-700" },
  { value: "MAINTENANCE", label: "Maintenance", color: "bg-yellow-100 text-yellow-700" },
  { value: "RETIRED", label: "Retired", color: "bg-red-100 text-red-700" },
];

function getStatusColor(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status)?.color || "bg-gray-100 text-gray-700";
}

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status)?.label || status;
}

function getDeviceTypeLabel(type: string) {
  return DEVICE_TYPES.find(t => t.value === type)?.label || type;
}

function exportToCSV(devices: IotDevice[]) {
  const headers = ['Device ID', 'Name', 'Type', 'Department', 'Location', 'MAC Address', 'IP Address', 'Firmware', 'Status', 'Last Seen'];
  const rows = devices.map(d => [
    d.deviceId,
    d.deviceName,
    d.deviceType,
    d.ownerDepartment,
    d.location,
    d.macAddress || '',
    d.ipAddress || '',
    d.firmwareVersion || '',
    d.status,
    d.lastSeenAt ? format(new Date(d.lastSeenAt), 'yyyy-MM-dd HH:mm') : ''
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `iot-devices-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminIotPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<IotDevice | null>(null);
  const [deleteDevice, setDeleteDevice] = useState<IotDevice | null>(null);
  
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    deviceType: "SENSOR",
    ownerDepartment: "",
    location: "",
    macAddress: "",
    ipAddress: "",
    firmwareVersion: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    status: "ACTIVE",
    networkSegment: "",
    notes: "",
  });

  const { data: devices = [], isLoading } = useQuery<IotDevice[]>({
    queryKey: ["/api/admin/iot-devices"],
    queryFn: async () => {
      const res = await fetch("/api/admin/iot-devices", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch IoT devices");
      return res.json();
    },
  });

  const createDeviceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/iot-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create device");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/iot-devices"] });
      setAddDialogOpen(false);
      resetForm();
      toast({ title: "Device Created", description: "The IoT device has been added to inventory." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await fetch(`/api/admin/iot-devices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update device");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/iot-devices"] });
      setEditDevice(null);
      resetForm();
      toast({ title: "Device Updated", description: "The IoT device has been updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/iot-devices/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete device");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/iot-devices"] });
      setDeleteDevice(null);
      toast({ title: "Device Deleted", description: "The IoT device has been removed from inventory." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      deviceId: "",
      deviceName: "",
      deviceType: "SENSOR",
      ownerDepartment: "",
      location: "",
      macAddress: "",
      ipAddress: "",
      firmwareVersion: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      status: "ACTIVE",
      networkSegment: "",
      notes: "",
    });
  };

  const handleOpenEdit = (device: IotDevice) => {
    setEditDevice(device);
    setFormData({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      ownerDepartment: device.ownerDepartment,
      location: device.location,
      macAddress: device.macAddress || "",
      ipAddress: device.ipAddress || "",
      firmwareVersion: device.firmwareVersion || "",
      manufacturer: device.manufacturer || "",
      model: device.model || "",
      serialNumber: device.serialNumber || "",
      status: device.status,
      networkSegment: device.networkSegment || "",
      notes: device.notes || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDevice) {
      updateDeviceMutation.mutate({ id: editDevice.id, data: formData });
    } else {
      createDeviceMutation.mutate(formData);
    }
  };

  const filteredDevices = devices.filter(d => 
    d.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.ownerDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const missingNetworkInfo = devices.filter(d => !d.macAddress || !d.ipAddress);
  const activeDevices = devices.filter(d => d.status === "ACTIVE");
  const maintenanceDevices = devices.filter(d => d.status === "MAINTENANCE");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary" data-testid="text-page-title">IoT Device Inventory</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage and track all IoT devices in your network.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportToCSV(devices)}
              disabled={devices.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-device">
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <p className="text-2xl font-bold" data-testid="text-total-devices">{devices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <p className="text-2xl font-bold text-green-600" data-testid="text-active-devices">{activeDevices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <p className="text-2xl font-bold text-yellow-600" data-testid="text-maintenance-devices">{maintenanceDevices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Missing Network Info
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <p className="text-2xl font-bold text-orange-600" data-testid="text-missing-network">{missingNetworkInfo.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Device List
                </CardTitle>
                <CardDescription>All registered IoT devices</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-devices"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Cpu className="h-12 w-12 mb-4 opacity-50" />
                <p>{searchQuery ? "No devices match your search" : "No IoT devices registered yet"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id} data-testid={`row-device-${device.id}`}>
                        <TableCell className="font-mono text-sm" data-testid={`text-device-id-${device.id}`}>{device.deviceId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{device.deviceName}</p>
                            <p className="text-xs text-muted-foreground">{device.ownerDepartment}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getDeviceTypeLabel(device.deviceType)}</TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell>
                          {(!device.macAddress || !device.ipAddress) ? (
                            <div className="flex items-center gap-1 text-orange-600">
                              <WifiOff className="h-4 w-4" />
                              <span className="text-xs">Incomplete</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-600">
                              <Wifi className="h-4 w-4" />
                              <span className="text-xs font-mono">{device.ipAddress}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(device.status)}>
                            {getStatusLabel(device.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" data-testid={`button-device-menu-${device.id}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEdit(device)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeleteDevice(device)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={addDialogOpen || !!editDevice} onOpenChange={(open) => {
        if (!open) {
          setAddDialogOpen(false);
          setEditDevice(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
            <DialogDescription>
              {editDevice ? "Update the device information." : "Enter the details for the new IoT device."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID *</Label>
                <Input
                  id="deviceId"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  placeholder="IOT-001"
                  required
                  data-testid="input-device-id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name *</Label>
                <Input
                  id="deviceName"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  placeholder="Temperature Sensor"
                  required
                  data-testid="input-device-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type *</Label>
                <Select value={formData.deviceType} onValueChange={(v) => setFormData({ ...formData, deviceType: v })}>
                  <SelectTrigger data-testid="select-device-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVICE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerDepartment">Owner Department *</Label>
                <Input
                  id="ownerDepartment"
                  value={formData.ownerDepartment}
                  onChange={(e) => setFormData({ ...formData, ownerDepartment: e.target.value })}
                  placeholder="IT Operations"
                  required
                  data-testid="input-owner-department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Building A, Floor 2"
                  required
                  data-testid="input-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address</Label>
                <Input
                  id="macAddress"
                  value={formData.macAddress}
                  onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                  placeholder="00:1A:2B:3C:4D:5E"
                  data-testid="input-mac-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address</Label>
                <Input
                  id="ipAddress"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="192.168.1.100"
                  data-testid="input-ip-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Cisco"
                  data-testid="input-manufacturer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="IoT-2000"
                  data-testid="input-model"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="SN123456789"
                  data-testid="input-serial-number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firmwareVersion">Firmware Version</Label>
                <Input
                  id="firmwareVersion"
                  value={formData.firmwareVersion}
                  onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                  placeholder="v2.1.0"
                  data-testid="input-firmware-version"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="networkSegment">Network Segment</Label>
                <Input
                  id="networkSegment"
                  value={formData.networkSegment}
                  onChange={(e) => setFormData({ ...formData, networkSegment: e.target.value })}
                  placeholder="VLAN 100 - IoT Sensors"
                  data-testid="input-network-segment"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about this device..."
                  rows={3}
                  data-testid="input-notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddDialogOpen(false);
                  setEditDevice(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createDeviceMutation.isPending || updateDeviceMutation.isPending}
                data-testid="button-submit-device"
              >
                {(createDeviceMutation.isPending || updateDeviceMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editDevice ? "Update Device" : "Add Device"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDevice} onOpenChange={(open) => !open && setDeleteDevice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Device
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteDevice?.deviceName}</strong> ({deleteDevice?.deviceId})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDevice(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDevice && deleteDeviceMutation.mutate(deleteDevice.id)}
              disabled={deleteDeviceMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteDeviceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
