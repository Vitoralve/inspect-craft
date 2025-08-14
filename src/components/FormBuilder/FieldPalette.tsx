import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { FieldPaletteItem } from '../../types/form';
import { 
  Type, 
  FileText, 
  CheckCircle, 
  List, 
  PenTool, 
  Camera, 
  Calendar, 
  Clock, 
  Hash, 
  Mic, 
  Paperclip, 
  Layers, 
  Info 
} from 'lucide-react';

const fieldTypes: FieldPaletteItem[] = [
  {
    type: 'text',
    label: 'Texto',
    icon: 'Type',
    description: 'Campo de texto simples'
  },
  {
    type: 'rich_text',
    label: 'Texto Rico',
    icon: 'FileText',
    description: 'Editor de texto com formatação'
  },
  {
    type: 'yes_no',
    label: 'Sim/Não',
    icon: 'CheckCircle',
    description: 'Campo binário de confirmação'
  },
  {
    type: 'select',
    label: 'Lista',
    icon: 'List',
    description: 'Lista de opções (OK/Ajustar/Crítico)'
  },
  {
    type: 'signature',
    label: 'Assinatura',
    icon: 'PenTool',
    description: 'Campo para captura de assinatura'
  },
  {
    type: 'photo',
    label: 'Foto',
    icon: 'Camera',
    description: 'Captura de imagem'
  },
  {
    type: 'date',
    label: 'Data',
    icon: 'Calendar',
    description: 'Seletor de data'
  },
  {
    type: 'time',
    label: 'Hora',
    icon: 'Clock',
    description: 'Seletor de hora'
  },
  {
    type: 'number',
    label: 'Número',
    icon: 'Hash',
    description: 'Campo numérico com validações'
  },
  {
    type: 'audio',
    label: 'Áudio',
    icon: 'Mic',
    description: 'Gravação de áudio'
  },
  {
    type: 'file',
    label: 'Anexo',
    icon: 'Paperclip',
    description: 'Upload de arquivos'
  },
  {
    type: 'subform',
    label: 'Sub-formulário',
    icon: 'Layers',
    description: 'Formulário repetível aninhado'
  },
  {
    type: 'instruction',
    label: 'Instrução',
    icon: 'Info',
    description: 'Texto informativo'
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    Type, FileText, CheckCircle, List, PenTool, Camera, 
    Calendar, Clock, Hash, Mic, Paperclip, Layers, Info
  };
  const IconComponent = icons[iconName as keyof typeof icons];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : <Type className="w-5 h-5" />;
};

export const FieldPalette: React.FC = () => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
        Paleta de Campos
      </h3>
      
      <Droppable droppableId="field-palette" isDropDisabled={true}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {fieldTypes.map((fieldType, index) => (
              <Draggable 
                key={fieldType.type} 
                draggableId={fieldType.type} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
                      p-3 rounded-lg border bg-card hover:bg-hover cursor-grab active:cursor-grabbing
                      transition-all duration-200 group
                      ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 border-primary' : 'shadow-sm'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {getIcon(fieldType.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">
                          {fieldType.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {fieldType.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};