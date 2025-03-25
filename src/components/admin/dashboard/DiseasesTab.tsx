
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Disease {
  id: string;
  name_en: string;
  name_ar: string;
  created_at: string;
}

const DiseasesTab: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDisease, setCurrentDisease] = useState<Disease | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("diseases")
        .select("*")
        .order("name_en");

      if (error) throw error;
      setDiseases(data || []);
    } catch (error) {
      console.error("Error fetching diseases:", error);
      toast({
        title: "Error fetching diseases",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDisease = () => {
    setDialogOpen(true);
    setIsEditing(false);
    setCurrentDisease(null);
    setNameEn("");
    setNameAr("");
  };

  const handleEditDisease = (disease: Disease) => {
    setDialogOpen(true);
    setIsEditing(true);
    setCurrentDisease(disease);
    setNameEn(disease.name_en);
    setNameAr(disease.name_ar);
  };

  const handleDeleteDisease = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("diseases")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Disease deleted",
        description: "The disease has been removed successfully",
      });
      
      fetchDiseases();
    } catch (error) {
      console.error("Error deleting disease:", error);
      toast({
        title: "Error deleting disease",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDisease = async () => {
    try {
      if (!nameEn || !nameAr) {
        toast({
          title: "Missing information",
          description: "Please provide both English and Arabic names",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      if (isEditing && currentDisease) {
        // Update existing disease
        const { error } = await supabase
          .from("diseases")
          .update({ 
            name_en: nameEn,
            name_ar: nameAr,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentDisease.id);

        if (error) throw error;
        
        toast({
          title: "Disease updated",
          description: "The disease has been updated successfully",
        });
      } else {
        // Create new disease
        const { error } = await supabase
          .from("diseases")
          .insert({ name_en: nameEn, name_ar: nameAr });

        if (error) throw error;
        
        toast({
          title: "Disease added",
          description: "The new disease has been added successfully",
        });
      }
      
      setDialogOpen(false);
      fetchDiseases();
    } catch (error) {
      console.error("Error saving disease:", error);
      toast({
        title: "Error saving disease",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Disease Management</h2>
        <Button onClick={handleAddDisease} className="flex items-center gap-2">
          <Plus size={16} />
          Add Disease
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading diseases...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>English Name</TableHead>
                <TableHead>Arabic Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diseases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No diseases found
                  </TableCell>
                </TableRow>
              ) : (
                diseases.map((disease) => (
                  <TableRow key={disease.id}>
                    <TableCell>{disease.name_en}</TableCell>
                    <TableCell>{disease.name_ar}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditDisease(disease)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteDisease(disease.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Disease" : "Add New Disease"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the disease information below"
                : "Enter the details for the new disease"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="nameEn" className="text-sm font-medium">
                English Name
              </label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Enter English name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nameAr" className="text-sm font-medium">
                Arabic Name
              </label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="Enter Arabic name"
                dir="rtl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              <X size={16} className="mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveDisease}
              disabled={isLoading}
            >
              <Check size={16} className="mr-1" />
              {isEditing ? "Update" : "Add"} Disease
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiseasesTab;
