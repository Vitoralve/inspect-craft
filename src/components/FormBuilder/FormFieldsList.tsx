import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FormField } from '../../types/form';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GripVertical, Trash2, Copy, Eye, EyeOff } from 'lucide-react';

interface FormFieldsListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldDelete: (fieldId: string) => void;
}

export const FormFieldsList: React.FC<FormFieldsListProps> = ({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldDelete
}) => {
  const getFieldTypeLabel = (type: string): string => {
    const labels = {
      text: 'Texto',
      rich_text: 'Texto Rico',
      yes_no: 'Sim/Não',
      select: 'Lista',
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
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Campos do Formulário
        </h3>
        <div className="text-xs text-muted-foreground mt-1">
          {fields.length} campo{fields.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Droppable droppableId="form-fields">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                min-h-full space-y-2 transition-colors rounded-lg
                ${snapshot.isDraggingOver ? 'bg-drag-target' : ''}
              `}
            >
              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-muted-foreground text-sm">
                    Arraste campos da paleta para começar
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Construa seu formulário personalizando cada campo
                  </div>
                </div>
              ) : (
                fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
                          p-3 rounded-lg border bg-card hover:bg-hover cursor-pointer
                          transition-all duration-200 group
                          ${selectedFieldId === field.id ? 'border-primary bg-primary-light/10' : ''}
                          ${snapshot.isDragging ? 'shadow-lg rotate-1 scale-105' : 'shadow-sm'}
                        `}
                        onClick={() => onFieldSelect(field.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground truncate">
                                {field.label || 'Campo sem título'}
                              </span>
                              {field.required && (
                                <span className="text-destructive text-xs">*</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getFieldTypeLabel(field.type)}
                              </Badge>
                              {field.conditionalLogic && (
                                <Badge variant="secondary" className="text-xs">
                                  Condicional
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement duplicate
                              }}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onFieldDelete(field.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};