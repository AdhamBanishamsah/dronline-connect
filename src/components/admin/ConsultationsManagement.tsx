
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Consultation, ConsultationStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatConsultationData } from "@/utils/formatters";

const ConsultationsManagement: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    consultation: Consultation | null;
    disease: string;
    status: ConsultationStatus;
  }>({
    isOpen: false,
    consultation: null,
    disease: "",
    status: ConsultationStatus.PENDING
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch consultations on component mount
  useEffect(() => {
    fetchConsultations();
  }, []);

  // Apply filters when searchQuery or statusFilter changes
  useEffect(() => {
    filterConsultations();
  }, [searchQuery, statusFilter, consultations]);

  const fetchConsultations = async () => {
    try {
      setIsLoading(true);
      
      // Get all consultations with nested data
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          *,
          consultation_comments (*)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;

      // Format the data
      const formattedConsultations = data.map(item => formatConsultationData(item));
      setConsultations(formattedConsultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error fetching consultations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = [...consultations];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(consultation => 
        consultation.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== null) {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }
    
    setFilteredConsultations(filtered);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/consultations/${id}`);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setEditDialog({
      isOpen: true,
      consultation,
      disease: consultation.disease,
      status: consultation.status as ConsultationStatus,
    });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.consultation) return;
    
    try {
      setIsLoading(true);
      
      // Update the consultation
      const { error } = await supabase
        .from("consultations")
        .update({ 
          disease: editDialog.disease,
          status: editDialog.status
        })
        .eq("id", editDialog.consultation.id);
        
      if (error) throw error;
      
      // Update local state
      setConsultations(prev =>
        prev.map(consultation =>
          consultation.id === editDialog.consultation?.id 
            ? { 
                ...consultation, 
                disease: editDialog.disease,
                status: editDialog.status
              } 
            : consultation
        )
      );
      
      toast({
        title: "Consultation updated",
        description: "The consultation has been updated successfully",
      });
      
      // Close the dialog
      setEditDialog({
        isOpen: false,
        consultation: null,
        disease: "",
        status: ConsultationStatus.PENDING
      });
    } catch (error) {
      console.error("Failed to update consultation:", error);
      toast({
        title: "Update failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ConsultationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search consultations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
            className={statusFilter === null ? "bg-medical-primary hover:opacity-90" : ""}
          >
            All Statuses
          </Button>
          <Button
            variant={statusFilter === ConsultationStatus.PENDING ? "default" : "outline"}
            onClick={() => setStatusFilter(ConsultationStatus.PENDING)}
            className={statusFilter === ConsultationStatus.PENDING ? "bg-yellow-600 hover:bg-yellow-700" : ""}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === ConsultationStatus.IN_PROGRESS ? "default" : "outline"}
            onClick={() => setStatusFilter(ConsultationStatus.IN_PROGRESS)}
            className={statusFilter === ConsultationStatus.IN_PROGRESS ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === ConsultationStatus.COMPLETED ? "default" : "outline"}
            onClick={() => setStatusFilter(ConsultationStatus.COMPLETED)}
            className={statusFilter === ConsultationStatus.COMPLETED ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Completed
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading consultations...</p>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-500">
            {searchQuery || statusFilter
              ? "Try adjusting your search or filter criteria"
              : "There are no consultations in the system yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disease</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.map((consultation) => (
                <TableRow key={consultation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{consultation.disease}</TableCell>
                  <TableCell>{consultation.patientId}</TableCell>
                  <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                  <TableCell>{format(new Date(consultation.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        onClick={() => handleViewDetails(consultation.id)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-medical-primary text-medical-primary hover:bg-blue-50"
                        onClick={() => handleEditConsultation(consultation)}
                      >
                        <Pencil size={16} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Consultation Dialog */}
      <Dialog open={editDialog.isOpen} onOpenChange={(open) => !open && setEditDialog(prev => ({ ...prev, isOpen: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Consultation</DialogTitle>
            <DialogDescription>
              Update the consultation details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="disease" className="text-sm font-medium">Disease</label>
              <Input
                id="disease"
                value={editDialog.disease}
                onChange={(e) => setEditDialog(prev => ({ ...prev, disease: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select
                value={editDialog.status}
                onValueChange={(value) => setEditDialog(prev => ({ ...prev, status: value as ConsultationStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ConsultationStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ConsultationStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={ConsultationStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsManagement;
