import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { FieldPalette } from './FieldPalette';
import { FormFieldsList } from './FormFieldsList';
import { PhoneSimulator } from './PhoneSimulator';
import { FormBuilderHeader } from './FormBuilderHeader';
import { FieldPropertiesPanel } from './FieldPropertiesPanel';
import { FormField, FormVersion, FieldType } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

const FormBuilder: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormVersion>({
    id: uuidv4(),
    name: 'Novo Formulário',
    version: 1,
    status: 'draft',
    fields: [],
    createdAt: new Date()
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    // Dragging from palette to form
    if (source.droppableId === 'field-palette' && destination.droppableId === 'form-fields') {
      const fieldType = result.draggableId as FieldType;
      const newField: FormField = {
        id: uuidv4(),
        type: fieldType,
        label: `Novo ${getFieldTypeLabel(fieldType)}`,
        required: false,
        placeholder: '',
      };

      const newFields = [...currentForm.fields];
      newFields.splice(destination.index, 0, newField);

      setCurrentForm(prev => ({
        ...prev,
        fields: newFields
      }));

      // Auto-select the new field
      setSelectedFieldId(newField.id);
      return;
    }

    // Reordering within form
    if (source.droppableId === 'form-fields' && destination.droppableId === 'form-fields') {
      const newFields = Array.from(currentForm.fields);
      const [reorderedField] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, reorderedField);

      setCurrentForm(prev => ({
        ...prev,
        fields: newFields
      }));
    }
  };

  const getFieldTypeLabel = (type: FieldType): string => {
    const labels = {
      text: 'Campo de Texto',
      rich_text: 'Texto Rico',
      yes_no: 'Sim/Não',
      select: 'Lista de Opções',
      signature: 'Assinatura',
      photo: 'Foto',
      date: 'Data',
      time: 'Hora',
      number: 'Número',
      audio: 'Áudio',
      file: 'Anexo',
      subform: 'Sub-formulário',
      instruction: 'Instrução'
    };
    return labels[type];
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const handleFieldDelete = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const selectedField = currentForm.fields.find(field => field.id === selectedFieldId);

  return (
    <div className="h-screen flex flex-col bg-background">
      <FormBuilderHeader form={currentForm} onFormUpdate={setCurrentForm} />
      
      <div className="flex-1 flex overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Left Panel - Form Builder */}
          <div className="w-1/2 flex border-r border-border bg-builder-sidebar">
            {/* Field Palette */}
            <div className="w-80 border-r border-border bg-field-palette">
              <FieldPalette />
            </div>
            
            {/* Form Fields List */}
            <div className="flex-1 flex flex-col">
              <FormFieldsList
                fields={currentForm.fields}
                selectedFieldId={selectedFieldId}
                onFieldSelect={setSelectedFieldId}
                onFieldDelete={handleFieldDelete}
              />
              
              {/* Field Properties Panel */}
              {selectedField && (
                <FieldPropertiesPanel
                  field={selectedField}
                  onFieldUpdate={handleFieldUpdate}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Phone Simulator */}
          <div className="w-1/2 bg-builder-main flex items-center justify-center p-8">
            <PhoneSimulator form={currentForm} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default FormBuilder;